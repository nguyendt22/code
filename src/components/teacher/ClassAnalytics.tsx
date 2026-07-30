import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, AlertTriangle, Lightbulb, FileSpreadsheet, Download, Sparkles, CheckCircle2, Search, Filter, Eye, Award, LineChart, Target, Calendar, Activity, BookOpen, Clock, Zap, Users, ShieldCheck } from "lucide-react";
import { getTeacherClasses, TeacherClassItem } from "../../data/teacherClassStore";
import { getTeacherStudents, normalizeClassName, TeacherStudent } from "../../data/teacherStudentStore";
import { MathRenderer } from "../common/MathRenderer";

type PeriodType = "week" | "month" | "semester";

interface StudentScoreSummary {
  id: string;
  name: string;
  username: string;
  className: string;
  score1: number; // KT 15p
  score2: number; // KT 1 Tiết
  score3: number; // Thực hành
  score4: number; // Midterm / Final
  completionRate: number;
  aiNote: string;
  weeklyProgress: number[];
  topicMastery: { topic: string; mastery: number }[];
  practiceHours: number;
  completedExercises: number;
}

const MOCK_CLASS_SUMMARY: StudentScoreSummary[] = [
  {
    id: "std-1",
    name: "Nguyễn Minh An",
    username: "NguyenMinhAn_7A1",
    className: "7A1",
    score1: 9.0,
    score2: 8.5,
    score3: 9.5,
    score4: 8.0,
    completionRate: 100,
    aiNote: "Thế mạnh Đại số, nắm vững dãy tỷ số. Tiến bộ +18% môn Hình học.",
    weeklyProgress: [7.0, 7.5, 8.0, 8.5, 8.8, 9.0],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 95 },
      { topic: "Số thực & Căn bậc hai", mastery: 88 },
      { topic: "Góc & Đường thẳng song song", mastery: 82 },
      { topic: "Tam giác bằng nhau", mastery: 78 }
    ],
    practiceHours: 14.5,
    completedExercises: 128
  },
  {
    id: "std-2",
    name: "Trần Hoàng Yến",
    username: "TranHoangYen_7A1",
    className: "7A1",
    score1: 8.0,
    score2: 7.5,
    score3: 8.0,
    score4: 7.0,
    completionRate: 100,
    aiNote: "Học lực Khá, cần luyện bài toán tỷ lệ nghịch. Tần suất luyện tập đều đặn.",
    weeklyProgress: [6.5, 7.0, 7.2, 7.5, 7.8, 8.0],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 85 },
      { topic: "Số thực & Căn bậc hai", mastery: 80 },
      { topic: "Góc & Đường thẳng song song", mastery: 75 },
      { topic: "Tam giác bằng nhau", mastery: 70 }
    ],
    practiceHours: 11.2,
    completedExercises: 95
  },
  {
    id: "std-3",
    name: "Đỗ Quốc Anh",
    username: "DoQuocAnh_7A1",
    className: "7A1",
    score1: 5.5,
    score2: 6.0,
    score3: 6.5,
    score4: 5.0,
    completionRate: 85,
    aiNote: "Hay nhầm lẫn dấu âm/dương khi nhân phân số. Đã tăng tốc gần đây.",
    weeklyProgress: [4.5, 5.0, 5.2, 5.5, 6.0, 6.2],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 62 },
      { topic: "Số thực & Căn bậc hai", mastery: 58 },
      { topic: "Góc & Đường thẳng song song", mastery: 65 },
      { topic: "Tam giác bằng nhau", mastery: 50 }
    ],
    practiceHours: 7.8,
    completedExercises: 64
  },
  {
    id: "std-4",
    name: "Lê Thu Hà",
    username: "LeThuHa_7A1",
    className: "7A1",
    score1: 10.0,
    score2: 9.5,
    score3: 10.0,
    score4: 9.8,
    completionRate: 100,
    aiNote: "Xuất sắc! Tư duy hình học & chứng minh phản chứng cực kỳ chuẩn xác.",
    weeklyProgress: [9.0, 9.2, 9.5, 9.6, 9.8, 10.0],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 100 },
      { topic: "Số thực & Căn bậc hai", mastery: 98 },
      { topic: "Góc & Đường thẳng song song", mastery: 96 },
      { topic: "Tam giác bằng nhau", mastery: 98 }
    ],
    practiceHours: 22.0,
    completedExercises: 195
  },
  {
    id: "std-5",
    name: "Phạm Hải Nam",
    username: "PhamHaiNam_7A1",
    className: "7A1",
    score1: 6.0,
    score2: 5.5,
    score3: 7.0,
    score4: 6.0,
    completionRate: 90,
    aiNote: "Cần củng cố đọc hiểu bài toán có lời văn và kỹ năng phân tích đề.",
    weeklyProgress: [5.0, 5.5, 5.8, 6.0, 6.2, 6.5],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 70 },
      { topic: "Số thực & Căn bậc hai", mastery: 64 },
      { topic: "Góc & Đường thẳng song song", mastery: 60 },
      { topic: "Tam giác bằng nhau", mastery: 55 }
    ],
    practiceHours: 8.5,
    completedExercises: 72
  },
  {
    id: "std-6",
    name: "Vũ Bảo Ngọc",
    username: "VuBaoNgoc_7A1",
    className: "7A1",
    score1: 8.5,
    score2: 8.0,
    score3: 9.0,
    score4: 8.5,
    completionRate: 100,
    aiNote: "Tiến bộ vượt bậc môn Hình học. Làm bài cẩn thận và có tư duy logic tốt.",
    weeklyProgress: [7.2, 7.5, 8.0, 8.2, 8.5, 8.8],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 88 },
      { topic: "Số thực & Căn bậc hai", mastery: 84 },
      { topic: "Góc & Đường thẳng song song", mastery: 90 },
      { topic: "Tam giác bằng nhau", mastery: 82 }
    ],
    practiceHours: 13.0,
    completedExercises: 110
  },
  // Lớp 7A2
  {
    id: "std-7A2-1",
    name: "Phùng Gia Huy",
    username: "PhungGiaHuy_7A2",
    className: "7A2",
    score1: 9.5,
    score2: 9.0,
    score3: 9.5,
    score4: 9.2,
    completionRate: 100,
    aiNote: "Top 1 lớp 7A2. Tư duy logic xuất sắc, giải bài nhanh và cẩn thận.",
    weeklyProgress: [8.5, 8.8, 9.0, 9.2, 9.3, 9.5],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 98 },
      { topic: "Số thực & Căn bậc hai", mastery: 95 },
      { topic: "Góc & Đường thẳng song song", mastery: 90 },
      { topic: "Tam giác bằng nhau", mastery: 92 }
    ],
    practiceHours: 18.2,
    completedExercises: 160
  },
  {
    id: "std-7A2-2",
    name: "Nguyễn Mai Phương",
    username: "NguyenMaiPhuong_7A2",
    className: "7A2",
    score1: 8.0,
    score2: 8.5,
    score3: 8.0,
    score4: 8.2,
    completionRate: 96,
    aiNote: "Chăm chỉ, làm bài đầy đủ. Cần rèn thêm kỹ năng giải toán thực tế.",
    weeklyProgress: [7.0, 7.5, 7.8, 8.0, 8.2, 8.4],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 85 },
      { topic: "Số thực & Căn bậc hai", mastery: 82 },
      { topic: "Góc & Đường thẳng song song", mastery: 80 },
      { topic: "Tam giác bằng nhau", mastery: 86 }
    ],
    practiceHours: 12.8,
    completedExercises: 112
  },
  {
    id: "std-7A2-3",
    name: "Hoàng Minh Trí",
    username: "HoangMinhTri_7A2",
    className: "7A2",
    score1: 6.5,
    score2: 6.0,
    score3: 7.0,
    score4: 6.5,
    completionRate: 88,
    aiNote: "Cần cải thiện tốc độ tính nhẩm đại số và xem kỹ công thức hình học.",
    weeklyProgress: [5.5, 5.8, 6.0, 6.2, 6.5, 6.7],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 72 },
      { topic: "Số thực & Căn bậc hai", mastery: 68 },
      { topic: "Góc & Đường thẳng song song", mastery: 65 },
      { topic: "Tam giác bằng nhau", mastery: 60 }
    ],
    practiceHours: 9.0,
    completedExercises: 80
  },
  // Lớp 8A1
  {
    id: "std-8A1-1",
    name: "Bùi Khánh Linh",
    username: "BuiKhanhLinh_8A1",
    className: "8A1",
    score1: 9.8,
    score2: 9.5,
    score3: 10.0,
    score4: 9.6,
    completionRate: 100,
    aiNote: "Xuất sắc Hằng đẳng thức & Phân thức đại số. Nắm vững định lý Thalès.",
    weeklyProgress: [9.0, 9.2, 9.4, 9.5, 9.6, 9.8],
    topicMastery: [
      { topic: "Hằng đẳng thức đáng nhớ", mastery: 98 },
      { topic: "Phân thức đại số", mastery: 95 },
      { topic: "Tứ giác & Hình bình hành", mastery: 92 },
      { topic: "Tam giác đồng dạng", mastery: 94 }
    ],
    practiceHours: 20.5,
    completedExercises: 185
  },
  // Lớp 6A1
  {
    id: "std-6A1-1",
    name: "Ngô Quang Vinh",
    username: "NgoQuangVinh_6A1",
    className: "6A1",
    score1: 9.0,
    score2: 8.8,
    score3: 9.2,
    score4: 8.9,
    completionRate: 100,
    aiNote: "Học giỏi Tập hợp số tự nhiên và Phép tính số nguyên. Tích cực phát biểu.",
    weeklyProgress: [8.0, 8.2, 8.5, 8.7, 8.8, 9.0],
    topicMastery: [
      { topic: "Tập hợp số tự nhiên", mastery: 96 },
      { topic: "Số nguyên & Phép tính", mastery: 90 },
      { topic: "Hình học trực quan", mastery: 88 }
    ],
    practiceHours: 15.0,
    completedExercises: 135
  }
];

