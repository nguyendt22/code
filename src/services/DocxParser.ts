/**
 * DocxParser - Parse DOCX files using mammoth.js
 * Extracts text, OMML equations, images, and preserves structure
 */

import mammoth from 'mammoth';
import JSZip from 'jszip';
import { 
  ParsedExamDocument, 
  ParserConfig, 
  ContentBlock,
  DocumentMetadata,
  ExamSection,
  ParseReport,
  EnhancedQuestion,
  ParseMetadata
} from '../types/exam';

export class DocxParser {
  private config: ParserConfig;

  constructor(config: ParserConfig) {
    this.config = config;
  }

  /**
   * Main parse method
   */
  async parse(file: File): Promise<ParsedExamDocument> {
    const startTime = Date.now();
    
    // Step 1: Extract raw content with mammoth
    const { htmlContent, images, rawXml } = await this.extractDocxContent(file);
    
    // Step 2: Extract equations from XML
    const equations = await this.extractEquations(file);
    
    // Step 3: Parse HTML to content blocks
    const contentBlocks = this.parseHtmlToBlocks(htmlContent, equations, images);
    
    // Step 4: Detect questions (will implement in Phase 4)
    // For now, return raw structure
    const { QuestionDetector } = await import('./QuestionDetector');
    const detector = new QuestionDetector(this.config);
    const detectedQuestions = detector.detectQuestions(contentBlocks);
    
    // Step 5: Convert to EnhancedQuestion objects
    const questions = detectedQuestions.map((dq, idx) => 
      this.createEnhancedQuestion(dq, idx)
    );
    
    // Step 6: Detect sections
    const sections = this.config.detectSections 
      ? this.detectSections(questions)
      : [{
          id: 'default',
          title: 'Tất cả câu hỏi',
          order: 1,
          questions
        }];
    
    // Step 7: Create metadata
    const metadata: DocumentMetadata = {
      fileName: file.name,
      fileSize: file.size,
      hasEquations: equations.length > 0,
      hasImages: images.length > 0,
      hasTables: htmlContent.includes('<table'),
      parsedAt: new Date().toISOString()
    };
    
    // Step 8: Generate parse report
    const parseReport = this.generateParseReport(questions);
    
    const parseTime = Date.now() - startTime;
    console.log(`✅ DocxParser completed in ${parseTime}ms`);
    
    return {
      metadata,
      sections,
      allQuestions: questions,
      parseReport
    };
  }

