import React, { useState } from "react";
import { X, Layers, Database, Cpu, ShieldCheck, CheckCircle2, ChevronRight, FileText, UserCheck, Sparkles, BookOpen } from "lucide-react";

interface ArchitectureDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocModal: React.FC<ArchitectureDocModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"arch" | "flow" | "db" | "ai" | "phases">("arch");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/30 rounded-xl border border-indigo-400/30">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">EduMath AI — Kiến Trúc & Thiết Kế Sản Phẩm</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tài liệu Đặc Tả Hệ Thống & Lộ Trình Phát Triển (Phase 1 → Phase 8)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 border-b border-slate-200 flex overflow-x-auto px-6 gap-2">
          <button
            onClick={() => setActiveTab("arch")}
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "arch"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" /> Kiến Trúc Tổng Thể
          </button>
          <button
            onClick={() => setActiveTab("flow")}
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "flow"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-4 h-4" /> Luồng Người Dùng (User Flow)
          </button>
          <button
            onClick={() => setActiveTab("db")}
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "db"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Database className="w-4 h-4" /> Cơ Sở Dữ Liệu (Firestore)
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "ai"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Cpu className="w-4 h-4" /> Luồng AI Engine
          </button>
          <button
            onClick={() => setActiveTab("phases")}
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "phases"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Lộ Trình Lập Trình (Phases)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm leading-relaxed">
          {activeTab === "arch" && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl">
                <h3 className="font-bold text-indigo-900 text-base mb-1">🎯 Định Vị Cốt Lõi Sản Phẩm</h3>
                <p className="text-indigo-800">
                  <strong>EduMath AI</strong> không đơn thuần là website làm trắc nghiệm, mà là hệ sinh thái luyện tập Toán THCS (Lớp 6, 7, 8) khép kín theo chuỗi sư phạm:
                  <span className="block font-semibold mt-1 text-indigo-950">
                    HỌC → LUYỆN → KIỂM TRA → PHÂN TÍCH LỖI → XÁC ĐỊNH LỖ HỔNG → ÔN LẠI → LUYỆN TẬP CÁ NHÂN HÓA → ĐÁNH GIÁ TIẾN BỘ
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" /> Frontend Layer
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• React 19 + TypeScript + Vite</li>
                    <li>• Tailwind CSS + Motion (Animations)</li>
                    <li>• KaTeX (Render công thức toán LaTeX)</li>
                    <li>• Lucide Icons + Responsive Multi-view Shell</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" /> Backend & Data Layer
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• Express.js Server proxy API</li>
                    <li>• Cloud Firestore Schema Architecture</li>
                    <li>• Firebase Authentication & Role Access</li>
                    <li>• Phân tách Context theo Năm Học (2025-2026)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600" /> AI Engine Layer
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• Google Gemini API (2.5 Flash Server-side)</li>
                    <li>• OCR & PDF/Word Document Analyzer</li>
                    <li>• Error Pattern Diagnosis Engine</li>
                    <li>• Personalized Practice Recommendation</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "flow" && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Luồng Tương Tác Theo Vai Trò (User Flow)</h3>
              
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Luồng Học Sinh (Student Flow)
                </h4>
                <p className="text-xs text-emerald-800">
                  Đăng nhập (mật khẩu GV cấp) → Dashboard (Xem streak, XP, bài cần học) → Học theo Chương/Bài → Ôn lại trọng tâm → Làm bài tập/Mini-test → AI phân tích lỗi sai tức thì & gợi ý bài tương tự → Thi thử có bấm giờ → Bản đồ năng lực cá nhân.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> 2. Luồng Giáo Viên (Teacher Flow)
                </h4>
                <p className="text-xs text-blue-800">
                  Đăng nhập → Quản lý Lớp → Upload file Excel học sinh → Tự động tạo tài khoản (HọTên_Lớp) → Giao bài kiểm tra (bật/tắt xem điểm ngay) → Upload PDF bài giảng/đề thi → AI trích xuất câu hỏi & xem trước → Báo cáo lỗi sai phổ biến của lớp.
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <h4 className="font-bold text-amber-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" /> 3. Luồng Quản Trị Viên (Admin Flow)
                </h4>
                <p className="text-xs text-amber-800">
                  Quản lý năm học (`AcademicYears`), phân quyền roles (Admin/Teacher/Student/Parent), cấu hình tham số hệ thống & giám sát ngân hàng câu hỏi.
                </p>
              </div>
            </div>
          )}

          {activeTab === "db" && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Cấu Trúc Firestore Collections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 font-mono">
                  <strong className="text-indigo-600">users /</strong> {`{ id, name, username, role, classId, grade }`}
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 font-mono">
                  <strong className="text-indigo-600">academicYears /</strong> {`{ id, yearName, isCurrent, startDate }`}
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 font-mono">
                  <strong className="text-indigo-600">classes /</strong> {`{ id, name, grade, teacherId, studentCount }`}
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 font-mono">
                  <strong className="text-indigo-600">chapters /</strong> {`{ id, title, grade, semester, lessons[] }`}
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 font-mono">
                  <strong className="text-indigo-600">questions /</strong> {`{ id, text, type, options, correctAnswer, cognitiveLevel }`}
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 font-mono">
                  <strong className="text-indigo-600">learningProfiles /</strong> {`{ studentId, subjectAreas[], errorPatterns[], recommendations[] }`}
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 font-mono">
                  <strong className="text-indigo-600">exams /</strong> {`{ id, title, durationMinutes, showScoreImmediately, questions[] }`}
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 font-mono">
                  <strong className="text-indigo-600">examAttempts /</strong> {`{ id, examId, studentId, score, answers, aiSummaryReport }`}
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Chuỗi Xử Lý AI Chẩn Đoán Lỗi & Cá Nhân Hóa</h3>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
                  <span>Tài Liệu / Bài Làm</span>
                  <ChevronRight className="w-4 h-4" />
                  <span>AI Extractor</span>
                  <ChevronRight className="w-4 h-4" />
                  <span>Mẫu Lỗi (Error Pattern)</span>
                  <ChevronRight className="w-4 h-4" />
                  <span>Gợi Ý Ôn Tập</span>
                </div>
                <p className="text-xs text-purple-800">
                  Hệ thống ghi nhận thời gian làm bài, số lần thử lại, lựa chọn sai. Gemini API phân tích nguyên nhân nhầm lẫn (ví dụ: không đổi dấu khi chuyển tế, quên nhân chéo tỉ lệ thức) và đẩy trực tiếp vào <strong>AI Learning Profile</strong> của học sinh.
                </p>
              </div>
            </div>
          )}

          {activeTab === "phases" && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Lộ Trình Phát Triển 8 Phase</h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg font-semibold text-emerald-900 flex justify-between items-center">
                  <span>✅ PHASE 1 — FOUNDATION (Đang triển khai)</span>
                  <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">Hoàn Thành Shell & Modules</span>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">PHASE 2 — STUDENT LEARNING ENGINE (Dashboard, Chapter, Lesson, Practice)</div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">PHASE 3 — QUESTION BANK & MATH FORMULA ENGINE (8 loại câu hỏi, KaTeX)</div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">PHASE 4 — TEACHER PORTAL & EXCEL ACCOUNT PROVISIONING</div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">PHASE 5 — AI LEARNING PROFILE & DOC EXTRACTION</div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">PHASE 6 — FULLSCREEN EXAM SIMULATOR & TIME CONTROLS</div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">PHASE 7 — GAMIFICATION & TOP 5 LEADERBOARD PRIVACY</div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">PHASE 8 — ANALYTICS, REPORTS & EXCEL EXPORT</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-medium">Phiên bản: EduMath AI v1.0.0 (Phase 1 Ready)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Đóng Đặc Tả
          </button>
        </div>
      </div>
    </div>
  );
};
