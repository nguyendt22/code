import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
  displayMode?: boolean; // Force display mode (block) for entire content
}

/**
 * MathRenderer - Universal Math Formula Display Component
 * 
 * Renders mathematical content using KaTeX for professional, textbook-quality display.
 * Supports both inline ($...$) and block ($$...$$) math notation.
 * 
 * Features:
 * - Auto-detects and converts plain-text math expressions (sqrt, fractions, etc.)
 * - Handles mixed content (text + multiple math expressions)
 * - Responsive on all devices with horizontal scroll for long formulas
 * - Supports full THCS math curriculum (fractions, roots, equations, geometry, etc.)
 * 
 * Usage:
 * - <MathRenderer content="Giải phương trình $x^2 + 2x + 1 = 0$" />
 * - <MathRenderer content="$$\frac{x^2-1}{x-1}=x+1$$" displayMode />
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ 
  content, 
  className = "", 
  inline = false,
  displayMode = false 
}) => {
  if (!content) return null;

  // Transform common plain-text math notations into proper LaTeX
  const normalizeMathText = (raw: string): string => {
    if (!raw) return "";

    let text = raw;

    // Convert LaTeX delimiter variants \( ... \) and \[ ... \] to $ ... $ and $$ ... $$
    text = text.replace(/\\\[([\s\S]+?)\\\]/g, "$$$$$1$$$$");
    text = text.replace(/\\\(([\s\S]+?)\\\)/g, "$$$1$");

    // Convert sqrt(...) -> \sqrt{...} if not already LaTeX
    text = text.replace(/(?<!\\)sqrt\(([^)]+)\)/g, "\\sqrt{$1}");
    
    // Convert cbrt(...) or sqrt[3](...) -> \sqrt[3]{...}
    text = text.replace(/(?<!\\)cbrt\(([^)]+)\)/g, "\\sqrt[3]{$1}");
    text = text.replace(/(?<!\\)sqrt\[(\d+)\]\(([^)]+)\)/g, "\\sqrt[$1]{$2}");

    // Convert (expr1)/(expr2) -> \frac{expr1}{expr2}
    text = text.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, "\\frac{$1}{$2}");
    
    // Convert abs(...) or |expr| -> |expr|
    text = text.replace(/(?<!\\)abs\(([^)]+)\)/g, "|$1|");

    // If string is wrapped in $ or $$, return with minor internal cleanup
    if (text.includes("$")) {
      // Auto-wrap un-delimited LaTeX commands that were added outside $...$
      const unWrappedCmds = /(?<!\$)\\(frac|sqrt|widehat|vec|overline|underline|mathbb|mathbf|cases|begin|end|times|cdot|div|pm|mp|le|ge|neq|perp|parallel|cong|sim|approx|equiv|in|notin|subset|subseteq|supset|cup|cap|emptyset|pi|alpha|beta|gamma|delta|epsilon|theta|lambda|mu|sigma|omega|angle|triangle|square|circ|degree|infty|sum|prod|int|lim|log|ln|sin|cos|tan|cot|sec|csc)(\{[^{}]*\}|\[[^\[\]]*\])*(\{[^{}]*\})*(?!\$)/g;
      text = text.replace(unWrappedCmds, (m) => `$${m}$`);
      return text;
    }

    // --- If string DOES NOT contain any $ delimiters ---

    // 1. Check if the string is entirely or mostly a standalone math expression
    const hasLatexCmds = /\\[a-zA-Z]+/.test(text);
    const hasMathOperators = /[=<>+\-*\/^√±×÷≤≥≠∈∉⊂⊃∪∩∅∞°∠△⊥∥≅∼]/.test(text);
    const isPureCases = text.includes("\\begin{cases}") || text.includes("begin{cases}");
    const hasFractionPattern = /\d+\/\d+/.test(text) || /\([^)]+\)\/\([^)]+\)/.test(text);
    
    // Check if text looks like a standalone equation / expression without long Vietnamese sentences
    const wordCount = text.trim().split(/\s+/).length;
    const vietnameseWords = text.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{4,}/g);
    const hasLongVietnameseText = vietnameseWords && vietnameseWords.length > 2;
    
    const isLikelyStandaloneMath =
      isPureCases ||
      hasLatexCmds ||
      (hasMathOperators && !hasLongVietnameseText && (wordCount <= 10 || hasFractionPattern));

    if (isLikelyStandaloneMath) {
      // Convert simple fractions like 1/2 or (x+1)/(x-2) or a/b
      let latexMath = text
        .replace(/\(([^()]+)\)\/\(([^()]+)\)/g, "\\frac{$1}{$2}")
        .replace(/(?<![\w\$\/])([a-zA-Z0-9^{}\-]+)\/([a-zA-Z0-9^{}\-]+)(?![\w\$\/])/g, "\\frac{$1}{$2}");

      // Auto-fix unescaped \begin{cases} if missing slash
      if (latexMath.includes("begin{cases}") && !latexMath.includes("\\begin{cases}")) {
        latexMath = latexMath.replace(/begin\{cases\}/g, "\\begin{cases}").replace(/end\{cases\}/g, "\\end{cases}");
      }
      
      // Auto-fix common LaTeX escaping issues
      latexMath = latexMath.replace(/\\{2,}/g, "\\"); // Remove double backslashes

      if (displayMode || inline) {
        return inline ? `$${latexMath}$` : `$$${latexMath}$$`;
      } else if (latexMath.includes("\\begin{cases}") || latexMath.length > 30) {
        return `$$${latexMath}$$`;
      } else {
        return `$${latexMath}$`;
      }
    }

    // 2. Mixed content (e.g. "Cho $a=2$ và $b=3$. Tính $a+b$.")
    let mixed = text;

    // Wrap fractions in text e.g. 1/2 or 3/4
    mixed = mixed.replace(/(?<![\w\$\/])(\d+)\/(\d+)(?![\w\$\/])/g, "$\\frac{$1}{$2}$");

    // Wrap un-delimited LaTeX commands
    const inlineLatexRegex = /\\(frac|sqrt|widehat|vec|overline|underline|mathbb|mathbf|cases|begin|times|cdot|div|pm|mp|le|ge|neq|perp|parallel|cong|sim|approx|equiv|in|notin|subset|subseteq|supset|cup|cap|emptyset|pi|alpha|beta|gamma|delta|epsilon|theta|lambda|mu|sigma|omega|angle|triangle|square|circ|degree|infty)(\{[^{}]*\}|\[[^\[\]]*\])*(\{[^{}]*\})*/g;
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
            output: "html",
            strict: false,
            trust: false,
            macros: {
              "\\RR": "\\mathbb{R}",
              "\\NN": "\\mathbb{N}",
              "\\ZZ": "\\mathbb{Z}",
              "\\QQ": "\\mathbb{Q}"
            }
          });
          return (
            <div
              key={index}
              className="my-3 overflow-x-auto overflow-y-hidden py-2 text-center font-serif text-slate-900 max-w-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 rounded"
              style={{ fontSize: "1.1em", lineHeight: "1.6" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          console.error("KaTeX render error (block):", e, "Math:", math);
          return (
            <div key={index} className="my-2 text-center font-mono text-xs text-rose-500 bg-rose-50 p-2 rounded border border-rose-200">
              ⚠️ Công thức lỗi: {math}
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
            output: "html",
            strict: false,
            trust: false,
            macros: {
              "\\RR": "\\mathbb{R}",
              "\\NN": "\\mathbb{N}",
              "\\ZZ": "\\mathbb{Z}",
              "\\QQ": "\\mathbb{Q}"
            }
          });
          return (
            <span
              key={index}
              className="inline-block mx-0.5 align-middle text-slate-900 font-serif"
              style={{ fontSize: "1.05em" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          console.error("KaTeX render error (inline):", e, "Math:", math);
          return (
            <span key={index} className="inline-block px-1.5 py-0.5 font-mono text-xs text-rose-500 bg-rose-50 rounded border border-rose-200">
              ⚠️ {math}
            </span>
          );
        }
      }

      // Plain text part - preserve whitespace and line breaks
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return <span className={`math-content ${className}`}>{renderFormattedText(content)}</span>;
};
