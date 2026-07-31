/**
 * Extended types for comprehensive exam import system
 * Supports structured content (text/math/image), OMML equations, question detection
 */

import { Question, QuestionType, CognitiveLevel } from "./index";

// ==================== CONTENT BLOCKS ====================

export type ContentBlockType = "text" | "math" | "image" | "table" | "paragraph_break";

export interface TextBlock {
  type: "text";
  value: string;
}

export interface MathBlock {
  type: "math";
  latex?: string; // LaTeX representation
  omml?: string; // Original OMML XML
  mathml?: string; // MathML representation
  fallbackText?: string; // Plain text fallback
  renderStatus: "success" | "partial" | "failed";
}

export interface ImageBlock {
  type: "image";
  src: string; // Base64 or URL
  alt?: string;
  width?: number;
  height?: number;
  isMathEquation?: boolean; // True if this is a rendered equation image
}

export interface TableBlock {
  type: "table";
  rows: string[][];
}

export interface ParagraphBreakBlock {
  type: "paragraph_break";
}

export type ContentBlock = TextBlock | MathBlock | ImageBlock | TableBlock | ParagraphBreakBlock;

// ==================== ENHANCED QUESTION ====================

export interface EnhancedQuestion extends Omit<Question, "text" | "options"> {
  // Structured content instead of plain text
  content: ContentBlock[];
  
  // Enhanced options for MCQ
  choices?: QuestionChoice[];
  
  // Sub-questions for True/False format
  subQuestions?: SubQuestion[];
  
  // Parsing metadata
  parseMetadata: ParseMetadata;
  
  // Section info
  section?: string;
  sectionOrder?: number;
  
  // Original question number from document
  originalNumber?: string;
  orderIndex: number;
}

export interface QuestionChoice {
  label: string; // "A", "B", "C", "D"
  content: ContentBlock[];
  isCorrect: boolean;
}

export interface SubQuestion {
  label: string; // "a", "b", "c", "d"
  content: ContentBlock[];
  correctAnswer?: boolean; // For true/false
}

export interface ParseMetadata {
  parseStatus: "success" | "warning" | "error";
  warnings: string[];
  errors: string[];
  confidence: number; // 0-1
  hasEquations: boolean;
  hasImages: boolean;
  equationCount: number;
  imageCount: number;
}

// ==================== EXAM STRUCTURE ====================

export interface ExamSection {
  id: string;
  title: string;
  order: number;
  questions: EnhancedQuestion[];
}

export interface ParsedExamDocument {
  title?: string;
  metadata: DocumentMetadata;
  sections: ExamSection[];
  allQuestions: EnhancedQuestion[];
  parseReport: ParseReport;
}

export interface DocumentMetadata {
  fileName: string;
  fileSize: number;
  pageCount?: number;
  wordCount?: number;
  hasEquations: boolean;
  hasImages: boolean;
  hasTables: boolean;
  parsedAt: string;
}

export interface ParseReport {
  totalQuestions: number;
  successfullyParsed: number;
  withWarnings: number;
  withErrors: number;
  validationIssues: ValidationIssue[];
  summary: string;
}

export interface ValidationIssue {
  type: "error" | "warning";
  questionIndex?: number;
  message: string;
  suggestion?: string;
}

// ==================== OMML / MATHTYPE ====================

export interface OMMLNode {
  tagName: string;
  attributes: Record<string, string>;
  children: OMMLNode[];
  text?: string;
}

export interface MathTypeObject {
  type: "ole" | "image" | "mathml";
  data: string;
  fallbackImage?: string;
}

// ==================== PARSER CONFIG ====================

export interface ParserConfig {
  autoFormatMath: boolean;
  extractImages: boolean;
  detectQuestionTypes: boolean;
  detectSections: boolean;
  validateStructure: boolean;
  defaultGrade: number;
  defaultCognitive: CognitiveLevel;
  defaultDifficulty: "Dễ" | "Trung bình" | "Khó";
}

// ==================== PARSE RESULT ====================

export interface DocxParseResult {
  success: boolean;
  document?: ParsedExamDocument;
  errors: string[];
  warnings: string[];
}
