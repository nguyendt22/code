import React from "react";
import katex from "katex";

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = "", inline = false }) => {
  if (!content) return null;

  // Transform common plain-text math notations (e.g. sqrt(x+2), (a)/(b), 1/2) into KaTeX LaTeX
  const normalizeMathText = (raw: string): string => {
    if (!raw) return "";

    let text = raw;

    // Convert LaTeX delimiter variants \( ... \) and \[ ... \] to $ ... $ and $$ ... $$
    text = text.replace(/\\\[([\s\S]+?)\\\]/g, "$$$$$1$$$$");
    text = text.replace(/\\\(([\s\S]+?)\\\)/g, "$$$1$");

    // Convert sqrt(...) -> \sqrt{...} if not already LaTeX
    text = text.replace(/(?<!\\)sqrt\(([^)]+)\)/g, "\\sqrt{$1}");

    // Convert (expr1)/(expr2) -> \frac{expr1}{expr2}
    text = text.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, "\\frac{$1}{$2}");

    // If string is wrapped in $ or $$, return with minor internal cleanup
    if (text.includes("$")) {
      // Auto-wrap un-delimited LaTeX commands that were added outside $...$
      const unWrappedCmds = /(?<!\$)\\(frac|sqrt|widehat|vec|overline|mathbb|cases|times|div|le|ge|neq|perp|parallel|cong|sim|in|notin|subset|cup|cap|pi|alpha|beta|gamma|delta|theta|angle|triangle)(\{[^{}]*\}|\[[^{}]*\])*(\{[^{}]*\})*(?!\$)/g;
      text = text.replace(unWrappedCmds, (m) => `$${m}$`);
      return text;
    }

    // --- If string DOES NOT contain any $ delimiters ---

    // 1. Check if the string is entirely or mostly a standalone math expression:
    // e.g. "x^2 + 2x + 1 = 0", "\frac{x+1}{x-2}", "AB \perp CD", "1/2 + 3/4", "\begin{cases} ... \end{cases}"
    const hasLatexCmds = /\\[a-zA-Z]+/.test(text);
    const hasMathOperators = /[=<>+\-*\/^√|]/.test(text);
    const isPureCases = text.includes("\\begin{cases}") || text.includes("begin{cases}");
    
    // Check if text looks like a standalone equation / expression without long Vietnamese sentences
    const wordCount = text.trim().split(/\s+/).length;
    const isLikelyStandaloneMath =
      isPureCases ||
      hasLatexCmds ||
      (hasMathOperators && (wordCount <= 8 || /^[\d\s\w\^+\-*\/=()<>\.\\_|,\\\u00C0-\u1EF9]+$/.test(text) && !/[a-zA-Z]{5,}/.test(text)));

    if (isLikelyStandaloneMath) {
      // Convert simple fractions like 1/2 or (x+1)/(x-2) or a/b
      let latexMath = text
        .replace(/\(([^()]+)\)\/\(([^()]+)\)/g, "\\frac{$1}{$2}")
        .replace(/(?<![\w\$\/])([a-zA-Z0-9^{}\-]+)\/([a-zA-Z0-9^{}\-]+)(?![\w\$\/])/g, "\\frac{$1}{$2}");

      // Auto-fix unescaped \begin{cases} if missing slash
      if (latexMath.includes("begin{cases}") && !latexMath.includes("\\begin{cases}")) {
        latexMath = latexMath.replace(/begin\{cases\}/g, "\\begin{cases}").replace(/end\{cases\}/g, "\\end{cases}");
      }

      if (inline) {
        return `$${latexMath}$`;
      } else if (latexMath.includes("\\begin{cases}") || latexMath.length > 25) {
        return `$$${latexMath}$$`;
      } else {
        return `$${latexMath}$`;
      }
    }

    // 2. Mixed content (e.g. "Cho $a=2$ và $b=3$. Tính $a+b$." or "Giải phương trình x^2 - 5x + 6 = 0")
    // Convert inline plain math like x^2 - 5x + 6 = 0 inside mixed text
    let mixed = text;

    // Wrap fractions in text e.g. 1/2 or 3/4
    mixed = mixed.replace(/(?<![\w\$\/])(\d+)\/(\d+)(?![\w\$\/])/g, "$\\frac{$1}{$2}$");

    // Wrap un-delimited LaTeX commands like \perp, \parallel, \widehat{A}, \sqrt{x+1}, \frac{a}{b}
    const inlineLatexRegex = /\\(frac|sqrt|widehat|vec|overline|mathbb|cases|times|div|le|ge|neq|perp|parallel|cong|sim|in|notin|subset|cup|cap|pi|alpha|beta|gamma|delta|theta|angle|triangle)(\{[^{}]*\}|\[[^{}]*\])*(\{[^{}]*\})*/g;
    mixed = mixed.replace(inlineLatexRegex, (m) => `$${m}$`);

    return mixed;
  };

  const renderFormattedText = (rawText: string) => {
    const text = normalizeMathText(rawText);

    // Regex splits by $$...$$ (block math) and $...$ (inline math)
    const regex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Block Math $$ ... $$
      if (part.startsWith("$$") && part.endsWith("$$") && part.length >= 4) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
            output: "html"
          });
          return (
            <div
              key={index}
              className="my-2.5 overflow-x-auto overflow-y-hidden py-1 text-center font-serif text-slate-900 max-w-full scrollbar-thin"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return (
            <div key={index} className="my-1 text-center font-mono text-xs text-rose-500 bg-rose-50 p-1 rounded">
              {math}
            </div>
          );
        }
      }

      // Inline Math $ ... $
      if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
            output: "html"
          });
          return (
            <span
              key={index}
              className="inline-block mx-0.5 align-middle text-slate-900 font-serif"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return (
            <span key={index} className="inline-block px-1 font-mono text-xs text-rose-500 bg-rose-50 rounded">
              {math}
            </span>
          );
        }
      }

      // Plain text part
      return <span key={index}>{part}</span>;
    });
  };

  return <span className={`math-content ${className}`}>{renderFormattedText(content)}</span>;
};



