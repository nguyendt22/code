import * as math from "mathjs";

/**
 * Utility to convert LaTeX string into a MathJS-compatible expression string.
 */
export function latexToMathJS(latex: string): string {
  if (!latex) return "";

  let str = latex.trim();

  // Remove KaTeX / MathLive formatting commands
  str = str.replace(/\\left\(/g, "(").replace(/\\right\)/g, ")");
  str = str.replace(/\\left\[/g, "[").replace(/\\right\]/g, "]");
  str = str.replace(/\\left\\\{/g, "{").replace(/\\right\\\}/g, "}");
  str = str.replace(/\\left\|/g, "|").replace(/\\right\|/g, "|");

  // Handle fractions: \frac{num}{den} -> ((num)/(den))
  // Handle nested fractions recursively
  while (/\\frac\{([^{}]+)\}\{([^{}]+)\}/.test(str)) {
    str = str.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))");
  }

  // Handle square roots: \sqrt{arg} -> sqrt(arg)
  while (/\\sqrt\{([^{}]+)\}/.test(str)) {
    str = str.replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)");
  }
  // Handle nth roots: \sqrt[n]{arg} -> (arg)^(1/n)
  while (/\\sqrt\[([^{}]+)\]\{([^{}]+)\}/.test(str)) {
    str = str.replace(/\\sqrt\[([^{}]+)\]\{([^{}]+)\}/g, "(($2)^(1/($1)))");
  }

  // Absolute value: |expr| -> abs(expr)
  str = str.replace(/\|([^|]+)\|/g, "abs($1)");

  // Multiplication & Division symbols
  str = str.replace(/\\cdot/g, "*")
    .replace(/\\times/g, "*")
    .replace(/\\div/g, "/")
    .replace(/:/g, "/");

  // Implicit multiplication: e.g. 2x -> 2*x, 3(x+1) -> 3*(x+1)
  str = str.replace(/(\d)([a-zA-Z])/g, "$1*$2");
  str = str.replace(/(\d)\(/g, "$1*(");
  str = str.replace(/\)([a-zA-Z0-9])/g, ")*$1");

  // Greek / Constants
  str = str.replace(/\\pi/g, "pi");

  // Power notation cleanup: e.g. x^{2} -> x^(2)
  str = str.replace(/\^\{([^{}]+)\}/g, "^($1)");

  // Remove leftover latex commands like \widehat{A} -> A
  str = str.replace(/\\widehat\{([^{}]+)\}/g, "$1");

  return str;
}

export interface EquivalenceResult {
  isEquivalent: boolean;
  score: number; // 1.0 = exact/equivalent, 0 = wrong
  feedback: string;
}

/**
 * Checks if student LaTeX math input is mathematically equivalent to expected answer.
 */
export function checkMathEquivalence(studentInput: string, expectedAnswer: string): EquivalenceResult {
  if (!studentInput || !studentInput.trim()) {
    return { isEquivalent: false, score: 0, feedback: "Chưa nhập đáp án." };
  }

  const cleanStudent = studentInput.trim();
  const cleanExpected = expectedAnswer.trim();

  // 1. Exact string or LaTeX match
  if (cleanStudent === cleanExpected) {
    return { isEquivalent: true, score: 1.0, feedback: "Chính xác tuyệt đối!" };
  }

  // Normalize string spaces & basic LaTeX formatting
  const normStudent = cleanStudent.replace(/\s+/g, "");
  const normExpected = cleanExpected.replace(/\s+/g, "");
  if (normStudent === normExpected) {
    return { isEquivalent: true, score: 1.0, feedback: "Chính xác!" };
  }

  // 2. Check for equation symmetry e.g. "x = 3" vs "3 = x"
  if (cleanExpected.includes("=") && cleanStudent.includes("=")) {
    const [expLeft, expRight] = cleanExpected.split("=").map((s) => s.trim());
    const [stdLeft, stdRight] = cleanStudent.split("=").map((s) => s.trim());

    if (
      (stdLeft === expRight && stdRight === expLeft) ||
      (checkMathEquivalence(stdLeft, expLeft).isEquivalent && checkMathEquivalence(stdRight, expRight).isEquivalent) ||
      (checkMathEquivalence(stdLeft, expRight).isEquivalent && checkMathEquivalence(stdRight, expLeft).isEquivalent)
    ) {
      return { isEquivalent: true, score: 1.0, feedback: "Chính xác (Đúng về mặt phương trình)!" };
    }
  }

  // 3. Symbolic / Numeric Equivalence Evaluation using MathJS
  try {
    const exprStudent = latexToMathJS(cleanStudent);
    const exprExpected = latexToMathJS(cleanExpected);

    // Try evaluating both expressions with MathJS
    const nodeStudent = math.parse(exprStudent);
    const nodeExpected = math.parse(exprExpected);

    // Simplification check
    const simplifiedStudent = math.simplify(nodeStudent).toString().replace(/\s+/g, "");
    const simplifiedExpected = math.simplify(nodeExpected).toString().replace(/\s+/g, "");

    if (simplifiedStudent === simplifiedExpected) {
      return { isEquivalent: true, score: 1.0, feedback: "Chính xác! (Tương đương về biểu thức đại số)" };
    }

    // Numerical Sampling Test (sample at multiple x, y values)
    const sampleScope = [
      { x: 1, y: 2, a: 3, b: 4, z: 5 },
      { x: 2, y: -3, a: 5, b: 1, z: 2 },
      { x: -0.5, y: 1.5, a: 2, b: 3, z: -1 },
      { x: 4, y: 0.5, a: -1, b: 2, z: 3 }
    ];

    let allSamplesMatch = true;
    let evalCount = 0;

    for (const scope of sampleScope) {
      try {
        const valStd = nodeStudent.evaluate(scope);
        const valExp = nodeExpected.evaluate(scope);

        if (typeof valStd === "number" && typeof valExp === "number") {
          evalCount++;
          if (Math.abs(valStd - valExp) > 1e-6) {
            allSamplesMatch = false;
            break;
          }
        }
      } catch (err) {
        // Scope variables didn't match or division by zero, ignore sample
      }
    }

    if (evalCount > 0 && allSamplesMatch) {
      return { isEquivalent: true, score: 1.0, feedback: "Chính xác! (Kết quả tương đương mặt giá trị)" };
    }
  } catch (err) {
    // MathJS parse error fallback to string comparison
  }

  return {
    isEquivalent: false,
    score: 0,
    feedback: "Kết quả chưa chính xác. Vui lòng kiểm tra lại phép tính hoặc cấu trúc công thức."
  };
}
