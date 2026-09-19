from groq_client import _chat_with_retry
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
def generate_question(track: str, jd_text: str = None, resume_text: str = None) -> dict:

    difficulty = get_difficulty_level(track)
    prompt = get_prompt(track, difficulty)

    context_parts = []
    if jd_text and jd_text.strip():
        context_parts.append(f"JOB DESCRIPTION:\n{jd_text.strip()[:2000]}")
    if resume_text and resume_text.strip():
        context_parts.append(f"CANDIDATE'S RESUME:\n{resume_text.strip()[:3000]}")

    if context_parts:
        combined_context = "\n\n".join(context_parts)
        prompt = f"""{prompt}

Additionally, use the following context to tailor this question:

---
{combined_context}
---

If both a job description and resume are provided, focus the question on
a specific gap between what the JD requires and what the resume shows -
the way a real interviewer would probe an unproven or missing skill.
The question should still be a single interview question, not a
restatement of either document."""

    response = _chat_with_retry(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": "You are an interview question generator. respond with only the question text, nothing else - no numbering, no extra commentary."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
    )
    content = (response.choices[0].message.content or "").strip()
    if not content:
        raise RuntimeError("Groq returned an empty question. Please try again.")
    return {
        "question": content,
        "difficulty": difficulty,
    }
def generate_followup(persona_name: str, persona_prompt: str, question: str, answer: str) -> str:
    system_prompt = f"""{persona_prompt}

You are {persona_name}. You just evaluated the candidate's answer. Now ask ONE natural
follow-up question that probes deeper into a specific weakness or gap in their answer —
the way a real interviewer would push further on a point that wasn't fully addressed.

Respond with ONLY the follow-up question text, nothing else."""

    response = _chat_with_retry(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": f"Original question: {question}\n\nCandidate's answer: {answer}",
            },
        ],
        temperature=0.6,
    )
    content = (response.choices[0].message.content or "").strip()
    if not content:
        raise RuntimeError("Groq returned an empty follow-up. Please try again.")
    return content

def generate_ideal_answer(question: str) -> str:
    response = _chat_with_retry(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert interview coach. Given an interview question, "
                    "write a strong, concise model answer (3-5 sentences) that a "
                    "well-prepared candidate might give. Respond with ONLY the answer "
                    "text, no preamble."
                ),
            },
            {"role": "user", "content": question},
        ],
        temperature=0.5,
    )
    content = (response.choices[0].message.content or "").strip()
    if not content:
        raise RuntimeError("Groq returned an empty ideal answer. Please try again.")
    return content
