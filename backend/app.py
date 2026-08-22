from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
from groq_client import call_persona
from personas import PERSONAS
from question_gen import generate_question
from models import db,Session,PersonaResult
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///tripanel.db"
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok","message": "Tripanel backend is running"})

@app.route("/evaluate",methods=["POST"])
def evaluate():
    data=request.json
    track=data.get("track","sde_technical")
    question=data.get("question")
    answer=data.get("answer")

    if not question or not answer:
        return jsonify({"error": "question and answer are required"}), 400
   

    def run_persona(item):
        key, persona = item
        try:
            result = call_persona(persona["system_prompt"], question, answer)
            result["persona"] = persona["name"]
            result["failed"] = False
        except Exception as e:
            result = {"persona": persona["name"], "failed": True, "error": str(e)}
        return key, result
        

    with ThreadPoolExecutor(max_workers=3) as executor:
        results = dict(executor.map(run_persona, PERSONAS.items()))

    session=Session(track=track,question=question,answer=answer)
    db.session.add(session)
    db.session.flush()

    for key, result in results.items():
        if not result.get("failed"):
            pr=PersonaResult(
                session_id=session.id,
                persona_name=result["persona"],
                score=result["score"],
                reasoning=result["reasoning"])
            db.session.add(pr)
            db.session.commit()
        

    return jsonify(results)
@app.route("/question",methods=["POST"])
def question():
    data=request.json
    track=data.get("track","sde_technical")
    q=generate_question(track)
    return jsonify({"question": q})
@app.route("/sessions",methods=["GET"])
def get_sessions():
     sessions = Session.query.order_by(Session.created_at.desc()).all()
     output=[]
     for s in sessions:
        output.append({
            "id":s.id,
            "track":s.track,
            "question":s.question,
            "answer":s.answer,
            "created_at":s.created_at.isoformat(),
            "results":[
                {"persona":r.persona_name,"score":r.score,"reasoning":r.reasoning} for r in s.results
            ]
        })
     return jsonify(output)
@app.route("/progress", methods=["GET"])
def get_progress():
    sessions = Session.query.order_by(Session.created_at.asc()).all()
    timeline = []
    for s in sessions:
        entry = {"date": s.created_at.isoformat(), "track": s.track}
        for r in s.results:
            entry[r.persona_name] = r.score
        timeline.append(entry)
    return jsonify(timeline)



if __name__ == '__main__':
    app.run(debug=True, port=5000)