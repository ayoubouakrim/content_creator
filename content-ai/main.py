from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI(title="SEO Content Manager API")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test endpoint
@app.get("/")
def home():
    return {"message": "API is running"}

# Health check
@app.get("/health")
def health():
    return {"status": "ok"}