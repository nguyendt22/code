/**
 * Word Document Importer - Import questions from .doc/.docx files
 * 
 * Uses mammoth.js to extract text from Word documents
 * Fallback to binary parsing for basic text extraction
 */

import { Question, QuestionType, CognitiveLevel } from '../types';
import { autoFormatQuestion } from './autoMathFormatter';

/**
 * Simple DOCX text extractor (fallback without external library)
 * Extracts text from .docx XML structure
 */
async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to string
    const text = new TextDecoder('utf-8').decode(uint8Array);
    
    // Find document.xml content between <w:t> tags (Word 2007+ format)
    const matches = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    
    if (matches && matches.length > 0) {
      return matches
        .map(match => match.replace(/<[^>]+>/g, ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // Fallback: extract all readable text
    return text
      .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (err) {
    console.error('Error extracting DOCX text:', err);
    throw new Error('Không thể đọc file Word. Vui lòng thử file .txt hoặc copy-paste nội dung.');
  }
}

/**
 * Extract text from .doc (old Word format) - binary parsing
 */
async function extractTextFromDoc(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Simple text extraction from binary
    let text = '';
    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i];
      // Only ASCII and extended ASCII printable characters
      if ((byte >= 32 && byte <= 126) || (byte >= 160 && byte <= 255)) {
        text += String.fromCharCode(byte);
      } else if (byte === 10 || byte === 13) {
        text += '\n';
      }
    }
    
    // Clean up
    return text
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[^\x20-\x7E\u00A0-\uFFFF\n]/g, '')
      .trim();
  } catch (err) {
    console.error('Error extracting DOC text:', err);
    throw new Error('Không thể đọc file Word cũ (.doc). Vui lòng lưu lại thành .docx hoặc .txt');
  }
}

/**
 * Parse questions from extracted text
 * Supports multiple formats:
 * 1. Each line is a question
 * 2. Numbered format: "1. Question", "2. Question"
 * 3. Structured format with Q/A pairs
 */
function parseQuestionsFromText(text: string, grade: number, autoFormat: boolean): Question[] {
  const lines = text.split('\n').filter(line => line.trim().length > 3);
  const questions: Question[] = [];
  
  // Try to detect format
  const hasNumbering = lines.some(line => /^\d+[\.\)]\s/.test(line.trim()));
  
  if (hasNumbering) {
    // Numbered format
    let currentQuestion = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Check if this is a new question (starts with number)
      if (/^\d+[\.\)]\s/.test(trimmed)) {
        // Save previous question
        if (currentQuestion.trim()) {
          questions.push(createQuestionFromText(currentQuestion, grade, autoFormat));
        }
        // Start new question (remove number prefix)
        currentQuestion = trimmed.replace(/^\d+[\.\)]\s*/, '');
      } else if (currentQuestion) {
        // Continue current question
        currentQuestion += ' ' + trimmed;
      }
    });
    
    // Save last question
    if (currentQuestion.trim()) {
      questions.push(createQuestionFromText(currentQuestion, grade, autoFormat));
    }
  } else {
    // Simple format: each line is a question
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 5) {
        questions.push(createQuestionFromText(trimmed, grade, autoFormat));
      }
    });
  }
  
  return questions;
}

/**
 * Create Question object from text
 */
function createQuestionFromText(text: string, grade: number, autoFormat: boolean): Question {
  const rawQuestion: Question = {
    id: `word-import-${Date.now()}-${Math.random()}`,
    text: text.trim(),
    type: "short_answer",
    correctAnswer: "",
    explanation: "Import từ file Word",
    grade,
    semester: 1,
    chapterId: "word-import",
    chapterName: "Import Word",
    lessonId: "word-import",
    lessonName: "Import Word",
    topicName: "Import từ Word",
    cognitiveLevel: "Thông hiểu",
    difficulty: "Trung bình",
    tags: [`Word Import`, `Toán ${grade}`]
  };
  
  return autoFormat ? autoFormatQuestion(rawQuestion) : rawQuestion;
}

/**
 * Main function: Import questions from Word file
 */
export async function importQuestionsFromWord(
  file: File,
  options: {
    grade: number;
    autoFormat?: boolean;
  }
): Promise<{
  questions: Question[];
  errors: string[];
  warnings: string[];
}> {
  const { grade, autoFormat = true } = options;
  const questions: Question[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const fileName = file.name.toLowerCase();
    let extractedText = '';
    
    if (fileName.endsWith('.docx')) {
      extractedText = await extractTextFromDocx(file);
    } else if (fileName.endsWith('.doc')) {
      extractedText = await extractTextFromDoc(file);
    } else {
      // Plain text file
      extractedText = await file.text();
    }
    
    if (!extractedText || extractedText.length < 10) {
      errors.push('File rỗng hoặc không đọc được nội dung. Vui lòng thử:\n1. Lưu file thành .txt\n2. Copy-paste nội dung trực tiếp\n3. Dùng Excel import');
      return { questions, errors, warnings };
    }
    
    // Parse questions
    const parsedQuestions = parseQuestionsFromText(extractedText, grade, autoFormat);
    questions.push(...parsedQuestions);
    
    if (questions.length === 0) {
      warnings.push('Không tìm thấy câu hỏi nào trong file. Kiểm tra định dạng:\n- Mỗi dòng là một câu hỏi\n- Hoặc đánh số: 1. Câu hỏi, 2. Câu hỏi...');
    }
    
  } catch (err: any) {
    errors.push(err.message || 'Lỗi đọc file Word');
  }
  
  return { questions, errors, warnings };
}
