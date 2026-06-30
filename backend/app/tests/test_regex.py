import pytest
from regex_engine import (
    add_concat_2_regex,
    regex_2_postfix,
    extract_alphabet,
    validate_regex,
)


@pytest.mark.parametrize(
    "input_regex, expected_output",
    [
        ("ab", "a.b"),
        ("abc", "a.b.c"),
        ("a|b", "a|b"),
        ("a*", "a*"),
        ("a*b", "a*.b"),
        ("a(b|c)", "a.(b|c)"),
        ("(a|b)c", "(a|b).c"),
        ("(a)(b)", "(a).(b)"),
        ("a*b*", "a*.b*"),
    ],
)
def test_add_concat_2_regex(input_regex, expected_output):
    assert add_concat_2_regex(input_regex) == expected_output


# --- TEST: Regex to postfix notation --- #


@pytest.mark.parametrize(
    "input_regex,expected_output",
    [
        ("a", "a"),
        ("a.b", "ab."),
        ("a|b", "ab|"),
        ("a*", "a*"),
        ("(a|b)", "ab|"),
        ("a(b|c)*", "abc|*."),
        ("a|bc*", "abc*.|"),
    ],
)
def test_regex_2_postfix(input_regex, expected_output):
    assert regex_2_postfix(input_regex) == expected_output


# --- TEST: Regex extract alphabets  --- #


@pytest.mark.parametrize(
    "input_regex, expected_output",
    [
        ("abc", {"a", "b", "c"}),
        ("a(b|c)*", {"a", "b", "c"}),
        ("aba", {"a", "b"}),
        ("*|().", set()),
        ("", set()),
        ("0(1|0)*", {"0", "1"}),
    ],
)
def test_extract_alphabet(input_regex, expected_output):
    assert extract_alphabet(input_regex) == expected_output