export const ClassAnalytics: React.FC = () => {
  const [teacherClassItems, setTeacherClassItems] = useState<TeacherClassItem[]>(() => getTeacherClasses());
  const [teacherStudents, setTeacherStudents] = useState<TeacherStudent[]>(() => getTeacherStudents());

  useEffect(() => {
    const handleUpdate = () => {
      setTeacherClassItems(getTeacherClasses());
      setTeacherStudents(getTeacherStudents());
    };
    window.addEventListener("teacher_classes_updated", handleUpdate);
    window.addEventListener("teacher_students_updated", handleUpdate);
    return () => {
      window.removeEventListener("teacher_classes_updated", handleUpdate);
      window.removeEventListener("teacher_students_updated", handleUpdate);
    };
  }, []);

  // Extracted short class names (e.g. "7A1", "7A2", "8A1")
  const teacherClassNames = teacherClassItems.map((c) => c.name.replace(/^Lớp\s*/i, "").trim());

  const [activeTab, setActiveTab] = useState<"progress" | "gradebook">("progress");
  const [period, setPeriod] = useState<PeriodType>("week");
  const [subPeriod, setSubPeriod] = useState<string>("Tuần Hiện Tại (T12)");
  const [selectedClass, setSelectedClass] = useState<string>(() => teacherClassNames[0] || "7A1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRankFilter, setSelectedRankFilter] = useState("all");
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentScoreSummary | null>(null);
  const [activeProgressStudentId, setActiveProgressStudentId] = useState<string>("");

  // Keep selected class valid if teacher class list updates
  useEffect(() => {
    if (teacherClassNames.length > 0 && !teacherClassNames.includes(selectedClass)) {
      setSelectedClass(teacherClassNames[0]);
    }
  }, [teacherClassItems]);

  const selectedCleanClass = normalizeClassName(selectedClass);

  // Filter students from store matching the selected class
  const currentClassStudents = teacherStudents.filter(
    (s) => normalizeClassName(s.className) === selectedCleanClass
  );

  useEffect(() => {
    if (currentClassStudents.length > 0) {
      if (!currentClassStudents.some((s) => s.id === activeProgressStudentId)) {
        setActiveProgressStudentId(currentClassStudents[0].id);
      }
    }
  }, [selectedClass, teacherStudents]);

  const calculateAverage = (s: StudentScoreSummary | TeacherStudent) => {
    return ((s.score1 + s.score2 * 2 + s.score3 + s.score4 * 2) / 6).toFixed(1);
  };

  const getRankBadge = (avg: number) => {
    if (avg >= 8.5) return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">Giỏi / Xuất Sắc</span>;
    if (avg >= 6.5) return <span className="bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">Khá</span>;
    if (avg >= 5.0) return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">Trung Bình</span>;
    return <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">Cần Can Thiệp</span>;
  };

  const filteredStudents = currentClassStudents.filter((std) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!std.name.toLowerCase().includes(q) && !std.username.toLowerCase().includes(q)) return false;
    }
    const avg = parseFloat(calculateAverage(std));
    if (selectedRankFilter === "good" && avg < 8.0) return false;
    if (selectedRankFilter === "weak" && avg >= 6.0) return false;
    return true;
  });

  const activeProgressStudent = currentClassStudents.find((s) => s.id === activeProgressStudentId) || currentClassStudents[0];

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,STT,Ho Ten,Username,Lop,KT 15p,KT 1 Tiet,Thuc Hanh,Midterm,Diem Trung Binh,Ty Le Hoan Thanh,Nhan Xet AI\n";
    filteredStudents.forEach((std, idx) => {
      const avg = calculateAverage(std);
      csvContent += `${idx + 1},"${std.name}",${std.username},${std.className},${std.score1},${std.score2},${std.score3},${std.score4},${avg},${std.completionRate}%,"${std.aiNote}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_Cao_Lop_Hoc_${selectedClass}_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Navigation Tabs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>📊 Báo Cáo Lớp Học (Tổng Hợp Theo Tuần, Tháng & Học Kỳ)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp tiến trình học tập, bảng điểm lớp và phân tích mẫu lỗi học sinh theo thời gian.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Main View Tabs */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === "progress"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Tiến Trình Học Tập
            </button>
            <button
              onClick={() => setActiveTab("gradebook")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === "gradebook"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="w-4 h-4" /> Bảng Điểm Tổng Hợp
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-slate-50 to-indigo-50/80 border border-indigo-200/90 p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>Chọn Lớp Báo Cáo Chi Tiết:</span>
            </h3>
            <p className="text-[11px] text-indigo-700 font-medium flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Báo cáo đồng bộ {teacherClassItems.length} lớp giảng dạy của Thầy Nguyễn Văn Toàn (Lớp {selectedClass})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick class pill buttons for teacher's managed classes */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-thin max-w-full">
            {teacherClassNames.map((cName) => (
              <button
                key={cName}
                onClick={() => setSelectedClass(cName)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                  selectedClass === cName
                    ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400 scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Lớp {cName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Period Aggregation Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-extrabold text-slate-800">Khung Thời Gian Báo Cáo:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 font-bold">
            <button
              onClick={() => { setPeriod("week"); setSubPeriod("Tuần Hiện Tại (T12)"); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === "week" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600"}`}
            >
              📅 Theo Tuần
            </button>
            <button
              onClick={() => { setPeriod("month"); setSubPeriod("Tháng 11/2025"); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === "month" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600"}`}
            >
              🗓️ Theo Tháng
            </button>
            <button
              onClick={() => { setPeriod("semester"); setSubPeriod("Học Kỳ I"); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${period === "semester" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600"}`}
            >
              🎓 Theo Học Kỳ
            </button>
          </div>
        </div>

        {/* Sub-period Selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Mốc thời gian:</span>
          {period === "week" && (
            <select
              value={subPeriod}
              onChange={(e) => setSubPeriod(e.target.value)}
              className="p-2 border border-slate-300 rounded-xl font-bold text-xs bg-slate-50 text-indigo-900"
            >
              <option value="Tuần Hiện Tại (T12)">Tuần 12 (Hiện tại)</option>
              <option value="Tuần 11">Tuần 11</option>
              <option value="Tuần 10">Tuần 10</option>
              <option value="Tuần 9">Tuần 9</option>
            </select>
          )}

          {period === "month" && (
            <select
              value={subPeriod}
              onChange={(e) => setSubPeriod(e.target.value)}
              className="p-2 border border-slate-300 rounded-xl font-bold text-xs bg-slate-50 text-indigo-900"
            >
              <option value="Tháng 11/2025">Tháng 11/2025</option>
              <option value="Tháng 10/2025">Tháng 10/2025</option>
              <option value="Tháng 9/2025">Tháng 9/2025</option>
            </select>
          )}

          {period === "semester" && (
            <select
              value={subPeriod}
              onChange={(e) => setSubPeriod(e.target.value)}
              className="p-2 border border-slate-300 rounded-xl font-bold text-xs bg-slate-50 text-indigo-900"
            >
              <option value="Học Kỳ I">Học Kỳ I (2025 - 2026)</option>
              <option value="Học Kỳ II">Học Kỳ II (Dự kiến)</option>
            </select>
          )}
        </div>
      </div>

      {/* Stats Summary Banner - Dynamically shifts based on period */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">
            Sĩ Số Lớp {selectedClass}
          </span>
          <div className="text-2xl font-black text-slate-900 font-display">
            {currentClassStudents.length}/{currentClassStudents.length} em
          </div>
          <div className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Đang tham gia
          </div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">
            {period === "week" ? "Tăng Trưởng Tuần" : period === "month" ? "Tăng Trưởng Tháng" : "Tăng Trưởng Học Kỳ"}
          </span>
          <div className="text-2xl font-black text-indigo-600 font-display">
            {period === "week" ? "+4.2%" : period === "month" ? "+14.5%" : "+22.0%"}
          </div>
          <div className="text-[10px] text-indigo-600 font-extrabold">Báo cáo {subPeriod}</div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">Mức Độ Hoàn Thành</span>
          <div className="text-2xl font-black text-emerald-600 font-display">
            {period === "week" ? "91%" : period === "month" ? "88%" : "94%"}
          </div>
          <div className="text-[10px] text-emerald-600 font-extrabold">Bài tập được giao</div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">Chủ Đề Trọng Tâm</span>
          <div className="text-2xl font-black text-amber-600 font-display">
            {period === "week" ? "Chia Phân Số Âm" : period === "month" ? "Tam Giác Bằng Nhau" : "Số Hữu Tỉ & Hình Học"}
          </div>
          <div className="text-[10px] text-amber-600 font-extrabold">Cần chú ý củng cố</div>
        </div>
      </div>

      {/* View Mode 1: Tiến Trình Học Tập (Learning Progress Dashboard) */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          {/* Class-Wide Topic Mastery Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span>Mức Độ Làm Chủ Chương Trình Toán Khối 7 ({subPeriod})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ hoàn thành đúng bài tập theo từng chương môn Đại số & Hình học</p>
              </div>

              <span className="text-xs font-black bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
                Lớp {selectedClass} • {subPeriod}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chapter 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-900">
                  <span>Chương I: Số Hữu Tỉ & Các Phép Tính</span>
                  <span className="text-emerald-700 font-mono">92% (Xuất sắc)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Đã giải: 420 bài tập</span>
                  <span>Điểm TB: 8.8 / 10</span>
                </div>
              </div>

              {/* Chapter 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-900">
                  <span>Chương II: Số Thực & Căn Bậc Hai</span>
                  <span className="text-indigo-700 font-mono">85% (Khá)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: "85%" }} />
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Đã giải: 380 bài tập</span>
                  <span>Điểm TB: 8.1 / 10</span>
                </div>
              </div>

              {/* Chapter 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-900">
                  <span>Chương III: Góc & Đường Thẳng Song Song</span>
                  <span className="text-indigo-700 font-mono">76% (Khá)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "76%" }} />
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Đã giải: 310 bài tập</span>
                  <span>Điểm TB: 7.4 / 10</span>
                </div>
              </div>

              {/* Chapter 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-900">
                  <span>Chương IV: Tam Giác Bằng Nhau (c-c-c, c-g-c, g-c-g)</span>
                  <span className="text-amber-700 font-mono">68% (Cần Củng Cố)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "68%" }} />
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Đã giải: 260 bài tập</span>
                  <span>Điểm TB: 6.7 / 10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Progress Spotlight - Deep Dive View */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <span>Hồ Sơ Tiến Trình Học Tập Từng Học Sinh</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Chọn một học sinh để xem chi tiết lộ trình tăng trưởng và bài tập đã làm trong {subPeriod}</p>
              </div>

              {/* Student Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-700">Học sinh:</span>
                <select
                  value={activeProgressStudentId}
                  onChange={(e) => setActiveProgressStudentId(e.target.value)}
                  className="p-2 border border-slate-300 rounded-xl text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  {currentClassStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Lớp {s.className})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Student Dashboard Panel */}
            {!activeProgressStudent ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
                <Users className="w-8 h-8 text-indigo-500 mx-auto" />
                <p className="text-xs font-extrabold text-slate-800">
                  Lớp <strong className="text-indigo-600 font-black">{selectedClass}</strong> hiện chưa có danh sách học sinh.
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Hãy vào mục <strong>Quản Lý Lớp & Học Sinh</strong> để Import file Excel danh sách lớp hoặc dán tên học sinh mới. Dữ liệu báo cáo sẽ tự động được cập nhật ngay lập tức!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Student Summary Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-lg font-black">{activeProgressStudent.name}</h3>
                    <p className="text-xs text-indigo-300 font-mono">{activeProgressStudent.username}</p>
                  </div>
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
                    Lớp {activeProgressStudent.className}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <div className="text-[10px] text-indigo-200 uppercase font-bold">Thời Gian Ôn Luyện</div>
                    <div className="text-lg font-black text-amber-300 font-mono mt-0.5">{activeProgressStudent.practiceHours} giờ</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <div className="text-[10px] text-indigo-200 uppercase font-bold">Bài Tập Đã Giải</div>
                    <div className="text-lg font-black text-emerald-300 font-mono mt-0.5">{activeProgressStudent.completedExercises} bài</div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-xs font-black text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Nhận Xét & Phân Tích Của AI ({subPeriod}):
                  </span>
                  <p className="text-xs text-indigo-100 bg-white/10 p-3 rounded-2xl border border-white/10 leading-relaxed font-medium">
                    {activeProgressStudent.aiNote}
                  </p>
                </div>
              </div>

              {/* Right 2 Columns: Growth Chart & Topic Bars */}
              <div className="lg:col-span-2 space-y-5">
                {/* Progress Curve Bar Chart */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                      <LineChart className="w-4 h-4 text-indigo-600" />
                      <span>Biểu Đồ Tiến Bộ ({period === "week" ? "6 Tuần Gần Nhất" : period === "month" ? "3 Tháng Gần Nhất" : "Cả Học Kỳ I"})</span>
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Tăng trưởng liên tục
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-6 gap-2 items-end h-28 pt-4">
                      {activeProgressStudent.weeklyProgress.map((score, wIdx) => {
                        const heightPct = (score / 10) * 100;
                        return (
                          <div key={wIdx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                            <span className="text-[10px] font-black text-indigo-700 font-mono opacity-80 group-hover:opacity-100">
                              {score.toFixed(1)}
                            </span>
                            <div
                              className="w-full bg-gradient-to-t from-indigo-800 to-indigo-500 rounded-t-lg transition-all group-hover:from-indigo-900 group-hover:to-indigo-600 shadow-2xs"
                              style={{ height: `${heightPct}%` }}
                            />
                            <span className="text-[10px] font-bold text-slate-500">
                              {period === "week" ? `T${wIdx + 1}` : period === "month" ? `Th${wIdx + 1}` : `HK${wIdx + 1}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Individual Topic Mastery Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-indigo-600" /> Mức Độ Thành Thạo Các Chủ Đề Toán Học:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProgressStudent.topicMastery.map((tm, tIdx) => (
                      <div key={tIdx} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800 truncate max-w-[180px]">{tm.topic}</span>
                          <span className="font-black font-mono text-indigo-700">{tm.mastery}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              tm.mastery >= 85 ? "bg-emerald-500" : tm.mastery >= 70 ? "bg-indigo-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${tm.mastery}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      )}

      {/* View Mode 2: Bảng Điểm Tổng Hợp (Gradebook Matrix View) */}
      {activeTab === "gradebook" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Bảng Điểm Lớp {selectedClass} ({subPeriod} • {filteredStudents.length} Học Sinh)</span>
            </h2>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Class Filter */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="p-2 border border-slate-300 rounded-xl text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {teacherClassNames.map((cName) => (
                  <option key={cName} value={cName}>
                    Lớp {cName}
                  </option>
                ))}
              </select>

              {/* Rank Filter */}
              <select
                value={selectedRankFilter}
                onChange={(e) => setSelectedRankFilter(e.target.value)}
                className="p-2 border border-slate-300 rounded-xl text-xs font-medium bg-white"
              >
                <option value="all">Tất cả học lực</option>
                <option value="good">Giỏi / Khá (≥ 8.0)</option>
                <option value="weak">Cần củng cố (&lt; 6.0)</option>
              </select>

              {/* Search Input */}
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Tìm tên/username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">STT</th>
                  <th className="p-3.5">Họ & Tên Học Sinh</th>
                  <th className="p-3.5 text-center">KT 15p</th>
                  <th className="p-3.5 text-center">KT 1 Tiết</th>
                  <th className="p-3.5 text-center">Thực Hành</th>
                  <th className="p-3.5 text-center">Giữa Kỳ 1</th>
                  <th className="p-3.5 text-center bg-indigo-50 text-indigo-900">ĐTB Môn</th>
                  <th className="p-3.5 text-center">% Hoàn Thành</th>
                  <th className="p-3.5">Xếp Loại</th>
                  <th className="p-3.5 text-right">Chi Tiết AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.map((std, idx) => {
                  const avg = parseFloat(calculateAverage(std));
                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 text-slate-400 text-[11px] font-mono">{idx + 1}</td>
                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900">{std.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{std.username}</div>
                      </td>
                      <td className="p-3.5 text-center font-bold">{std.score1}</td>
                      <td className="p-3.5 text-center font-bold">{std.score2}</td>
                      <td className="p-3.5 text-center font-bold">{std.score3}</td>
                      <td className="p-3.5 text-center font-bold">{std.score4}</td>
                      <td className="p-3.5 text-center font-black text-indigo-700 bg-indigo-50/40 text-sm font-mono">
                        {avg.toFixed(1)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="font-extrabold text-emerald-700 font-mono">{std.completionRate}%</span>
                      </td>
                      <td className="p-3.5">{getRankBadge(avg)}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedStudentDetail(std)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-xl transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Phân Tích
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Class AI Insights */}
      <div className="bg-indigo-950 text-white p-6 rounded-3xl shadow-md border border-indigo-800 space-y-3">
        <div className="font-black text-sm flex items-center justify-between text-indigo-200">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Báo Cáo Sư Phạm AI Tổng Hợp Lỗi Sai Lớp {selectedClass} ({subPeriod}):</span>
          </span>
          <span className="text-xs bg-indigo-900 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-700">
            Tổng hợp theo {period === "week" ? "Tuần" : period === "month" ? "Tháng" : "Học Kỳ"}
          </span>
        </div>

        <ul className="space-y-2 text-xs text-indigo-100 leading-relaxed font-medium">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <div>
              <MathRenderer content={`**Chủ đề Phép chia phân số âm (${subPeriod}):** Có 8 học sinh thường bỏ quên quy tắc đảo ngược phân số thứ hai hoặc nhầm dấu âm nhân âm. Đề xuất phát 1 phiếu bài tập ôn tập cấp tốc.`} />
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <div>
              <MathRenderer content={`**Chủ đề Tỉ lệ thức vận dụng (${subPeriod}):** Có 5 học sinh lúng túng khi lập dãy tỷ số bằng nhau có chứa hệ số $2x + 3y$. AI khuyến nghị bài củng cố hướng dẫn từng bước.`} />
            </div>
          </li>
        </ul>
      </div>

      {/* Student Detail AI Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">{selectedStudentDetail.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedStudentDetail.username} • {selectedStudentDetail.className}</p>
              </div>
              <button onClick={() => setSelectedStudentDetail(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
                <span className="font-extrabold text-indigo-900">Điểm Trung Bình Tổng Hợp ({subPeriod}):</span>
                <span className="text-lg font-black text-indigo-700 font-mono">{calculateAverage(selectedStudentDetail)} / 10</span>
              </div>

              <div className="space-y-1.5">
                <span className="font-extrabold text-slate-800">📌 Phân Tích Mẫu Lỗi & Nhận Xét Của AI:</span>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 font-medium leading-relaxed">
                  <MathRenderer content={selectedStudentDetail.aiNote} />
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1">
                <span className="font-extrabold block">💡 Khuyến Nghị Bài Tập Củng Cố Cho Giáo Viên:</span>
                <p className="text-[11px] text-emerald-800 font-medium">
                  Hệ thống AI đề xuất giao bộ 5 bài tập cá nhân hóa tập trung vào chuyên đề <strong>Số Hữu Tỉ & Dãy Tỷ Số Bằng Nhau</strong>.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`Đã gửi bài tập củng cố cá nhân hóa cho học sinh ${selectedStudentDetail.name}!`);
                  setSelectedStudentDetail(null);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-sm transition-colors"
              >
                Giao Bài Củng Cố Cho Học Sinh Này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
