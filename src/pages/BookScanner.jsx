import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Camera from '../components/Camera';
import ResultDisplay from '../components/ResultDisplay';
import { performOCR, categorizeBook, initializeOCR, cleanupOCR } from '../utils/ocrUtils';

const BookScanner = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [ocrInitialized, setOcrInitialized] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const initOCR = async () => {
      try {
        await initializeOCR();
        setOcrInitialized(true);
      } catch (error) {
        console.error('Failed to initialize OCR:', error);
        setError('OCR initialization failed. Please refresh the page.');
      }
    };

    initOCR();

    return () => {
      cleanupOCR().catch(console.error);
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      await processImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = async (imageData) => {
    await processImage(imageData);
  };

  const processImage = async (imageData) => {
    setCapturedImage(imageData);
    setIsProcessing(true);
    setScanResult(null);
    setError(null);

    try {
      if (!ocrInitialized) {
        throw new Error('OCR not ready. Please wait and try again.');
      }

      const { text, confidence } = await performOCR(imageData);
      
      if (!text.trim()) {
        throw new Error('No text detected. Please ensure the image contains clear text.');
      }
      
      const category = await categorizeBook(text);

      setScanResult({
        extractedText: text,
        category,
        confidence
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      setError(error.message);
      
      setScanResult({
        extractedText: 'Error processing image',
        category: 'Error: Processing failed',
        confidence: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraToggle = () => {
    setIsCameraActive(!isCameraActive);
    if (isCameraActive) {
      setCapturedImage(null);
      setScanResult(null);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-4 border-black bg-yellow-100 p-6 shadow-[8px_8px_0_0_#000]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                📖 BOOK SCANNER 3000
              </h1>
              <p className="text-lg">
                Scan book covers to find their perfect shelf
              </p>
            </div>
            <Link
              to="/"
              className="border-2 border-black bg-white px-6 py-2 font-bold shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] transition-all"
            >
              ← Home
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Upload Button */}
            <div className="border-4 border-black bg-blue-100 p-6 shadow-[8px_8px_0_0_#000]">
              <h2 className="text-xl font-bold mb-4">UPLOAD IMAGE</h2>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="w-full border-2 border-black bg-white px-6 py-3 font-bold shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] transition-all"
              >
                📁 CHOOSE FILE
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <p className="mt-2 text-sm">Supports JPG, PNG</p>
            </div>

            {/* Camera Toggle */}
            <div className="border-4 border-black bg-green-100 p-6 shadow-[8px_8px_0_0_#000]">
              <h2 className="text-xl font-bold mb-4">CAMERA</h2>
              <button
                onClick={handleCameraToggle}
                className={`w-full border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] transition-all ${
                  isCameraActive
                    ? 'bg-red-500 text-white'
                    : 'bg-white'
                }`}
              >
                {isCameraActive ? '🛑 STOP CAMERA' : '📷 START CAMERA'}
              </button>
            </div>

            {/* Instructions */}
            <div className="border-4 border-black bg-pink-100 p-6 shadow-[8px_8px_0_0_#000]">
              <h2 className="text-xl font-bold mb-4">HOW TO USE</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-xl">1️⃣</span>
                  <span>Activate camera or upload image</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">2️⃣</span>
                  <span>Position book cover clearly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">3️⃣</span>
                  <span>Get instant categorization</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle Column - Camera */}
          <div className="lg:col-span-1">
            <Camera
              onCapture={handleCapture}
              isActive={isCameraActive}
              onToggle={handleCameraToggle}
            />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <ResultDisplay
              result={scanResult}
              capturedImage={capturedImage}
              isLoading={isProcessing}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookScanner;