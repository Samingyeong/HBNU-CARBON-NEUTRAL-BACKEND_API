// pages/recycling-analysis.js
import { useState } from 'react';
import Head from 'next/head';
import CameraCapture from '../components/CameraCapture';
import { analyzeAndSaveImage } from '../utils/api';

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
  
  // 재질 한글 이름 변환
  const getKoreanMaterialName = (materialType) => {
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
  };
  
  // 분리수거함 색상 변환
  const getBinColor = (binColor) => {
    const colorMap = {
      "파란색": "#3498db",
      "초록색": "#2ecc71",
      "갈색": "#d35400",
      "노란색": "#f1c40f",
      "검정색": "#34495e",
      "별도 수거함": "#9b59b6"
    };
    
    return colorMap[binColor] || "#95a5a6";
  };
  
  return (
    <div className="recycling-analysis-page">
      <Head>
        <title>재활용 분석 - 탄소중립 프로젝트</title>
        <meta name="description" content="이미지를 분석하여 재활용 가능 여부와 분리수거 방법을 알려드립니다." />
      </Head>
      
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
        
        {analysisResult && analysisResult.recycling_analysis && (
          <div className="result-section">
            <h2>분석 결과</h2>
            
            <div className="recycling-results">
              {/* 재활용 가능 재질 */}
              {analysisResult.recycling_analysis.recommendations.recyclable_materials.length > 0 && (
                <div className="recyclable-materials">
                  <h3 className="recyclable">재활용 가능 재질</h3>
                  <ul className="material-list">
                    {analysisResult.recycling_analysis.recommendations.recyclable_materials.map((material, index) => (
                      <li key={`recyclable-${index}`} className="material-item">
                        <div className="material-header">
                          <span className="material-type">{getKoreanMaterialName(material.type)}</span>
                          <span className="confidence">
                            (신뢰도: {(material.confidence * 100).toFixed(2)}%)
                          </span>
                        </div>
                        
                        <div className="bin-info">
                          분리수거함: 
                          <span 
                            className="bin-color" 
                            style={{backgroundColor: getBinColor(material.bin_color)}}
                          >
                            {material.bin_color}
                          </span>
                        </div>
                        
                        <div className="preparation-steps">
                          <strong>준비 단계:</strong>
                          <ol>
                            {material.preparation_steps.map((step, stepIndex) => (
                              <li key={`step-${index}-${stepIndex}`}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* 복합 재질 */}
              {analysisResult.recycling_analysis.recommendations.composite_materials.length > 0 && (
                <div className="composite-materials">
                  <h3>복합 재질 처리 방법</h3>
                  
                  {analysisResult.recycling_analysis.recommendations.composite_materials.map((composite, index) => (
                    <div key={`composite-${index}`} className="composite-material">
                      <h4>{composite.description}</h4>
                      <p>
                        <strong>재질:</strong> {composite.materials.map(m => getKoreanMaterialName(m)).join(' + ')}
                      </p>
                      <p>
                        <strong>분리 방법:</strong> {composite.separation_method}
                      </p>
                      <div className="composite-steps">
                        <strong>단계:</strong>
                        <ol>
                          {composite.steps.map((step, stepIndex) => (
                            <li key={`composite-step-${index}-${stepIndex}`}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
        
        .material-list {
                .material-list {
          list-style-type: none;
          padding: 0;
        }
        
        .material-item {
          margin-bottom: 15px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #f9f9f9;
        }
        
        .material-header {
          margin-bottom: 10px;
        }
        
        .material-type {
          font-size: 1.2em;
          font-weight: bold;
        }
        
        .confidence {
          color: #7f8c8d;
          font-size: 0.9em;
          margin-left: 10px;
        }
        
        .bin-info {
          margin: 10px 0;
        }
        
        .bin-color {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          margin-left: 5px;
        }
        
        .preparation-steps ol {
          margin-top: 5px;
        }
        
        .recyclable {
          color: #27ae60;
        }
        
        .non-recyclable {
          color: #e74c3c;
        }
        
        .composite-material {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #f0f7ff;
        }
        
        .composite-steps ol {
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
}