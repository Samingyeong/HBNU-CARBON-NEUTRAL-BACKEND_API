/**
 * 재활용 분석 결과 컴포넌트
 * 
 * 이 컴포넌트는 재활용 분석 결과를 표시합니다.
 */

import { useState } from 'react';
import { getKoreanMaterialName, getBinColor } from './camera-integration';

export default function RecyclingResult({ result }) {
  const [activeTab, setActiveTab] = useState('materials');
  
  if (!result || !result.recycling_analysis) {
    return <div>분석 결과가 없습니다.</div>;
  }
  
  const analysis = result.recycling_analysis;
  const recommendations = analysis.recommendations;
  
  return (
    <div className="recycling-result">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          재질 분석
        </button>
        <button 
          className={`tab-button ${activeTab === 'composite' ? 'active' : ''}`}
          onClick={() => setActiveTab('composite')}
        >
          복합 재질
        </button>
        <button 
          className={`tab-button ${activeTab === 'steps' ? 'active' : ''}`}
          onClick={() => setActiveTab('steps')}
        >
          분리수거 방법
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'materials' && (
          <div className="materials-tab">
            <p className="general-instructions">{recommendations.general_instructions}</p>
            
            {/* 재활용 가능 재질 */}
            {recommendations.recyclable_materials.length > 0 && (
              <div className="recyclable-materials">
                <h3 className="recyclable">재활용 가능 재질</h3>
                <ul className="material-list">
                  {recommendations.recyclable_materials.map((material, index) => (
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
                      
                      <div className="items">
                        <strong>감지된 항목:</strong> {material.items.join(', ')}
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
            
            {/* 재활용 불가능 재질 */}
            {recommendations.non_recyclable_materials.length > 0 && (
              <div className="non-recyclable-materials">
                <h3 className="non-recyclable">재활용 불가능 재질</h3>
                <ul className="material-list">
                  {recommendations.non_recyclable_materials.map((material, index) => (
                    <li key={`non-recyclable-${index}`} className="material-item">
                      <div className="material-header">
                        <span className="material-type">{getKoreanMaterialName(material.type)}</span>
                        <span className="confidence">
                          (신뢰도: {(material.confidence * 100).toFixed(2)}%)
                        </span>
                      </div>
                      
                      <div className="bin-info">
                        배출 방법: 
                        <span 
                          className="bin-color" 
                          style={{backgroundColor: getBinColor(material.bin_color)}}
                        >
                          {material.bin_color}
                        </span>
                      </div>
                      
                      <div className="items">
                        <strong>감지된 항목:</strong> {material.items.join(', ')}
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
          </div>
        )}
        
        {activeTab === 'composite' && (
          <div className="composite-tab">
            <h3>복합 재질 처리 방법</h3>
            
            {recommendations.composite_materials.length > 0 ? (
              <div className="composite-materials">
                {recommendations.composite_materials.map((composite, index) => (
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
            ) : (
              <p>복합 재질이 감지되지 않았습니다.</p>
            )}
          </div>
        )}
        
        {activeTab === 'steps' && (
          <div className="steps-tab">
            <h3>분리수거 상세 단계</h3>
            
            {recommendations.detailed_steps.length > 0 ? (
              <ol className="detailed-steps">
                {recommendations.detailed_steps.map((step, index) => (
                  <li key={`detailed-step-${index}`}>{step}</li>
                ))}
              </ol>
            ) : (
              <p>상세 단계가 없습니다.</p>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .recycling-result {
          margin-top: 20px;
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
        }
        
        .tab-button {
          padding: 10px 15px;
          background-color: #f1f1f1;
          border: none;
          cursor: pointer;
          margin-right: 5px;
          border-radius: 4px 4px 0 0;
        }
        
        .tab-button.active {
          background-color: #3498db;
          color: white;
        }
        
        .general-instructions {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
          border-left: 4px solid #3498db;
        }
        
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
        
        .items {
          margin: 10px 0;
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
        
        .detailed-steps li {
          margin-bottom: 10px;
          padding: 5px 0;
          border-bottom: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
}
