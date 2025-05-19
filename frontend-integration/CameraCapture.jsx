/**
 * 카메라 촬영 컴포넌트
 * 
 * 이 컴포넌트는 Next.js 프론트엔드에서 카메라로 이미지를 촬영하는 기능을 제공합니다.
 */

import { useState, useRef, useEffect } from 'react';

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
        setError(null);
      }
    } catch (err) {
      console.error('카메라 접근 오류:', err);
      setError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  // 이미지 캡처
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // 캔버스 크기를 비디오 크기에 맞춤
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // 비디오 프레임을 캔버스에 그림
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 캔버스에서 이미지 데이터 추출
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      
      // 부모 컴포넌트에 이미지 전달
      if (onCapture) {
        // Base64 데이터 URL을 Blob으로 변환
        fetch(imageDataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
            onCapture(file);
          });
      }
      
      // 카메라 중지
      stopCamera();
    }
  };

  // 컴포넌트 언마운트 시 카메라 중지
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="camera-capture">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{ display: isCameraOpen ? 'block' : 'none' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {capturedImage && (
          <div className="captured-image-container">
            <img src={capturedImage} alt="Captured" className="captured-image" />
          </div>
        )}
      </div>
      
      <div className="camera-controls">
        {!isCameraOpen && !capturedImage && (
          <button onClick={startCamera} className="camera-button">
            카메라 열기
          </button>
        )}
        
        {isCameraOpen && (
          <button onClick={captureImage} className="capture-button">
            사진 촬영
          </button>
        )}
        
        {capturedImage && (
          <div className="captured-controls">
            <button onClick={() => {
              setCapturedImage(null);
              startCamera();
            }} className="retake-button">
              다시 촬영
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
