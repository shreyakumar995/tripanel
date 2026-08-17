from groq_client import client
import json

TRACK_PROMPTS={
    "sde_technical": "Generate one realistic technical interview question about data structures, algorithms, or coding, at a fresher/entry-level difficulty. The question should be answerable in 2-4 sentences, not require writing full code.",
    "genai": "Generate one realistic GenAI/LLM-focused interview question suitable for a fresher applying to AI/ML roles - covering topics like prompt engineering, RAG, embeddings, or LLM basics.",
    "hr_behavioral": "Generate one realistic HR/behavioral interview question commonly asked to fresh graduates - about teamwork, conflict, failure, or motivation."
}
def generate_question(track:str)->str:
    prompt=TRACK_PROMPTS.get(track,TRACK_PROMPTS["sde_technical"])
    response=client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role":"system","content":"You are an interview question generator. respond with only the question text, nothing else - no numbering, no extra commentary."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
    )
    return response.choices[0].message.content.strip()
