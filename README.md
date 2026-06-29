# regvizz

> ⚠️ **Work in progress.** This project is in active development. Things may break, change, or be missing. Current focus is getting a stable deployable version out — don't expect a polished experience just yet.

A visual tool for understanding how **regular expressions** are converted into **NFAs** and **DFAs** — step by step, state by state.

Built for students and anyone learning automata theory who wants to *see* what's happening under the hood, not just read about it.

---

## What it does

You type a regular expression. regvizz shows you:

- The **NFA** built from it using Thompson's Construction
- The **DFA** derived from that NFA using Subset Construction
- Each state, transition, and ε-closure — visualized as a graph

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Python + FastAPI |
| Frontend | React |

---

## Project Status

Currently in development. The immediate goal is a working deployment of the core conversion pipeline. Features and UI will evolve from there.

**What's being worked on:**
- Regex → NFA conversion (Thompson's Construction)
- NFA → DFA conversion (Subset Construction)
- Graph rendering on the frontend
- Deployment setup [DONE] with this after such pain stacking hours finally some working version of my project 
- Next up making this student friendly 

---

## Getting Started

> Setup instructions will be added once the first deployable version is ready.

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

