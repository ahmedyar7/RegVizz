# Adding Concatenation to the Regular Expression
def add_concat_2_regex(regex: str) -> str:
    """This function is responsible for adding (.) to the regular expression"""

    operators = {"*", "|", "(", ")"}
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
