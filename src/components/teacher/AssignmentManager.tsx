import React, { useState, useEffect } from "react";
import { Exam } from "../../types";
import { MOCK_EXAMS } from "../../data/mockData";
import { FileCheck2, Calendar, Eye, EyeOff, Lock, Clock, Plus, Check, Edit3, ShieldAlert, Sparkles, AlertCircle, Trash2, CheckSquare, Square } from "lucide-react";
import { getTeacherClasses, TeacherClassItem } from "../../data/teacherClassStore";

interface ExtendedExam extends Partial<Exam> {
  id: string;
  title: string;
  description: string;
  grade: number;
  durationMinutes: number;
  showScoreImmediately: boolean;
  isPublished: boolean;
  questions: Exam['questions'];
  startTime?: string;
  dueDate?: string;
  autoLockOnTimeOut?: boolean;
  maxAttempts?: number;
  assignedClasses?: string[];
}

export const AssignmentManager: React.FC = () => {
  const [teacherClasses, setTeacherClasses] = useState<TeacherClassItem[]>(() => getTeacherClasses());

  useEffect(() => {
    const handleUpdate = () => {
      setTeacherClasses(getTeacherClasses());
    };
    window.addEventListener("teacher_classes_updated", handleUpdate);
    return () => window.removeEventListener("teacher_classes_updated", handleUpdate);
  }, []);

  const [exams, setExams] = useState<ExtendedExam[]>([
    {
      ...MOCK_EXAMS[0],
      startTime: "2026-08-01T08:00",
      dueDate: "2026-08-15T23:59",
      autoLockOnTimeOut: true,
      maxAttempts: 1,
      assignedClasses: ["Lớp 7A1", "Lớp 7A2"]
    },
    {
      ...MOCK_EXAMS[1],
      startTime: "2026-08-05T07:00",
      dueDate: "2026-08-20T23:59",
      autoLockOnTimeOut: true,
      maxAttempts: 2,
      assignedClasses: ["Lớp 7A1"]
    },
    {
      ...MOCK_EXAMS[2],
      startTime: "2026-08-10T08:00",
      dueDate: "2026-08-25T23:59",
      autoLockOnTimeOut: true,
      maxAttempts: 1,
      assignedClasses: ["Lớp 8A1"]
    }
  ]);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingExam, setEditingExam] = useState<ExtendedExam | null>(null);

  // Double confirmation state for deleting an exam
  const [deletingExam, setDeletingExam] = useState<ExtendedExam | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [startTime, setStartTime] = useState("2026-08-01T08:00");
  const [dueDate, setDueDate] = useState("2026-08-15T23:59");
  const [autoLockOnTimeOut, setAutoLockOnTimeOut] = useState(true);
  const [showScoreImmediately, setShowScoreImmediately] = useState(true);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["Lớp 7A1"]);

  const handleConfirmDelete = () => {
    if (!deletingExam) return;
    setExams(prev => prev.filter(e => e.id !== deletingExam.id));
    setDeletingExam(null);
  };

  const toggleScoreVisibility = (examId: string) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === examId ? { ...e, showScoreImmediately: !e.showScoreImmediately } : e
      )
    );
  };

  const handleOpenNewModal = () => {
    setEditingExam(null);
    setTitle("Bài Kiểm Tra Định Kỳ Mới");
    setDurationMinutes(45);
    setStartTime("2026-08-10T08:00");
    setDueDate("2026-08-20T23:59");
    setAutoLockOnTimeOut(true);
    setShowScoreImmediately(true);
    setMaxAttempts(1);
    setSelectedClasses(teacherClasses.map((c) => c.name));
    setShowConfigModal(true);
  };

  const handleOpenEditModal = (exam: ExtendedExam) => {
    setEditingExam(exam);
    setTitle(exam.title);
    setDurationMinutes(exam.durationMinutes);
    setStartTime(exam.startTime || "2026-08-01T08:00");
    setDueDate(exam.dueDate || "2026-08-15T23:59");
    setAutoLockOnTimeOut(exam.autoLockOnTimeOut ?? true);
    setShowScoreImmediately(exam.showScoreImmediately);
    setMaxAttempts(exam.maxAttempts || 1);
    setSelectedClasses(exam.assignedClasses || ["Lớp 7A1"]);
    setShowConfigModal(true);
  };

  const toggleClassSelection = (className: string) => {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className]
    );
  };

  const toggleSelectAllClasses = () => {
    const allNames = teacherClasses.map((c) => c.name);
    if (selectedClasses.length === allNames.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(allNames);
    }
  };

  const handleSaveExamConfig = () => {
    if (!title.trim()) return;
    const finalClasses = selectedClasses.length > 0 ? selectedClasses : ["Lớp 7A1"];

    if (editingExam) {
      setExams((prev) =>
        prev.map((e) =>
          e.id === editingExam.id
            ? {
                ...e,
                title,
                durationMinutes,
                startTime,
                dueDate,
                autoLockOnTimeOut,
                showScoreImmediately,
                maxAttempts,
                assignedClasses: finalClasses
              }
            : e
        )
      );
    } else {
      const newExam: ExtendedExam = {
        id: `exam-custom-${Date.now()}`,
        title,
        description: `Bài kiểm tra giao cho ${finalClasses.join(", ")}, thời gian làm ${durationMinutes} phút.`,
        grade: 7,
        durationMinutes,
        showScoreImmediately,
        isPublished: true,
        startTime,
        dueDate,
        autoLockOnTimeOut,
        maxAttempts,
        assignedClasses: finalClasses,
        questions: MOCK_EXAMS[0].questions
      };
      setExams([newExam, ...exams]);
    }

    setShowConfigModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" />
            <span>Giao Bài & Cấu Hình Thời Gian Làm Bài</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Giáo viên thiết lập thời gian bắt đầu, hạn nộp, thời gian đếm ngược (phút), tự động nộp khi hết giờ & tùy chọn ẩn/hiện điểm.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Tạo Bài Kiểm Tra & Set Thời Gian
        </button>
      </div>

      {/* Exam Cards List */}
      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{exam.title}</h3>
                  <div className="flex items-center gap-1 flex-wrap">
                    {(exam.assignedClasses || ["Lớp 7A1"]).map((cName) => (
                      <span key={cName} className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md border border-indigo-200">
                        {cName}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{exam.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(exam)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" /> Cài Đặt Thời Gian
                </button>
                <button
                  onClick={() => setDeletingExam(exam)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-rose-200"
                  title="Xóa bài kiểm tra"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa Đề
                </button>
              </div>
            </div>

            {/* Time Settings Matrix Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Làm Bài</span>
                <span className="font-extrabold text-indigo-700 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {exam.durationMinutes} Phút
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Mở Đề</span>
                <span className="font-semibold text-slate-800">
                  {exam.startTime ? new Date(exam.startTime).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "Mở tự do"}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Đóng Đề (Hạn Nộp)</span>
                <span className="font-semibold text-rose-700">
                  {exam.dueDate ? new Date(exam.dueDate).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "Không giới hạn"}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Quy Tắc Nộp Bài</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  {exam.autoLockOnTimeOut ? (
                    <span className="text-emerald-700 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Khóa & Tự nộp khi hết giờ</span>
                  ) : (
                    <span className="text-amber-700">Cho phép nộp muộn</span>
                  )}
                </span>
              </div>
            </div>

            {/* Score Visibility Setting Toggle */}
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  {exam.showScoreImmediately ? (
                    <Eye className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-amber-600" />
                  )}
                  <span>Cho phép học sinh xem điểm & lời giải ngay sau khi nộp</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {exam.showScoreImmediately
                    ? "Học sinh sẽ thấy điểm số và phân tích AI ngay khi ấn Nộp bài."
                    : "Học sinh sẽ nhận được thông báo chờ giáo viên công bố kết quả."}
                </p>
              </div>

              <button
                onClick={() => toggleScoreVisibility(exam.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors shrink-0 ${
                  exam.showScoreImmediately
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
              >
                {exam.showScoreImmediately ? "Đang BẬT Xem Điểm" : "Đang TẮT Xem Điểm"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Cấu Hình Thời Gian Làm Bài & Quy Tắc Nộp</span>
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Bài Kiểm Tra:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Chọn Lớp Được Giao Bài ({selectedClasses.length}/{teacherClasses.length} lớp):</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleSelectAllClasses}
                    className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    {selectedClasses.length === teacherClasses.length ? "Bỏ chọn tất cả" : "Chọn tất cả các lớp"}
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                  {teacherClasses.map((cls) => {
                    const isChecked = selectedClasses.includes(cls.name);
                    return (
                      <label
                        key={cls.id}
                        onClick={() => toggleClassSelection(cls.name)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                          isChecked
                            ? "bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100/80"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <span>{cls.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Thời Gian Làm Bài (Phút):</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-indigo-700 bg-white"
                >
                  <option value={15}>15 Phút (Kiểm tra nhanh)</option>
                  <option value={45}>45 Phút (Kiểm tra 1 tiết)</option>
                  <option value={60}>60 Phút</option>
                  <option value={90}>90 Phút (Kiểm tra Học kỳ)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời Gian Mở Đề:</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời Gian Đóng Đề (Hạn Nộp):</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoLockOnTimeOut}
                    onChange={(e) => setAutoLockOnTimeOut(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Tự động nộp bài và khóa đề khi hết giờ đếm ngược</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showScoreImmediately}
                    onChange={(e) => setShowScoreImmediately(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Cho phép học sinh xem điểm & đáp án ngay sau khi nộp</span>
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Số Lần Nộp Bài Tối Đa:</label>
                <select
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                >
                  <option value={1}>1 Lần Duy Nhất (Chuẩn thi thật)</option>
                  <option value={2}>2 Lần (Lấy điểm cao nhất)</option>
                  <option value={99}>Không giới hạn (Luyện tập tự do)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveExamConfig}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Lưu Cấu Hình Thời Gian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Double Confirmation Delete Exam Modal */}
      {deletingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200">
            <div className="flex items-center gap-3 text-rose-600 border-b border-rose-100 pb-3">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Xác Nhận Xóa Bài Kiểm Tra?
                </h3>
                <span className="text-[11px] text-rose-600 font-bold uppercase tracking-wider">Hành động không thể hoàn tác</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài kiểm tra <strong className="text-slate-900">"{deletingExam.title}"</strong> không?
            </p>
            
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">⚠️ Cảnh báo dữ liệu:</span>
              <p className="text-[11px]">
                Hành động này sẽ xóa hoàn toàn đề thi, lịch sử làm bài và điểm số của tất cả học sinh đã nộp bài này.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingExam(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Xác Nhận Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
