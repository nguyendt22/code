import React from "react";
import { StudentLearningProfile } from "../../types";
import { BrainCircuit, AlertTriangle, Lightbulb, ArrowRight, CheckCircle2, TrendingUp, Sparkles, BookOpen } from "lucide-react";
import { MathRenderer } from "../common/MathRenderer";

interface CompetencyMapProps {
  profile: StudentLearningProfile;
  onNavigatePractice: (lessonId: string) => void;
}

export const CompetencyMap: React.FC<CompetencyMapProps> = ({ profile, onNavigatePractice }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 font-display">🧠 Hồ Sơ Năng Lực AI (Learning Profile)</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Học Sinh: {profile.studentName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            AI phân tích dữ liệu thực tế từ bài làm, thời gian, câu sai và số lần thử lại để chẩn đoán chính xác lỗ hổng kiến thức.
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="bg-gradient-to-tr from-indigo-900 to-indigo-800 text-white p-4 rounded-2xl border border-indigo-700 flex items-center gap-4 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-indigo-300 font-display">{profile.overallCompetencyPct}%</div>
            <div className="text-[10px] text-indigo-200 uppercase font-medium">Năng Lực Tổng Thể</div>
          </div>
          <div className="border-l border-indigo-700/80 pl-4 text-xs space-y-0.5 text-indigo-100">
            <div>• Đã làm: <strong>{profile.totalQuestionsAttempted} câu</strong></div>
            <div>• Tỷ lệ đúng: <strong>{profile.overallAccuracyPct}%</strong></div>
          </div>
        </div>
      </div>

      {/* Competency by Subject Area (Đại số, Hình học, Thống kê) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>Bản Đồ Năng Lực Theo Chủ Đề Môn Toán 7</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.subjectAreas.map((area, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{area.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    area.status === "Tốt"
                      ? "bg-emerald-100 text-emerald-800"
                      : area.status === "Khá"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {area.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Mức độ nắm vững:</span>
                  <span>{area.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${area.percentage}%`, backgroundColor: area.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Patterns Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Mẫu Lỗi Thường Gặp (Error Patterns)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Cập nhật tự động sau mỗi bài luyện</span>
        </div>

        <div className="space-y-3">
          {profile.errorPatterns.map((err) => (
            <div key={err.id} className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-900 text-xs">{err.topicName}</span>
                  <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">
                    Lặp lại {err.frequencyCount} lần
                  </span>
                </div>
                <div className="text-xs text-slate-700">
                  <MathRenderer content={err.patternDescription} />
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Bài cần ôn lại: <strong>{err.recommendedLessonTitle}</strong></span>
                </div>
              </div>

              <button
                onClick={() => onNavigatePractice(err.recommendedLessonId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Ôn Ngay Dạng Bài Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>Gợi Ý Học Tập Cá Nhân Hóa Tới Từng Học Sinh</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">{rec.title}</span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">
                    Mức ưu tiên {rec.priority}
                  </span>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  <MathRenderer content={rec.description} />
                </div>
              </div>

              <button
                onClick={() => onNavigatePractice("les-7-1-2")}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" /> Thực Hiện Gợi Ý Này
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
