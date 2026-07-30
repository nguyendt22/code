import React, { useEffect, useRef, useState } from "react";
import "mathlive";
import { MathRenderer } from "./MathRenderer";
import {
  Calculator,
  X,
  Check,
  RotateCcw,
  RotateCw,
  Trash2,
  Delete,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Type,
  Eye
} from "lucide-react";

// Augment React JSX IntrinsicElements for math-field
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "math-field": any;
      }
    }
  }
}

interface VisualMathEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  inline?: boolean;
  showKeyboardByDefault?: boolean;
}

export const VisualMathEditor: React.FC<VisualMathEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập văn bản có dấu cách hoặc chọn nút công thức Mathway...",
  className = "",
  label,
  inline = false,
  showKeyboardByDefault = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mathfieldRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(showKeyboardByDefault);
  const [editorMode, setEditorMode] = useState<"text" | "mathlive">("text");
  const [activeTab, setActiveTab] = useState<"struc" | "num" | "var" | "geom" | "sym">("struc");
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Sync value to mathfield if in mathlive mode
  useEffect(() => {
    if (editorMode === "mathlive" && mathfieldRef.current) {
      if (mathfieldRef.current.value !== value) {
        mathfieldRef.current.value = value || "";
      }
    }
  }, [value, editorMode]);

  // Insert LaTeX snippet into textarea at current cursor position
  const insertTextAtCursor = (textToInsert: string) => {
    if (editorMode === "mathlive" && mathfieldRef.current) {
      const mf = mathfieldRef.current;
      mf.focus();
      mf.insert(textToInsert, { format: "latex" });
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) {
      onChange((value || "") + textToInsert);
      return;
    }

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentValue = value || "";

    const newValue =
      currentValue.substring(0, startPos) +
      textToInsert +
      currentValue.substring(endPos, currentValue.length);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = startPos + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleClear = () => {
    onChange("");
    if (editorMode === "mathlive" && mathfieldRef.current) {
      mathfieldRef.current.value = "";
    }
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && <label className="text-xs font-bold text-slate-700 block mb-1">{label}</label>}

      {/* Main Input Box */}
      <div className="relative bg-white rounded-2xl border-2 border-slate-200 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 transition-all shadow-2xs">
        {editorMode === "text" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={inline ? 1 : 2}
            className="w-full p-3 pr-32 text-sm font-medium text-slate-900 bg-transparent resize-y min-h-[52px] focus:outline-none"
          />
        ) : (
          <div className="p-3 pr-32 min-h-[52px] flex items-center overflow-x-auto">
            <math-field
              ref={mathfieldRef}
              class="w-full text-slate-900 font-medium focus:outline-none min-w-[200px]"
              style={{
                fontSize: "1.1rem",
                background: "transparent",
                border: "none"
              }}
            >
              {value}
            </math-field>
          </div>
        )}

        {/* Action Buttons Bar inside top right */}
        <div className="absolute right-2 top-2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              title="Xóa hết"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setEditorMode(editorMode === "text" ? "mathlive" : "text")}
            title="Đổi chế độ nhập"
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-xl flex items-center gap-1 border border-slate-200 transition-colors"
          >
            <Type className="w-3.5 h-3.5 text-indigo-600" />
            <span>{editorMode === "text" ? "Văn bản + Math" : "MathLive"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs ${
              isOpen
                ? "bg-indigo-600 text-white shadow-indigo-200"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{isOpen ? "Ẩn Phím Mathway" : "Bàn Phím Mathway"}</span>
          </button>
        </div>
      </div>

      {/* Live KaTeX Render Preview */}
      {value.trim() && (
        <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-start gap-2 text-xs">
          <Eye className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1">
            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block">
              Xem Trước Công Thức & Văn Bản:
            </span>
            <div className="text-sm font-semibold text-slate-900">
              <MathRenderer content={value} />
            </div>
          </div>
        </div>
      )}

      {/* Mathway Structured Virtual Keyboard Panel */}
      {isOpen && (
        <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xs shadow-xs">
                ∑
              </div>
              <span className="font-extrabold text-xs text-indigo-200 font-display">
                Bàn Phím Nhập Công Thức Trực Quan Mathway (Toán THCS)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                title="Sao chép nội dung"
                className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px] font-bold"
              >
                {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSuccess ? "Đã chép" : "Copy"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Touch-Optimized Category Tabs */}
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-black scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("struc")}
              className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "struc"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>[1] Phân Số & Căn</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("num")}
              className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "num"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>[123] Số & Phép Tính</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("var")}
              className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "var"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>[x y z] Biến Số</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("geom")}
              className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "geom"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>[∠] Hình Học</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sym")}
              className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "sym"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>[⋯] Ký Hiệu</span>
            </button>
          </div>

          {/* TAB 1: Structured Math Operators (Fractions, Roots, Powers, Absolute, Systems) */}
          {activeTab === "struc" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              <button
                type="button"
                onClick={() => insertTextAtCursor("\\frac{a}{b}")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$\\frac{a}{b}$" />
                <span className="text-[10px] text-slate-400">Phân số</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("x^2")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$x^2 / x^n$" />
                <span className="text-[10px] text-slate-400">Số mũ</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("x_n")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$x_n$" />
                <span className="text-[10px] text-slate-400">Chỉ số dưới</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("\\sqrt{x}")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$\\sqrt{x}$" />
                <span className="text-[10px] text-slate-400">Căn bậc hai</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("\\sqrt[n]{x}")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$\\sqrt[n]{x}$" />
                <span className="text-[10px] text-slate-400">Căn bậc n</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("|x|")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$|x|$" />
                <span className="text-[10px] text-slate-400">Trị tuyệt đối</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("(x)")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$(x)$" />
                <span className="text-[10px] text-slate-400">Ngoặc tròn</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("[x]")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$[x]$" />
                <span className="text-[10px] text-slate-400">Ngoặc vuông</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("2\\frac{1}{3}")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$2\\frac{1}{3}$" />
                <span className="text-[10px] text-slate-400">Hỗn số</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("\\frac{x+1}{x-2}")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$\\frac{x+1}{x-2}$" />
                <span className="text-[10px] text-slate-400">Phân thức</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("25\\%")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$25\\%$" />
                <span className="text-[10px] text-slate-400">Phần trăm</span>
              </button>

              <button
                type="button"
                onClick={() => insertTextAtCursor("\\begin{cases} x+y=5 \\\\ 2x-y=1 \\end{cases}")}
                className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold"
              >
                <MathRenderer content="$\\begin{cases} x+y=5 \\\\ 2x-y=1 \\end{cases}$" />
                <span className="text-[10px] text-slate-400">Hệ PT</span>
              </button>
            </div>
          )}

          {/* TAB 2: Numbers & Basic Operations */}
          {activeTab === "num" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Keypad 1-9 Grid */}
              <div className="grid grid-cols-3 gap-2">
                {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "="].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => insertTextAtCursor(btn)}
                    className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80 transition-all"
                  >
                    {btn}
                  </button>
                ))}
              </div>

              {/* Basic Operations */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => insertTextAtCursor("+")}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor("-")}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor(" \\times ")}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80"
                >
                  ×
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor(" \\div ")}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80"
                >
                  ÷
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor(" \\neq ")}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80"
                >
                  ≠
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor(" < ")}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor(" > ")}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80"
                >
                  &gt;
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor(" \\le ")}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80"
                >
                  ≤
                </button>
                <button
                  type="button"
                  onClick={() => insertTextAtCursor(" \\ge ")}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white font-extrabold text-base rounded-2xl border border-slate-700/80"
                >
                  ≥
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Variables & Greek */}
          {activeTab === "var" && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400">Biến số thường gặp:</div>
              <div className="grid grid-cols-6 gap-2">
                {["x", "y", "z", "a", "b", "c", "m", "n", "k", "A", "B", "C", "X", "Y", "Z"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertTextAtCursor(v)}
                    className="p-2.5 bg-slate-800 hover:bg-indigo-600 text-amber-300 font-extrabold font-serif text-base rounded-2xl border border-slate-700/80 transition-all"
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-bold text-slate-400 pt-1">Hằng số & Ký hiệu Hy Lạp:</div>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { name: "\\pi", label: "π" },
                  { name: "\\alpha", label: "α" },
                  { name: "\\beta", label: "β" },
                  { name: "\\gamma", label: "γ" },
                  { name: "\\theta", label: "θ" },
                  { name: "\\Delta", label: "Δ" }
                ].map((g) => (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => insertTextAtCursor(g.name)}
                    className="p-2.5 bg-slate-800 hover:bg-indigo-600 text-indigo-200 font-bold text-base rounded-2xl border border-slate-700/80"
                  >
                    <MathRenderer content={`$${g.label}$`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Geometry Symbols */}
          {activeTab === "geom" && (
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {[
                { name: "\\widehat{A}", label: "Góc A" },
                { name: " \\perp ", label: "Vuông góc" },
                { name: " \\parallel ", label: "Song song" },
                { name: "\\triangle ABC", label: "Tam giác ABC" },
                { name: "^\\circ", label: "Độ (°)" },
                { name: " \\cong ", label: "Bằng nhau (≅)" },
                { name: " \\sim ", label: "Đồng dạng (~)" }
              ].map((gItem, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => insertTextAtCursor(gItem.name)}
                  className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 flex flex-col items-center justify-center gap-1"
                >
                  <MathRenderer content={`$${gItem.name}$`} />
                  <span className="text-[10px] text-slate-400 font-bold">{gItem.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* TAB 5: Math Sets & General Symbols */}
          {activeTab === "sym" && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { name: " \\in ", label: "Thuộc (∈)" },
                { name: " \\notin ", label: "Không thuộc (∉)" },
                { name: " \\subset ", label: "Tập con (⊂)" },
                { name: " \\subseteq ", label: "Con hoặc bằng (⊆)" },
                { name: " \\cup ", label: "Hợp (∪)" },
                { name: " \\cap ", label: "Giao (∩)" },
                { name: "\\infty", label: "Vô cùng (∞)" },
                { name: "\\mathbb{R}", label: "Số thực R" },
                { name: "\\mathbb{Q}", label: "Hữu tỉ Q" },
                { name: "\\mathbb{Z}", label: "Số nguyên Z" },
                { name: "\\mathbb{N}", label: "Tự nhiên N" }
              ].map((sItem, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => insertTextAtCursor(sItem.name)}
                  className="p-2.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700/80 flex flex-col items-center justify-center gap-1"
                >
                  <MathRenderer content={`$${sItem.name}$`} />
                  <span className="text-[9px] text-slate-400 font-bold">{sItem.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Controls Bottom Bar */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">
              💡 Gõ tiếng Việt có dấu cách bình thường và nhấn các nút trên để chèn công thức Toán.
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Hoàn Tất Nhập</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
