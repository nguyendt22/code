/**
 * Auto Math Formatter - Automatically detect and wrap math expressions in $ delimiters
 * 
 * This utility helps teachers by automatically formatting math content when they
 * forget to add $ delimiters around formulas.
 */

/**
 * Detects if a string contains math-like patterns
 */
export function containsMathPattern(text: string): boolean {
  if (!text) return false;
  
  // Already has $ delimiters
  if (text.includes('$')) return true;
  
  // Common math patterns
  const mathPatterns = [
    /\d+\/\d+/,                          // Fractions: 1/2, 3/4
    /\([^)]+\)\/\([^)]+\)/,              // Complex fractions: (x+1)/(x-2)
    /[a-z]\^\d+/i,                       // Exponents: x^2, a^3
    /[a-z]_\d+/i,                        // Subscripts: x_1, a_2
    /sqrt\([^)]+\)/,                     // Square root: sqrt(x+1)
    /\\frac|\\sqrt|\\sum|\\int/,         // LaTeX commands
    /[=<>≤≥≠±×÷]/,                       // Math operators
    /\\perp|\\parallel|\\angle|\\triangle/, // Geometry symbols
    /\\in|\\subset|\\cup|\\cap/,         // Set theory
    /\\alpha|\\beta|\\gamma|\\theta|\\pi/ // Greek letters
  ];
  
  return mathPatterns.some(pattern => pattern.test(text));
}

/**
 * Automatically wraps math expressions in $ delimiters
 * Preserves existing $ delimiters and handles mixed content
 */
export function autoFormatMath(text: string): string {
  if (!text || !text.trim()) return text;
  
  // Already properly formatted with $ delimiters
  if (text.includes('$')) return text;
  
  // Check if entire string is a math expression
  const trimmed = text.trim();
  
  // Pattern 1: Pure LaTeX command (already starts with \)
  if (trimmed.startsWith('\\')) {
    return `$${trimmed}$`;
  }
  
  // Pattern 2: Simple fraction pattern (digits/digits)
  if (/^\d+\/\d+$/.test(trimmed)) {
    return `$\\frac{${trimmed.split('/')[0]}}{${trimmed.split('/')[1]}}$`;
  }
  
  // Pattern 3: Complex fraction (expr)/(expr)
  const complexFractionMatch = trimmed.match(/^\(([^)]+)\)\/\(([^)]+)\)$/);
  if (complexFractionMatch) {
    return `$\\frac{${complexFractionMatch[1]}}{${complexFractionMatch[2]}}$`;
  }
  
  // Pattern 4: Contains math operators - likely a formula
  if (/[=<>+\-×÷]/.test(trimmed) && !/[,.;!?]/.test(trimmed)) {
    // Likely a standalone equation
    return `$${trimmed}$`;
  }
  
  // Pattern 5: Mixed content - Vietnamese text with math
  // Find and wrap individual math expressions
  let result = text;
  
  // Wrap fractions
  result = result.replace(/(\d+)\/(\d+)/g, '$\\frac{$1}{$2}$');
  
  // Wrap complex fractions
  result = result.replace(/\(([^)]+)\)\/\(([^)]+)\)/g, '$\\frac{$1}{$2}$');
  
  // Wrap sqrt
  result = result.replace(/sqrt\(([^)]+)\)/g, '$\\sqrt{$1}$');
  
  // Wrap standalone LaTeX commands
  result = result.replace(/(\\(?:frac|sqrt|sum|int|lim|log|sin|cos|tan|perp|parallel|angle|triangle|in|subset|cup|cap|alpha|beta|gamma|theta|pi|Delta)(?:\{[^}]*\}|\[[^\]]*\])*(?:\{[^}]*\})*)/g, '$$1$');
  
  return result;
}

/**
 * Formats an entire question object, adding $ delimiters where needed
 */
export function autoFormatQuestion(question: {
  text: string;
  options?: string[];
  explanation?: string;
  [key: string]: any;
}): typeof question {
  return {
    ...question,
    text: autoFormatMath(question.text),
    options: question.options?.map(opt => autoFormatMath(opt)),
    explanation: question.explanation ? autoFormatMath(question.explanation) : question.explanation
  };
}

/**
 * Formats an array of questions
 */
export function autoFormatQuestions(questions: any[]): any[] {
  return questions.map(q => autoFormatQuestion(q));
}

/**
 * Smart formatter that detects common Vietnamese question patterns
 * and only formats the math parts
 */
export function smartFormatVietnameseQuestion(text: string): string {
  if (!text || text.includes('$')) return text;
  
  // Common Vietnamese question starters that should NOT be wrapped
  const vietnameseStarters = [
    'Tính', 'Giải', 'Cho', 'Tìm', 'Chứng minh', 'Biết', 'Với',
    'Kết quả', 'Giá trị', 'Đáp án', 'Phát biểu'
  ];
  
  // If starts with Vietnamese, it's mixed content
  const startsWithVietnamese = vietnameseStarters.some(starter => 
    text.trim().startsWith(starter)
  );
  
  if (startsWithVietnamese) {
    // Mixed content - only wrap math parts
    return autoFormatMath(text);
  }
  
  // Pure math expression
  if (containsMathPattern(text) && text.split(' ').length <= 8) {
    return `$${text}$`;
  }
  
  return autoFormatMath(text);
}

/**
 * Validates that a math string has proper $ delimiters
 */
export function validateMathFormatting(text: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  if (!text) {
    return { isValid: true, issues, suggestions };
  }
  
  // Check for LaTeX commands without $ delimiters
  const bareLatexMatch = text.match(/\\[a-z]+/gi);
  if (bareLatexMatch && !text.includes('$')) {
    issues.push('Phát hiện lệnh LaTeX nhưng thiếu dấu $');
    suggestions.push(`Thêm dấu $ quanh công thức: $${text}$`);
  }
  
  // Check for unescaped fractions
  const bareFractionMatch = text.match(/\d+\/\d+/);
  if (bareFractionMatch && !text.includes('$')) {
    issues.push('Phát hiện phân số dạng text (ví dụ: 1/2)');
    suggestions.push('Sử dụng \\frac{1}{2} hoặc để hệ thống tự động format');
  }
  
  // Check for mismatched $ delimiters
  const dollarCount = (text.match(/\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    issues.push('Số lượng dấu $ không khớp (lẻ)');
    suggestions.push('Đảm bảo mỗi $ mở có một $ đóng tương ứng');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * Preview formatter - shows what the formatted version will look like
 */
export function previewFormatting(text: string): {
  original: string;
  formatted: string;
  changes: string[];
} {
  const formatted = smartFormatVietnameseQuestion(text);
  const changes: string[] = [];
  
  if (original !== formatted) {
    if (!text.includes('$') && formatted.includes('$')) {
      changes.push('Đã thêm dấu $ quanh công thức toán');
    }
    if (text.includes('/') && formatted.includes('\\frac')) {
      changes.push('Đã chuyển phân số từ dạng a/b sang \\frac{a}{b}');
    }
    if (text.includes('sqrt') && formatted.includes('\\sqrt')) {
      changes.push('Đã chuyển sqrt() sang \\sqrt{}');
    }
  }
  
  return { original: text, formatted, changes };
}
