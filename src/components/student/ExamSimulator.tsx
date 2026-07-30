import React, { useState, useEffect } from "react";
import { Exam, Question } from "../../types";
import { MOCK_EXAMS } from "../../data/mockData";
import { MathRenderer } from "../common/MathRenderer";
import { MathInputKeypad } from "../common/MathInputKeypad";
import { checkMathEquivalence } from "../../utils/mathEquivalence";
import { Timer, CheckCircle2, XCircle, AlertCircle, ArrowLeft, Send, Sparkles, Lock, FileText, HelpCircle, Check, HelpCircle as QuestionIcon } from "lucide-react";

interface ExamSimulatorProps {
  onBack: () => void;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({ onBack }) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);

  // Timer countdown hook
  useEffect(() => {
    let interval: any = null;
    if (isExamStarted && !isSubmitted && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamStarted, isSubmitted, timeLeftSeconds]);

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setUserAnswers({});
    setActiveQuestionIndex(0);
    setIsExamStarted(true);
    setIsSubmitted(false);
    setExamResult(null);
  };

  const handleSelectOption = (questionId: string, answerVal: any) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerVal }));
  };

  const handleFinalSubmit = () => {
    if (!selectedExam) return;

    let correctCount = 0;
    selectedExam.questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (q.type === "mcq4" && ans === q.correctAnswer) correctCount++;
      else if (q.type === "true_false") {
        const ansStr = String(ans || "").trim().toLowerCase();
        const corrStr = String(q.correctAnswer || "").trim().toLowerCase();
        if (
          ansStr === corrStr ||
          (ansStr === "đúng" && (corrStr === "true" || corrStr === "1")) ||
          (ansStr === "sai" && (corrStr === "false" || corrStr === "0"))
        ) {
          correctCount++;
        }
      }
      else if (q.type === "short_answer") {
        const eqRes = checkMathEquivalence(String(ans || ""), String(q.correctAnswer || ""));
        if (eqRes.isEquivalent) correctCount++;
      }
      else if (q.type === "essay" && ans) correctCount++;
    });

    const totalQ = selectedExam.questions.length;
    const score = Math.round((correctCount / totalQ) * 10 * 10) / 10;

    setExamResult({
      score,
      correctCount,
      totalQ,
      showScoreImmediately: selectedExam.showScoreImmediately
    });

    setIsSubmitted(true);
    setShowConfirmModal(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Exam Selection Screen
  if (!selectedExam || !isExamStarted) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-display">🎯 Danh Sách Kỳ Kiểm Tra & Thi Thử</h1>
            <p className="text-xs text-slate-500 mt-0.5">Chọn bài kiểm tra được giáo viên giao để làm bài trực tuyến có đếm ngược thời gian.</p>
          </div>
          <button
            onClick={onBack}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Quay Lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_EXAMS.map((exam) => (
            <div key={exam.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100">
                    Toán {exam.grade} • {exam.durationMinutes} Phút
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Hạn nộp: 10/08/2026</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{exam.title}</h3>
                <p className="text-xs text-slate-600">{exam.description}</p>
                <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                  <span>• Số câu: <strong>{exam.questions.length} câu</strong></span>
                  <span>• Cấu hình điểm: <strong>{exam.showScoreImmediately ? "Xem ngay sau khi nộp" : "Chờ GV công bố"}</strong></span>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Timer className="w-4 h-4" /> BẮT ĐẦU LÀM BÀI THI
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Submitted Screen
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 font-display">Đã Nộp Bài Thi Thành Công!</h2>
            <p className="text-xs text-slate-500">{selectedExam.title}</p>
          </div>

          {/* Teacher Score Visibility Check */}
          {examResult.showScoreImmediately ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-4xl font-extrabold text-indigo-600 font-display">
                {examResult.score} <span className="text-base font-medium text-slate-500">/ 10 điểm</span>
              </div>
              <p className="text-xs text-slate-600">
                Bạn đã làm đúng <strong>{examResult.correctCount}</strong> / {examResult.totalQ} câu hỏi.
              </p>
              <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200 text-left space-y-1">
                <div className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> AI Đánh Giá Tổng Quan:
                </div>
                <p className="text-xs text-indigo-950">
                  Bạn làm tốt phần câu hỏi Nhận biết và Tỉ lệ thức, nhưng cần chú ý kiểm tra quy tắc dấu ở bài toán Số hữu tỉ.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
              <div className="font-bold text-sm flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-amber-700" /> Điểm Số Đang Được Báo Bảo Mật
              </div>
              <p className="text-xs text-amber-800">
                Giáo viên đã cài đặt chế độ bảo mật kết quả. Điểm số và đáp án sẽ được công bố chính thức sau khi toàn bộ học sinh lớp hoàn thành bài thi.
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setIsExamStarted(false);
              setSelectedExam(null);
            }}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Quay Về Danh Sách Bài Thi
          </button>
        </div>
      </div>
    );
  }

  const currentQ = selectedExam.questions[activeQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Top Fixed Bar with Timer */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold">{selectedExam.title}</h2>
          <span className="text-xs text-slate-400">Đang thi trực tuyến</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-amber-400 font-mono font-bold text-lg">
          <Timer className="w-5 h-5 text-amber-400 animate-pulse" />
          <span>{formatTimer(timeLeftSeconds)}</span>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" /> NỘP BÀI THI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Workspace */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-xs text-indigo-600">
                Câu {activeQuestionIndex + 1} / {selectedExam.questions.length} ({currentQ.cognitiveLevel})
              </span>
              <span className="text-xs text-slate-400">Toán 7</span>
            </div>

            <div className="text-sm font-semibold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <MathRenderer content={currentQ.text} />
            </div>

            {/* Answer Selector */}
            {currentQ.type === "mcq4" && currentQ.options && (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      userAnswers[currentQ.id] === idx
                        ? "bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20 font-bold"
                        : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <MathRenderer content={opt} />
                    {userAnswers[currentQ.id] === idx && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* True / False Option Selection Boxes */}
            {currentQ.type === "true_false" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Chọn phát biểu Đúng hoặc Sai:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, "Đúng")}
                    className={`p-4 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all ${
                      userAnswers[currentQ.id] === "Đúng"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200 text-emerald-800 hover:bg-emerald-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${userAnswers[currentQ.id] === "Đúng" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-extrabold block">ĐÚNG</span>
                        <span className={`text-[10px] ${userAnswers[currentQ.id] === "Đúng" ? "text-emerald-100" : "text-emerald-600"}`}>Khẳng định chính xác</span>
                      </div>
                    </div>
                    {userAnswers[currentQ.id] === "Đúng" && (
                      <span className="text-[11px] bg-white text-emerald-900 font-extrabold px-2.5 py-1 rounded-lg shadow-xs">
                        ✓ Đã Chọn
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, "Sai")}
                    className={`p-4 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all ${
                      userAnswers[currentQ.id] === "Sai"
                        ? "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/20"
                        : "bg-white border-slate-200 text-rose-800 hover:bg-rose-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${userAnswers[currentQ.id] === "Sai" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"}`}>
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-extrabold block">SAI</span>
                        <span className={`text-[10px] ${userAnswers[currentQ.id] === "Sai" ? "text-rose-100" : "text-rose-600"}`}>Khẳng định không chính xác</span>
                      </div>
                    </div>
                    {userAnswers[currentQ.id] === "Sai" && (
                      <span className="text-[11px] bg-white text-rose-900 font-extrabold px-2.5 py-1 rounded-lg shadow-xs">
                        ✓ Đã Chọn
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Short Answer Input with Visual Illustration & Math Helpers */}
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
                  value={userAnswers[currentQ.id] || ""}
                  onChange={(val) => handleSelectOption(currentQ.id, val)}
                  placeholder="Nhập kết quả số hoặc biểu thức toán (VD: 9, -1/4, \sqrt{3})..."
                  label="Nhập Kết Quả Của Bạn (Kèm Bàn Phím Mathway):"
                />

              </div>
            )}
          </div>
        </div>

        {/* Question Status Grid Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-fit">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Bảng Trạng Thái Câu</h3>

          <div className="grid grid-cols-5 gap-2">
            {selectedExam.questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== "";
              const isSelected = activeQuestionIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveQuestionIndex(idx)}
                  className={`h-9 rounded-lg font-bold text-xs transition-all flex items-center justify-center ${
                    isSelected
                      ? "ring-2 ring-indigo-600 font-extrabold bg-indigo-600 text-white"
                      : isAnswered
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {(idx + 1).toString().padStart(2, "0")}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span>Đã trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100" />
              <span>Chưa làm</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-600" />
              <span>Đang chọn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Xác Nhận Nộp Bài Thi</h3>
                <p className="text-xs text-slate-500">
                  Đã trả lời <strong>{Object.keys(userAnswers).length}</strong> / {selectedExam.questions.length} câu.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn nộp bài thi ngay bây giờ không? Sau khi nộp, bài thi sẽ được lưu vào hệ thống.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Làm Tiếp
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Xác Nhận Nộp Bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
