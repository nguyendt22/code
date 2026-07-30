/**
 * Math Test Page - Interactive Testing Interface
 * 
 * Usage: Add this route temporarily to test all math rendering capabilities
 * Access via: /test/math
 */

import React, { useState } from "react";
import { MathRenderer } from "../common/MathRenderer";
import { MATH_TEST_CASES } from "../common/MathRenderer.test";
import { Check, X, AlertCircle, BookOpen, TestTube } from "lucide-react";

export const MathTestPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");
  
  const categories = Array.from(new Set(MATH_TEST_CASES.map(tc => tc.category)));
  const filteredTests = selectedCategory 
    ? MATH_TEST_CASES.filter(tc => tc.category === selectedCategory)
    : MATH_TEST_CASES;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <TestTube className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 font-display">
                Math Rendering Test Suite
              </h1>
              <p className="text-slate-600 mt-1">
                Comprehensive testing for THCS (Vietnamese Middle School) math curriculum rendering
              </p>
              <div className="flex flex-wrap gap-3 mt-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">
                    {MATH_TEST_CASES.length} Test Cases
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-indigo-900">
                    {categories.length} Categories
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-amber-900">
                    KaTeX Powered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Input Tester */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>🧪 Live Math Input Tester</span>
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Nhập công thức của bạn (LaTeX, text, hoặc mixed):
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Ví dụ: Giải phương trình $x^2 + 2x + 1 = 0$ hoặc (x+1)/(x-2)"
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-mono text-sm resize-y min-h-[100px]"
              />
            </div>
            
            {customInput && (
              <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl border-2 border-indigo-200">
                <div className="text-xs font-bold text-indigo-900 uppercase mb-2 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Rendered Output:</span>
                </div>
                <div className="bg-white p-4 rounded-lg text-base border border-indigo-200">
                  <MathRenderer content={customInput} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase mb-3">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === null
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All ({MATH_TEST_CASES.length})
            </button>
            {categories.map(cat => {
              const count = MATH_TEST_CASES.filter(tc => tc.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Test Cases */}
        <div className="space-y-4">
          {filteredTests.map(test => (
            <div key={test.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Test Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-600 rounded-lg text-xs font-bold">
                    {test.id}
                  </span>
                  <h3 className="font-bold text-sm">{test.name}</h3>
                </div>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-lg font-semibold">
                  {test.category}
                </span>
              </div>

              <div className="p-6 space-y-4">
                {/* Input Code */}
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2">Input Code:</div>
                  <div className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-sm overflow-x-auto border border-slate-700">
                    {test.input || "(empty)"}
                  </div>
                </div>

                {/* Rendered Output */}
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2">Rendered Output:</div>
                  <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-white rounded-xl border-2 border-indigo-100 text-lg min-h-[80px] flex items-center justify-center">
                    {test.input ? (
                      <MathRenderer content={test.input} />
                    ) : (
                      <span className="text-slate-400 text-sm italic">(empty input)</span>
                    )}
                  </div>
                </div>

                {/* Expected LaTeX */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                  <span className="font-bold text-amber-900">Expected LaTeX: </span>
                  <code className="text-amber-800 font-mono">{test.expectedLatex}</code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Criteria */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
            <Check className="w-5 h-5" />
            ✅ Test Success Criteria
          </h3>
          <ul className="space-y-2 text-sm text-emerald-800">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>All math formulas render without errors or fallback text</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>No raw LaTeX code displayed to users (e.g., no visible <code>\frac</code>, <code>\sqrt</code>)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>No plain-text math notation visible (e.g., <code>x^2</code>, <code>1/2</code>, <code>sqrt(x)</code>)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Formulas display professionally like textbook quality</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Long formulas scroll horizontally without breaking layout</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Mixed text and math render correctly inline</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Vietnamese text displays properly alongside math</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Responsive on desktop, tablet, and mobile devices</span>
            </li>
          </ul>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 text-center">
          <p className="text-sm opacity-80">
            Math Rendering powered by <strong className="text-indigo-400">KaTeX</strong> • 
            EduMath AI Platform • Version 1.0
          </p>
        </div>

      </div>
    </div>
  );
};
