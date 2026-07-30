/**
 * Excel/CSV Importer - Import questions from Excel/CSV files
 * 
 * Supports formats:
 * - .xlsx (Excel)
 * - .csv (Comma-separated values)
 * 
 * Expected columns:
 * - Question Text (required)
 * - Option A, Option B, Option C, Option D (for MCQ)
 * - Correct Answer (required)
 * - Explanation (optional)
 * - Cognitive Level (optional)
 * - Difficulty (optional)
 */

import * as XLSX from 'xlsx';
import { Question, QuestionType, CognitiveLevel } from '../types';
import { autoFormatQuestion } from './autoMathFormatter';

export interface ImportedQuestionRow {
  questionText?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: string;
  explanation?: string;
  cognitiveLevel?: string;
  difficulty?: string;
  [key: string]: any;
}

/**
 * Parse Excel/CSV file and convert to Questions
 */
export async function importQuestionsFromExcel(
  file: File,
  options: {
    grade: number;
    autoFormat?: boolean;
    defaultCognitive?: CognitiveLevel;
    defaultDifficulty?: "Dễ" | "Trung bình" | "Khó";
  }
): Promise<{
  questions: Question[];
  errors: string[];
  warnings: string[];
}> {
  const {
    grade,
    autoFormat = true,
    defaultCognitive = "Thông hiểu",
    defaultDifficulty = "Trung bình"
  } = options;

  const questions: Question[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Read file
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const rows: ImportedQuestionRow[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: false
    });

    if (rows.length === 0) {
      errors.push("File không có dữ liệu hoặc định dạng không đúng");
      return { questions, errors, warnings };
    }

    // Process each row
    rows.forEach((row, index) => {
      const rowNum = index + 2; // Excel row (header is row 1)
      
      try {
        const questionText = extractField(row, ['questionText', 'question', 'câu hỏi', 'Question Text', 'Câu Hỏi']);
        
        if (!questionText || questionText.trim().length < 5) {
          warnings.push(`Dòng ${rowNum}: Bỏ qua - Câu hỏi quá ngắn hoặc rỗng`);
          return;
        }

        // Detect question type
        const optionA = extractField(row, ['optionA', 'option_a', 'A', 'Option A', 'Đáp án A']);
        const optionB = extractField(row, ['optionB', 'option_b', 'B', 'Option B', 'Đáp án B']);
        const optionC = extractField(row, ['optionC', 'option_c', 'C', 'Option C', 'Đáp án C']);
        const optionD = extractField(row, ['optionD', 'option_d', 'D', 'Option D', 'Đáp án D']);
        
        const hasOptions = optionA || optionB || optionC || optionD;
        const questionType: QuestionType = hasOptions ? "mcq4" : "short_answer";

        // Get correct answer
        const correctAnswerRaw = extractField(row, ['correctAnswer', 'correct', 'answer', 'đáp án đúng', 'Correct Answer', 'Đáp Án']);
        let correctAnswer: any;
        
        if (questionType === "mcq4") {
          // Parse correct answer (A, B, C, D or 0, 1, 2, 3)
          const normalized = correctAnswerRaw?.toString().toUpperCase().trim();
          if (normalized === 'A' || normalized === '0') correctAnswer = 0;
          else if (normalized === 'B' || normalized === '1') correctAnswer = 1;
          else if (normalized === 'C' || normalized === '2') correctAnswer = 2;
          else if (normalized === 'D' || normalized === '3') correctAnswer = 3;
          else {
            warnings.push(`Dòng ${rowNum}: Đáp án không hợp lệ "${correctAnswerRaw}", mặc định là A`);
            correctAnswer = 0;
          }
        } else {
          correctAnswer = correctAnswerRaw || "";
        }

        // Get other fields
        const explanation = extractField(row, ['explanation', 'giải thích', 'lời giải', 'Explanation', 'Lời Giải']);
        const cognitiveRaw = extractField(row, ['cognitiveLevel', 'cognitive', 'mức độ', 'Cognitive Level']);
        const difficultyRaw = extractField(row, ['difficulty', 'độ khó', 'Difficulty']);

        const cognitiveLevel = parseCognitiveLevel(cognitiveRaw) || defaultCognitive;
        const difficulty = parseDifficulty(difficultyRaw) || defaultDifficulty;

        // Create question object
        const question: Question = {
          id: `imported-${Date.now()}-${index}`,
          text: questionText,
          type: questionType,
          options: questionType === "mcq4" 
            ? [optionA, optionB, optionC, optionD].filter(o => o && o.trim())
            : undefined,
          correctAnswer,
          explanation: explanation || "Import từ file Excel",
          grade,
          semester: 1,
          chapterId: "imported",
          chapterName: "Import",
          lessonId: "imported",
          lessonName: "Import",
          topicName: `Import từ ${file.name}`,
          cognitiveLevel,
          difficulty,
          tags: [`Import ${file.name}`, `Toán ${grade}`]
        };

        // Auto-format math if enabled
        const finalQuestion = autoFormat ? autoFormatQuestion(question) : question;
        questions.push(finalQuestion);

      } catch (err: any) {
        errors.push(`Dòng ${rowNum}: Lỗi xử lý - ${err.message}`);
      }
    });

    if (questions.length === 0 && errors.length === 0) {
      errors.push("Không thể import câu hỏi nào từ file này");
    }

  } catch (err: any) {
    errors.push(`Lỗi đọc file: ${err.message}`);
  }

  return { questions, errors, warnings };
}

