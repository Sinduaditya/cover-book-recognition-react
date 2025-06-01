export const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment'
      }
    });
    return stream;
  } catch (error) {
    console.error('Camera Error:', error);
    
    try {
      const basicStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      return basicStream;
    } catch (basicError) {
      throw new Error('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  }
};

export const captureFrame = (video) => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Tidak dapat membuat canvas context');
  
  ctx.drawImage(video, 0, 0);
  
  // Enhance image for better OCR
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Simple contrast adjustment
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Increase contrast
    data[i] = r < 128 ? r * 0.8 : Math.min(255, r * 1.2);
    data[i + 1] = g < 128 ? g * 0.8 : Math.min(255, g * 1.2);
    data[i + 2] = b < 128 ? b * 0.8 : Math.min(255, b * 1.2);
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.9);
};

export const stopCamera = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
};

export const checkCameraPermission = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'camera' });
    return result.state;
  } catch (error) {
    console.warn('Cannot check camera permission:', error);
    return 'unknown';
  }
};