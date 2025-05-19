/**
 * 분석 결과 상세 페이지
 * 
 * 이 페이지는 특정 이미지의 분석 결과를 상세하게 보여줍니다.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RecyclingResult from './RecyclingResult';
import { getImageInfo, getImageUrl } from './camera-integration';

export default function AnalysisDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchAnalysisData = async () => {
      try {
        // 이미지 정보 및 분석 결과 조회 API 호출
        const data = await getImageInfo(id);
        setAnalysisData(data);
      } catch (err) {
        console.error('분석 데이터 조회 오류:', err);
        setError('분석 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysisData();
  }, [id]);
  
  if (!id) {
    return null; // 라우터가 준비되지 않은 경우
  }
  
  if (isLoading) {
    return <div className="loading">데이터 불러오는 중...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!analysisData) {
    return <div>분석 데이터가 없습니다.</div>;
  }
  
  return (
    <div className="analysis-detail-page">
      <h1>분석 결과 상세</h1>
      
      <div className="image-container">
        <img 
          src={getImageUrl(id)} 
          alt={analysisData.image.filename} 
          className="analysis-image"
        />
      </div>
      
      <div className="analysis-info">
        <p><strong>파일명:</strong> {analysisData.image.filename}</p>
        <p><strong>분석 일시:</strong> {new Date(analysisData.image.created_at).toLocaleString()}</p>
      </div>
      
      {analysisData.analysis && (
        <div className="analysis-result">
          <RecyclingResult result={{
            recycling_analysis: analysisData.analysis.analysis_result,
            detected_labels: analysisData.analysis.detected_labels,
            detected_objects: analysisData.analysis.detected_objects
          }} />
        </div>
      )}
      
      <div className="actions">
        <button onClick={() => router.push('/recycling-analysis')} className="new-analysis-button">
          새 이미지 분석하기
        </button>
        <button onClick={() => router.back()} className="back-button">
          뒤로 가기
        </button>
      </div>
      
      <style jsx>{`
        .analysis-detail-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
        }
        
        .error-message {
          color: #e74c3c;
          padding: 15px;
          background-color: #ffeaea;
          border-radius: 8px;
          border-left: 4px solid #e74c3c;
        }
        
        .image-container {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .analysis-image {
          max-width: 100%;
          max-height: 500px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .analysis-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .analysis-result {
          margin-bottom: 30px;
        }
        
        .actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 30px;
        }
        
        .new-analysis-button, .back-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .new-analysis-button {
          background-color: #3498db;
          color: white;
        }
        
        .new-analysis-button:hover {
          background-color: #2980b9;
        }
        
        .back-button {
          background-color: #95a5a6;
          color: white;
        }
        
        .back-button:hover {
          background-color: #7f8c8d;
        }
      `}</style>
    </div>
  );
}
