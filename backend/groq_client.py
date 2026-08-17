from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

client=Groq(api_key=os.getenv("GROQ_API_KEY"))
def call_persona(system_prompt:str, question:str,answer:str)->dict:
    response=client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role":"user","content":f"Question:{question}\n\nCandidate's answer:{answer}"}
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    return json.loads(response.choices[0].message.content)
