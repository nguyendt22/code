/**
 * MathRenderer Test Cases - THCS Math Curriculum
 * 
 * Tests all mathematical expressions required for Vietnamese Middle School (THCS) curriculum:
 * - Fractions, exponents, roots
 * - Equations and inequalities
 * - Geometry notation
 * - Sets and logic symbols
 * - Mixed text and math content
 */

import React from "react";
import { MathRenderer } from "./MathRenderer";

export const MATH_TEST_CASES = [
  // ===== BASIC ARITHMETIC =====
  {
    id: "test-1",
    name: "Simple Equation",
    input: "x^2 + 2x + 1 = 0",
    expectedLatex: "$x^2 + 2x + 1 = 0$",
    category: "Phương trình cơ bản"
  },
  {
    id: "test-2",
    name: "Fraction Division",
    input: "\\frac{x+1}{x-2}",
    expectedLatex: "$\\frac{x+1}{x-2}$",
    category: "Phân số"
  },
  {
    id: "test-3",
    name: "Plain Text Fraction",
    input: "(x+1)/(x-2)",
    expectedLatex: "$\\frac{x+1}{x-2}$",
    category: "Phân số dạng text"
  },
  {
    id: "test-4",
    name: "Simple Fraction",
    input: "1/2 + 3/4",
    expectedLatex: "$\\frac{1}{2} + \\frac{3}{4}$",
    category: "Phân số số học"
  },

  // ===== ROOTS =====
  {
    id: "test-5",
    name: "Square Root",
    input: "\\sqrt{x+1}",
    expectedLatex: "$\\sqrt{x+1}$",
    category: "Căn bậc hai"
  },
  {
    id: "test-6",
    name: "Square Root (text notation)",
    input: "sqrt(x+1)",
    expectedLatex: "$\\sqrt{x+1}$",
    category: "Căn bậc hai dạng text"
  },
  {
    id: "test-7",
    name: "Cube Root",
    input: "\\sqrt[3]{x+1}",
    expectedLatex: "$\\sqrt[3]{x+1}$",
    category: "Căn bậc ba"
  },
  {
    id: "test-8",
    name: "Nth Root",
    input: "\\sqrt[n]{a^n + b^n}",
    expectedLatex: "$\\sqrt[n]{a^n + b^n}$",
    category: "Căn bậc n"
  },

  // ===== EXPONENTS =====
  {
    id: "test-9",
    name: "Simple Exponent",
    input: "x^2",
    expectedLatex: "$x^2$",
    category: "Lũy thừa"
  },
  {
    id: "test-10",
    name: "Complex Exponent",
    input: "a^{n+1}",
    expectedLatex: "$a^{n+1}$",
    category: "Lũy thừa phức tạp"
  },

  // ===== SUBSCRIPTS =====
  {
    id: "test-11",
    name: "Subscripts",
    input: "x_1, x_2, \\ldots, x_n",
    expectedLatex: "$x_1, x_2, \\ldots, x_n$",
    category: "Chỉ số dưới"
  },

  // ===== ABSOLUTE VALUE =====
  {
    id: "test-12",
    name: "Absolute Value",
    input: "|x-2|",
    expectedLatex: "$|x-2|$",
    category: "Giá trị tuyệt đối"
  },
  {
    id: "test-13",
    name: "Absolute Value Equation",
    input: "|2x + 3| = 7",
    expectedLatex: "$|2x + 3| = 7$",
    category: "Phương trình giá trị tuyệt đối"
  },

  // ===== SYSTEMS OF EQUATIONS =====
  {
    id: "test-14",
    name: "System of Equations",
    input: "\\begin{cases} x+y=5\\\\ 2x-y=1 \\end{cases}",
    expectedLatex: "$$\\begin{cases} x+y=5\\\\ 2x-y=1 \\end{cases}$$",
    category: "Hệ phương trình"
  },
  {
    id: "test-15",
    name: "System of Three Equations",
    input: "\\begin{cases} x+y+z=6\\\\ 2x-y+z=3\\\\ x-2y+3z=2 \\end{cases}",
    expectedLatex: "$$\\begin{cases} x+y+z=6\\\\ 2x-y+z=3\\\\ x-2y+3z=2 \\end{cases}$$",
    category: "Hệ 3 phương trình"
  },

  // ===== INEQUALITIES =====
  {
    id: "test-16",
    name: "Simple Inequality",
    input: "2x + 3 > 7",
    expectedLatex: "$2x + 3 > 7$",
    category: "Bất phương trình"
  },
  {
    id: "test-17",
    name: "System of Inequalities",
    input: "\\begin{cases} x > 1\\\\ x < 5 \\end{cases}",
    expectedLatex: "$$\\begin{cases} x > 1\\\\ x < 5 \\end{cases}$$",
    category: "Hệ bất phương trình"
  },
  {
    id: "test-18",
    name: "Inequality with Fractions",
    input: "\\frac{x-1}{x+2} \\le 0",
    expectedLatex: "$\\frac{x-1}{x+2} \\le 0$",
    category: "Bất phương trình phân thức"
  },

  // ===== GEOMETRY =====
  {
    id: "test-19",
    name: "Perpendicular Lines",
    input: "AB \\perp CD",
    expectedLatex: "$AB \\perp CD$",
    category: "Vuông góc"
  },
  {
    id: "test-20",
    name: "Parallel Lines",
    input: "AB \\parallel CD",
    expectedLatex: "$AB \\parallel CD$",
    category: "Song song"
  },
  {
    id: "test-21",
    name: "Angle Notation",
    input: "\\widehat{A} = 60^\\circ",
    expectedLatex: "$\\widehat{A} = 60^\\circ$",
    category: "Góc"
  },
  {
    id: "test-22",
    name: "Angle Symbol",
    input: "\\angle ABC = 90^\\circ",
    expectedLatex: "$\\angle ABC = 90^\\circ$",
    category: "Ký hiệu góc"
  },
  {
    id: "test-23",
    name: "Triangle",
    input: "\\triangle ABC",
    expectedLatex: "$\\triangle ABC$",
    category: "Tam giác"
  },
  {
    id: "test-24",
    name: "Congruent Triangles",
    input: "\\triangle ABC \\cong \\triangle DEF",
    expectedLatex: "$\\triangle ABC \\cong \\triangle DEF$",
    category: "Tam giác đồng dạng"
  },

  // ===== SETS =====
  {
    id: "test-25",
    name: "Set Subset",
    input: "A \\subset B",
    expectedLatex: "$A \\subset B$",
    category: "Tập con"
  },
  {
    id: "test-26",
    name: "Element of Set",
    input: "x \\in A",
    expectedLatex: "$x \\in A$",
    category: "Thuộc tập hợp"
  },
  {
    id: "test-27",
    name: "Not Element of Set",
    input: "x \\notin B",
    expectedLatex: "$x \\notin B$",
    category: "Không thuộc tập hợp"
  },
  {
    id: "test-28",
    name: "Set Union and Intersection",
    input: "A \\cup B, A \\cap B",
    expectedLatex: "$A \\cup B$, $A \\cap B$",
    category: "Hợp và giao"
  },

  // ===== GREEK LETTERS & SYMBOLS =====
  {
    id: "test-29",
    name: "Pi Symbol",
    input: "\\pi",
    expectedLatex: "$\\pi$",
    category: "Ký hiệu Pi"
  },
  {
    id: "test-30",
    name: "Greek Letters",
    input: "\\alpha, \\beta, \\gamma, \\theta, \\Delta",
    expectedLatex: "$\\alpha, \\beta, \\gamma, \\theta, \\Delta$",
    category: "Chữ Hy Lạp"
  },
  {
    id: "test-31",
    name: "Infinity",
    input: "\\infty",
    expectedLatex: "$\\infty$",
    category: "Vô cùng"
  },

  // ===== MIXED CONTENT =====
  {
    id: "test-32",
    name: "Mixed Text and Math (Inline)",
    input: "Cho $a=2$ và $b=3$. Tính $a+b$.",
    expectedLatex: "Cho $a=2$ và $b=3$. Tính $a+b$.",
    category: "Nội dung hỗn hợp inline"
  },
  {
    id: "test-33",
    name: "Mixed Text and Math (Block)",
    input: "Giải phương trình\n\n$$2x+3=7$$",
    expectedLatex: "Giải phương trình\n\n$$2x+3=7$$",
    category: "Nội dung hỗn hợp block"
  },
  {
    id: "test-34",
    name: "Multiple Inline Math",
    input: "Cho $x=2$, $y=3$, $z=5$. Tính $xyz$.",
    expectedLatex: "Cho $x=2$, $y=3$, $z=5$. Tính $xyz$.",
    category: "Nhiều công thức inline"
  },

  // ===== COMPLEX EXPRESSIONS =====
  {
    id: "test-35",
    name: "Complex Fraction",
    input: "\\frac{a^2 + b^2}{a + b}",
    expectedLatex: "$\\frac{a^2 + b^2}{a + b}$",
    category: "Phân số phức tạp"
  },
  {
    id: "test-36",
    name: "Nested Fraction",
    input: "\\frac{1}{1 + \\frac{1}{x}}",
    expectedLatex: "$\\frac{1}{1 + \\frac{1}{x}}$",
    category: "Phân số lồng nhau"
  },
  {
    id: "test-37",
    name: "Long Formula (Mobile Test)",
    input: "x^4 - 5x^3 + 8x^2 - 7x + 3 = 0",
    expectedLatex: "$x^4 - 5x^3 + 8x^2 - 7x + 3 = 0$",
    category: "Công thức dài (test mobile)"
  },

  // ===== PROPORTIONS =====
  {
    id: "test-38",
    name: "Proportion",
    input: "\\frac{x}{3} = \\frac{8}{6}",
    expectedLatex: "$\\frac{x}{3} = \\frac{8}{6}$",
    category: "Tỉ lệ thức"
  },
  {
    id: "test-39",
    name: "Chain of Proportions",
    input: "\\frac{a}{b} = \\frac{c}{d} = \\frac{e}{f}",
    expectedLatex: "$\\frac{a}{b} = \\frac{c}{d} = \\frac{e}{f}$",
    category: "Dãy tỉ số bằng nhau"
  },

  // ===== SPECIAL CASES =====
  {
    id: "test-40",
    name: "Empty String",
    input: "",
    expectedLatex: "(empty)",
    category: "Chuỗi rỗng"
  },
  {
    id: "test-41",
    name: "Plain Vietnamese Text (No Math)",
    input: "Đây là văn bản thuần túy không có công thức toán học.",
    expectedLatex: "Đây là văn bản thuần túy không có công thức toán học.",
    category: "Văn bản thuần"
  },
  {
    id: "test-42",
    name: "Number Only",
    input: "42",
    expectedLatex: "42",
    category: "Chỉ có số"
  }
];

