class NFAState:

    def __init__(self, id):
        self.id = id
        self.transition_state = {}
        self.epsilon_state = []

    def add_transition(self, char, state):
        if char is None:
            self.epsilon_state.append(state)
        else:
            self.transition_state.setdefault(char, []).append(state)
