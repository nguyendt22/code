/**
 * Quick Math Test - Minimal test to verify MathRenderer works
 * Add this to your app temporarily to test
 */

import React from "react";
import { MathRenderer } from "../common/MathRenderer";

export const QuickMathTest: React.FC = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Quick Math Renderer Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-500 mb-2">Test 1: Fraction</div>
          <div className="text-lg">
            <MathRenderer content="Kết quả của phép tính $\frac{-3}{4} + \frac{1}{2}$ là:" />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-500 mb-2">Test 2: Options with Math</div>
          <div className="space-y-2">
            {["A. $\\frac{-1}{4}$", "B. $\\frac{-2}{6}$", "C. $\\frac{1}{4}$", "D. $\\frac{-5}{4}$"].map((opt, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-slate-300">
                <MathRenderer content={opt} />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-500 mb-2">Test 3: Plain text conversion</div>
          <div className="text-lg">
            <MathRenderer content="(x+1)/(x-2)" />
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="text-sm font-bold text-emerald-900">
            ✅ If you see proper fractions above (not -3/4 or \frac), MathRenderer works!
          </div>
        </div>
      </div>
    </div>
  );
};
