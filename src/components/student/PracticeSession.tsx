import React, { useState } from "react";
import { Question } from "../../types";
import { MOCK_QUESTIONS } from "../../data/mockData";
import { MathRenderer } from "../common/MathRenderer";
import { MathInputKeypad } from "../common/MathInputKeypad";
import { checkMathEquivalence } from "../../utils/mathEquivalence";
import { CheckCircle2, XCircle, Sparkles, Lightbulb, ArrowRight, RefreshCw, AlertCircle, BookOpen } from "lucide-react";


interface PracticeSessionProps {
  lessonId?: string;
  lessonTitle?: string;
  onFinish?: () => void;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({
  lessonId,
  lessonTitle = "Luyện Tập Số Hữu Tỉ & Phép Tính",
  onFinish
}) => {
  const questions: Question[] = MOCK_QUESTIONS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [shortAnswerText, setShortAnswerText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [equivalenceFeedback, setEquivalenceFeedback] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (isSubmitted) return;

    let correct = false;
    let answerVal = selectedOption;

    if (currentQ.type === "mcq4") {
      correct = selectedOption === currentQ.correctAnswer;
    } else if (currentQ.type === "true_false") {
      correct = selectedOption === currentQ.correctAnswer;
    } else if (currentQ.type === "short_answer") {
      answerVal = shortAnswerText.trim();
      // Use symbolic math equivalence checker!
      const eqResult = checkMathEquivalence(answerVal, String(currentQ.correctAnswer));
      correct = eqResult.isEquivalent;
      setEquivalenceFeedback(eqResult.feedback);
    } else {
      correct = true;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setXpEarned((prev) => prev + 15);
    } else {
      // Trigger AI Server Error Pattern Diagnosis
      setIsLoadingAi(true);
      try {
        const res = await fetch("/api/ai/analyze-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionText: currentQ.text,
            studentAnswer: String(answerVal),
            correctAnswer: String(currentQ.correctAnswer),
            topicName: currentQ.topicName
          })
        });
        const data = await res.json();
        if (data.success) {
          setAiAnalysis(data.analysis);
        }
      } catch (err) {
        console.error("Failed to analyze error", err);
      } finally {
        setIsLoadingAi(false);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShortAnswerText("");
      setIsSubmitted(false);
      setIsCorrect(false);
      setAiAnalysis(null);
    } else {
      if (onFinish) onFinish();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Session Progress Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Bài Luyện Tập</span>
          <h2 className="text-base font-bold text-slate-900">{lessonTitle}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-500">
            Câu <strong>{currentIndex + 1}</strong> / {questions.length}
          </span>
          <div className="text-xs font-bold text-emerald-600 mt-0.5">+{xpEarned} XP Đạt Được</div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Question Metadata & Cognitive Level */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            {currentQ.cognitiveLevel} • {currentQ.difficulty}
          </span>
          <span className="text-xs text-slate-500">{currentQ.chapterName}</span>
        </div>

        {/* Question Text */}
        <div className="text-base font-bold text-slate-900 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <MathRenderer content={currentQ.text} />
        </div>

        {/* Answer Options according to type */}
        <div className="space-y-3">
          {currentQ.type === "mcq4" && currentQ.options && (
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    selectedOption === idx
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20"
                      : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <MathRenderer content={opt} />
                  {selectedOption === idx && <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">✓</div>}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === "true_false" && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Chọn phát biểu Đúng hoặc Sai:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption("Đúng")}
                  className={`p-4 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all ${
                    selectedOption === "Đúng"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                      : "bg-white border-slate-200 text-emerald-800 hover:bg-emerald-50/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedOption === "Đúng" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-extrabold block">ĐÚNG</span>
                      <span className={`text-[10px] ${selectedOption === "Đúng" ? "text-emerald-100" : "text-emerald-600"}`}>Khẳng định chính xác</span>
                    </div>
                  </div>
                  {selectedOption === "Đúng" && (
                    <span className="text-[11px] bg-white text-emerald-900 font-extrabold px-2.5 py-1 rounded-lg shadow-xs">
                      ✓ Đã Chọn
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption("Sai")}
                  className={`p-4 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all ${
                    selectedOption === "Sai"
                      ? "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/20"
                      : "bg-white border-slate-200 text-rose-800 hover:bg-rose-50/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedOption === "Sai" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"}`}>
                      <XCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-extrabold block">SAI</span>
                      <span className={`text-[10px] ${selectedOption === "Sai" ? "text-rose-100" : "text-rose-600"}`}>Khẳng định không chính xác</span>
                    </div>
                  </div>
                  {selectedOption === "Sai" && (
                    <span className="text-[11px] bg-white text-rose-900 font-extrabold px-2.5 py-1 rounded-lg shadow-xs">
                      ✓ Đã Chọn
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {currentQ.type === "short_answer" && (
            <div className="space-y-4">
              {/* Visual Diagram Illustration Card */}
              <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Minh Họa Trực Quan & Sơ Đồ Bài Toán:</span>
                  </span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
                    Dạng Trả Lời Ngắn
                  </span>
                </div>

                {/* Graphic Illustration */}
                <div className="bg-white p-3.5 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center gap-4 text-xs">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl flex flex-col items-center justify-center shadow-xs text-center shrink-0 p-2">
                    <span className="text-[10px] uppercase font-bold opacity-80">Mô Hình</span>
                    <span className="text-lg font-extrabold font-mono">$\sqrt{81}$</span>
                    <span className="text-[9px] opacity-90">$a^2 = 81$</span>
                  </div>

                  <div className="space-y-1 text-slate-700 text-left">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                      <span>📐 Sơ đồ minh họa giá trị cần tìm:</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Cho bài toán tính hoặc tìm $x$. Điền duy nhất giá trị kết quả hoặc phân số rút gọn vào ô bên dưới.
                    </p>
                    <div className="text-[11px] text-indigo-800 font-semibold flex items-center gap-1 pt-0.5">
                      <span>Minh họa cú pháp hợp lệ:</span>
                      <code className="bg-slate-100 text-indigo-900 px-1.5 py-0.5 rounded font-mono font-bold">9</code>
                      <span>hoặc</span>
                      <code className="bg-slate-100 text-indigo-900 px-1.5 py-0.5 rounded font-mono font-bold">-1/4</code>
                      <span>hoặc</span>
                      <code className="bg-slate-100 text-indigo-900 px-1.5 py-0.5 rounded font-mono font-bold">1.5</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mathway Keypad Input */}
              <MathInputKeypad
                value={shortAnswerText}
                onChange={(val) => setShortAnswerText(val)}
                placeholder="Nhập kết quả số hoặc biểu thức toán (VD: 9, -1/4)..."
                label="Nhập Kết Quả Của Bạn (Kèm Bàn Phím Mathway):"
              />

            </div>
          )}
        </div>

        {/* Submit or Next Button */}
        {!isSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null && !shortAnswerText.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            Kiểm Tra Đáp Án
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Correct Feedback */}
            {isCorrect ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>🎉 Chính xác! Bạn nhận được +15 XP</span>
                </div>
                <div className="text-xs text-emerald-800">
                  <strong>Giải thích chi tiết:</strong> <MathRenderer content={currentQ.explanation} />
                </div>
              </div>
            ) : (
              /* Incorrect Feedback + Pedagogical AI Breakdown */
              <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>❌ Chưa chính xác</span>
                  </div>
                  <span className="text-[11px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
                    Cập nhật AI Profile
                  </span>
                </div>

                {isLoadingAi ? (
                  <div className="flex items-center gap-2 text-xs text-rose-700">
                    <RefreshCw className="w-4 h-4 animate-spin text-rose-600" />
                    <span>AI đang phân tích mẫu lỗi và chuẩn bị gợi ý sư phạm...</span>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs text-slate-800">
                    {/* Root Cause Diagnosis */}
                    <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                      <div className="font-bold text-rose-900 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Bạn đang nhầm lẫn:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {aiAnalysis?.rootCause || "Nhầm lẫn quy tắc dấu hoặc đảo ngược phân số trong phép tính."}
                      </p>
                    </div>

                    {/* Hint & Knowledge link */}
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>💡 Gợi ý & Lý thuyết liên quan:</span>
                      </div>
                      <p className="text-amber-950">
                        <MathRenderer content={currentQ.explanation} />
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>{currentIndex < questions.length - 1 ? "Câu Hỏi Tiếp Theo" : "Hoàn Thành Bài Luyện Tập"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
