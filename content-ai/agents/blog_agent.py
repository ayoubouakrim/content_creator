
class BlogAgent(BaseAgent):
    def __init__(self,):
        super().__init__(llm=llm, tools=tools, verbose=True)
        