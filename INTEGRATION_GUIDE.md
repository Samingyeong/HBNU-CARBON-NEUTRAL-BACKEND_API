# FastAPI 백엔드와 Next.js 프론트엔드 연동 가이드

이 문서는 FastAPI 백엔드와 Next.js 프론트엔드(https://github.com/YUJAEYUN/HBNU-CARBON-NEUTRAL-TEAM.git)를 연동하는 방법을 설명합니다.

## 1. FastAPI 백엔드 설정

### 1.1 환경 설정

1. 가상 환경 활성화:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. 필요한 패키지 설치:
   ```bash
   pip install -r requirements.txt
   ```

3. Google Cloud Vision API 설정:
   - Google Cloud 콘솔에서 프로젝트 생성
   - Vision API 활성화
   - 서비스 계정 생성 및 JSON 키 파일 다운로드
   - 키 파일을 안전한 위치에 저장

4. `.env` 파일 설정:
   - 프로젝트 루트 디렉토리에 `.env` 파일이 있는지 확인
   - Google Cloud 서비스 계정 키 파일 경로 설정
   - CORS 설정에 Next.js 프론트엔드 도메인 추가

### 1.2 백엔드 서버 실행

```bash
python run.py
```

또는

```bash
uvicorn app.main:app --reload
```

서버는 기본적으로 http://localhost:8000 에서 실행됩니다.

### 1.3 API 문서 확인

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 2. Next.js 프론트엔드 설정

### 2.1 프론트엔드 프로젝트 클론

```bash
git clone https://github.com/YUJAEYUN/HBNU-CARBON-NEUTRAL-TEAM.git
cd HBNU-CARBON-NEUTRAL-TEAM
```

### 2.2 의존성 설치

```bash
npm install
# 또는
yarn
```

### 2.3 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2.4 API 서비스 통합

1. `frontend-integration` 폴더의 파일을 참조하여 API 서비스 구현
2. `api-service.ts` 파일을 프로젝트의 적절한 위치에 복사 (예: `src/services/` 또는 `src/lib/`)
3. 필요한 경우 타입 정의 추가

### 2.5 컴포넌트 통합

1. `CarbonAnalyzer.tsx` 컴포넌트를 프로젝트의 컴포넌트 디렉토리에 복사 (예: `src/components/`)
2. 페이지에 컴포넌트 추가

### 2.6 프론트엔드 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

프론트엔드는 기본적으로 http://localhost:3000 에서 실행됩니다.

## 3. 연동 테스트

1. 백엔드 서버가 실행 중인지 확인 (http://localhost:8000)
2. 프론트엔드 서버가 실행 중인지 확인 (http://localhost:3000)
3. 프론트엔드에서 이미지 업로드 및 분석 기능 테스트
4. 브라우저 개발자 도구의 네트워크 탭에서 API 호출 확인

## 4. 배포 고려사항

### 4.1 백엔드 배포

- 클라우드 서비스(AWS, GCP, Azure 등)에 배포
- 도메인 설정
- HTTPS 설정
- 환경 변수 설정
- CORS 설정 업데이트

### 4.2 프론트엔드 배포

- Vercel 또는 다른 호스팅 서비스에 배포
- 환경 변수 설정 (`NEXT_PUBLIC_API_URL`을 배포된 백엔드 URL로 설정)

## 5. 문제 해결

### 5.1 CORS 오류

CORS 오류가 발생하는 경우:

1. 백엔드의 `.env` 파일에서 `ALLOWED_ORIGINS` 설정 확인
2. 프론트엔드 도메인이 허용 목록에 포함되어 있는지 확인
3. 백엔드 서버 재시작

### 5.2 API 연결 오류

API 호출이 실패하는 경우:

1. 백엔드 서버가 실행 중인지 확인
2. API URL이 올바른지 확인
3. 네트워크 요청/응답 검사
4. 백엔드 서버 로그 확인

### 5.3 Vision API 오류

Vision API 관련 오류가 발생하는 경우:

1. Google Cloud 서비스 계정 키 파일 경로가 올바른지 확인
2. Vision API가 활성화되어 있는지 확인
3. 서비스 계정에 적절한 권한이 있는지 확인

## 6. 추가 리소스

- [FastAPI 문서](https://fastapi.tiangolo.com/)
- [Next.js 문서](https://nextjs.org/docs)
- [Google Cloud Vision API 문서](https://cloud.google.com/vision/docs)
- [Vercel 배포 문서](https://vercel.com/docs)
