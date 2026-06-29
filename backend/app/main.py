from regex_engine import (
    extract_alphabet,
    regex_2_postfix,
    serialize_dfa_to_graph,
    serialize_nfa_to_graph,
    postfix_2_nfa,
    nfa_2_dfa,
)
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="Regex Automation Engine",
    description="NFA & DFA generation based upon the regular expression",
    version="1.0.0",
)

# Allow localhost for local development
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://regvizz.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/compile")
def compile_regex(data: dict):
    return {"status": "success", "data": "automaton_graph_data"}


# Fix 2: Prepend '/api' to your FastAPI decorators so they match vercel's edge proxies
@app.get("/api/compile/nfa")
def compile_to_nfa(
    regex: str = Query(..., description="The regular expression string")
):
    try:
        postfix = regex_2_postfix(regex)
        nfa_root = postfix_2_nfa(postfix)
        return serialize_nfa_to_graph(nfa_root)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/compile/dfa")
def compile_to_dfa(
    regex: str = Query(..., description="The regular expression string")
):
    try:
        postfix = regex_2_postfix(regex)
        nfa_root = postfix_2_nfa(postfix)
        alphabet = extract_alphabet(regex)
        dfa_table, dfa_accepting = nfa_2_dfa(nfa_root, alphabet)
        return serialize_dfa_to_graph(dfa_table, dfa_accepting)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/compile/both")
def compile_both(regex: str = Query(..., description="Regular expression string")):
    try:
        postfix = regex_2_postfix(regex)
        nfa_root = postfix_2_nfa(postfix)
        alphabet = extract_alphabet(regex)
        dfa_table, dfa_accepting = nfa_2_dfa(nfa_root, alphabet)
        return {
            "regex": regex,
            "postfix": postfix,
            "nfa": serialize_nfa_to_graph(nfa_root),
            "dfa": serialize_dfa_to_graph(dfa_table, dfa_accepting),
        }
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Engine compilation failed: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
