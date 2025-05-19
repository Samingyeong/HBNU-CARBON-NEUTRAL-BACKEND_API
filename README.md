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

## Docker 지원

이 프로젝트는 Docker를 사용하여 쉽게 실행할 수 있습니다.

### Docker로 실행하기

1. Docker 이미지 빌드:
   ```bash
   docker build -t carbon-neutral-api .
   ```

2. Docker 컨테이너 실행:
   ```bash
   docker run -p 8000:8000 -v $(pwd)/carbon-project-hanbat-5cbc71a30dff.json:/app/credentials.json:ro \
     -e GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json \
     -e MONGO_URL=mongodb://host.docker.internal:27017 \
     -e MONGO_DB_NAME=recycling_db \
     -e ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000 \
     carbon-neutral-api
   ```

### Docker Compose로 실행하기

MongoDB와 함께 애플리케이션을 실행하려면:

```bash
docker-compose up
```

## CI/CD 파이프라인

이 프로젝트는 GitHub Actions를 사용하여 Google Cloud Run에 자동으로 배포됩니다.

### 배포 설정

1. GitHub 저장소에 다음 시크릿을 설정하세요:
   - `GCP_SA_KEY`: Google Cloud 서비스 계정 키 (JSON 형식)
   - `MONGO_URL`: MongoDB 연결 문자열
   - `MONGO_DB_NAME`: MongoDB 데이터베이스 이름
   - `ALLOWED_ORIGINS`: 허용된 오리진 목록

2. 메인 브랜치에 푸시하면 자동으로 Cloud Run에 배포됩니다.

## 서버 실행 방법

### 가상 환경 사용
```bash
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

### Docker 사용
```bash
docker-compose up
```

## License

[MIT License](LICENSE)