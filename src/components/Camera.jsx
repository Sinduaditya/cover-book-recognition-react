import { useRef, useEffect, useState } from 'react';
import { startCamera, captureFrame, stopCamera, checkCameraPermission } from '../utils/cameraUtils';

const Camera = ({ onCapture, isActive, onToggle }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    if (isActive && !stream) {
      initCamera();
    } else if (!isActive && stream) {
      stopCameraStream();
    }

    return () => {
      if (stream) stopCameraStream();
    };
  }, [isActive]);

  const checkPermission = async () => {
    const status = await checkCameraPermission();
    setPermissionStatus(status);
  };

  const initCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mediaStream = await startCamera();
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      
      setPermissionStatus('granted');
    } catch (error) {
      console.error('Failed to start camera:', error);
      setError(error.message);
      setPermissionStatus('denied');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stopCamera(stream);
      setStream(null);
    }
    setError(null);
  };

  const handleCapture = () => {
    if (videoRef.current && stream) {
      try {
        const imageData = captureFrame(videoRef.current);
        onCapture(imageData);
      } catch (error) {
        console.error('Failed to capture frame:', error);
        setError('Gagal mengambil gambar. Silakan coba lagi.');
      }
    }
  };

  return (
     <div className="border-4 border-black bg-purple-100 p-6 shadow-[8px_8px_0_0_#000]">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          📷 LIVE CAMERA
          {permissionStatus === 'denied' && (
            <span className="text-sm">(ACCESS DENIED)</span>
          )}
        </h3>
      </div>

      {error && (
        <div className="mb-4 border-2 border-black bg-red-100 p-3">
          <p className="font-bold">{error}</p>
        </div>
      )}

      {isActive && (
        <div className="space-y-4">
          <div className="relative border-4 border-black bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>INITIALIZING CAMERA...</p>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleCapture}
            disabled={!stream || isLoading}
            className="w-full border-2 border-black bg-white px-6 py-3 font-bold shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] disabled:shadow-none disabled:opacity-70 transition-all"
          >
            🚀 CAPTURE IMAGE
          </button>
        </div>
      )}

      {!isActive && permissionStatus === 'denied' && (
        <div className="text-center py-4 border-2 border-black bg-white p-4">
          <p className="font-bold mb-2">CAMERA ACCESS REQUIRED</p>
          <p className="text-sm">
            Please refresh and allow camera permissions
          </p>
        </div>
      )}
    </div>
  );
};

export default Camera;