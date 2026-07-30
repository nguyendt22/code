import React from "react";
import { UserRole } from "../../types";
import { Sparkles, ArrowRight, CheckCircle2, BrainCircuit, Target, BookOpen, Users, BarChart3, ShieldCheck, Flame, Award, Lightbulb } from "lucide-react";

interface LandingPageProps {
  onSelectRole: (role: UserRole, targetView?: string) => void;
  onOpenDocModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole, onOpenDocModal }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Nền Tảng Luyện Tập Toán THCS Tích Hợp AI Trí Tuệ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display leading-tight text-white">
            Luyện tập đúng trọng tâm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              Hiểu lỗi sai – Tiến bộ theo cách của bạn
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Nền tảng hỗ trợ học sinh Lớp 6, 7, 8 ôn tập môn Toán, thi thử online và sử dụng AI để tự động phát hiện mẫu lỗi sai, xác định lỗ hổng kiến thức và đề xuất bài tập cá nhân hóa.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onSelectRole("student", "dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 text-sm"
            >
              <span>Vào Học Ngay (Học Sinh)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectRole("teacher", "teacher_dashboard")}
              className="px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all text-sm"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Dành Cho Giáo Viên</span>
            </button>

            <button
              onClick={onOpenDocModal}
              className="px-4 py-3 text-xs font-semibold text-indigo-300 hover:text-white underline underline-offset-4"
            >
              Xem Đặc Tả Kiến Trúc Hệ Thống
            </button>
          </div>
        </div>
      </section>

      {/* Core Learning Loop Visualization */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 font-display">Vòng Lặp Học Tập Cá Nhân Hóa Cốt Lõi</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Không chỉ chấm điểm trắc nghiệm suông, EduMath AI giúp học sinh tìm ra nguyên nhân cốt lõi gây sai sót.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { step: "1. HỌC", desc: "Ôn lại lý thuyết trọng tâm", icon: BookOpen, color: "text-blue-600 bg-blue-50 border-blue-200" },
            { step: "2. KIỂM TRA", desc: "Làm bài tập & Thi thử", icon: Target, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
            { step: "3. PHÂN TÍCH LỖI", desc: "AI chẩn đoán nguyên nhân", icon: BrainCircuit, color: "text-purple-600 bg-purple-50 border-purple-200" },
            { step: "4. ÔN LẠI", desc: "Đọc lại lý thuyết hổng", icon: Lightbulb, color: "text-amber-600 bg-amber-50 border-amber-200" },
            { step: "5. LUYỆN CÁ NHÂN", desc: "Làm bài tập tương tự", icon: Flame, color: "text-rose-600 bg-rose-50 border-rose-200" },
            { step: "6. TIẾN BỘ", desc: "Cập nhật Bản đồ năng lực", icon: Award, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border text-center space-y-2 ${item.color}`}>
              <item.icon className="w-6 h-6 mx-auto" />
              <div className="font-bold text-xs">{item.step}</div>
              <div className="text-[11px] text-slate-600 leading-tight">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights for Student and Teacher */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tính Năng Cho Học Sinh</h3>
            <p className="text-xs text-slate-500 mt-0.5">Trải nghiệm học tập Toán 6, 7, 8 sinh động & cá nhân hóa</p>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>AI Learning Profile:</strong> Đánh giá chi tiết năng lực Đại số, Hình học và Thống kê.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Phân tích mẫu lỗi tức thì:</strong> Chỉ ra nguyên nhân làm sai thay vì chỉ báo ❌.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Chế độ thi thử chuẩn:</strong> Đồng hồ đếm ngược, toàn màn hình, nộp bài tự động.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Gamification & Top 5 Vinh Danh:</strong> Tích lũy XP, Level, Chuỗi Streak bảo mật thứ hạng.</span>
            </li>
          </ul>
          <button
            onClick={() => onSelectRole("student", "dashboard")}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Trải Nghiệm Giao Diện Học Sinh
          </button>
        </div>

        {/* Teacher Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tính Năng Cho Giáo Viên</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tiết kiệm 80% thời gian tạo đề và phân tích kết quả học tập</p>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>Cấp tài khoản tự động:</strong> Upload danh sách Excel → Sinh username `HọTên_Lớp`.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>AI Trích xuất PDF/Word:</strong> Đọc tài liệu, trích kiến thức & tạo 8 dạng câu hỏi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>Cấu hình ẩn/hiện điểm:</strong> Tùy chọn cho phép học sinh xem điểm ngay sau khi thi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>Báo cáo mẫu lỗi lớp:</strong> AI tổng hợp học sinh yếu ở chủ đề nào để can thiệp kịp thời.</span>
            </li>
          </ul>
          <button
            onClick={() => onSelectRole("teacher", "teacher_dashboard")}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Trải Nghiệm Giao Diện Giáo Viên
          </button>
        </div>
      </section>
    </div>
  );
};
