from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
from groq_client import call_persona
from personas import PERSONAS
from question_gen import generate_question
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok","message": "Tripanel backend is running"})

@app.route("/evaluate",methods=["POST"])
def evaluate():
    data=request.json
    question=data.get("question")
    answer=data.get("answer")

    if not question or not answer:
        return jsonify({"error": "question and answer are required"}), 400

    def run_persona(item):
        key, persona = item
        result = call_persona(persona["system_prompt"], question, answer)
        result["persona"] = persona["name"]
        return key, result

    with ThreadPoolExecutor(max_workers=3) as executor:
        results = dict(executor.map(run_persona, PERSONAS.items()))

    return jsonify(results)
@app.route("/question",methods=["POST"])
def question():
    data=request.json
    track=data.get("track","sde_technical")
    q=generate_question(track)
    return jsonify({"question": q})



if __name__ == '__main__':
    app.run(debug=True, port=5000)