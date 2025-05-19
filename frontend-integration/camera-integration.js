/**
 * Next.js 프론트엔드와 FastAPI 백엔드 연동 예제
 * 
 * 이 파일은 Next.js 프론트엔드에서 카메라로 촬영한 이미지를 
 * FastAPI 백엔드로 전송하고 분석 결과를 받아오는 예제 코드입니다.
 */

// API 기본 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * 이미지를 분석하고 MongoDB에 저장하는 함수
 * @param {File} imageFile - 카메라로 촬영하거나 업로드한 이미지 파일
 * @returns {Promise<Object>} 분석 결과
 */
export async function analyzeAndSaveImage(imageFile) {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append('file', imageFile);
    
    // API 호출
    const response = await fetch(`${API_BASE_URL}/analyze-and-save/`, {
      method: 'POST',
      body: formData,
    });
    
    // 응답 확인
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API 호출 실패: ${response.status}`);
    }
    
    // 응답 데이터 반환
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('이미지 분석 및 저장 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 저장된 이미지 정보와 분석 결과를 조회하는 함수
 * @param {string} imageId - 이미지 ID
 * @returns {Promise<Object>} 이미지 정보와 분석 결과
 */
export async function getImageInfo(imageId) {
  try {
    // API 호출
    const response = await fetch(`${API_BASE_URL}/images/${imageId}`);
    
    // 응답 확인
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API 호출 실패: ${response.status}`);
    }
    
    // 응답 데이터 반환
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('이미지 정보 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 최근 분석된 이미지 목록을 조회하는 함수
 * @param {number} limit - 조회할 이미지 수
 * @returns {Promise<Array>} 이미지 목록
 */
export async function getRecentImages(limit = 10) {
  try {
    // API 호출
    const response = await fetch(`${API_BASE_URL}/images/recent?limit=${limit}`);
    
    // 응답 확인
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API 호출 실패: ${response.status}`);
    }
    
    // 응답 데이터 반환
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('최근 이미지 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 이미지 URL을 생성하는 함수
 * @param {string} imageId - 이미지 ID
 * @returns {string} 이미지 URL
 */
export function getImageUrl(imageId) {
  return `${API_BASE_URL}/images/${imageId}/data`;
}

/**
 * 한국어 재질 이름 변환 함수
 * @param {string} materialType - 재질 유형
 * @returns {string} 한국어 재질 이름
 */
export function getKoreanMaterialName(materialType) {
  const materialNames = {
    "plastic": "플라스틱",
    "paper": "종이",
    "glass": "유리",
    "metal": "금속/캔",
    "food_waste": "음식물 쓰레기",
    "general_waste": "일반 쓰레기",
    "electronics": "전자제품",
    "textile": "의류/섬유"
  };
  
  return materialNames[materialType] || materialType;
}

/**
 * 분리수거함 색상 변환 함수
 * @param {string} binColor - 분리수거함 색상
 * @returns {string} CSS 색상 코드
 */
export function getBinColor(binColor) {
  const colorMap = {
    "파란색": "#3498db",
    "초록색": "#2ecc71",
    "갈색": "#d35400",
    "노란색": "#f1c40f",
    "검정색": "#34495e",
    "별도 수거함": "#9b59b6"
  };
  
  return colorMap[binColor] || "#95a5a6";
}
