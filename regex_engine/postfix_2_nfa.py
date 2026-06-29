from .nfa_state import NFAState
from .fragement_state import Fragment


def postfix_2_nfa(postfix_expr: str) -> Fragment:
    state_counter = 0

    def new_state():
        nonlocal state_counter
        state_counter = state_counter + 1
        return NFAState(state_counter - 1)

    stack = []

    for char in postfix_expr:
        # String Literal
        if char not in {"|", "*", "."}:
            st_0 = new_state()
            st_1 = new_state()
            st_0.add_transition(char, st_1)
            stack.append(Fragment(st_0, st_1))

        # Concatenation
        elif char == ".":
            f2 = stack.pop()
            f1 = stack.pop()
            f1.accept.add_transition(None, f2.start)  # Linked correctly
            stack.append(Fragment(f1.start, f2.accept))

        # Alternation (OR)
        elif char == "|":
            f2 = stack.pop()  # naming them f1 and f2 makes matching clean
            f1 = stack.pop()

            start = new_state()
            accept = new_state()

            start.add_transition(None, f1.start)
            start.add_transition(None, f2.start)

            f1.accept.add_transition(None, accept)
            f2.accept.add_transition(None, accept)

            stack.append(Fragment(start, accept))

        # Kleene Star (*)
        elif char == "*":
            f = stack.pop()
            start, accept = new_state(), new_state()

            start.add_transition(None, f.start)
            start.add_transition(None, accept)

            f.accept.add_transition(None, f.start)
            f.accept.add_transition(None, accept)

            stack.append(Fragment(start, accept))

    return stack.pop()


def serialize_nfa_to_graph(nfa_root: Fragment) -> dict:
    """
    Traverses the NFA graph using BFS and builds a clean 
    Nodes/Edges dictionary tailored for React Flow.
    """
    visited = set()
    queue = [nfa_root.start]
    
    nodes_map = {}  # Using a map to avoid duplicate node entries
    edges = []

    while queue:
        state = queue.pop(0)
        if state.id in visited:
            continue
        visited.add(state.id)

        # 1. Register the current node
        nodes_map[state.id] = {
            "id": f"nfa_{state.id}",
            "label": f"q{state.id}",
            "isStart": state.id == nfa_root.start.id,
            "isAccept": state.id == nfa_root.accept.id
        }

        # 2. Process Literal Transitions (from your .transition_state dict)
        transitions = getattr(state, 'transition_state', {})
        for char, next_states in transitions.items():
            for target in next_states:
                edges.append({
                    "source": f"nfa_{state.id}",
                    "target": f"nfa_{target.id}",
                    "label": char
                })
                # Ensure the target node is added to the rendering queue
                if target.id not in visited:
                    queue.append(target)

        # 3. Process Epsilon Transitions (from your .epsilon_state list)
        epsilon_states = getattr(state, 'epsilon_state', [])
        for target in epsilon_states:
            edges.append({
                "source": f"nfa_{state.id}",
                "target": f"nfa_{target.id}",
                "label": "ε"
            })
            # Ensure the target node is added to the rendering queue
            if target.id not in visited:
                queue.append(target)

    # Convert our unique map back to a clean list of nodes for React
    return {
        "nodes": list(nodes_map.values()),
        "edges": edges
    }