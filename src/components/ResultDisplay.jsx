import React from 'react';

const ResultDisplay = ({ result, capturedImage, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="border-4 border-black bg-purple-100 p-6 shadow-[8px_8px_0_0_#000]">
        <h2 className="text-xl font-bold mb-4">🔄 PROCESSING...</h2>
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p>Scanning your book...</p>
          <div className="mt-4 space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-gray-600">Reading text and categorizing</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-4 border-black bg-red-100 p-6 shadow-[8px_8px_0_0_#000]">
        <h2 className="text-xl font-bold mb-4 text-red-600">❌ ERROR</h2>
        <div className="space-y-4">
          <p className="text-red-700 font-medium">{error}</p>
          <div className="text-sm text-gray-600">
            <p className="font-bold mb-2">Troubleshooting tips:</p>
            <ul className="space-y-1">
              <li>• Ensure good lighting</li>
              <li>• Hold camera steady</li>
              <li>• Make sure text is clear</li>
              <li>• Try uploading a different image</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="border-4 border-black bg-gray-100 p-6 shadow-[8px_8px_0_0_#000]">
        <h2 className="text-xl font-bold mb-4">📋 SCAN RESULTS</h2>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📷</div>
          <p>Take a photo or upload an image to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0_0_#000]">
          <h3 className="text-lg font-bold mb-3">📸 CAPTURED IMAGE</h3>
          <img
            src={capturedImage}
            alt="Captured book"
            className="w-full max-h-48 object-contain border-2 border-gray-300 rounded"
          />
        </div>
      )}

      {/* Main Results */}
      <div className="border-4 border-black bg-green-100 p-6 shadow-[8px_8px_0_0_#000]">
        <h2 className="text-xl font-bold mb-4">📋 SCAN RESULTS</h2>
        
        {/* Category and Rack Info */}
        <div className="space-y-4">
          <div className="bg-white p-4 border-2 border-black rounded">
            <h3 className="font-bold text-lg mb-2">📚 CATEGORY</h3>
            <p className="text-lg">{result.category}</p>
          </div>

          {result.rackId && result.rackId !== 'N/A' && (
            <div className="bg-orange-50 p-4 border-2 border-orange-400 rounded">
              <h3 className="font-bold text-lg mb-2 text-orange-700">🏷️ RACK LOCATION</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">{result.rackId}</span>
                <div className="text-right text-sm text-orange-600">
                  <p>Confidence: {result.confidence}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Text */}
          <div className="bg-white p-4 border-2 border-black rounded">
            <h3 className="font-bold text-lg mb-2">📝 EXTRACTED TEXT</h3>
            <p className="text-sm bg-gray-50 p-3 rounded border">
              {result.extractedText}
            </p>
            {result.ocrConfidence && (
              <p className="text-xs text-gray-500 mt-2">
                OCR Confidence: {Math.round(result.ocrConfidence)}%
              </p>
            )}
          </div>

          {/* Matched Keywords */}
          {result.matchedKeywords && result.matchedKeywords.length > 0 && (
            <div className="bg-blue-50 p-4 border-2 border-blue-400 rounded">
              <h3 className="font-bold text-lg mb-2 text-blue-700">🔍 MATCHED KEYWORDS</h3>
              <div className="space-y-2">
                {result.matchedKeywords.slice(0, 3).map((match, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      {match.keyword}
                    </span>
                    <span className="text-blue-600 font-medium">
                      Score: {match.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence Indicator */}
          <div className="bg-white p-4 border-2 border-black rounded">
            <h3 className="font-bold text-lg mb-2">📊 ACCURACY</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Categorization Confidence</span>
                <span className="font-bold">{result.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    result.confidence >= 70 ? 'bg-green-500' : 
                    result.confidence >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(result.confidence, 5)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">
                {result.confidence >= 70 ? 'High confidence match' :
                 result.confidence >= 40 ? 'Moderate confidence match' :
                 'Low confidence - please verify manually'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-4 border-black bg-yellow-100 p-6 shadow-[8px_8px_0_0_#000]">
        <h3 className="text-lg font-bold mb-4">🎯 NEXT STEPS</h3>
        <div className="space-y-3">
          {result.rackId && result.rackId !== 'N/A' && (
            <div className="text-center p-3 bg-green-50 border-2 border-green-400 rounded">
              <p className="font-bold text-green-700 mb-1">
                📍 Place book in rack: {result.rackId}
              </p>
              <p className="text-sm text-green-600">
                Category: {result.category}
              </p>
            </div>
          )}
          
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Double-check the category matches the book content</p>
            <p>• Verify the rack location before placing</p>
            <p>• Take another photo if confidence is low</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;