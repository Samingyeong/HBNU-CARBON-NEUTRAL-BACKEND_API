'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import apiService from './api-service';

// 분석 유형 정의
type AnalysisType = 'labels' | 'text' | 'objects' | 'carbon-footprint';

// 분석 결과 인터페이스
interface AnalysisResult {
  filename?: string;
  content_type?: string;
  [key: string]: any;
}

export default function CarbonAnalyzer() {
  // 상태 관리
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('carbon-footprint');

  // 파일 선택 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // 이미지 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      
      // 이전 결과 및 오류 초기화
      setResult(null);
      setError(null);
    }
  };

  // 분석 유형 변경 핸들러
  const handleAnalysisTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAnalysisType(e.target.value as AnalysisType);
    setResult(null);
    setError(null);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('이미지 파일을 선택해주세요');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      // 선택한 분석 유형에 따라 API 호출
      switch (analysisType) {
        case 'labels':
          response = await apiService.analyzeImage(file);
          break;
        case 'text':
          response = await apiService.detectText(file);
          break;
        case 'objects':
          response = await apiService.detectObjects(file);
          break;
        case 'carbon-footprint':
          response = await apiService.analyzeCarbonFootprint(file);
          break;
      }
      
      setResult(response);
    } catch (err) {
      console.error('이미지 분석 중 오류 발생:', err);
      setError('이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 탄소 발자국 분석 결과 렌더링
  const renderCarbonFootprintResults = () => {
    if (!result) return null;
    
    return (
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">탄소 발자국 분석 결과</h3>
        <div className="mb-4">
          <p className="font-semibold">평가: 
            <span className={`ml-2 px-2 py-1 rounded ${
              result.assessment?.includes('Positive') ? 'bg-green-100 text-green-800' : 
              result.assessment?.includes('Neutral') ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {result.assessment}
            </span>
          </p>
          <p className="font-semibold">총 탄소 점수: {result.total_carbon_score?.toFixed(2)}</p>
        </div>
        
        {result.carbon_impact_details?.length > 0 ? (
          <div>
            <h4 className="font-semibold mb-2">탄소 영향 세부 정보:</h4>
            <ul className="divide-y">
              {result.carbon_impact_details.map((item: any, index: number) => (
                <li key={index} className="py-2">
                  <p><span className="font-medium">항목:</span> {item.item}</p>
                  <p><span className="font-medium">탄소 값:</span> {item.carbon_value}</p>
                  <p><span className="font-medium">신뢰도:</span> {(item.confidence * 100).toFixed(2)}%</p>
                  <p><span className="font-medium">가중 영향:</span> {item.weighted_impact.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>탄소 영향 세부 정보가 없습니다.</p>
        )}
      </div>
    );
  };

  // 기타 분석 결과 렌더링
  const renderAnalysisResults = () => {
    if (!result) return null;
    
    if (analysisType === 'carbon-footprint') {
      return renderCarbonFootprintResults();
    }
    
    // 다른 분석 유형에 대한 결과 표시
    return (
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">분석 결과</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">탄소중립 이미지 분석기</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">분석 유형 선택:</label>
          <select
            value={analysisType}
            onChange={handleAnalysisTypeChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="carbon-footprint">탄소 발자국 분석</option>
            <option value="labels">라벨 감지</option>
            <option value="text">텍스트 감지</option>
            <option value="objects">객체 감지</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">이미지 업로드:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        
        {preview && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">미리보기:</h3>
            <img
              src={preview}
              alt="미리보기"
              className="max-h-64 rounded-lg shadow"
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !file}
          className={`px-6 py-2 rounded-lg text-white font-medium ${
            loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? '분석 중...' : '이미지 분석하기'}
        </button>
      </form>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      
      {renderAnalysisResults()}
    </div>
  );
}
