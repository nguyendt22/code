/**
 * OMMLConverter - Convert Office Math Markup Language (OMML) to LaTeX
 * Supports: fractions, superscripts, subscripts, radicals, parentheses, symbols
 */

export class OMMLConverter {
  /**
   * Convert OMML XML to LaTeX string
   */
  convertToLatex(ommlXml: string): { latex: string; success: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      // Parse XML
      const parser = new DOMParser();
      const doc = parser.parseFromString(ommlXml, 'text/xml');
      
      // Check for parse errors
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        errors.push('XML parse error: ' + parseError.textContent);
        return { latex: '', success: false, errors };
      }
      
      // Find oMath root
      const oMath = doc.querySelector('oMath, m\\:oMath');
      if (!oMath) {
        errors.push('No oMath element found');
        return { latex: '', success: false, errors };
      }
      
      // Convert recursively
      const latex = this.convertNode(oMath);
      
      return {
        latex: latex.trim(),
        success: true,
        errors: []
      };
      
    } catch (err: any) {
      errors.push(err.message || 'Unknown conversion error');
      return { latex: '', success: false, errors };
    }
  }

  /**
   * Convert XML node to LaTeX recursively
   */
  private convertNode(node: Element): string {
    const tagName = this.getLocalName(node.tagName);
    
    switch (tagName) {
      case 'oMath':
      case 'oMathPara':
        return this.convertChildren(node);
      
      case 'f': // Fraction
        return this.convertFraction(node);
      
      case 'sup': // Superscript
        return this.convertSuperscript(node);
      
      case 'sub': // Subscript
        return this.convertSubscript(node);
      
      case 'rad': // Radical (square root)
        return this.convertRadical(node);
      
      case 'd': // Delimiter (parentheses, brackets)
        return this.convertDelimiter(node);
      
      case 'func': // Function (sin, cos, log, etc.)
        return this.convertFunction(node);
      
      case 'limLow': // Limit lower
        return this.convertLimitLower(node);
      
      case 'limUpp': // Limit upper
        return this.convertLimitUpper(node);
      
      case 'nary': // N-ary operator (sum, integral)
        return this.convertNary(node);
      
      case 'r': // Run (text/number)
        return this.convertRun(node);
      
      case 't': // Text
        return node.textContent || '';
      
      case 'e': // Element (generic container)
        return this.convertChildren(node);
      
      default:
        // Unknown element - try to convert children
        return this.convertChildren(node);
    }
  }

  /**
   * Convert fraction: \frac{num}{den}
   */
  private convertFraction(node: Element): string {
    const num = node.querySelector('num');
    const den = node.querySelector('den');
    
    if (!num || !den) {
      return '[fraction error]';
    }
    
    const numerator = this.convertChildren(num);
    const denominator = this.convertChildren(den);
    
    return `\\frac{${numerator}}{${denominator}}`;
  }

  /**
   * Convert superscript: base^{sup}
   */
  private convertSuperscript(node: Element): string {
    const e = node.querySelector('e');
    const sup = node.querySelector('sup');
    
    if (!e || !sup) {
      return '[superscript error]';
    }
    
    const base = this.convertChildren(e);
    const exponent = this.convertChildren(sup);
    
    return `{${base}}^{${exponent}}`;
  }

  /**
   * Convert subscript: base_{sub}
   */
  private convertSubscript(node: Element): string {
    const e = node.querySelector('e');
    const sub = node.querySelector('sub');
    
    if (!e || !sub) {
      return '[subscript error]';
    }
    
    const base = this.convertChildren(e);
    const subscript = this.convertChildren(sub);
    
    return `{${base}}_{${subscript}}`;
  }

  /**
   * Convert radical: \sqrt{...} or \sqrt[n]{...}
   */
  private convertRadical(node: Element): string {
    const deg = node.querySelector('deg');
    const e = node.querySelector('e');
    
    if (!e) {
      return '[radical error]';
    }
    
    const content = this.convertChildren(e);
    
    if (deg && deg.textContent?.trim()) {
      const degree = this.convertChildren(deg);
      return `\\sqrt[${degree}]{${content}}`;
    } else {
      return `\\sqrt{${content}}`;
    }
  }

  /**
   * Convert delimiter (parentheses, brackets, etc.)
   */
  private convertDelimiter(node: Element): string {
    const e = node.querySelector('e');
    if (!e) {
      return '';
    }
    
    // Get delimiter characters
    const dPr = node.querySelector('dPr');
    const begChr = dPr?.querySelector('begChr')?.getAttribute('m:val') || '(';
    const endChr = dPr?.querySelector('endChr')?.getAttribute('m:val') || ')';
    
    const content = this.convertChildren(e);
    
    // Map common delimiters to LaTeX
    const delimiterMap: Record<string, string> = {
      '(': '\\left(',
      ')': '\\right)',
      '[': '\\left[',
      ']': '\\right]',
      '{': '\\left\\{',
      '}': '\\right\\}',
      '|': '\\left|',
    };
    
    const leftDelim = delimiterMap[begChr] || begChr;
    const rightDelim = delimiterMap[endChr] || endChr;
    
    return `${leftDelim} ${content} ${rightDelim}`;
  }

  /**
   * Convert function (sin, cos, log, etc.)
   */
  private convertFunction(node: Element): string {
    const fName = node.querySelector('fName');
    const e = node.querySelector('e');
    
    if (!fName) {
      return this.convertChildren(node);
    }
    
    const funcName = this.convertChildren(fName).trim();
    const arg = e ? this.convertChildren(e) : '';
    
    // Map to LaTeX function names
    const latexFuncs = ['sin', 'cos', 'tan', 'log', 'ln', 'exp', 'lim', 'max', 'min'];
    const funcLower = funcName.toLowerCase();
    
    if (latexFuncs.includes(funcLower)) {
      return `\\${funcLower}${arg ? ` ${arg}` : ''}`;
    }
    
    return `${funcName}${arg ? `(${arg})` : ''}`;
  }

  /**
   * Convert limit lower (e.g., lim_{x->0})
   */
  private convertLimitLower(node: Element): string {
    const e = node.querySelector('e');
    const lim = node.querySelector('lim');
    
    if (!e || !lim) {
      return this.convertChildren(node);
    }
    
    const base = this.convertChildren(e);
    const limit = this.convertChildren(lim);
    
    return `${base}_{${limit}}`;
  }

  /**
   * Convert limit upper
   */
  private convertLimitUpper(node: Element): string {
    const e = node.querySelector('e');
    const lim = node.querySelector('lim');
    
    if (!e || !lim) {
      return this.convertChildren(node);
    }
    
    const base = this.convertChildren(e);
    const limit = this.convertChildren(lim);
    
    return `${base}^{${limit}}`;
  }

  /**
   * Convert n-ary operator (sum, integral, product)
   */
  private convertNary(node: Element): string {
    const chr = node.querySelector('naryPr chr')?.getAttribute('m:val');
    const sub = node.querySelector('sub');
    const sup = node.querySelector('sup');
    const e = node.querySelector('e');
    
    if (!e) {
      return '[nary error]';
    }
    
    // Map character to LaTeX operator
    const operatorMap: Record<string, string> = {
      '∑': '\\sum',
      '∏': '\\prod',
      '∫': '\\int',
      '∮': '\\oint'
    };
    
    const operator = chr ? (operatorMap[chr] || chr) : '\\sum';
    const lower = sub ? `_{${this.convertChildren(sub)}}` : '';
    const upper = sup ? `^{${this.convertChildren(sup)}}` : '';
    const content = this.convertChildren(e);
    
    return `${operator}${lower}${upper} ${content}`;
  }

  /**
   * Convert run (text/number)
   */
  private convertRun(node: Element): string {
    const t = node.querySelector('t');
    if (!t) {
      return '';
    }
    
    let text = t.textContent || '';
    
    // Handle special characters and Greek letters
    text = this.convertSpecialCharacters(text);
    
    return text;
  }

  /**
   * Convert special characters and Greek letters to LaTeX
   */
  private convertSpecialCharacters(text: string): string {
    const charMap: Record<string, string> = {
      'α': '\\alpha',
      'β': '\\beta',
      'γ': '\\gamma',
      'δ': '\\delta',
      'ε': '\\epsilon',
      'θ': '\\theta',
      'λ': '\\lambda',
      'μ': '\\mu',
      'π': '\\pi',
      'σ': '\\sigma',
      'φ': '\\phi',
      'ω': '\\omega',
      '∞': '\\infty',
      '≤': '\\leq',
      '≥': '\\geq',
      '≠': '\\neq',
      '≈': '\\approx',
      '±': '\\pm',
      '×': '\\times',
      '÷': '\\div',
      '∈': '\\in',
      '∉': '\\notin',
      '⊂': '\\subset',
      '⊃': '\\supset',
      '∪': '\\cup',
      '∩': '\\cap',
      '∅': '\\emptyset',
      '→': '\\rightarrow',
      '←': '\\leftarrow',
      '↔': '\\leftrightarrow'
    };
    
    let result = text;
    for (const [char, latex] of Object.entries(charMap)) {
      result = result.replace(new RegExp(char, 'g'), latex);
    }
    
    return result;
  }

  /**
   * Convert all children nodes
   */
  private convertChildren(node: Element): string {
    const children = Array.from(node.children);
    return children.map(child => this.convertNode(child as Element)).join(' ');
  }

  /**
   * Get local tag name (strip namespace)
   */
  private getLocalName(tagName: string): string {
    return tagName.includes(':') ? tagName.split(':')[1] : tagName;
  }
}