/**
 * Helper: Extract field from row by trying multiple possible column names
 */
function extractField(row: ImportedQuestionRow, possibleNames: string[]): string {
  for (const name of possibleNames) {
    // Try exact match
    if (row[name]) return String(row[name]).trim();
    
    // Try case-insensitive match
    const lowerName = name.toLowerCase();
    const matchingKey = Object.keys(row).find(k => k.toLowerCase() === lowerName);
    if (matchingKey && row[matchingKey]) {
      return String(row[matchingKey]).trim();
    }
  }
  return "";
}

/**
 * Parse cognitive level from various formats
 */
function parseCognitiveLevel(raw: string | undefined): CognitiveLevel | null {
  if (!raw) return null;
  
  const normalized = raw.toLowerCase().trim();
  
  if (normalized.includes('nhận biết') || normalized.includes('nhan biet')) return "Nhận biết";
  if (normalized.includes('thông hiểu') || normalized.includes('thong hieu')) return "Thông hiểu";
  if (normalized.includes('vận dụng cao') || normalized.includes('van dung cao')) return "Vận dụng cao";
  if (normalized.includes('vận dụng') || normalized.includes('van dung')) return "Vận dụng";
  
  return null;
}

/**
 * Parse difficulty from various formats
 */
function parseDifficulty(raw: string | undefined): "Dễ" | "Trung bình" | "Khó" | null {
  if (!raw) return null;
  
  const normalized = raw.toLowerCase().trim();
  
  if (normalized.includes('dễ') || normalized.includes('de') || normalized === 'easy') return "Dễ";
  if (normalized.includes('khó') || normalized.includes('kho') || normalized === 'hard') return "Khó";
  if (normalized.includes('trung bình') || normalized.includes('medium')) return "Trung bình";
  
  return null;
}

/**
 * Generate Excel template for teachers
 */
export function generateExcelTemplate(): Blob {
  const templateData = [
    {
      "Câu Hỏi": "Kết quả của phép tính $\\frac{-3}{4} + \\frac{1}{2}$ là:",
      "Đáp Án A": "$\\frac{-1}{4}$",
      "Đáp Án B": "$\\frac{-2}{6}$",
      "Đáp Án C": "$\\frac{1}{4}$",
      "Đáp Án D": "$\\frac{-5}{4}$",
      "Đáp Án Đúng": "A",
      "Lời Giải": "Quy đồng mẫu số: $\\frac{-3}{4} + \\frac{2}{4} = \\frac{-1}{4}$",
      "Mức Độ": "Thông hiểu",
      "Độ Khó": "Trung bình"
    },
    {
      "Câu Hỏi": "Cho tỉ lệ thức $\\frac{x}{5} = \\frac{12}{15}$. Tìm $x$.",
      "Đáp Án A": "$x = 4$",
      "Đáp Án B": "$x = 3$",
      "Đáp Án C": "$x = 60$",
      "Đáp Án D": "$x = 12$",
      "Đáp Án Đúng": "A",
      "Lời Giải": "Theo tính chất tỉ lệ thức: $x = \\frac{5 \\times 12}{15} = 4$",
      "Mức Độ": "Nhận biết",
      "Độ Khó": "Dễ"
    },
    {
      "Câu Hỏi": "Tính $\\sqrt{81}$",
      "Đáp Án A": "",
      "Đáp Án B": "",
      "Đáp Án C": "",
      "Đáp Án D": "",
      "Đáp Án Đúng": "9",
      "Lời Giải": "Vì $9^2 = 81$ nên $\\sqrt{81} = 9$",
      "Mức Độ": "Nhận biết",
      "Độ Khó": "Dễ"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Câu Hỏi");
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 50 }, // Câu Hỏi
    { wch: 20 }, // Đáp Án A
    { wch: 20 }, // Đáp Án B
    { wch: 20 }, // Đáp Án C
    { wch: 20 }, // Đáp Án D
    { wch: 10 }, // Đáp Án Đúng
    { wch: 40 }, // Lời Giải
    { wch: 15 }, // Mức Độ
    { wch: 12 }  // Độ Khó
  ];

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * Download template file
 */
export function downloadExcelTemplate(filename: string = 'mau-de-thi-toan.xlsx') {
  const blob = generateExcelTemplate();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
