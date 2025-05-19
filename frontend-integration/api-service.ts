// api-service.ts
// Next.js 프론트엔드에서 FastAPI 백엔드를 호출하기 위한 서비스

// 백엔드 API URL 설정
// 환경 변수를 사용하거나 기본값으로 로컬 개발 서버 URL 사용
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * 이미지 분석 API 호출 함수
 * @param file 분석할 이미지 파일
 * @returns 분석 결과
 */
export async function analyzeImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/analyze-image/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('이미지 분석 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 텍스트 감지 API 호출 함수
 * @param file 텍스트를 감지할 이미지 파일
 * @returns 감지된 텍스트 결과
 */
export async function detectText(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/detect-text/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('텍스트 감지 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 객체 감지 API 호출 함수
 * @param file 객체를 감지할 이미지 파일
 * @returns 감지된 객체 결과
 */
export async function detectObjects(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/detect-objects/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('객체 감지 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 탄소 발자국 분석 API 호출 함수
 * @param file 분석할 이미지 파일
 * @returns 탄소 발자국 분석 결과
 */
export async function analyzeCarbonFootprint(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/analyze-carbon-footprint/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('탄소 발자국 분석 중 오류 발생:', error);
    throw error;
  }
}

// API 서비스 객체로 내보내기
const apiService = {
  analyzeImage,
  detectText,
  detectObjects,
  analyzeCarbonFootprint,
};

export default apiService;
