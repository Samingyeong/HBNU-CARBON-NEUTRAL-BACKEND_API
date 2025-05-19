/**
 * 이미지 히스토리 컴포넌트
 * 
 * 이 컴포넌트는 최근 분석된 이미지 목록을 표시합니다.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRecentImages, getImageUrl } from './camera-integration';

export default function ImageHistory() {
  const [recentImages, setRecentImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRecentImages = async () => {
      try {
        // 최근 이미지 조회 API 호출
        const images = await getRecentImages();
        setRecentImages(images);
      } catch (err) {
        console.error('이미지 조회 오류:', err);
        setError('최근 이미지를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentImages();
  }, []);
  
  if (isLoading) {
    return <div className="loading">이미지 불러오는 중...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="image-history">
      <h2>최근 분석 이미지</h2>
      
      {recentImages.length === 0 ? (
        <p>최근 분석한 이미지가 없습니다.</p>
      ) : (
        <div className="image-grid">
          {recentImages.map(image => (
            <div key={image.image_id} className="image-item">
              <Link href={`/analysis/${image.image_id}`}>
                <a>
                  <div className="image-thumbnail">
                    <img 
                      src={getImageUrl(image.image_id)} 
                      alt={image.filename} 
                      className="thumbnail"
                    />
                  </div>
                  <div className="image-info">
                    <p className="image-filename">{image.filename}</p>
                    <p className="image-date">
                      {new Date(image.created_at).toLocaleString()}
                    </p>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .image-history {
          margin-top: 30px;
        }
        
        h2 {
          margin-bottom: 20px;
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
        
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .image-item {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s;
        }
        
        .image-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .image-thumbnail {
          height: 150px;
          overflow: hidden;
        }
        
        .thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-info {
          padding: 10px;
        }
        
        .image-filename {
          font-weight: bold;
          margin: 0 0 5px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .image-date {
          font-size: 0.8em;
          color: #7f8c8d;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
