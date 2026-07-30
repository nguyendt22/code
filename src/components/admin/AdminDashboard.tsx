import React, { useState } from "react";
import { AcademicYear } from "../../types";
import { MOCK_ACADEMIC_YEARS } from "../../data/mockData";
import { ShieldAlert, Calendar, Users, Database, Plus, CheckCircle2 } from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(MOCK_ACADEMIC_YEARS);

  const handleToggleCurrentYear = (yearId: string) => {
    setAcademicYears((prev) =>
      prev.map((ay) => ({
        ...ay,
        isCurrent: ay.id === yearId
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">🛡️ Quản Trị Hệ Thống & Cấu Hình Phân Quyền</h1>
          <p className="text-xs text-slate-500 mt-0.5">Quản lý ngữ cảnh Năm học (Academic Years), phân quyền Roles & giám sát cơ sở dữ liệu.</p>
        </div>
      </div>

      {/* Academic Year Context Management (Requirement 33) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Quản Lý Ngữ Cảnh Năm Học (Academic Years)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Dữ liệu phân tách theo từng năm học</span>
        </div>

        <p className="text-xs text-slate-600">
          Khi sang năm học mới, hệ thống tự động lưu trữ dữ liệu cũ và mở context năm học mới mà không bị xóa lịch sử bài làm của học sinh.
        </p>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {academicYears.map((ay) => (
            <div key={ay.id} className="p-4 flex items-center justify-between bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Năm học {ay.yearName}</span>
                  {ay.isCurrent && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đang Hoạt Động
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  Thời gian: {ay.startDate} đến {ay.endDate}
                </div>
              </div>

              <button
                onClick={() => handleToggleCurrentYear(ay.id)}
                disabled={ay.isCurrent}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  ay.isCurrent
                    ? "bg-slate-200 text-slate-500 cursor-default"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {ay.isCurrent ? "Đang chọn năm này" : "Đặt làm Năm Học Hiện Tại"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Role Access Architecture Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          <span>Kiến Trúc Phân Quyền Vai Trò (Role-Based Access Control - RBAC)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
            <strong className="text-emerald-900 font-bold block text-sm">Học sinh (Student)</strong>
            <p className="text-emerald-800">
              Chỉ được truy cập dữ liệu cá nhân, làm bài tập thuộc Lớp mình, xem top 5 vinh danh và bản đồ năng lực cá nhân.
            </p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
            <strong className="text-indigo-900 font-bold block text-sm">Giáo viên (Teacher)</strong>
            <p className="text-indigo-800">
              Quản lý các Lớp phụ trách, cấp tài khoản hàng loạt, tạo bài kiểm tra, cấu hình cho phép xem điểm, trích xuất PDF qua AI.
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
            <strong className="text-purple-900 font-bold block text-sm">Quản trị (Admin)</strong>
            <p className="text-purple-800">
              Toàn quyền cấu hình tham số hệ thống, chuyển đổi ngữ cảnh năm học, quản lý danh mục môn học và phân quyền.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
