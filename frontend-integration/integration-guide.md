# 프론트엔드 연동 가이드

이 디렉토리에는 Next.js 프론트엔드와 FastAPI 백엔드를 연동하기 위한 예제 코드가 포함되어 있습니다.

## 파일 구조

- `camera-integration.js`: 백엔드 API 호출 함수 모음
- `CameraCapture.jsx`: 카메라 촬영 컴포넌트
- `RecyclingAnalysisPage.jsx`: 재활용 분석 페이지
- `RecyclingResult.jsx`: 재활용 분석 결과 표시 컴포넌트
- `ImageHistory.jsx`: 최근 분석 이미지 목록 컴포넌트
- `AnalysisDetailPage.jsx`: 분석 결과 상세 페이지

## 설치 방법

1. Next.js 프로젝트에 파일 복사:
   - 위 파일들을 Next.js 프로젝트의 적절한 위치에 복사합니다.
   - 컴포넌트는 `components` 디렉토리에, 페이지는 `pages` 디렉토리에 복사하는 것이 좋습니다.

2. 환경 변수 설정:
   - `.env.local` 파일을 생성하고 다음 내용을 추가합니다:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. 필요한 패키지 설치:
   ```bash
   npm install next-images
   ```

## 사용 방법

### 페이지 라우팅 설정

Next.js 프로젝트의 `pages` 디렉토리에 다음 파일들을 추가합니다:

1. `pages/recycling-analysis.js`:
   ```jsx
   import RecyclingAnalysisPage from '../components/RecyclingAnalysisPage';
   
   export default function RecyclingAnalysis() {
     return <RecyclingAnalysisPage />;
   }
   ```

2. `pages/analysis/[id].js`:
   ```jsx
   import AnalysisDetailPage from '../../components/AnalysisDetailPage';
   
   export default function AnalysisDetail() {
     return <AnalysisDetailPage />;
   }
   ```

3. `pages/history.js`:
   ```jsx
   import ImageHistory from '../components/ImageHistory';
   
   export default function History() {
     return (
       <div>
         <h1>이미지 히스토리</h1>
         <ImageHistory />
       </div>
     );
   }
   ```

### 네비게이션 메뉴 추가

`components/Layout.jsx` 또는 메인 레이아웃 파일에 다음과 같은 네비게이션 메뉴를 추가합니다:

```jsx
<nav>
  <ul>
    <li>
      <Link href="/">
        <a>홈</a>
      </Link>
    </li>
    <li>
      <Link href="/recycling-analysis">
        <a>재활용 분석</a>
      </Link>
    </li>
    <li>
      <Link href="/history">
        <a>분석 히스토리</a>
      </Link>
    </li>
  </ul>
</nav>
```

## API 엔드포인트

이 프론트엔드 코드는 다음 백엔드 API 엔드포인트를 사용합니다:

- `POST /analyze-and-save/`: 이미지 분석 및 저장
- `GET /images/{image_id}`: 이미지 정보 및 분석 결과 조회
- `GET /images/{image_id}/data`: 이미지 데이터 조회
- `GET /images/recent`: 최근 이미지 목록 조회

## 주의사항

1. 카메라 접근 권한:
   - 카메라 기능을 사용하려면 HTTPS 환경이 필요합니다.
   - 개발 환경에서는 `localhost`에서도 작동하지만, 배포 시에는 HTTPS가 필요합니다.

2. 이미지 크기:
   - 카메라로 촬영한 이미지는 크기가 클 수 있으므로, 필요에 따라 이미지 크기를 조정하는 코드를 추가할 수 있습니다.

3. 오류 처리:
   - 네트워크 오류, 서버 오류 등 다양한 오류 상황에 대한 처리가 구현되어 있습니다.
   - 필요에 따라 오류 메시지를 사용자 친화적으로 수정할 수 있습니다.

## 커스터마이징

1. 스타일링:
   - 각 컴포넌트에는 기본적인 스타일이 포함되어 있습니다.
   - 프로젝트의 디자인 시스템에 맞게 스타일을 수정할 수 있습니다.

2. 기능 확장:
   - 이미지 공유 기능, 소셜 미디어 공유 등 추가 기능을 구현할 수 있습니다.
   - 사용자 인증을 추가하여 개인별 이미지 히스토리를 관리할 수 있습니다.
