import React from "react";
import { UserRole } from "../../types";
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  Target,
  BrainCircuit,
  Trophy,
  Users,
  Database,
  UploadCloud,
  FileCheck2,
  BarChart3,
  ShieldAlert,
  Home
} from "lucide-react";

interface SidebarProps {
  currentRole: UserRole;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeView, onNavigate }) => {
  const renderStudentNav = () => (
    <>
      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trang Chính</div>
      <button
        onClick={() => onNavigate("dashboard")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "dashboard"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <LayoutDashboard className="w-4 h-4" /> Trang Chủ Student
      </button>

      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-4">Nội Dung Ôn Tập</div>
      <button
        onClick={() => onNavigate("learning")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "learning"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <BookOpen className="w-4 h-4" /> 📚 Chương & Bài Học
      </button>
      <button
        onClick={() => onNavigate("practice")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "practice"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <PenTool className="w-4 h-4" /> 📝 Luyện Tập & AI Sửa Lỗi
      </button>
      <button
        onClick={() => onNavigate("exam")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "exam"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Target className="w-4 h-4" /> 🎯 Kiểm Tra & Thi Thử
      </button>

      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-4">Phân Tích AI</div>
      <button
        onClick={() => onNavigate("profile_ai")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "profile_ai"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <BrainCircuit className="w-4 h-4" /> 🧠 AI Learning Profile
      </button>
      <button
        onClick={() => onNavigate("gamification")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "gamification"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Trophy className="w-4 h-4" /> 🏆 Bảng Vinh Danh (Top 5)
      </button>
    </>
  );

  const renderTeacherNav = () => (
    <>
      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Quan</div>
      <button
        onClick={() => onNavigate("teacher_dashboard")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "teacher_dashboard"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <LayoutDashboard className="w-4 h-4" /> Dashboard Giáo Viên
      </button>

      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-4">Quản Lý Lớp & Học Sinh</div>
      <button
        onClick={() => onNavigate("teacher_classes")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "teacher_classes"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Users className="w-4 h-4" /> 🏫 Danh Sách Lớp & Cấp TK
      </button>

      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-4">Tạo Đề & Nội Dung</div>
      <button
        onClick={() => onNavigate("learning")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "learning"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <BookOpen className="w-4 h-4" /> 📚 Chương & Bài Học
      </button>
      <button
        onClick={() => onNavigate("teacher_questions")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "teacher_questions"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Database className="w-4 h-4" /> 📝 Ngân Hàng Câu Hỏi
      </button>
      <button
        onClick={() => onNavigate("teacher_ai_docs")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "teacher_ai_docs"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <UploadCloud className="w-4 h-4" /> 🤖 AI Trích Xuất Tài Liệu
      </button>
      <button
        onClick={() => onNavigate("teacher_assignments")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "teacher_assignments"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <FileCheck2 className="w-4 h-4" /> 📤 Giao Bài & Hạn Nộp
      </button>

      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-4">Phân Tích & Báo Cáo</div>
      <button
        onClick={() => onNavigate("teacher_analytics")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "teacher_analytics"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <BarChart3 className="w-4 h-4" /> 📊 Báo Cáo Lớp Học
      </button>
      <button
        onClick={() => onNavigate("gamification")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "gamification"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Trophy className="w-4 h-4" /> 🏆 Bảng Vinh Danh
      </button>
    </>
  );

  const renderAdminNav = () => (
    <>
      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hệ Thống</div>
      <button
        onClick={() => onNavigate("admin_overview")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
          activeView === "admin_overview"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <ShieldAlert className="w-4 h-4" /> Quản Trị Hệ Thống & Roles
      </button>
    </>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:block min-h-[calc(100vh-4rem)] p-4 flex-col justify-between shrink-0">
      <div className="space-y-1">
        {/* Landing Home Link */}
        <button
          onClick={() => onNavigate("landing")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs mb-2 transition-colors ${
            activeView === "landing"
              ? "bg-slate-900 text-white font-semibold"
              : "text-slate-700 bg-slate-100 hover:bg-slate-200"
          }`}
        >
          <Home className="w-4 h-4 text-indigo-500" /> Trang Giới Thiệu (Landing)
        </button>

        {currentRole === "student" && renderStudentNav()}
        {currentRole === "teacher" && renderTeacherNav()}
        {currentRole === "admin" && renderAdminNav()}
      </div>

      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        EduMath AI &copy; 2026. Lớp 6 - 7 - 8.
      </div>
    </aside>
  );
};
