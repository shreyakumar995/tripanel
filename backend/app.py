from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
from groq_client import call_persona, groq_error_message
from personas import PERSONAS
from question_gen import generate_question
from models import db,Session,PersonaResult
from datetime import date,timedelta
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
    jd_text=data.get("jd_text")
    try:
        result=generate_question(track,jd_text)
        return jsonify(result)
    except Exception as exc:
        message, status=groq_error_message(exc)
        return jsonify({"error": message}), status
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
@app.route("/streak", methods=["GET"])
def get_streak():
    sessions = Session.query.order_by(Session.created_at.desc()).all()
    if not sessions:
         return jsonify({"current_streak": 0, "total_sessions": 0})
    practice_days = sorted(set(s.created_at.date() for s in sessions), reverse=True)

    streak=0
    expected_day=date.today()
    for day in practice_days:
        if day==expected_day:
            streak+=1
            expected_day-=timedelta(days=1)
        elif day == expected_day + timedelta(days=1):
            continue
        else:
            break
    return jsonify({"current_streak": streak,"total_sessions":len(sessions)})



if __name__ == '__main__':
    app.run(debug=False, port=5000)