  /**
   * Extract DOCX content using mammoth.js
   */
  private async extractDocxContent(file: File): Promise<{
    htmlContent: string;
    images: { id: string; data: string; contentType: string }[];
    rawXml: string;
  }> {
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract with mammoth
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        // Custom style map to preserve structure
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Title'] => h1.title:fresh"
        ],
        convertImage: mammoth.images.imgElement(async (image) => {
          const buffer = await image.read();
          const base64 = this.arrayBufferToBase64(buffer);
          return {
            src: `data:${image.contentType};base64,${base64}`
          };
        })
      }
    );
    
    // Extract raw XML for equation parsing
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = await zip.file('word/document.xml')?.async('string') || '';
    
    // Extract images metadata
    const images: { id: string; data: string; contentType: string }[] = [];
    const imageFiles = Object.keys(zip.files).filter(name => 
      name.startsWith('word/media/') && /\.(png|jpg|jpeg|gif|emf|wmf)$/i.test(name)
    );
    
    for (const imagePath of imageFiles) {
      const imageFile = zip.files[imagePath];
      const buffer = await imageFile.async('arraybuffer');
      const base64 = this.arrayBufferToBase64(buffer);
      const ext = imagePath.split('.').pop()?.toLowerCase() || 'png';
      const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      
      images.push({
        id: imagePath.split('/').pop() || '',
        data: `data:${contentType};base64,${base64}`,
        contentType
      });
    }
    
    return {
      htmlContent: result.value,
      images,
      rawXml: documentXml
    };
  }

  /**
   * Extract OMML equations from DOCX XML
   */
  private async extractEquations(file: File): Promise<Array<{
    id: string;
    omml: string;
    position: number;
  }>> {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = await zip.file('word/document.xml')?.async('string') || '';
    
    const equations: Array<{ id: string; omml: string; position: number }> = [];
    
    // Find all OMML math elements: <m:oMath>...</m:oMath>
    const ommlRegex = /<m:oMath[^>]*>([\s\S]*?)<\/m:oMath>/g;
    let match;
    let index = 0;
    
    while ((match = ommlRegex.exec(documentXml)) !== null) {
      equations.push({
        id: `eq-${index}`,
        omml: match[0],
        position: match.index
      });
      index++;
    }
    
    console.log(`📐 Extracted ${equations.length} OMML equations`);
    return equations;
  }

  /**
   * Parse HTML to ContentBlocks
   */
  private parseHtmlToBlocks(
    html: string,
    equations: Array<{ id: string; omml: string; position: number }>,
    images: Array<{ id: string; data: string; contentType: string }>
  ): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Walk through all elements
    const walker = document.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    let equationIndex = 0;
    
    while (node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          blocks.push({
            type: 'text',
            value: text
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        
        // Images
        if (element.tagName === 'IMG') {
          const src = element.getAttribute('src');
          if (src) {
            blocks.push({
              type: 'image',
              src,
              alt: element.getAttribute('alt') || undefined,
              isMathEquation: false
            });
          }
        }
        
        // Paragraph breaks
        if (element.tagName === 'P' && !element.textContent?.trim()) {
          blocks.push({
            type: 'paragraph_break'
          });
        }
        
        // Tables
        if (element.tagName === 'TABLE') {
          const rows: string[][] = [];
          const trs = element.querySelectorAll('tr');
          trs.forEach(tr => {
            const row: string[] = [];
            tr.querySelectorAll('td, th').forEach(cell => {
              row.push(cell.textContent?.trim() || '');
            });
            rows.push(row);
          });
          
          if (rows.length > 0) {
            blocks.push({
              type: 'table',
              rows
            });
          }
        }
        
        // Math equations (placeholder for now)
        // We'll replace these with actual OMML conversion in Phase 5
        if (element.classList.contains('math') || element.tagName === 'MATH') {
          if (equationIndex < equations.length) {
            const eq = equations[equationIndex];
            blocks.push({
              type: 'math',
              omml: eq.omml,
              latex: undefined, // Will be converted in Phase 5
              fallbackText: element.textContent || '[Equation]',
              renderStatus: 'partial'
            });
            equationIndex++;
          }
        }
      }
    }
    
    return this.mergeAdjacentTextBlocks(blocks);
  }

  /**
   * Merge adjacent text blocks
   */
  private mergeAdjacentTextBlocks(blocks: ContentBlock[]): ContentBlock[] {
    const merged: ContentBlock[] = [];
    
    for (const block of blocks) {
      if (block.type === 'text') {
        const last = merged[merged.length - 1];
        if (last && last.type === 'text') {
          last.value += ' ' + block.value;
        } else {
          merged.push(block);
        }
      } else {
        merged.push(block);
      }
    }
    
    return merged;
  }

  /**
   * Create EnhancedQuestion from detected question
   */
  private createEnhancedQuestion(detectedQ: any, index: number): EnhancedQuestion {
    const parseMetadata: ParseMetadata = {
      parseStatus: 'success',
      warnings: [],
      errors: [],
      confidence: detectedQ.confidence || 0.8,
      hasEquations: detectedQ.content?.some((b: ContentBlock) => b.type === 'math') || false,
      hasImages: detectedQ.content?.some((b: ContentBlock) => b.type === 'image') || false,
      equationCount: detectedQ.content?.filter((b: ContentBlock) => b.type === 'math').length || 0,
      imageCount: detectedQ.content?.filter((b: ContentBlock) => b.type === 'image').length || 0
    };
    
    return {
      id: `q-${Date.now()}-${index}`,
      text: '', // Deprecated, use content instead
      content: detectedQ.content || [],
      type: detectedQ.type || 'short_answer',
      choices: detectedQ.choices,
      subQuestions: detectedQ.subQuestions,
      correctAnswer: detectedQ.correctAnswer || '',
      explanation: detectedQ.explanation || '',
      grade: this.config.defaultGrade,
      semester: 1,
      chapterId: 'imported',
      chapterName: 'Import',
      lessonId: 'imported',
      lessonName: 'Import',
      topicName: 'Import từ DOCX',
      cognitiveLevel: this.config.defaultCognitive,
      difficulty: this.config.defaultDifficulty,
      tags: ['Import DOCX'],
      parseMetadata,
      originalNumber: detectedQ.questionNumber,
      orderIndex: index,
      section: detectedQ.section,
      sectionOrder: detectedQ.sectionOrder
    };
  }

  /**
   * Detect sections from questions
   */
  private detectSections(questions: EnhancedQuestion[]): ExamSection[] {
    // Group questions by section
    const sectionMap = new Map<string, EnhancedQuestion[]>();
    
    questions.forEach(q => {
      const sectionTitle = q.section || 'Tất cả câu hỏi';
      if (!sectionMap.has(sectionTitle)) {
        sectionMap.set(sectionTitle, []);
      }
      sectionMap.get(sectionTitle)!.push(q);
    });
    
    // Convert to ExamSection array
    const sections: ExamSection[] = [];
    let order = 1;
    
    sectionMap.forEach((questions, title) => {
      sections.push({
        id: `section-${order}`,
        title,
        order,
        questions
      });
      order++;
    });
    
    return sections;
  }

  /**
   * Generate parse report
   */
  private generateParseReport(questions: EnhancedQuestion[]): ParseReport {
    const totalQuestions = questions.length;
    const successfullyParsed = questions.filter(q => 
      q.parseMetadata.parseStatus === 'success'
    ).length;
    const withWarnings = questions.filter(q => 
      q.parseMetadata.parseStatus === 'warning'
    ).length;
    const withErrors = questions.filter(q => 
      q.parseMetadata.parseStatus === 'error'
    ).length;
    
    const validationIssues = questions.flatMap(q => 
      q.parseMetadata.errors.map(err => ({
        type: 'error' as const,
        questionIndex: q.orderIndex,
        message: err,
        suggestion: undefined
      }))
    );
    
    const summary = `Đã parse ${successfullyParsed}/${totalQuestions} câu hỏi thành công. ` +
      (withWarnings > 0 ? `${withWarnings} câu có cảnh báo. ` : '') +
      (withErrors > 0 ? `${withErrors} câu có lỗi.` : '');
    
    return {
      totalQuestions,
      successfullyParsed,
      withWarnings,
      withErrors,
      validationIssues,
      summary
    };
  }

  /**
   * Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
