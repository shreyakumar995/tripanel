from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok","message": "Tripanel backend is running"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)