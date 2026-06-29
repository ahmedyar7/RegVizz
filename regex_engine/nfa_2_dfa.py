from .nfa_state import NFAState
from .fragement_state import Fragment


def epsilon_closure(states: NFAState):
    """
    Finding all the nfa states that are reachable
    from epsilon states only.
    """
    closure = set(states)
    stack = list(states)

    while stack:
        state = stack.pop()

        for next_state in state.epsilon_state:
            if next_state not in closure:
                closure.add(next_state)
                stack.append(next_state)

    return frozenset(closure)


def nfa_2_dfa(nfa_fragment: Fragment, alphabet: set):
    """Converts the NFA Fragment to DFA Transition Table."""

    start_closure = epsilon_closure([nfa_fragment.start])

    # Tracking mapping of frozenset(NFA_STATE -> UNIQUE DFA STATE NAMES)
    dfa_state = {start_closure: "Q0"}
    state_counter = 1

    dfa_transition = {}
    dfa_accept_states = set()

    unmarked_states = [start_closure]

    while unmarked_states:
        current_set = unmarked_states.pop(0)
        current_name = dfa_state[current_set]

        if any(state.id == nfa_fragment.accept.id for state in current_set):
            dfa_accept_states.add(current_name)

        dfa_transition[current_name] = {}

        for char in alphabet:
            move_states = set()

            for nfa_state in current_set:
                if char in nfa_state.transition_state:
                    move_states.update(nfa_state.transition_state[char])

            if not move_states:
                continue

            # Take the epsilon closure for those destination states
            closure = epsilon_closure(move_states)

            # If it's complete new subset then discover it.
            if closure not in dfa_state:
                dfa_state[closure] = f"Q{state_counter}"
                state_counter += 1
                unmarked_states.append(closure)

            dfa_transition[current_name][char] = dfa_state[closure]

    return dfa_transition, dfa_accept_states


def serialize_dfa_to_graph(dfa_table : dict, accept_states : set) -> dict:
    """Transforms a standard DFA transitions map into explicit frontend/node edges definations"""

    nodes = []
    edges = []

    for state_name, transitions in dfa_table.items():
        nodes.append(
            {
                "id" : state_name,
                "label" : state_name,
                "isStart" : state_name == "Q0",
                "isAccept" : state_name in accept_states
            }
        )

        for char, target_state, in transitions.items():
            edges.append(
                {
                    "source" : state_name,
                    "target" : target_state,
                    "label" : char
                }
            )
    return {"nodes": nodes, "edges": edges}