from groq_client import client
from models import Session
import json

def get_prompt(track:str,difficulty:str)->str:
    difficulty_text={
          "beginner": "at a fresher/entry-level difficulty, testing fundamental concepts",
        "intermediate": "at a moderate difficulty, requiring the candidate to reason through a scenario, not just recall a definition",
        "advanced": "at a challenging difficulty, involving edge cases, tradeoffs, or multi-step reasoning"
    }[difficulty]
    prompts={
    "sde_technical": "Generate one realistic technical interview question about data structures, algorithms, or coding, at a fresher/entry-level difficulty. The question should be answerable in 2-4 sentences, not require writing full code.",
    "genai": "Generate one realistic GenAI/LLM-focused interview question suitable for a fresher applying to AI/ML roles - covering topics like prompt engineering, RAG, embeddings, or LLM basics.",
    "hr_behavioral": "Generate one realistic HR/behavioral interview question commonly asked to fresh graduates - about teamwork, conflict, failure, or motivation."
    }
    return prompts.get(track,prompts["sde_technical"]) 


def get_difficulty_level(track:str)->str:
    count=Session.query.filter_by(track=track).count()
    if count<3:
        return"beginner"
    elif count<8:
        return"intermediate"
    else:
        return"advanced"
def generate_question(track:str)->dict:
    difficulty=get_difficulty_level(track)
    prompt=get_prompt(track,difficulty)
    response=client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role":"system","content":"You are an interview question generator. respond with only the question text, nothing else - no numbering, no extra commentary."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
    )
    return {
        "question": response.choices[0].message.content.strip(),
        "difficulty": difficulty,
    }
