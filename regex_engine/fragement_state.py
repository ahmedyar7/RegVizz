class Fragment:
    """This represents the single NFA-state with single start and accept state"""

    def __init__(self, start, accept):
        self.start = start
        self.accept = accept
