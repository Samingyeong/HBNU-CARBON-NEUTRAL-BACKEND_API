/**
 * 재활용 분석 페이지
 * 
 * 이 페이지는 카메라로 촬영하거나 업로드한 이미지를 분석하여
 * 재활용 가능 여부와 분리수거 방법을 보여줍니다.
 */

import { useState } from 'react';
import CameraCapture from './CameraCapture';
import RecyclingResult from './RecyclingResult';
import { analyzeAndSaveImage } from './camera-integration';

export default function RecyclingAnalysisPage() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  
  // 카메라로 촬영한 이미지 처리
  const handleCapture = (capturedFile) => {
    setFile(capturedFile);
    analyzeImage(capturedFile);
  };
  
  // 파일 선택 처리
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      analyzeImage(selectedFile);
    }
  };
  
  // 이미지 분석 요청
  const analyzeImage = async (imageFile) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // 이미지 분석 및 저장 API 호출
      const result = await analyzeAndSaveImage(imageFile);
      
      // 분석 결과 설정
      setAnalysisResult(result);
      
      // 이미지 ID 저장 (필요시 나중에 조회할 수 있도록)
      localStorage.setItem('lastAnalyzedImageId', result.image_id);
    } catch (err) {
      console.error('이미지 분석 오류:', err);
      setError('이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="recycling-analysis-page">
      <h1>재활용 분석</h1>
      
      <div className="analysis-container">
        <div className="input-section">
          <h2>이미지 입력</h2>
          
          <div className="input-methods">
            <div className="camera-section">
              <h3>카메라로 촬영</h3>
              <CameraCapture onCapture={handleCapture} />
            </div>
            
            <div className="upload-section">
              <h3>이미지 업로드</h3>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="file-input"
              />
            </div>
          </div>
        </div>
        
        {isAnalyzing && (
          <div className="analyzing-indicator">
            <p>이미지 분석 중...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {analysisResult && (
          <div className="result-section">
            <h2>분석 결과</h2>
            <RecyclingResult result={analysisResult} />
          </div>
        )}
      </div>
      
      <style jsx>{`
        .recycling-analysis-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .analysis-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .input-section {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .input-methods {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .camera-section, .upload-section {
          flex: 1;
          min-width: 300px;
        }
        
        .file-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-top: 10px;
        }
        
        .analyzing-indicator {
          text-align: center;
          padding: 20px;
          background-color: #f0f7ff;
          border-radius: 8px;
        }
        
        .error-message {
          color: #e74c3c;
          padding: 15px;
          background-color: #ffeaea;
          border-radius: 8px;
          border-left: 4px solid #e74c3c;
        }
        
        .result-section {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
