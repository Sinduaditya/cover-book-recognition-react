import { createWorker } from 'tesseract.js';

let worker = null;
let isInitializing = false;
let categoriesData = [];

const loadCategoriesData = async () => {
  try {
    const response = await fetch('/data/book_categories.json');
    if (!response.ok) throw new Error('Failed to load categories');
    categoriesData = await response.json();
    console.log('Categories data loaded');
  } catch (error) {
    console.error('Error loading categories:', error);
    console.log('OAKOWKOA eror');
  }
};

loadCategoriesData();

export const initializeOCR = async () => {
  if (worker || isInitializing) return;
  
  try {
    isInitializing = true;
    console.log('Initializing OCR worker...');
    
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        console.log('Cleanup error:', e);
      }
      worker = null;
    }
    
    worker = await createWorker({
      logger: m => console.log(m.status),
      workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/worker.min.js',
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4/tesseract-core.wasm.js',
    });
    
    await worker.loadLanguage('eng+ind');
    await worker.initialize('eng+ind');
    
    await worker.setParameters({
      tessedit_pageseg_mode: '6',
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?;:() -',
      preserve_interword_spaces: '1',
    });
    
    console.log('OCR worker ready');
    return worker;
    
  } catch (error) {
    console.error('OCR init error:', error);
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        console.log('Termination error:', e);
      }
      worker = null;
    }
    throw error;
  } finally {
    isInitializing = false;
  }
};

export const performOCR = async (imageData) => {
  try {
    if (!worker) {
      await initializeOCR();
    }
    
    console.log('Processing image with OCR...');
    const { data } = await worker.recognize(imageData);
    
    if (!data?.text || data.text.trim().length < 3) {
      throw new Error('No text detected');
    }
    
    return {
      text: data.text.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' '),
      confidence: data.confidence
    };
      
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Tidak dapat membaca teks dari gambar. Pastikan cover buku terlihat jelas dan mengandung teks.');
  }
};

export const categorizeBook = async (text) => {
  try {
    const lowerText = text.toLowerCase();
    let bestCategory = '99-Lainnya';
    let bestScore = 0;
    
    for (const category of categoriesData) {
      let score = 0;
      for (const keyword of category.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category.category_name;
      }
    }
    
    return bestCategory;
    
  } catch (error) {
    console.error('Categorization error:', error);
    return '99-Kategori Tidak Diketahui';
  }
};

export const cleanupOCR = async () => {
  if (worker) {
    try {
      await worker.terminate();
      worker = null;
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
};