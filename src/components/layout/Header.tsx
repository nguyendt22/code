import React, { useState } from "react";
import { UserRole, User } from "../../types";
import { Sparkles, Bell, Calendar, Flame, Award, BookOpen, Shield, GraduationCap, ChevronDown, FileCode2 } from "lucide-react";

interface HeaderProps {
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  onOpenDocModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onRoleSwitch, onOpenDocModal }) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "student":
        return "Học sinh (Lớp 7A1)";
      case "teacher":
        return "Giáo viên (Toán THCS)";
      case "admin":
        return "Quản trị viên";
      case "parent":
        return "Phụ huynh";
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "student":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "teacher":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "parent":
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight font-display">EduMath AI</span>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                THCS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Ôn tập Toán cá nhân hóa bằng AI</p>
          </div>
        </div>

        {/* Academic Year Indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>Năm học: <strong>2025 – 2026</strong></span>
        </div>

        {/* Action Controls & User Profile */}
        <div className="flex items-center gap-3">
          {/* Spec Doc Modal Trigger */}
          <button
            onClick={onOpenDocModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
            title="Xem Thiết Kế Hệ Thống & Phase 1 Roadmap"
          >
            <FileCode2 className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">Đặc Tả Architecture</span>
          </button>

          {/* Student Quick Stats (Streak / XP) */}
          {currentUser.role === "student" && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>6 Ngày</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>1,250 XP</span>
              </div>
            </div>
          )}

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${getRoleBadgeColor(
                currentUser.role
              )}`}
            >
              <span className="font-semibold">{getRoleLabel(currentUser.role)}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Chuyển Vai Trò Thử Nghiệm
                </div>
                <button
                  onClick={() => {
                    onRoleSwitch("student");
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    currentUser.role === "student" ? "font-bold text-emerald-600 bg-emerald-50/50" : "text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" /> Học Sinh (Nguyễn Minh An - 7A1)
                  </span>
                </button>
                <button
                  onClick={() => {
                    onRoleSwitch("teacher");
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    currentUser.role === "teacher" ? "font-bold text-indigo-600 bg-indigo-50/50" : "text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" /> Giáo Viên (Thầy Văn Toàn)
                  </span>
                </button>
                <button
                  onClick={() => {
                    onRoleSwitch("admin");
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    currentUser.role === "admin" ? "font-bold text-purple-600 bg-purple-50/50" : "text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" /> Quản Trị Viên (Admin)
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <img
            src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={currentUser.name}
            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
          />
        </div>
      </div>
    </header>
  );
};
