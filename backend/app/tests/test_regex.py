import pytest
from regex_engine import add_concat_2_regex

# test for add_concat_2_regex


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
