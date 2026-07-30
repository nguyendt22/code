import React from "react";
import { StudentLearningProfile } from "../../types";
import { Flame, Award, ArrowRight, AlertTriangle, BookOpen, Target, BrainCircuit, Trophy, CheckCircle2, Play } from "lucide-react";

interface StudentDashboardProps {
  profile: StudentLearningProfile;
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ profile, onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display">👋 Chào {profile.studentName}!</h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Lớp 7A1
            </span>
          </div>
          <p className="text-xs text-indigo-200 mt-1">Hôm nay là ngày tuyệt vời để luyện tập và chinh phục thêm +50 XP môn Toán!</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-base">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{profile.streaksCount}</span>
            </div>
            <div className="text-[10px] text-indigo-200 uppercase font-medium">Chuỗi Streak</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1 text-indigo-300 font-bold text-base">
              <Award className="w-4 h-4" />
              <span>{profile.xpPoints}</span>
            </div>
            <div className="text-[10px] text-indigo-200 uppercase font-medium">Cấp Độ {profile.level}</div>
          </div>
        </div>
      </div>

      {/* Continuation & Critical Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tiếp Tục Học Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">ĐANG HỌC DỞ</span>
              <span className="text-xs font-bold text-slate-500">Tiến độ: 70%</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Toán 7 – Chương I: Bài 2. Phép chia số hữu tỉ</h3>
            <p className="text-xs text-slate-500">Đã hoàn thành 14/20 câu luyện tập bài học.</p>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-600 h-2 rounded-full w-[70%]" />
            </div>
          </div>
          <button
            onClick={() => onNavigate("practice")}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4 fill-white" /> TIẾP TỤC HỌC
          </button>
        </div>

        {/* Cần Ôn Lại Card */}
        <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> AI PHÁT HIỆN CẦN ÔN NGAY
              </span>
              <span className="text-xs font-bold text-rose-600">Sai 4 lần gần đây</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Củng cố Quy Tắc Dấu Trong Chia Phân Số Âm</h3>
            <p className="text-xs text-slate-600">
              AI nhận thấy bạn thường nhầm lẫn dấu khi thực hiện phép chia phân số âm hoặc quên đảo ngược số chia.
            </p>
          </div>
          <button
            onClick={() => onNavigate("practice")}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>ÔN NGAY BÀI NÀY (5 PHÚT)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Shortcuts Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Khu Vực Học Tập Chính</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate("learning")}
            className="p-4 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-sm">📚 Chương & Bài</div>
            <p className="text-[11px] text-slate-500">Xem lý thuyết trọng tâm SGK</p>
          </button>

          <button
            onClick={() => onNavigate("practice")}
            className="p-4 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition-all space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-sm">📝 Luyện Tập Từng Bài</div>
            <p className="text-[11px] text-slate-500">Luyện câu hỏi có AI giải thích</p>
          </button>

          <button
            onClick={() => onNavigate("exam")}
            className="p-4 bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 rounded-2xl text-left transition-all space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-sm">🎯 Kiểm Tra & Thi Thử</div>
            <p className="text-[11px] text-slate-500">Làm đề thi bấm giờ thực tế</p>
          </button>

          <button
            onClick={() => onNavigate("profile_ai")}
            className="p-4 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-2xl text-left transition-all space-y-2 group shadow-xs"
          >
            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 text-sm">🧠 AI Learning Profile</div>
            <p className="text-[11px] text-slate-500">Xem bản đồ năng lực & lỗi sai</p>
          </button>
        </div>
      </div>
    </div>
  );
};
