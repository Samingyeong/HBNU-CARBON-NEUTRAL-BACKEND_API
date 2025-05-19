# FastAPI 백엔드와 Next.js 프론트엔드 연동 가이드

이 문서는 FastAPI 백엔드 API를 Next.js 프론트엔드와 연동하는 방법을 설명합니다.

## 목차

1. [환경 설정](#환경-설정)
2. [API 서비스 통합](#api-서비스-통합)
3. [컴포넌트 사용 방법](#컴포넌트-사용-방법)
4. [배포 시 고려사항](#배포-시-고려사항)

## 환경 설정

### 1. 환경 변수 설정

Next.js 프로젝트의 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

개발 환경에서는 로컬 FastAPI 서버 URL을, 프로덕션 환경에서는 배포된 FastAPI 서버 URL을 사용합니다.

### 2. 필요한 패키지 설치

```bash
npm install axios
# 또는
yarn add axios
```

## API 서비스 통합

### 1. API 서비스 파일 복사

`frontend-integration` 폴더의 `api-service.ts` 파일을 Next.js 프로젝트의 적절한 위치(예: `src/services/` 또는 `src/lib/`)에 복사합니다.

### 2. 타입 정의 (TypeScript 사용 시)

필요한 경우 API 응답에 대한 타입을 정의합니다. 예시:

```typescript
// src/types/api.ts
export interface LabelResult {
  description: string;
  score: number;
}

export interface ImageAnalysisResult {
  filename: string;
  content_type: string;
  labels: LabelResult[];
}

// 다른 API 응답에 대한 타입도 필요에 따라 정의
```

## 컴포넌트 사용 방법

### 1. 예제 컴포넌트 복사

`frontend-integration` 폴더의 `CarbonAnalyzer.tsx` 파일을 Next.js 프로젝트의 컴포넌트 디렉토리(예: `src/components/`)에 복사합니다.

### 2. 페이지에 컴포넌트 추가

Next.js 앱 라우터를 사용하는 경우:

```tsx
// src/app/carbon-analyzer/page.tsx
import CarbonAnalyzer from '@/components/CarbonAnalyzer';

export default function CarbonAnalyzerPage() {
  return (
    <main>
      <CarbonAnalyzer />
    </main>
  );
}
```

페이지 라우터를 사용하는 경우:

```tsx
// src/pages/carbon-analyzer.tsx
import CarbonAnalyzer from '@/components/CarbonAnalyzer';

export default function CarbonAnalyzerPage() {
  return (
    <main>
      <CarbonAnalyzer />
    </main>
  );
}
```

### 3. 스타일링 적용

예제 컴포넌트는 Tailwind CSS를 사용합니다. Tailwind CSS가 설치되어 있지 않다면 설치하거나, 기존 스타일링 방식에 맞게 컴포넌트를 수정하세요.

## 배포 시 고려사항

### 1. CORS 설정

FastAPI 백엔드의 CORS 설정에 프론트엔드 도메인이 허용되어 있는지 확인합니다. `.env` 파일의 `ALLOWED_ORIGINS` 변수에 프론트엔드 도메인을 추가해야 합니다.

### 2. 환경 변수 설정

Vercel과 같은 서비스에 배포할 때 환경 변수를 설정합니다:

1. Vercel 대시보드에서 프로젝트 설정으로 이동
2. "Environment Variables" 섹션에서 `NEXT_PUBLIC_API_URL` 변수 추가
3. 값으로 배포된 FastAPI 백엔드 URL 입력 (예: `https://your-fastapi-backend.com`)

### 3. 보안 고려사항

- 민감한 API 키나 비밀은 클라이언트 측 코드에 포함하지 마세요.
- 필요한 경우 Next.js API 라우트를 사용하여 백엔드 API 호출을 프록시하세요.
- 프로덕션 환경에서는 HTTPS를 사용하세요.

## 문제 해결

### CORS 오류

브라우저 콘솔에 CORS 오류가 표시되는 경우:

1. FastAPI 백엔드의 CORS 설정에 프론트엔드 도메인이 포함되어 있는지 확인
2. 백엔드 서버가 실행 중인지 확인
3. API URL이 올바르게 설정되어 있는지 확인

### API 연결 오류

API 호출이 실패하는 경우:

1. 백엔드 서버가 실행 중인지 확인
2. 네트워크 탭에서 요청/응답을 검사하여 오류 세부 정보 확인
3. API URL이 올바른지 확인
4. 백엔드 서버 로그 확인
