import React, { useState, useEffect } from "react";
import { SchoolClass, Exam } from "../../types";
import { Users, FileText, AlertTriangle, UploadCloud, Plus, ArrowRight, BarChart3, CheckCircle2, FileEdit } from "lucide-react";
import { getTeacherClasses, TeacherClassItem } from "../../data/teacherClassStore";
import { getTeacherStudents, normalizeClassName, TeacherStudent } from "../../data/teacherStudentStore";
import { ExamCreator } from "./ExamCreator";

interface TeacherDashboardProps {
  onNavigate: (view: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const [teacherClasses, setTeacherClasses] = useState<TeacherClassItem[]>(() => getTeacherClasses());
  const [teacherStudents, setTeacherStudents] = useState<TeacherStudent[]>(() => getTeacherStudents());
  const [showExamCreator, setShowExamCreator] = useState(false);
  const [createdExams, setCreatedExams] = useState<Exam[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
      setTeacherClasses(getTeacherClasses());
      setTeacherStudents(getTeacherStudents());
    };
    window.addEventListener("teacher_classes_updated", handleUpdate);
    window.addEventListener("teacher_students_updated", handleUpdate);
    return () => {
      window.removeEventListener("teacher_classes_updated", handleUpdate);
      window.removeEventListener("teacher_students_updated", handleUpdate);
    };
  }, []);

  const totalClasses = teacherClasses.length;
  const totalStudents = teacherStudents.length;
  const class7A1Students = teacherStudents.filter((s) => normalizeClassName(s.className) === "7A1");
  const count7A1 = class7A1Students.length || 38;

  /**
   * Handle exam save from ExamCreator
   */
  const handleSaveExam = (exam: Exam) => {
    setCreatedExams([...createdExams, exam]);
    setShowExamCreator(false);
    alert(`✅ Đã lưu đề thi "${exam.title}" thành công!\n\nSố câu hỏi: ${exam.questions.length}\nThời gian: ${exam.duration} phút`);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display">👋 Chào Thầy Nguyễn Văn Toàn!</h1>
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Giáo Viên Toán THCS
            </span>
          </div>
          <p className="text-xs text-indigo-200 mt-1">
            Quản lý {totalClasses} lớp học • {totalStudents} học sinh • Năm học 2025–2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExamCreator(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileEdit className="w-4 h-4" /> Tạo Đề Thi
          </button>
          <button
            onClick={() => onNavigate("teacher_ai_docs")}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <UploadCloud className="w-4 h-4" /> AI Trích Xuất PDF
          </button>
          <button
            onClick={() => onNavigate("teacher_classes")}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Users className="w-4 h-4 text-indigo-400" /> Cấp Tài Khoản
          </button>
        </div>
      </div>

      {/* Class Proficiency Warnings */}
      <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 shadow-xs flex items-start gap-4">
        <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-amber-950 text-sm">Cảnh Báo AI Sư Phạm: Mẫu Lỗi Sai Lớp 7A1</h3>
          <p className="text-xs text-amber-900 leading-relaxed">
            Trong số {count7A1} học sinh Lớp 7A1, <strong>{Math.min(8, count7A1)} học sinh</strong> đang gặp khó khăn ở chủ đề <em>"Phép chia phân số âm"</em> và <strong>{Math.min(5, count7A1)} học sinh</strong> làm sai câu hỏi Vận dụng tỉ lệ thức.
          </p>
          <button
            onClick={() => onNavigate("teacher_analytics")}
            className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 pt-1"
          >
            <span>Xem Báo Cáo Phân Tích & Giao Bài Củng Cố</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Managed Classes Overview */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Danh Sách Lớp Phụ Trách ({totalClasses} Lớp)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {teacherClasses.map((cls) => {
            const studentCount = teacherStudents.filter(
              (s) => normalizeClassName(s.className) === normalizeClassName(cls.name)
            ).length;

            return (
              <div key={cls.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">
                      Khối {cls.grade}
                    </span>
                    <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                      {studentCount} Học Sinh
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{cls.name}</h3>
                  <p className="text-xs text-slate-500">Mã tham gia: <code className="font-mono bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">{cls.joinCode}</code></p>
                </div>

                <button
                  onClick={() => onNavigate("teacher_classes")}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Xem Roster & Cấp Mật Khẩu ({studentCount} em)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Created Exams Section */}
      {createdExams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Đề Thi Đã Tạo ({createdExams.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdExams.map((exam) => (
              <div key={exam.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900">{exam.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{exam.description}</p>
                  </div>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
                    Khối {exam.grade}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{exam.questions.length} câu</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>{exam.duration} phút</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors">
                    Xem Chi Tiết
                  </button>
                  <button className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors">
                    Giao Bài
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ExamCreator Modal */}
      {showExamCreator && (
        <ExamCreator
          onSave={handleSaveExam}
          onClose={() => setShowExamCreator(false)}
        />
      )}
    </div>
  );
};