/**
 * Test Component to visually verify all test cases
 * Usage: Import and render this component in a test page
 */
export const MathRendererTestPage: React.FC = () => {
  const categories = Array.from(new Set(MATH_TEST_CASES.map(tc => tc.category)));

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 bg-slate-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">MathRenderer Test Suite</h1>
        <p className="text-slate-600 text-sm">
          Comprehensive test cases for THCS (Vietnamese Middle School) math curriculum.
          Total: {MATH_TEST_CASES.length} test cases across {categories.length} categories.
        </p>
      </div>

      {categories.map(category => {
        const tests = MATH_TEST_CASES.filter(tc => tc.category === category);
        return (
          <div key={category} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
              {category} ({tests.length} tests)
            </h2>
            
            <div className="space-y-6">
              {tests.map(test => (
                <div key={test.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600">{test.id}</span>
                    <span className="text-xs font-semibold text-slate-700">{test.name}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-500 uppercase">Input:</div>
                    <div className="p-3 bg-slate-900 text-white rounded-lg font-mono text-xs overflow-x-auto">
                      {test.input || "(empty)"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-500 uppercase">Rendered Output:</div>
                    <div className="p-4 bg-white rounded-xl border border-indigo-200 text-base">
                      <MathRenderer content={test.input} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-emerald-900 mb-2">✅ Test Completion Criteria</h3>
        <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside">
          <li>All formulas render without errors</li>
          <li>No raw LaTeX displayed to users</li>
          <li>No plain text notation (x^2, 1/2, sqrt) visible</li>
          <li>Responsive on desktop, tablet, and mobile</li>
          <li>Long formulas scroll horizontally without breaking layout</li>
          <li>Mixed text and math render correctly</li>
          <li>Vietnamese text displays properly alongside math</li>
        </ul>
      </div>
    </div>
  );
};
