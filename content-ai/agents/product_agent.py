from agents.base_agent import BaseAgent
from schemas.content import ProductDescriptionRequest

class ProductAgent(BaseAgent):
    product_system_prompt = "You are a helpful assistant that creates product descriptions."
    def __init__(self):
        system_prompt = self.product_system_prompt
        super().__init__(system_prompt)

    def create_content(self, request: ProductDescriptionRequest) -> str:
        features = ", ".join(request.features)
        prompt = f"Write a product description for '{request.product_name}' that highlights the following features: {features}. The description should also explain the benefits of the product and be targeted towards {request.target_audience}. The description should be approximately {request.length} words long."
        response = self.generate(prompt)
        return response