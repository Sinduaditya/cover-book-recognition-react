import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="border-4 border-black bg-yellow-100 p-8 max-w-md w-full shadow-[12px_12px_0_0_#000]">
        <div className="mb-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl font-bold mb-4">
            BOOK SCANNER 3000
          </h1>
          <p className="text-lg">
            Scan book covers with AI-powered OCR
          </p>
        </div>

        <div className="mb-8 border-4 border-black bg-white p-4">
          <div className="text-5xl mb-4 text-center">🔍</div>
          <p className="text-center">
            Find the perfect shelf for your books instantly
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/scanner"
            className="block w-full border-4 border-black bg-green-300 hover:bg-green-400 text-black font-bold py-4 px-6 text-center shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] transition-all"
          >
            🚀 START SCANNING
          </Link>
          
          <div className="border-2 border-black bg-white p-3">
            <p className="font-bold">✅ TIPS:</p>
            <ul className="text-sm space-y-1 mt-1">
              <li>• Allow camera access</li>
              <li>• Good lighting</li>
              <li>• Clear book cover</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t-2 border-black">
          <p className="text-xs">
            Made with ❤️ using React & Tesseract.js
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;