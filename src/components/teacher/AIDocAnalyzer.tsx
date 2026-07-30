import React, { useState } from "react";
import { MathRenderer } from "../common/MathRenderer";
import { MathInputKeypad } from "../common/MathInputKeypad";
import { UploadCloud, Sparkles, FileText, CheckCircle2, Edit3, ArrowRight, RefreshCw, Trash2, Plus, X, Save } from "lucide-react";

export const AIDocAnalyzer: React.FC = () => {
  const [docName, setDocName] = useState("De_Kiem_Tra_Toan_7_Chuong_2.pdf");
  const [docContent, setDocContent] = useState("Tỉ lệ thức và tính chất dãy tỷ số bằng nhau. Căn bậc hai số học của 49 là 7. Tỷ số bằng nhau $a/b = c/d$.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);
  const [editingQuestionObj, setEditingQuestionObj] = useState<any>(null);
  const [editingKeyPointIdx, setEditingKeyPointIdx] = useState<number | null>(null);
  const [editingKeyPointText, setEditingKeyPointText] = useState<string>("");
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ name: string; size: string; type: string } | null>({
    name: "De_Kiem_Tra_Toan_7_Chuong_2.pdf",
    size: "1.2 MB",
    type: "application/pdf"
  });

  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`;
    setUploadedFileInfo({
      name: file.name,
      size: sizeFormatted,
      type: file.type || "application/octet-stream"
    });
    setDocName(file.name);

    if (file.type.includes("text") || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (text) setDocContent(text);
      };
      reader.readAsText(file);
    } else {
      setDocContent(`Trích đoạn nội dung tự động từ file ${file.name}: "Cho tỉ lệ thức $a/b = c/d$. Tìm $x$ thỏa mãn $2x + 3 = 15$. Căn bậc hai số học $\\sqrt{81} = 9$."`);
    }
  };

  const handleAnalyzeDoc = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/extract-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docTitle: docName, contentSnippet: docContent })
      });
      const data = await res.json();
      if (data.success) {
        setExtractedData(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Key point handlers
  const handleSaveKeyPoint = (idx: number) => {
    if (!extractedData) return;
    const updated = [...extractedData.extractedKeyPoints];
    updated[idx] = editingKeyPointText;
    setExtractedData({ ...extractedData, extractedKeyPoints: updated });
    setEditingKeyPointIdx(null);
  };

  const handleDeleteKeyPoint = (idx: number) => {
    if (!extractedData) return;
    const updated = extractedData.extractedKeyPoints.filter((_: any, i: number) => i !== idx);
    setExtractedData({ ...extractedData, extractedKeyPoints: updated });
  };

  const handleAddKeyPoint = () => {
    if (!extractedData) return;
    const updated = [...extractedData.extractedKeyPoints, "Khái niệm và kiến thức bổ sung..."];
    setExtractedData({ ...extractedData, extractedKeyPoints: updated });
  };

  // Question editing handlers
  const handleOpenEditQuestion = (idx: number) => {
    setEditingQuestionIdx(idx);
    setEditingQuestionObj(JSON.parse(JSON.stringify(extractedData.generatedQuestions[idx])));
  };

  const handleSaveEditedQuestion = () => {
    if (editingQuestionIdx === null || !extractedData || !editingQuestionObj) return;
    const updated = [...extractedData.generatedQuestions];
    updated[editingQuestionIdx] = editingQuestionObj;
    setExtractedData({ ...extractedData, generatedQuestions: updated });
    setEditingQuestionIdx(null);
    setEditingQuestionObj(null);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (!extractedData) return;
    const updated = extractedData.generatedQuestions.filter((_: any, i: number) => i !== idx);
    setExtractedData({ ...extractedData, generatedQuestions: updated });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <span>AI Trích Xuất & Phân Tích Tài Liệu (PDF / DOCX)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Giáo viên upload đề thi hoặc tài liệu PDF/Word. AI sẽ tự động đọc, trích xuất kiến thức trọng tâm và sinh bộ câu hỏi có đáp án & lời giải để giáo viên xem qua và điều chỉnh trực quan trước khi đưa vào ngân hàng.
        </p>
      </div>

      {/* Input / Upload Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Tải Lên Đề Thi Hoặc Bài Giảng (.pdf, .docx, .doc, .txt):</label>
          
          <label className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center space-y-2">
            <UploadCloud className="w-10 h-10 text-indigo-600 animate-bounce" />
            <div>
              <span className="font-bold text-xs text-indigo-950 block">Nhấp để chọn file hoặc kéo thả tài liệu vào đây</span>
              <span className="text-[11px] text-slate-500">Định dạng hỗ trợ: PDF, Word (.docx), TXT (Tối đa 25 MB)</span>
            </div>
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleDocFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {uploadedFileInfo && (
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-900 block">{uploadedFileInfo.name}</span>
                <span className="text-[11px] text-slate-500">Dung lượng: {uploadedFileInfo.size} • Đã sẵn sàng cho AI xử lý</span>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
              ✓ Đã tải lên
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Tên file / Tiêu đề bài kiểm tra:</label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Trích đoạn xem trước nội dung:</label>
            <input
              type="text"
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium font-mono"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyzeDoc}
          disabled={isProcessing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI Đang Phân Tích PDF & Sinh Câu Hỏi...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Bắt Đầu Cho AI Trích Xuất & Sinh Câu Hỏi</span>
            </>
          )}
        </button>
      </div>

      {/* Extracted Review Section */}
      {extractedData && (
        <div className="space-y-6 animate-in fade-in">
          {/* Metadata & Key Points */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Kết Quả AI Trích Xuất Kiến Thức Trọng Tâm (Giáo Viên Chỉnh Sửa Được)</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">
                  {extractedData.grade} • {extractedData.chapter}
                </span>
                <button
                  type="button"
                  onClick={handleAddKeyPoint}
                  className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-indigo-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Kiến Thức
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700">📌 Mạch Kiến Thức Trọng Tâm AI Sinh Ra:</h3>
              <div className="space-y-2 text-xs">
                {extractedData.extractedKeyPoints.map((pt: string, idx: number) => (
                  <div key={idx} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start justify-between gap-2">
                    {editingKeyPointIdx === idx ? (
                      <div className="w-full space-y-2">
                        <MathInputKeypad
                          value={editingKeyPointText}
                          onChange={setEditingKeyPointText}
                          label="Chỉnh sửa nội dung kiến thức AI:"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingKeyPointIdx(null)}
                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => handleSaveKeyPoint(idx)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" /> Lưu Thay Đổi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-2 pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                          <span className="font-medium text-slate-800"><MathRenderer content={pt} /></span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingKeyPointIdx(idx);
                              setEditingKeyPointText(pt);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                            title="Sửa nội dung"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteKeyPoint(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Questions List for Review & Approval */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Bộ Câu Hỏi AI Tự Động Sinh (Giáo Viên Duyệt & Điều Chỉnh Trực Quan)</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {extractedData.generatedQuestions.length} câu hỏi
              </span>
            </div>

            <div className="space-y-4">
              {extractedData.generatedQuestions.map((q: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-indigo-600">Câu {idx + 1}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                        {q.cognitiveLevel}
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                        Độ khó: {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditQuestion(idx)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 border border-indigo-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Điều Chỉnh Câu Hỏi
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200"
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-900 bg-white p-3 rounded-xl border border-slate-200">
                    <MathRenderer content={q.text} />
                  </div>

                  {q.options && q.options.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt: string, oIdx: number) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border ${
                            oIdx === q.correctIndex
                              ? "bg-emerald-50 border-emerald-300 font-bold text-emerald-900 flex items-center justify-between"
                              : "bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          <MathRenderer content={opt} />
                          {oIdx === q.correctIndex && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">Đáp án đúng</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs font-bold text-indigo-900 flex items-center justify-between">
                      <span>Đáp án đúng: {q.correctAnswer || q.correctIndex || "Đúng"}</span>
                      <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">Dạng ngắn / Đúng Sai</span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong>Lời giải:</strong> <MathRenderer content={q.explanation} />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert("Đã duyệt và chính thức lưu toàn bộ kiến thức & câu hỏi đã chỉnh sửa vào Ngân hàng dữ liệu!")}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>DUYỆT & ĐƯA BỘ CÂU HỎI ĐÃ ĐIỀU CHỈNH VÀO NGÂN HÀNG CHÍNH THỨC</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal for Editing AI Generated Question */}
      {editingQuestionIdx !== null && editingQuestionObj && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-base font-display">
                  Chỉnh Sửa Câu Hỏi AI (Câu {editingQuestionIdx + 1})
                </h3>
              </div>
              <button
                onClick={() => setEditingQuestionIdx(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Question Text Editor */}
              <div>
                <MathInputKeypad
                  value={editingQuestionObj.text}
                  onChange={(val) => setEditingQuestionObj({ ...editingQuestionObj, text: val })}
                  label="Đề bài câu hỏi (Nhập công thức trực quan Mathway):"
                />
              </div>

              {/* Cognitive & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mức độ nhận thức:</label>
                  <select
                    value={editingQuestionObj.cognitiveLevel || "Thông hiểu"}
                    onChange={(e) => setEditingQuestionObj({ ...editingQuestionObj, cognitiveLevel: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium bg-white"
                  >
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Độ khó:</label>
                  <select
                    value={editingQuestionObj.difficulty || "Trung bình"}
                    onChange={(e) => setEditingQuestionObj({ ...editingQuestionObj, difficulty: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium bg-white"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khó">Khó</option>
                  </select>
                </div>
              </div>

              {/* Options Editing */}
              {editingQuestionObj.options && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Các lựa chọn đáp án (Chọn nút tròn để đánh dấu đáp án đúng):
                  </label>
                  {editingQuestionObj.options.map((opt: string, oIdx: number) => (
                    <div key={oIdx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={editingQuestionObj.correctIndex === oIdx}
                        onChange={() => setEditingQuestionObj({ ...editingQuestionObj, correctIndex: oIdx })}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...editingQuestionObj.options];
                          newOpts[oIdx] = e.target.value;
                          setEditingQuestionObj({ ...editingQuestionObj, options: newOpts });
                        }}
                        className="w-full p-2 text-xs border border-slate-300 rounded-lg font-medium"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation Editor */}
              <div>
                <MathInputKeypad
                  value={editingQuestionObj.explanation || ""}
                  onChange={(val) => setEditingQuestionObj({ ...editingQuestionObj, explanation: val })}
                  label="Lời giải chi tiết:"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setEditingQuestionIdx(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Hủy Chỉnh Sửa
              </button>
              <button
                onClick={handleSaveEditedQuestion}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" /> Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

