const ResultDisplay = ({ result, capturedImage, isLoading, error }) => {
  if (!capturedImage && !isLoading && !error) return null;

  return (
    <div className="border-4 border-black bg-orange-100 p-6 shadow-[8px_8px_0_0_#000] h-full">
      <h3 className="text-xl font-bold mb-4">
        🎯 SCAN RESULTS
      </h3>

      {capturedImage && (
        <div className="mb-4 border-4 border-black bg-white">
          <img
            src={capturedImage}
            alt="Captured book cover"
            className="w-full h-48 object-contain"
          />
        </div>
      )}

      {error && (
        <div className="mb-4 border-2 border-black bg-red-100 p-3">
          <h4 className="font-bold mb-1">❌ ERROR:</h4>
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8 border-2 border-black bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-3"></div>
            <p className="font-bold">PROCESSING...</p>
          </div>
        </div>
      )}

      {result && !isLoading && !error && (
        <div className="space-y-4">
          <div className="border-2 border-black bg-white p-4">
            <h4 className="font-bold mb-2">📜 EXTRACTED TEXT:</h4>
            <div className="bg-gray-100 p-2 min-h-[80px]">
              <p className="whitespace-pre-wrap">
                {result.extractedText || 'No text detected.'}
              </p>
            </div>
          </div>

          <div className={`border-2 border-black p-4 ${
            result.category.includes('Error') 
              ? 'bg-red-100' 
              : 'bg-green-100'
          }`}>
            <h4 className="font-bold mb-2">🏷️ CATEGORY:</h4>
            <p className="font-mono font-bold">
              {result.category}
            </p>
          </div>

          {result.confidence && (
            <div className="border-2 border-black bg-blue-100 p-4">
              <h4 className="font-bold mb-2">📊 CONFIDENCE:</h4>
              <p className="font-mono">
                {Math.round(result.confidence)}% ACCURACY
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;