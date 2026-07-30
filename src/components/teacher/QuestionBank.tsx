import React, { useState } from "react";
import { Question, CognitiveLevel, QuestionType } from "../../types";
type DifficultyLevel = "Dễ" | "Trung bình" | "Vận dụng cao";
import { MOCK_QUESTIONS } from "../../data/mockData";
import { MathRenderer } from "../common/MathRenderer";
import { MathInputKeypad } from "../common/MathInputKeypad";
import { Database, Plus, Filter, Sparkles, CheckCircle2, Eye, Upload, Edit3, Trash2, Save, X } from "lucide-react";

export const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedGrade, setSelectedGrade] = useState<number>(7);
  const [selectedCognitive, setSelectedCognitive] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Question Form state
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState<QuestionType>("mcq4");
  const [newCognitive, setNewCognitive] = useState<CognitiveLevel>("Thông hiểu");
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>("Trung bình");
  const [newExplanation, setNewExplanation] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>([
    "Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"
  ]);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState<any>(0);

  // Edit Question State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleImportQuestionFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        const lines = text.split("\n").filter((l) => l.trim().length > 3);
        const newQs: Question[] = lines.map((l, idx) => ({
          id: `imported-q-${Date.now()}-${idx}`,
          text: l,
          type: "mcq4",
          options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
          correctAnswer: 0,
          explanation: "Lời giải trích xuất từ file.",
          grade: selectedGrade,
          semester: 1,
          chapterId: "chap-7-1",
          chapterName: "Chương I: Số Hữu Tỉ",
          lessonId: "les-7-1-1",
          lessonName: "Bài 1",
          topicName: "Tự động import",
          cognitiveLevel: "Thông hiểu",
          difficulty: "Trung bình",
          tags: ["Toán " + selectedGrade]
        }));
        setQuestions((prev) => [...newQs, ...prev]);
        alert(`Đã trích xuất và thêm thành công ${newQs.length} câu hỏi từ file ${file.name}!`);
      }
    };
    reader.readAsText(file);
  };

  const filtered = questions.filter((q) => {
    if (q.grade !== selectedGrade) return false;
    if (selectedCognitive !== "all" && q.cognitiveLevel !== selectedCognitive) return false;
    return true;
  });

  const handleCreateQuestion = () => {
    if (!newText.trim()) return;

    const newQ: Question = {
      id: `q-custom-${Date.now()}`,
      text: newText,
      type: newType,
      options: newType === "mcq4" ? newOptions : undefined,
      correctAnswer: newCorrectAnswer,
      explanation: newExplanation || "Giải thích mặc định.",
      grade: selectedGrade,
      semester: 1,
      chapterId: "chap-7-1",
      chapterName: "Chương I: Số Hữu Tỉ",
      lessonId: "les-7-1-1",
      lessonName: "Bài 1",
      topicName: "Tổng hợp",
      cognitiveLevel: newCognitive,
      difficulty: newDifficulty,
      tags: ["Toán " + selectedGrade]
    };

    setQuestions([newQ, ...questions]);
    setShowAddModal(false);
    setNewText("");
    setNewExplanation("");
  };

  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(JSON.parse(JSON.stringify(q)));
  };

  const handleSaveEditQuestion = () => {
    if (!editingQuestion) return;
    setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? editingQuestion : q));
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng câu hỏi?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      if (editingQuestion?.id === id) setEditingQuestion(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">📝 Ngân Hàng Câu Hỏi Toán THCS (8 Loại Dạng Bài)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Phân loại câu hỏi theo Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao & công thức LaTeX. Cho phép điều chỉnh từng câu.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-200 transition-colors">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Tải File Bổ Sung (.csv/.txt)</span>
            <input
              type="file"
              accept=".csv,.txt,.json"
              onChange={handleImportQuestionFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm Câu Hỏi Mới
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <Filter className="w-4 h-4 text-indigo-600" /> Lọc Theo:
        </span>

        {/* Grade Filter */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[6, 7, 8].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1 font-bold rounded-lg transition-colors ${
                selectedGrade === g ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>

        {/* Cognitive Filter */}
        <select
          value={selectedCognitive}
          onChange={(e) => setSelectedCognitive(e.target.value)}
          className="p-2 border border-slate-300 rounded-xl font-medium bg-white"
        >
          <option value="all">Tất cả mức độ nhận thức</option>
          <option value="Nhận biết">Nhận biết</option>
          <option value="Thông hiểu">Thông hiểu</option>
          <option value="Vận dụng">Vận dụng</option>
          <option value="Vận dụng cao">Vận dụng cao</option>
        </select>

        <span className="ml-auto font-bold text-slate-500">
          Hiển thị {filtered.length} câu hỏi
        </span>
      </div>

      {/* Questions Cards List */}
      <div className="space-y-4">
        {filtered.map((q, idx) => (
          <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-indigo-600">Câu {idx + 1}</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                  {q.cognitiveLevel}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                  Dạng: {q.type}
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                  {q.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">{q.chapterName}</span>
                {/* Prominent Adjust / Edit Button for Teachers */}
                <button
                  onClick={() => handleOpenEditModal(q)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Điều Chỉnh
                </button>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Xóa câu hỏi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-sm font-semibold text-slate-900 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <MathRenderer content={q.text} />
            </div>

            {q.type === "mcq4" && q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-2.5 rounded-lg border ${
                      oIdx === q.correctAnswer
                        ? "bg-emerald-50 border-emerald-300 font-bold text-emerald-900 flex items-center justify-between"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <MathRenderer content={opt} />
                    {oIdx === q.correctAnswer && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Đáp án đúng</span>}
                  </div>
                ))}
              </div>
            )}

            {q.type === "true_false" && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between font-bold ${
                    String(q.correctAnswer).toLowerCase() === "đúng" || q.correctAnswer === true
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  <span>✓ ĐÚNG (True)</span>
                  {(String(q.correctAnswer).toLowerCase() === "đúng" || q.correctAnswer === true) && (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded">Đáp án đúng</span>
                  )}
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center justify-between font-bold ${
                    String(q.correctAnswer).toLowerCase() === "sai" || q.correctAnswer === false
                      ? "bg-rose-50 border-rose-300 text-rose-900"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  <span>✕ SAI (False)</span>
                  {(String(q.correctAnswer).toLowerCase() === "sai" || q.correctAnswer === false) && (
                    <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded">Đáp án đúng</span>
                  )}
                </div>
              </div>
            )}

            {q.type === "short_answer" && (
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-900">Đáp án ngắn:</span>
                  <span className="px-2.5 py-1 bg-white border border-indigo-300 rounded-lg font-mono font-bold text-indigo-950">
                    {String(q.correctAnswer)}
                  </span>
                </div>
                <span className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Kèm sơ đồ minh họa & hỗ trợ bàn phím công thức
                </span>
              </div>
            )}

            <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              <strong>Lời giải / Lời khuyên:</strong> <MathRenderer content={q.explanation} />
            </div>
          </div>
        ))}
      </div>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <span>Điều Chỉnh Câu Hỏi Trong Ngân Hàng</span>
              </h3>
              <button onClick={() => setEditingQuestion(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
              {/* Question Text with MathInputKeypad */}
              <div>
                <MathInputKeypad
                  value={editingQuestion.text}
                  onChange={(val) => setEditingQuestion({ ...editingQuestion, text: val })}
                  label="Nội dung đề bài (Sử dụng bàn phím Mathway công thức):"
                />
              </div>

              {/* KaTeX Live Preview */}
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
                <span className="font-bold text-indigo-900 text-[11px] block mb-1">Xem Trước Render Công Thức:</span>
                <div className="text-sm font-bold text-slate-900">
                  <MathRenderer content={editingQuestion.text} />
                </div>
              </div>

              {/* Type, Cognitive, Difficulty Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại câu hỏi:</label>
                  <select
                    value={editingQuestion.type}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, type: e.target.value as QuestionType })}
                    className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="mcq4">Trắc nghiệm 4 Lựa chọn</option>
                    <option value="true_false">Đúng / Sai</option>
                    <option value="short_answer">Điền đáp án số</option>
                    <option value="essay">Tự luận</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức độ nhận thức:</label>
                  <select
                    value={editingQuestion.cognitiveLevel}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, cognitiveLevel: e.target.value as CognitiveLevel })}
                    className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Độ khó:</label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as DifficultyLevel })}
                    className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khó">Khó</option>
                  </select>
                </div>
              </div>

              {/* MCQ Options editing */}
              {editingQuestion.type === "mcq4" && editingQuestion.options && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="font-bold text-slate-700 block">
                    Chỉnh sửa 4 lựa chọn và chọn đáp án đúng:
                  </label>
                  <div className="space-y-2">
                    {editingQuestion.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <input
                          type="radio"
                          name="correctOptionEdit"
                          checked={editingQuestion.correctAnswer === oIdx}
                          onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: oIdx })}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="font-bold text-slate-700 w-6">A{oIdx + 1}:</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...(editingQuestion.options || [])];
                            newOpts[oIdx] = e.target.value;
                            setEditingQuestion({ ...editingQuestion, options: newOpts });
                          }}
                          className="flex-1 p-2 border border-slate-300 rounded-lg text-xs font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation editing with MathInputKeypad */}
              <div className="border-t border-slate-100 pt-3">
                <MathInputKeypad
                  value={editingQuestion.explanation}
                  onChange={(val) => setEditingQuestion({ ...editingQuestion, explanation: val })}
                  label="Lời giải / Hướng dẫn chi tiết (Có thể dùng công thức Mathway):"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-3">
              <button
                onClick={() => handleDeleteQuestion(editingQuestion.id)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa Câu Hỏi
              </button>

              <div className="flex gap-2">
                <button onClick={() => setEditingQuestion(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                  Hủy
                </button>
                <button onClick={handleSaveEditQuestion} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm">
                  <Save className="w-3.5 h-3.5" /> Lưu Điều Chỉnh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Thêm Câu Hỏi Mới Môn Toán {selectedGrade}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <MathInputKeypad
                  value={newText}
                  onChange={(val) => setNewText(val)}
                  placeholder="Tính kết quả \frac{-5}{6} + \frac{1}{3}..."
                  label="Nội dung câu hỏi (Nhập hoặc dùng Bàn Phím Mathway):"
                />
              </div>

              {/* Live KaTeX Preview */}
              {newText.trim() && (
                <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200">
                  <div className="font-bold text-indigo-900 text-[11px] mb-1">Xem Trước Render Công Thức:</div>
                  <div className="text-sm font-bold text-slate-900">
                    <MathRenderer content={newText} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dạng câu hỏi:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as QuestionType)}
                    className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="mcq4">Trắc nghiệm 4 lựa chọn</option>
                    <option value="true_false">Đúng / Sai</option>
                    <option value="short_answer">Điền đáp án số</option>
                    <option value="essay">Tự luận</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức độ nhận thức:</label>
                  <select
                    value={newCognitive}
                    onChange={(e) => setNewCognitive(e.target.value as CognitiveLevel)}
                    className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>
              </div>

              <div>
                <MathInputKeypad
                  value={newExplanation}
                  onChange={(val) => setNewExplanation(val)}
                  placeholder="Quy đồng mẫu số ta được..."
                  label="Lời giải / Hướng dẫn chi tiết:"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs">
                Hủy
              </button>
              <button onClick={handleCreateQuestion} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-sm">
                Lưu Vào Ngân Hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
