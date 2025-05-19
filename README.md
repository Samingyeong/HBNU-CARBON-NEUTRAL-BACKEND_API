# HBNU Carbon Neutral Backend API

This is a FastAPI backend service that integrates with Google Vision API to analyze images for carbon footprint assessment and other vision-related tasks.

## Features

- Image analysis using Google Vision API
- Label detection
- Text detection
- Object detection
- Carbon footprint analysis based on image content
- CORS support for frontend integration

## Prerequisites

- Python 3.8+
- Google Cloud account with Vision API enabled
- Google Cloud service account key file

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/HBNU-CARBON-NEUTRAL-BACKEND_API.git
   cd HBNU-CARBON-NEUTRAL-BACKEND_API
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up Google Cloud Vision API:
   - Create a project in Google Cloud Console
   - Enable the Vision API
   - Create a service account and download the JSON key file
   - Place the key file in a secure location

4. Configure environment variables:
   - Create a `.env` file in the project root
   - Add the following variables:
     ```
     GOOGLE_APPLICATION_CREDENTIALS=path/to/your-service-account-key.json
     ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
     ```

## Running the API

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://127.0.0.1:8000

## API Documentation

Once the server is running, you can access the interactive API documentation at:

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## API Endpoints

- `GET /`: Welcome message
- `POST /analyze-image/`: Analyze an image to detect labels
- `POST /detect-text/`: Detect text in an image
- `POST /detect-objects/`: Detect objects in an image
- `POST /analyze-carbon-footprint/`: Analyze carbon footprint based on image content

## Frontend Integration

To connect with a Next.js frontend:

1. Ensure CORS is properly configured in the `.env` file
2. Use the fetch API or Axios in your Next.js application to make requests to the backend
3. Example usage:

```javascript
// Example Next.js code to call the API
async function analyzeImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/analyze-carbon-footprint/', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data;
}
```

## License

[MIT License](LICENSE)