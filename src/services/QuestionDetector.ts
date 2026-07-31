/**
 * QuestionDetector - Detect question structure from content blocks
 * Identifies question numbers, types, choices, sections
 */

import { 
  ContentBlock, 
  ParserConfig,
  QuestionType 
} from '../types/exam';

// Define DetectedQuestion locally since it's used internally
interface DetectedQuestion {
  questionNumber: string;
  rawText: string;
  startIndex: number;
  endIndex: number;
  questionText: string;
  content: ContentBlock[];
  choices?: Array<{
    label: string;
    content: ContentBlock[];
    isCorrect: boolean;
  }>;
  subQuestions?: Array<{
    label: string;
    content: ContentBlock[];
  }>;
  type: QuestionType;
  confidence: number;
  section?: string;
  sectionOrder?: number;
  correctAnswer?: any;
  explanation?: string;
}

interface DetectedChoice {
  label: string;
  text: string;
  isCorrect?: boolean;
}

export class QuestionDetector {
  private config: ParserConfig;

  // Question number patterns
  private readonly QUESTION_PATTERNS = [
    { regex: /^Câu\s+(\d+)[.:)]\s*/i, type: 'vietnamese' },
    { regex: /^Question\s+(\d+)[.:)]\s*/i, type: 'english' },
    { regex: /^(\d+)[.:)]\s+/,type: 'number' },
    { regex: /^([IVX]+)[.:)]\s+/, type: 'roman' },
  ];

  // Section patterns
  private readonly SECTION_PATTERNS = [
    /^PHẦN\s+([IVX\d]+)[.:]/i,
    /^PART\s+([IVX\d]+)[.:]/i,
    /^Phần\s+(\d+)[.:]/i
  ];

  // Choice patterns (A, B, C, D or a, b, c, d)
  private readonly CHOICE_PATTERNS = [
    { regex: /^([A-D])[.:)]\s+(.+)/, type: 'upper' },
    { regex: /^([a-d])[.:)]\s+(.+)/, type: 'lower' }
  ];

  constructor(config: ParserConfig) {
    this.config = config;
  }

  /**
   * Main detection method
   */
  detectQuestions(blocks: ContentBlock[]): DetectedQuestion[] {
    const questions: DetectedQuestion[] = [];
    let currentSection: string | undefined;
    let currentQuestion: Partial<DetectedQuestion> | null = null;
    let questionContent: ContentBlock[] = [];
    let currentChoices: DetectedChoice[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      // Skip paragraph breaks
      if (block.type === 'paragraph_break') {
        continue;
      }

      // Detect section headers
      if (block.type === 'text') {
        const sectionMatch = this.matchSection(block.value);
        if (sectionMatch) {
          currentSection = sectionMatch;
          continue;
        }

        // Detect question start
        const questionMatch = this.matchQuestionStart(block.value);
        if (questionMatch) {
          // Save previous question if exists
          if (currentQuestion) {
            questions.push(this.finalizeQuestion(
              currentQuestion,
              questionContent,
              currentChoices,
              currentSection
            ));
          }

          // Start new question
          currentQuestion = {
            questionNumber: questionMatch.number,
            rawText: questionMatch.text,
            startIndex: i,
            confidence: questionMatch.confidence
          };
          questionContent = [];
          currentChoices = [];

          // Add remaining text after question number
          if (questionMatch.text.trim()) {
            questionContent.push({
              type: 'text',
              value: questionMatch.text
            });
          }
          continue;
        }

        // Detect choices (A, B, C, D)
        if (currentQuestion) {
          const choiceMatch = this.matchChoice(block.value);
          if (choiceMatch) {
            currentChoices.push(choiceMatch);
            
            // ALSO check if there are multiple choices in same line
            // e.g., "A. choice A B. choice B"
            const remaining = block.value.substring(block.value.indexOf(choiceMatch.text) + choiceMatch.text.length);
            if (remaining.trim()) {
              const secondChoice = this.matchChoice(remaining.trim());
              if (secondChoice) {
                currentChoices.push(secondChoice);
              }
            }
            
            continue;
          }
        }

        // Regular text - add to current question content
        if (currentQuestion) {
          questionContent.push(block);
        }
      } else {
        // Non-text blocks (math, image, table)
        if (currentQuestion) {
          questionContent.push(block);
        }
      }
    }

    // Save last question
    if (currentQuestion) {
      questions.push(this.finalizeQuestion(
        currentQuestion,
        questionContent,
        currentChoices,
        currentSection
      ));
    }

    // If no questions detected with patterns, treat all as one question
    if (questions.length === 0 && blocks.length > 0) {
      questions.push({
        questionNumber: '1',
        rawText: this.blocksToText(blocks),
        startIndex: 0,
        endIndex: blocks.length - 1,
        questionText: this.blocksToText(blocks),
        content: blocks,
        type: 'short_answer',
        confidence: 0.5
      });
    }

    console.log(`🔍 Detected ${questions.length} questions`);
    return questions;
  }

  /**
   * Match section header
   */
  private matchSection(text: string): string | null {
    for (const pattern of this.SECTION_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        return text.trim();
      }
    }
    return null;
  }

  /**
   * Match question start
   */
  private matchQuestionStart(text: string): {
    number: string;
    text: string;
    confidence: number;
  } | null {
    for (const pattern of this.QUESTION_PATTERNS) {
      const match = text.match(pattern.regex);
      if (match) {
        return {
          number: match[1],
          text: text.replace(pattern.regex, '').trim(),
          confidence: 0.9
        };
      }
    }
    return null;
  }

  /**
   * Match choice (A, B, C, D)
   */
  private matchChoice(text: string): DetectedChoice | null {
    for (const pattern of this.CHOICE_PATTERNS) {
      const match = text.match(pattern.regex);
      if (match) {
        return {
          label: match[1].toUpperCase(),
          text: match[2].trim(),
          isCorrect: false // Will be determined later
        };
      }
    }
    return null;
  }

  /**
   * Finalize detected question
   */
  private finalizeQuestion(
    partial: Partial<DetectedQuestion>,
    content: ContentBlock[],
    choices: DetectedChoice[],
    section?: string
  ): DetectedQuestion {
    // Determine question type
    let type: QuestionType = 'short_answer';
    
    if (choices.length >= 2) {
      // DEFAULT to mcq4 for 2-4 choices (teacher can change later)
      if (choices.length === 4) {
        type = 'mcq4';
      } else if (choices.length === 3) {
        type = 'mcq4'; // 3 choices still MCQ
      } else if (choices.length === 2) {
        type = 'mcq4'; // 2 choices - could be true/false but default to MCQ for flexibility
      }
    }

    // Check for sub-questions (a, b, c, d format) - override to short_answer with sub-questions
    const hasSubQuestions = choices.some(c => /^[a-d]$/i.test(c.label));
    if (hasSubQuestions) {
      type = 'short_answer'; // Will have subQuestions array instead
    }

    // Convert choices to proper format
    const questionChoices = choices.length >= 2 ? choices.map(c => ({
      label: c.label,
      content: [{
        type: 'text' as const,
        value: c.text
      }],
      isCorrect: false
    })) : undefined;

    return {
      questionNumber: partial.questionNumber || '?',
      rawText: partial.rawText || '',
      startIndex: partial.startIndex || 0,
      endIndex: partial.startIndex || 0,
      questionText: this.blocksToText(content),
      content,
      choices: questionChoices,
      type,
      confidence: partial.confidence || 0.7,
      section,
      sectionOrder: undefined
    };
  }

  /**
   * Convert content blocks to plain text
   */
  private blocksToText(blocks: ContentBlock[]): string {
    return blocks
      .map(block => {
        if (block.type === 'text') return block.value;
        if (block.type === 'math') return block.fallbackText || '[Math]';
        if (block.type === 'image') return '[Image]';
        if (block.type === 'table') return '[Table]';
        return '';
      })
      .filter(t => t)
      .join(' ');
  }
}
