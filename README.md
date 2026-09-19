# TriPanel

**An AI mock-interview platform where three independent AI personas evaluate your answer — and their disagreement is the insight.**

[Live Demo](https://your-vercel-url.vercel.app) · [Backend API](https://your-render-url.onrender.com/health)

---

## The Problem

Most AI mock-interview tools give you a single score from a single AI grader, with no way to know whether that feedback is actually reliable — a harsh grader and a lenient one can score the identical answer completely differently, and you have no way to tell which (if either) to trust.

**TriPanel solves this by never relying on one AI opinion.**

## The Idea

Every answer is evaluated independently by three distinct AI personas, each with its own rubric and explicit boundaries on what it will and won't judge:

| Persona | Evaluates | Ignores |
|---|---|---|
| **Strict Technical Reviewer** | Correctness, edge cases, complexity | Communication style, tone |
| **Friendly HR Interviewer** | Clarity, structure, confidence | Algorithmic correctness |
| **System Design Skeptic** | Assumptions, tradeoffs, scale thinking | Basic correctness, tone |

Their scores are never averaged into one number. Instead, TriPanel calculates the **spread** between them — low spread means the raters agree and the feedback is trustworthy; high spread flags exactly where an answer is ambiguous or where one persona caught something the others missed. This is a lightweight, LLM-applied version of **inter-rater reliability**, the same concept used in human panel scoring — and it's the core idea the entire product is built around.

## Features

**Core evaluation**
- Three concurrent, independently-prompted AI personas (Groq API, LLaMA) scoring every answer
- Consistency/spread scoring surfacing rater disagreement as a signal, not noise
- Graceful degradation — if one persona's call fails, the other two still return results

**Interview experience**
- Voice-first answer flow: camera and mic activate together, live reactive waveform, live caption transcript, with a review/re-record step before submitting — no textarea
- Text-to-speech: questions are read aloud automatically
- AI-generated follow-up questions from whichever persona scored lowest, based on the actual answer given
- Full multi-question interview rounds (`/interview`) with a combined summary report
- Adaptive difficulty that scales with how many sessions you've completed per track

**Personalization**
- JD-aware question generation — paste a job description to shape what's asked
- Resume-aware tailoring (`/tailor`) — upload a resume PDF alongside a JD to generate questions that probe the specific gap between what a role requires and what your resume shows
- AI-generated ideal-answer comparison on every session report, from a neutral model call kept separate from the scoring personas to avoid bias

**Product layer**
- Persistent session history with full score/reasoning detail
- Progress dashboard with per-persona score trend charts over time
- Streak tracking for consecutive practice days
- First-visit onboarding tour
- Settings for voice language, default track, and auto-speak behavior

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│  Next.js         │  HTTP   │  Flask API         │         │  Groq API    │
│  (Vercel)        │ ──────► │  (Render)          │ ──────► │  LLaMA       │
│                  │         │                    │         │  (per persona│
│  Voice UI, camera│         │  Concurrent 3-call │         │  system      │
│  waveform, live  │ ◄────── │  ThreadPoolExecutor│ ◄────── │  prompts)    │
│  captions        │  JSON   │  + SQLite (sessions│         └─────────────┘
└─────────────────┘         │  history, scores)   │
                             └──────────────────┘
```

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Flask, Gunicorn (production WSGI server)
- **AI:** Groq API, `openai/gpt-oss-120b` — separate temperature settings per task (0.3 for scoring consistency, 0.6 for follow-ups, 0.8 for question variety)
- **Database:** SQLite via Flask-SQLAlchemy
- **PDF parsing:** pypdf, for resume text extraction
- **Voice/video:** Web Speech API (`SpeechSynthesis`, `SpeechRecognition`), `getUserMedia`
- **Hosting:** Vercel (frontend), Render (backend)

## Why These Design Decisions

- **Concurrent, not sequential, persona calls** — three sequential API calls would triple response latency. A `ThreadPoolExecutor` runs them in parallel since each is an independent, I/O-bound network call.
- **Ideal-answer generation is a separate, neutral call** — deliberately not one of the three scoring personas, so the model generating a "correct" answer never influences how your actual answer is graded.
- **JSON mode over free-text parsing** — every persona call uses Groq's structured output mode, avoiding fragile regex parsing of free-form model text.
- **Auth was intentionally skipped** — this is scoped as a single-user practice tool; adding auth would have added complexity with no real payoff at this scope. Documented here rather than silently omitted.
- **SQLite over Postgres** — sufficient for a single-user tool's actual concurrency needs; a clear migration path exists if that ever changes.

## Project Structure

```
tripanel/
├── backend/
│   ├── app.py                  # Flask routes
│   ├── personas.py             # 3 persona system prompts + rubrics
│   ├── groq_client.py          # Groq API wrapper
│   ├── question_gen.py         # question generation, follow-ups, ideal answers
│   ├── models.py               # SQLAlchemy models (Session, PersonaResult)
│   ├── gunicorn_config.py
│   └── requirements.txt
└── frontend/
    └── app/
        ├── page.tsx             # landing page
        ├── practice/            # single-question practice mode
        ├── interview/           # multi-question interview rounds
        ├── report/[sessionId]/  # per-session detail + ideal answer
        ├── dashboard/           # streak + recent sessions
        ├── progress/            # score trend chart
        ├── tailor/              # resume + JD upload
        ├── settings/
        └── components/
```

## Running Locally

**Backend**
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate      # Windows
pip install -r requirements.txt
# create a .env file with: GROQ_API_KEY=your_key_here
python app.py
```

**Frontend**
```bash
cd frontend
npm install
# create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

Visit `http://localhost:3000`.

## Known Limitations

- **Free-tier database persistence:** the backend runs on Render's free tier, whose disk isn't guaranteed to persist across redeploys — session history may reset when the service is redeployed or spins down after inactivity.
- **Browser support:** voice input (`SpeechRecognition`) is reliably supported in Chrome/Edge; Firefox and Safari support is inconsistent.
- **Cold starts:** the free-tier backend may take several seconds to respond after a period of inactivity.

## What I'd Build Next

- Multi-model routing — assigning different LLaMA variants per persona to trade off latency vs. reasoning depth
- A proper eval harness — a fixed test set of Q&A pairs with LLM-as-judge groundedness scoring, to measure persona consistency quality over time rather than trusting it anecdotally
- LoRA fine-tuning a small model on persona-specific feedback style, rather than relying on prompting alone

## Author

Shreya Kumar — B.Tech CSE, Trident Academy of Technology
[GitHub](https://github.com/shreyakumar995) · [LinkedIn](https://linkedin.com/in/shreya-kumar-a27118311)
