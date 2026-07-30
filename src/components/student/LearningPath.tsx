import React, { useState } from "react";
import { Chapter, Lesson } from "../../types";
import { MOCK_CHAPTERS } from "../../data/mockData";
import { MathRenderer } from "../common/MathRenderer";
import { MathInputKeypad } from "../common/MathInputKeypad";
import { BookOpen, CheckCircle2, ChevronRight, Sparkles, X, Play, Award, Edit3, Plus, Trash2, Save, Settings2 } from "lucide-react";

interface LearningPathProps {
  onStartPractice: (lessonId: string, lessonTitle: string) => void;
  isTeacher?: boolean;
}

export const LearningPath: React.FC<LearningPathProps> = ({ onStartPractice, isTeacher = false }) => {
  const [chapters, setChapters] = useState<Chapter[]>(MOCK_CHAPTERS);
  const [selectedGrade, setSelectedGrade] = useState<number>(7);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [selectedLessonModal, setSelectedLessonModal] = useState<Lesson | null>(null);

  // Edit Chapter Modal State
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState<string>("");

  // Edit Lesson Modal State
  const [editingLessonObj, setEditingLessonObj] = useState<{ chapterId: string; lesson: Lesson } | null>(null);

  const filteredChapters = chapters.filter(
    (c) => c.grade === selectedGrade && c.semester === selectedSemester
  );

  // Handlers for Chapter editing
  const handleOpenEditChapter = (chap: Chapter) => {
    setEditingChapterId(chap.id);
    setEditingChapterTitle(chap.title);
  };

  const handleSaveChapter = () => {
    if (!editingChapterId) return;
    setChapters(prev =>
      prev.map(c => (c.id === editingChapterId ? { ...c, title: editingChapterTitle } : c))
    );
    setEditingChapterId(null);
  };

  // Handlers for Lesson editing
  const handleOpenEditLesson = (chapId: string, lesson: Lesson) => {
    setEditingLessonObj({
      chapterId: chapId,
      lesson: JSON.parse(JSON.stringify(lesson))
    });
  };

  const handleSaveLesson = () => {
    if (!editingLessonObj) return;
    const { chapterId, lesson } = editingLessonObj;
    setChapters(prev =>
      prev.map(c => {
        if (c.id === chapterId) {
          return {
            ...c,
            lessons: c.lessons.map(l => (l.id === lesson.id ? lesson : l))
          };
        }
        return c;
      })
    );
    setEditingLessonObj(null);
  };

  const handleAddKeyKnowledgePoint = () => {
    if (!editingLessonObj) return;
    setEditingLessonObj({
      ...editingLessonObj,
      lesson: {
        ...editingLessonObj.lesson,
        keyKnowledge: [...editingLessonObj.lesson.keyKnowledge, "Kiến thức bổ sung $x > 0$..."]
      }
    });
  };

  const handleRemoveKeyKnowledgePoint = (idx: number) => {
    if (!editingLessonObj) return;
    const updated = editingLessonObj.lesson.keyKnowledge.filter((_, i) => i !== idx);
    setEditingLessonObj({
      ...editingLessonObj,
      lesson: {
        ...editingLessonObj.lesson,
        keyKnowledge: updated
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Teacher Control Header Banner */}
      {isTeacher && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-4 rounded-2xl shadow-md border border-indigo-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Settings2 className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">
                Chế Độ Quản Lý Giáo Viên
              </div>
              <p className="text-xs font-semibold text-white">
                Cho phép xem qua và <strong>ĐIỀU CHỈNH</strong> tiêu đề chương, tên bài học, tóm tắt lý thuyết và hệ thống kiến thức trọng tâm.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Sẵn sàng điều chỉnh
          </span>
        </div>
      )}

      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <span>📚 Lộ Trình Học Tập Chương & Bài</span>
            {isTeacher && (
              <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-2.5 py-0.5 rounded-full">
                Giáo Viên Điều Chỉnh
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chọn Chương và Bài theo chương trình Toán THCS để học lý thuyết, luyện tập hoặc điều chỉnh nội dung kiến thức.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Grade Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[6, 7, 8].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  selectedGrade === g ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* Semester Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSemester(s as 1 | 2)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  selectedSemester === s ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Học Kỳ {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chapters Accordion / List */}
      <div className="space-y-6">
        {filteredChapters.map((chapter) => (
          <div key={chapter.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Chapter Header */}
            <div className="bg-slate-900 text-white p-4 font-bold text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                {chapter.title}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-normal text-slate-400">{chapter.lessons.length} Bài Học</span>
                {isTeacher && (
                  <button
                    onClick={() => handleOpenEditChapter(chapter)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Điều Chỉnh Chương
                  </button>
                )}
              </div>
            </div>

            {/* Lessons List */}
            <div className="divide-y divide-slate-100">
              {chapter.lessons.map((lesson) => (
                <div key={lesson.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{lesson.title}</h4>
                      {lesson.completedPct === 100 && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã hoàn thành
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600">
                      <MathRenderer content={lesson.summary} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Teacher Edit Button */}
                    {isTeacher && (
                      <button
                        onClick={() => handleOpenEditLesson(chapter.id, lesson)}
                        className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Điều Chỉnh
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedLessonModal(lesson)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Ôn Kiến Thức
                    </button>
                    <button
                      onClick={() => onStartPractice(lesson.id, lesson.title)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Luyện Tập
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Knowledge Modal (Student or Teacher Preview) */}
      {selectedLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">{selectedLessonModal.title}</h3>
              <button
                onClick={() => setSelectedLessonModal(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Kiến Thức Trọng Tâm Cần Ghi Nhớ
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                {selectedLessonModal.keyKnowledge.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span><MathRenderer content={point} /></span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              {isTeacher && (
                <button
                  onClick={() => {
                    const lesson = selectedLessonModal;
                    const chap = chapters.find(c => c.lessons.some(l => l.id === lesson.id));
                    if (chap) {
                      setSelectedLessonModal(null);
                      handleOpenEditLesson(chap.id, lesson);
                    }
                  }}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Điều Chỉnh Mạch Kiến Thức Này
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setSelectedLessonModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    const lesson = selectedLessonModal;
                    setSelectedLessonModal(null);
                    onStartPractice(lesson.id, lesson.title);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Bắt Đầu Luyện Tập Tương Tự
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Edit Chapter Title Modal */}
      {editingChapterId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" /> Điều Chỉnh Tên Chương
              </h3>
              <button onClick={() => setEditingChapterId(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Tên/Mục Chương Học:</label>
              <input
                type="text"
                value={editingChapterTitle}
                onChange={(e) => setEditingChapterTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingChapterId(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                Hủy
              </button>
              <button onClick={handleSaveChapter} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1">
                <Save className="w-3.5 h-3.5" /> Lưu Tên Chương
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Edit Lesson & Key Knowledge Modal */}
      {editingLessonObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Điều Chỉnh Nội Dung Bài Học & Kiến Thức Trọng Tâm
                </h3>
              </div>
              <button onClick={() => setEditingLessonObj(null)} className="p-1 text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
              {/* Lesson Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Bài Học:</label>
                <input
                  type="text"
                  value={editingLessonObj.lesson.title}
                  onChange={(e) => setEditingLessonObj({
                    ...editingLessonObj,
                    lesson: { ...editingLessonObj.lesson, title: e.target.value }
                  })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              {/* Lesson Summary with MathInputKeypad */}
              <div>
                <MathInputKeypad
                  value={editingLessonObj.lesson.summary}
                  onChange={(val) => setEditingLessonObj({
                    ...editingLessonObj,
                    lesson: { ...editingLessonObj.lesson, summary: val }
                  })}
                  label="Tóm tắt nội dung lý thuyết (Công thức LaTeX):"
                />
              </div>

              {/* Key Knowledge Points List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">
                    Danh Sách Kiến Thức Trọng Tâm Cần Ghi Nhớ:
                  </label>
                  <button
                    onClick={handleAddKeyKnowledgePoint}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Ý Kiến Thức
                  </button>
                </div>

                <div className="space-y-2">
                  {editingLessonObj.lesson.keyKnowledge.map((point, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-600 text-[11px]">Ý {idx + 1}:</span>
                        <button
                          onClick={() => handleRemoveKeyKnowledgePoint(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Xóa ý này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <MathInputKeypad
                        value={point}
                        onChange={(val) => {
                          const updated = [...editingLessonObj.lesson.keyKnowledge];
                          updated[idx] = val;
                          setEditingLessonObj({
                            ...editingLessonObj,
                            lesson: { ...editingLessonObj.lesson, keyKnowledge: updated }
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setEditingLessonObj(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveLesson}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" /> Lưu Điều Chỉnh Bài Học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
