/**
 * DocumentParser - Main orchestrator for exam document parsing
 * 
 * Architecture:
 * File → Validator → DocxParser → TextExtractor → EquationExtractor → 
 * QuestionDetector → QuestionNormalizer → Validator → Result
 */

import { DocxParseResult, ParserConfig, ParsedExamDocument } from "../types/exam";

export class DocumentParser {
  private config: ParserConfig;

  constructor(config: Partial<ParserConfig> = {}) {
    this.config = {
      autoFormatMath: true,
      extractImages: true,
      detectQuestionTypes: true,
      detectSections: true,
      validateStructure: true,
      defaultGrade: 7,
      defaultCognitive: "Thông hiểu",
      defaultDifficulty: "Trung bình",
      ...config
    };
  }

  /**
   * Main entry point: Parse document file
   */
  async parseDocument(file: File): Promise<DocxParseResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Step 1: Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
          warnings: []
        };
      }

      // Step 2: Route to appropriate parser based on file type
      let document: ParsedExamDocument;
      
      if (file.name.toLowerCase().endsWith('.docx')) {
        const { DocxParser } = await import('./DocxParser');
        const parser = new DocxParser(this.config);
        document = await parser.parse(file);
      } else if (file.name.toLowerCase().endsWith('.pdf')) {
        // TODO: PDF parser
        throw new Error('PDF parsing chưa được hỗ trợ. Vui lòng chuyển sang DOCX.');
      } else {
        throw new Error('Định dạng file không được hỗ trợ. Chỉ hỗ trợ .docx');
      }

      // Step 3: Validate parsed document
      if (this.config.validateStructure) {
        const validationResult = this.validateParsedDocument(document);
        warnings.push(...validationResult.warnings);
        if (validationResult.errors.length > 0) {
          errors.push(...validationResult.errors);
        }
      }

      return {
        success: true,
        document,
        errors,
        warnings
      };

    } catch (err: any) {
      console.error('DocumentParser error:', err);
      errors.push(err.message || 'Lỗi không xác định khi parse document');
      return {
        success: false,
        errors,
        warnings
      };
    }
  }

  /**
   * Validate file before parsing
   */
  private validateFile(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check file exists
    if (!file) {
      errors.push('File không tồn tại');
      return { valid: false, errors };
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File quá lớn (${(file.size / 1024 / 1024).toFixed(2)}MB). Tối đa 50MB.`);
    }

    if (file.size === 0) {
      errors.push('File rỗng');
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const supportedExtensions = ['.docx', '.doc', '.pdf'];
    const hasValidExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      errors.push(`Định dạng file không hỗ trợ. Chỉ hỗ trợ: ${supportedExtensions.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate parsed document structure
   */
  private validateParsedDocument(document: ParsedExamDocument): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if any questions were parsed
    if (document.allQuestions.length === 0) {
      errors.push('Không tìm thấy câu hỏi nào trong file');
      return { errors, warnings };
    }

    // Check for duplicate question numbers
    const questionNumbers = document.allQuestions
      .map(q => q.originalNumber)
      .filter(n => n);
    
    const duplicates = questionNumbers.filter((num, idx) => 
      questionNumbers.indexOf(num) !== idx
    );
    
    if (duplicates.length > 0) {
      warnings.push(`Phát hiện trùng số câu: ${duplicates.join(', ')}`);
    }

    // Check for missing question numbers (gaps in sequence)
    const numbers = questionNumbers
      .map(n => parseInt(n?.match(/\d+/)?.[0] || '0'))
      .filter(n => n > 0)
      .sort((a, b) => a - b);
    
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] - numbers[i-1] > 1) {
        warnings.push(`Phát hiện thiếu câu số ${numbers[i-1] + 1} đến ${numbers[i] - 1}`);
      }
    }

    // Check for questions without content
    const emptyQuestions = document.allQuestions.filter(q => 
      q.content.length === 0 || 
      (q.content.length === 1 && q.content[0].type === 'text' && !q.content[0].value.trim())
    );
    
    if (emptyQuestions.length > 0) {
      warnings.push(`${emptyQuestions.length} câu không có nội dung`);
    }

    // Check for questions with parse errors
    const errorQuestions = document.allQuestions.filter(q => 
      q.parseMetadata.parseStatus === 'error'
    );
    
    if (errorQuestions.length > 0) {
      errors.push(`${errorQuestions.length} câu có lỗi parse nghiêm trọng`);
    }

    // Check for questions with warnings
    const warningQuestions = document.allQuestions.filter(q => 
      q.parseMetadata.parseStatus === 'warning'
    );
    
    if (warningQuestions.length > 0) {
      warnings.push(`${warningQuestions.length} câu có cảnh báo (có thể cần kiểm tra)`);
    }

    // Check for MCQ questions missing choices
    const mcqWithoutChoices = document.allQuestions.filter(q =>
      q.type === 'mcq4' && (!q.choices || q.choices.length < 2)
    );
    
    if (mcqWithoutChoices.length > 0) {
      warnings.push(`${mcqWithoutChoices.length} câu trắc nghiệm không có đáp án A/B/C/D`);
    }

    return { errors, warnings };
  }

  /**
   * Get parser configuration
   */
  getConfig(): ParserConfig {
    return { ...this.config };
  }

  /**
   * Update parser configuration
   */
  updateConfig(newConfig: Partial<ParserConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
