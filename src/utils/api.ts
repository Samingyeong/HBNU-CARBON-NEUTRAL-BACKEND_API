/**
 * API 서비스
 * 
 * Next.js 프론트엔드에서 FastAPI 백엔드를 호출하기 위한 유틸리티 함수들
 */

// 백엔드 API URL 설정
// 환경 변수를 사용하거나 기본값으로 로컬 개발 서버 URL 사용
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * 이미지를 분석하고 MongoDB에 저장하는 함수
 * 
 * @param file 분석할 이미지 파일
 * @param userId 사용자 ID (선택 사항)
 * @param category 이미지 카테고리 (선택 사항)
 * @returns 분석 결과
 */
export async function analyzeAndSaveImage(file: File, userId?: string, category?: string) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // 사용자 ID와 카테고리가 제공된 경우 추가
    if (userId) {
      formData.append('user_id', userId);
    }
    
    if (category) {
      formData.append('category', category);
    }

    const response = await fetch(`${API_BASE_URL}/analyze-and-save/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('이미지 분석 및 저장 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 특정 사용자의 이미지 목록을 가져오는 함수
 * 
 * @param userId 사용자 ID
 * @param limit 가져올 이미지 수 (기본값: 50)
 * @returns 사용자의 이미지 목록
 */
export async function getUserImages(userId: string, limit: number = 50) {
  try {
    const response = await fetch(`${API_BASE_URL}/images/user/${userId}?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('사용자 이미지 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 특정 카테고리의 이미지 목록을 가져오는 함수
 * 
 * @param category 이미지 카테고리
 * @param limit 가져올 이미지 수 (기본값: 50)
 * @param userId 특정 사용자의 이미지만 가져올 경우 사용자 ID (선택 사항)
 * @returns 카테고리별 이미지 목록
 */
export async function getCategoryImages(category: string, limit: number = 50, userId?: string) {
  try {
    let url = `${API_BASE_URL}/images/category/${category}?limit=${limit}`;
    if (userId) {
      url += `&user_id=${userId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('카테고리 이미지 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 이미지 정보와 분석 결과를 가져오는 함수
 * 
 * @param imageId 이미지 ID
 * @returns 이미지 정보와 분석 결과
 */
export async function getImageInfo(imageId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}`);

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('이미지 정보 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 이미지 URL을 생성하는 함수
 * 
 * @param imageId 이미지 ID
 * @returns 이미지 URL
 */
export function getImageUrl(imageId: string) {
  return `${API_BASE_URL}/images/${imageId}/data`;
}
