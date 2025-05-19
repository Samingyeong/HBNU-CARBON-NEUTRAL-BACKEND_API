import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get host and port from environment variables or use defaults
host = os.getenv("API_HOST", "127.0.0.1")
port = int(os.getenv("API_PORT", "8001"))

if __name__ == "__main__":
    print(f"Starting Carbon Neutral Vision API server at http://{host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)