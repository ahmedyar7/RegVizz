from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from regex_engine import (
    regex_2_postfix,
    postfix_2_nfa,
    nfa_2_dfa,
    Fragment,
    serialize_nfa_to_graph,
    serialize_dfa_to_graph,
    extract_alphabet,
)

app = FastAPI(
    title="Regex Automation Engine Too",
    description="NFA & DFA generation based upon the regular expression",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_compiled_nfa(regex_str: str) -> Fragment:
    try:
        postfix = regex_2_postfix(regex_str)
        return postfix_2_nfa(postfix)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Regex Str {e}")


@app.get("/compile/nfa")
def compile_to_nfa(
    regex: str = Query(..., description="The regular expression string")
):
    postfix = regex_2_postfix(regex)
    nfa_root = postfix_2_nfa(postfix)

    return serialize_nfa_to_graph(nfa_root)


@app.get("/compile/dfa")
def compile_to_dfa(regex: str = Query(..., description="The Regular Expresion string")):
    postfix = regex_2_postfix(regex)
    nfa_root = postfix_2_nfa(postfix)

    alphabet = extract_alphabet(regex)
    dfa_table, dfa_accepting = nfa_2_dfa(nfa_root, alphabet)

    return serialize_dfa_to_graph(dfa_table, dfa_accepting)


@app.get("/compile/both")
def compile_both(regex: str = Query(..., description="Regular Expression sring")):
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
