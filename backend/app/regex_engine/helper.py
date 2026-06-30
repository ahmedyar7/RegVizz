from fastapi import HTTPException


# Adding Concatenation to the Regular Expression
def add_concat_2_regex(regex: str) -> str:
    """This function is responsible for adding (.) to the regular expression"""

    operators = {"*", "|", "(", ")","."}
    results = []

    for i in range(len(regex)):
        c1 = regex[i]
        results.append(c1)

        if (i + 1) < len(regex):
            c2 = regex[i + 1]

            if (c1 not in operators or c1 in {"*", ")"}) and (
                c2 not in operators or c2 == "("
            ):
                results.append(".")

    return "".join(results)


# ==== Regex Validation ==== #
def validate_regex(regex: str) -> None:
    """Validate the Regular expression mathematically and raise HTTPException"""

    if not regex:
        raise HTTPException(status_code=400, detail="The Regex cannot be empty")

    # Balance parenthesis
    balance = 0

    for char in regex:
        if char == "(":
            balance += 1

        elif char == ")":
            balance -= 1

        if balance < 0:
            raise HTTPException(status_code=400, detail="Unbalanced Parenthesis")

    if balance != 0:
        raise HTTPException(status_code=400, detail="Unbalanced Parenthesis")

    # empty parenthesis.
    if "()" in regex:
        raise HTTPException(status_code=400, detail="Empty parenthesis are not allowed")

    # invalid start and end
    if regex[0] in {"|", "*"}:
        raise HTTPException(
            status_code=400, detail="Regex cannot start with an operator"
        )

    if regex[-1] == "|":
        raise HTTPException(
            status_code=400, detail="Regex cannot end with the aletration"
        )

    # Invalid combinations.
    invalid_combos = {
        "||": "Consecutive aletration are not allowed",
        "(*": "Kleen start followed by opening parenthsis",
        "(|": "Opening parenthesis followed by aletration",
        "|)": "Closing parenthesis followed by aletration",
        "|*": "Aletratino followed by kleen start",
        "**": "Consecutive kleen star",
    }

    for combo, reason in invalid_combos.items():
        if combo in regex:
            raise HTTPException(status_code=400, detail=f"Invalid syntax: {reason}")


def regex_2_postfix(regex: str) -> str:
    # Converting Regex -> PostFix Notation
    """This function would take the regex as input and return postfix notation"""

    regex = add_concat_2_regex(regex)
    stack = []
    output = []

    precedence = {"|": 1, ".": 2, "*": 3}

    for char in regex:
        # Literal
        if (char not in precedence) and (char not in {"(", ")"}):
            output.append(char)

        # Opening Parenthesis
        elif char == "(":
            stack.append(char)

        # Closing parenthesis
        elif char == ")":
            while (stack) and (stack[-1] != "("):
                output.append(stack.pop())
            stack.pop()

        else:
            while (stack and stack[-1] != "(") and (
                precedence.get(stack[-1], 0) >= precedence[char]
            ):
                output.append(stack.pop())
            stack.append(char)

    while stack:
        output.append(stack.pop())

    return "".join(output)


def extract_alphabet(regex: str) -> set:
    """Extracts unique literal characters from the regex to form the alphabet."""
    operators = {"*", "|", "(", ")", "."}
    return {char for char in regex if char not in operators}


# --- Graph Formation Utility --- #
