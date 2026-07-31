/**
 * ExamCreator - Comprehensive exam creation interface for teachers
 * 
 * Features:
 * - Create full exams with multiple questions
 * - Import questions from Excel/Word files
 * - Auto-format math expressions
 * - Preview before publishing
 * - Drag-and-drop question ordering
 */

import React, { useState } from "react";
import { Exam, Question, QuestionType, CognitiveLevel } from "../../types";
import { MathRenderer } from "../common/MathRenderer";
import { MathInputKeypad } from "../common/MathInputKeypad";
import { autoFormatQuestion, smartFormatVietnameseQuestion, validateMathFormatting } from "../../utils/autoMathFormatter";
import { importQuestionsFromExcel, downloadExcelTemplate } from "../../utils/excelImporter";
import { importQuestionsFromWord, importQuestionsFromBulkText } from "../../utils/wordImporter";
import { DocumentParser } from "../../services/DocumentParser";
import { ExamImportPreview } from "./ExamImportPreview";
import { ParsedExamDocument, EnhancedQuestion } from "../../types/exam";
import {
  FileText, Plus, Upload, Save, Eye, Trash2, Edit3, Check, X,
  AlertCircle, ChevronUp, ChevronDown, Copy, FileSpreadsheet,
  Sparkles, BookOpen, Clock, Users, Download
} from "lucide-react";

interface ExamCreatorProps {
  onSave?: (exam: Exam) => void;
  onCancel?: () => void;
  existingExam?: Exam;
}

export const ExamCreator: React.FC<ExamCreatorProps> = ({
  onSave,
  onCancel,
  existingExam
}) => {
  // Exam metadata
  const [examTitle, setExamTitle] = useState(existingExam?.title || "");
  const [examDescription, setExamDescription] = useState(existingExam?.description || "");
  const [examGrade, setExamGrade] = useState(existingExam?.grade || 7);
  const [examDuration, setExamDuration] = useState(existingExam?.durationMinutes || 45);
  const [examQuestions, setExamQuestions] = useState<Question[]>(existingExam?.questions || []);
  
  // UI state
  const [activeTab, setActiveTab] = useState<"info" | "questions" | "preview">("info");
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkImportText, setBulkImportText] = useState("");
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [parsedDocument, setParsedDocument] = useState<ParsedExamDocument | null>(null);
  const [isParsingDocx, setIsParsingDocx] = useState(false);
  
  // New question form
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>("mcq4");
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>(["", "", "", ""]);
  const [newQuestionCorrectAnswer, setNewQuestionCorrectAnswer] = useState<any>(0);
  const [newQuestionExplanation, setNewQuestionExplanation] = useState("");
  const [newQuestionCognitive, setNewQuestionCognitive] = useState<CognitiveLevel>("Thông hiểu");
  const [newQuestionDifficulty, setNewQuestionDifficulty] = useState<"Dễ" | "Trung bình" | "Khó">("Trung bình");

  // Auto-format toggle
  const [autoFormatEnabled, setAutoFormatEnabled] = useState(true);

  /**
   * Add a new question to the exam
   */
  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const rawQuestion: Question = {
      id: `q-${Date.now()}`,
      text: newQuestionText,
      type: newQuestionType,
      options: newQuestionType === "mcq4" ? newQuestionOptions.filter(o => o.trim()) : undefined,
      correctAnswer: newQuestionCorrectAnswer,
      explanation: newQuestionExplanation,
      grade: examGrade,
      semester: 1,
      chapterId: "custom",
      chapterName: "Tự tạo",
      lessonId: "custom",
      lessonName: "Tự tạo",
      topicName: examTitle || "Đề thi",
      cognitiveLevel: newQuestionCognitive,
      difficulty: newQuestionDifficulty,
      tags: [`Toán ${examGrade}`]
    };

    // Auto-format math if enabled
    const formattedQuestion = autoFormatEnabled ? autoFormatQuestion(rawQuestion) : rawQuestion;

    setExamQuestions([...examQuestions, formattedQuestion]);
    
    // Reset form
    setNewQuestionText("");
    setNewQuestionOptions(["", "", "", ""]);
    setNewQuestionExplanation("");
    setNewQuestionCorrectAnswer(0);
    setShowAddQuestionModal(false);
  };

  /**
   * Update an existing question
   */
  const handleUpdateQuestion = (index: number) => {
    if (editingQuestionIndex === null) return;
    
    const updated = [...examQuestions];
    const question = updated[editingQuestionIndex];
    
    // Auto-format if enabled
    if (autoFormatEnabled) {
      updated[editingQuestionIndex] = autoFormatQuestion(question);
    }
    
    setExamQuestions(updated);
    setEditingQuestionIndex(null);
  };

  /**
   * Delete a question
   */
  const handleDeleteQuestion = (index: number) => {
    if (confirm("Xóa câu hỏi này?")) {
      setExamQuestions(examQuestions.filter((_, i) => i !== index));
    }
  };

  /**
   * Move question up/down
   */
  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= examQuestions.length) return;
    
    const updated = [...examQuestions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setExamQuestions(updated);
  };

  /**
   * Duplicate a question
   */
  const handleDuplicateQuestion = (index: number) => {
    const original = examQuestions[index];
    const duplicate: Question = {
      ...original,
      id: `q-${Date.now()}`,
      text: original.text + " (Sao chép)"
    };
    
    const updated = [...examQuestions];
    updated.splice(index + 1, 0, duplicate);
    setExamQuestions(updated);
  };

  /**
   * Save the complete exam
   */
  const handleSaveExam = () => {
    if (!examTitle.trim()) {
      alert("Vui lòng nhập tên đề thi!");
      return;
    }
    
    if (examQuestions.length === 0) {
      alert("Đề thi phải có ít nhất 1 câu hỏi!");
      return;
    }

    const exam: Exam = {
      id: existingExam?.id || `exam-${Date.now()}`,
      title: examTitle,
      description: examDescription,
      grade: examGrade,
      teacherId: "current-teacher",
      classIds: [],
      durationMinutes: examDuration,
      questions: examQuestions,
      showScoreImmediately: true,
      allowReview: true,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "draft"
    };

    onSave?.(exam);
    alert(`Đã lưu đề thi "${examTitle}" với ${examQuestions.length} câu hỏi!`);
  };

  /**
   * Import from bulk text (copy-paste)
   */
  const handleBulkImport = () => {
    if (!bulkImportText.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const result = importQuestionsFromBulkText(bulkImportText, examGrade, autoFormatEnabled);
    
    if (result.questions.length === 0) {
      alert("❌ Không tìm thấy câu hỏi nào.\n\nHướng dẫn:\n- Mỗi dòng là 1 câu hỏi\n- Hoặc đánh số: 1. Câu hỏi, 2. Câu hỏi");
      return;
    }

    setExamQuestions([...examQuestions, ...result.questions]);
    setBulkImportText("");
    setShowBulkImportModal(false);
    
    alert(`✅ Đã import thành công ${result.questions.length} câu hỏi!`);
  };

  /**
   * Import questions from Excel file
   */
  const handleImportExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importQuestionsFromExcel(file, {
        grade: examGrade,
        autoFormat: autoFormatEnabled
      });

      if (result.errors.length > 0) {
        alert("Lỗi import:\n" + result.errors.join("\n"));
        return;
      }

      setExamQuestions([...examQuestions, ...result.questions]);
      
      let message = `✅ Đã import thành công ${result.questions.length} câu hỏi từ file ${file.name}`;
      if (result.warnings.length > 0) {
        message += "\n\n⚠️ Cảnh báo:\n" + result.warnings.slice(0, 5).join("\n");
        if (result.warnings.length > 5) {
          message += `\n... và ${result.warnings.length - 5} cảnh báo khác`;
        }
      }
      
      alert(message);
    } catch (err: any) {
      alert("Lỗi import file: " + err.message);
    }

    e.target.value = ""; // Reset input
  };

  /**
   * Import questions from text/Word file using NEW DocumentParser
   */
  const handleImportTextFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileName = file.name.toLowerCase();
      
      // Check if Word file - use NEW parser
      if (fileName.endsWith('.docx')) {
        setIsParsingDocx(true);
        
        try {
          console.log('[ExamCreator] Starting DOCX parse:', file.name);
          
          const parser = new DocumentParser({
            autoFormatMath: autoFormatEnabled,
            extractImages: true,
            detectQuestionTypes: true,
            detectSections: true,
            validateStructure: true,
            defaultGrade: examGrade,
            defaultCognitive: "Thông hiểu",
            defaultDifficulty: "Trung bình"
          });

          console.log('[ExamCreator] DocumentParser created, calling parseDocument...');
          const result = await parser.parseDocument(file);
          console.log('[ExamCreator] Parse result:', result);

          if (!result.success || !result.document) {
            const errorMsg = result.errors.join("\n") || "Unknown error";
            console.error('[ExamCreator] Parse failed:', errorMsg);
            alert("❌ Lỗi parse DOCX:\n\n" + errorMsg);
            setIsParsingDocx(false);
            e.target.value = "";
            return;
          }

          console.log('[ExamCreator] Parse successful, showing preview...');
          // Show preview modal
          setParsedDocument(result.document);
          setShowImportPreview(true);
          setIsParsingDocx(false);

          // Show warnings if any
          if (result.warnings.length > 0) {
            console.warn('[ExamCreator] Parse warnings:', result.warnings);
          }

        } catch (err: any) {
          console.error('[ExamCreator] DocumentParser error:', err);
          alert("❌ Lỗi parse DOCX: " + (err.message || err.toString()));
          setIsParsingDocx(false);
          e.target.value = "";
        }
      } 
      // Old .doc format - fallback to old parser
      else if (fileName.endsWith('.doc')) {
        const result = await importQuestionsFromWord(file, {
          grade: examGrade,
          autoFormat: autoFormatEnabled
        });

        if (result.errors.length > 0) {
          alert("❌ Lỗi import Word:\n\n" + result.errors.join("\n"));
          e.target.value = "";
          return;
        }

        setExamQuestions([...examQuestions, ...result.questions]);
        
        let message = `✅ Đã import thành công ${result.questions.length} câu hỏi từ file Word`;
        if (result.warnings.length > 0) {
          message += "\n\n⚠️ Lưu ý:\n" + result.warnings.join("\n");
        }
        
        alert(message);
      } 
      // Plain text file
      else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          if (!text) return;

          const lines = text.split('\n').filter(line => line.trim().length > 5);
          
          const imported: Question[] = lines.map((line, idx) => {
            const rawQ: Question = {
              id: `imported-${Date.now()}-${idx}`,
              text: line.trim(),
              type: "short_answer",
              correctAnswer: "",
              explanation: "Import từ file",
              grade: examGrade,
              semester: 1,
              chapterId: "custom",
              chapterName: "Import",
              lessonId: "custom",
              lessonName: "Import",
              topicName: examTitle,
              cognitiveLevel: "Thông hiểu",
              difficulty: "Trung bình",
              tags: [`Import ${file.name}`]
            };
            
            return autoFormatEnabled ? autoFormatQuestion(rawQ) : rawQ;
          });

          setExamQuestions([...examQuestions, ...imported]);
          alert(`✅ Đã import ${imported.length} câu hỏi từ file ${file.name}`);
        };
        
        reader.readAsText(file, 'utf-8');
      }
    } catch (err: any) {
      alert("❌ Lỗi import file: " + err.message);
      setIsParsingDocx(false);
    }
    
    e.target.value = ""; // Reset input
  };

  /**
   * Handle accept from import preview
   */
  const handleAcceptImport = (questions: EnhancedQuestion[]) => {
    // Convert EnhancedQuestion to Question
    const convertedQuestions: Question[] = questions.map(eq => {
      // Convert content blocks back to text for backward compatibility
      const text = eq.content
        .map(block => {
          if (block.type === 'text') return block.value;
          if (block.type === 'math' && block.latex) return `$${block.latex}$`;
          if (block.type === 'math' && block.fallbackText) return block.fallbackText;
          return '';
        })
        .filter(t => t)
        .join(' ');

      // Convert choices if MCQ
      let options: string[] | undefined;
      let correctAnswer: any = eq.correctAnswer;
      
      if (eq.choices && eq.choices.length > 0) {
        options = eq.choices.map(choice => 
          choice.content.map(b => b.type === 'text' ? b.value : '').join(' ')
        );
        // Find correct answer index
        const correctIdx = eq.choices.findIndex(c => c.isCorrect);
        if (correctIdx >= 0) correctAnswer = correctIdx;
      }

      return {
        id: eq.id,
        text,
        type: eq.type,
        options,
        correctAnswer,
        explanation: eq.explanation,
        grade: eq.grade,
        semester: eq.semester,
        chapterId: eq.chapterId,
        chapterName: eq.chapterName,
        lessonId: eq.lessonId,
        lessonName: eq.lessonName,
        topicName: eq.topicName,
        cognitiveLevel: eq.cognitiveLevel,
        difficulty: eq.difficulty,
        tags: eq.tags
      };
    });

    setExamQuestions([...examQuestions, ...convertedQuestions]);
    setShowImportPreview(false);
    setParsedDocument(null);
    alert(`✅ Đã import thành công ${convertedQuestions.length} câu hỏi!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {existingExam ? "Chỉnh Sửa Đề Thi" : "Tạo Đề Thi Mới"}
              </h1>
              <p className="text-sm text-indigo-200 mt-1">
                Tạo đề thi hoàn chỉnh với tự động format công thức toán
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors"
            >
              <X className="w-4 h-4 inline mr-1" />
              Hủy
            </button>
            <button
              onClick={handleSaveExam}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold transition-colors shadow-lg"
            >
              <Save className="w-4 h-4 inline mr-1" />
              Lưu Đề Thi
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          {[
            { id: "info", label: "Thông Tin", icon: FileText },
            { id: "questions", label: `Câu Hỏi (${examQuestions.length})`, icon: BookOpen },
            { id: "preview", label: "Xem Trước", icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-900 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tab: Exam Info */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Tên Đề Thi *
                  </label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="Ví dụ: Kiểm tra giữa kỳ I - Toán 7"
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Mô Tả
                  </label>
                  <textarea
                    value={examDescription}
                    onChange={(e) => setExamDescription(e.target.value)}
                    placeholder="Mô tả ngắn về nội dung đề thi..."
                    rows={3}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-y"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Lớp
                  </label>
                  <select
                    value={examGrade}
                    onChange={(e) => setExamGrade(Number(e.target.value))}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Thời Gian (phút)
                  </label>
                  <input
                    type="number"
                    value={examDuration}
                    onChange={(e) => setExamDuration(Number(e.target.value))}
                    min={5}
                    max={180}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-amber-900 text-sm">Tự Động Format Công Thức Toán</span>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoFormatEnabled}
                    onChange={(e) => setAutoFormatEnabled(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-amber-800">
                    Tự động thêm dấu $ và format công thức khi tạo câu hỏi
                    {autoFormatEnabled && " ✓ Đang bật"}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Tab: Questions */}
          {activeTab === "questions" && (
            <div className="space-y-4">
              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowAddQuestionModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Thêm Câu Hỏi Mới
                </button>
                
                <button
                  onClick={() => setShowBulkImportModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  <Copy className="w-4 h-4 inline mr-1" />
                  Copy-Paste Nhiều Câu
                </button>
                
                <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer">
                  <FileSpreadsheet className="w-4 h-4 inline mr-1" />
                  Import Excel/CSV
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleImportExcelFile}
                    className="hidden"
                  />
                </label>
                
                <label className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer relative">
                  <Upload className="w-4 h-4 inline mr-1" />
                  {isParsingDocx ? 'Đang xử lý...' : 'Upload DOCX'}
                  <input
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleImportTextFile}
                    disabled={isParsingDocx}
                    className="hidden"
                  />
                  {isParsingDocx && (
                    <span className="absolute inset-0 bg-slate-600 rounded-xl flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                </label>

                <button
                  onClick={() => downloadExcelTemplate()}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 inline mr-1" />
                  Tải File Mẫu
                </button>
              </div>

              {/* Questions list */}
              {examQuestions.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">
                    Chưa có câu hỏi nào. Nhấn "Thêm Câu Hỏi Mới" để bắt đầu.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {examQuestions.map((q, index) => (
                    <div key={q.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-900 rounded-lg text-xs font-bold">
                              Câu {index + 1}
                            </span>
                            <span className="text-xs text-slate-500">
                              {q.cognitiveLevel} • {q.difficulty}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            <MathRenderer content={q.text} />
                          </div>
                          {q.options && (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {q.options.map((opt, oIdx) => (
                                <div
                                  key={oIdx}
                                  className={`p-2 rounded-lg ${
                                    oIdx === q.correctAnswer
                                      ? "bg-emerald-100 border border-emerald-300 font-bold"
                                      : "bg-white border border-slate-200"
                                  }`}
                                >
                                  <MathRenderer content={opt} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveQuestion(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Di chuyển lên"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveQuestion(index, "down")}
                            disabled={index === examQuestions.length - 1}
                            className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Di chuyển xuống"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateQuestion(index)}
                            className="p-1 text-slate-400 hover:text-blue-600"
                            title="Sao chép"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingQuestionIndex(index)}
                            className="p-1 text-slate-400 hover:text-amber-600"
                            title="Chỉnh sửa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(index)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Preview */}
          {activeTab === "preview" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-2">{examTitle || "Chưa đặt tên"}</h2>
                <p className="text-slate-300 text-sm mb-4">{examDescription || "Chưa có mô tả"}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Lớp {examGrade}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{examDuration} phút</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{examQuestions.length} câu hỏi</span>
                  </div>
                </div>
              </div>

              {examQuestions.map((q, index) => (
                <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-bold text-sm text-indigo-600">
                      Câu {index + 1} ({q.cognitiveLevel})
                    </span>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-lg">
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="text-base font-semibold text-slate-900">
                    <MathRenderer content={q.text} />
                  </div>

                  {q.options && q.type === "mcq4" && (
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border text-sm ${
                            oIdx === q.correctAnswer
                              ? "bg-emerald-50 border-emerald-300 font-bold"
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <MathRenderer content={opt} />
                          {oIdx === q.correctAnswer && (
                            <span className="ml-2 text-xs text-emerald-700">(Đáp án đúng)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                      <strong className="text-amber-900">Lời giải:</strong>{" "}
                      <MathRenderer content={q.explanation} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Question Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Thêm Câu Hỏi Mới</h3>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Question text */}
              <div>
                <MathInputKeypad
                  value={newQuestionText}
                  onChange={setNewQuestionText}
                  label="Nội dung câu hỏi *"
                  placeholder="Nhập câu hỏi (công thức sẽ tự động được format nếu bật)"
                />
              </div>

              {/* Type, Cognitive, Difficulty */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Loại câu hỏi</label>
                  <select
                    value={newQuestionType}
                    onChange={(e) => setNewQuestionType(e.target.value as QuestionType)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="mcq4">Trắc nghiệm 4 đáp án</option>
                    <option value="true_false">Đúng/Sai</option>
                    <option value="short_answer">Trả lời ngắn</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Mức độ</label>
                  <select
                    value={newQuestionCognitive}
                    onChange={(e) => setNewQuestionCognitive(e.target.value as CognitiveLevel)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Độ khó</label>
                  <select
                    value={newQuestionDifficulty}
                    onChange={(e) => setNewQuestionDifficulty(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khó">Khó</option>
                  </select>
                </div>
              </div>

              {/* Options (if MCQ) */}
              {newQuestionType === "mcq4" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Các đáp án (đánh dấu đáp án đúng)
                  </label>
                  <div className="space-y-2">
                    {newQuestionOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct"
                          checked={newQuestionCorrectAnswer === idx}
                          onChange={() => setNewQuestionCorrectAnswer(idx)}
                          className="w-4 h-4"
                        />
                        <MathInputKeypad
                          value={opt}
                          onChange={(val) => {
                            const updated = [...newQuestionOptions];
                            updated[idx] = val;
                            setNewQuestionOptions(updated);
                          }}
                          placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div>
                <MathInputKeypad
                  value={newQuestionExplanation}
                  onChange={setNewQuestionExplanation}
                  label="Lời giải / Giải thích"
                  placeholder="Hướng dẫn giải..."
                />
              </div>

              {/* Preview */}
              {newQuestionText && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <div className="text-xs font-bold text-indigo-900 mb-2">XEM TRƯỚC:</div>
                  <div className="bg-white p-3 rounded-lg text-sm">
                    <MathRenderer content={smartFormatVietnameseQuestion(newQuestionText)} />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowAddQuestionModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddQuestion}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Thêm Câu Hỏi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal (Copy-Paste) */}
      {showBulkImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Import Câu Hỏi Từ Word/Text</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Copy-paste nội dung từ Word hoặc file text. Đáng tin cậy hơn việc upload file!
                </p>
              </div>
              <button
                onClick={() => setShowBulkImportModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-blue-900 mb-2">📝 Hướng dẫn:</h4>
                <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
                  <li>Mỗi dòng là một câu hỏi HOẶC đánh số: <code className="bg-white px-1 rounded">1. Câu hỏi, 2. Câu hỏi...</code></li>
                  <li>Công thức toán sẽ tự động format (nếu bật Auto-Format)</li>
                  <li>VD: <code className="bg-white px-1 rounded">Giải phương trình x^2 - 4 = 0</code></li>
                  <li><strong>Khuyến nghị:</strong> Mở file Word → Copy tất cả (Ctrl+A, Ctrl+C) → Paste vào đây</li>
                </ul>
              </div>

              {/* Textarea */}
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Nội dung câu hỏi ({bulkImportText.split('\n').filter(l => l.trim().length > 3).length} dòng)
                </label>
                <textarea
                  value={bulkImportText}
                  onChange={(e) => setBulkImportText(e.target.value)}
                  placeholder={"Paste nội dung từ Word vào đây...\n\nVí dụ:\n1. Giải phương trình x^2 - 4 = 0\n2. Tính giá trị biểu thức 2x + 3 khi x = 5\n3. Tìm x biết x/4 = 3/2"}
                  className="w-full h-64 p-4 border border-slate-300 rounded-xl text-sm font-mono resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Auto-format status */}
              <div className="flex items-center gap-2 text-sm">
                {autoFormatEnabled ? (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-700 font-semibold">Auto-format BẬT - Công thức toán sẽ tự động được format</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Auto-format TẮT - Bạn cần tự thêm $ cho công thức</span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => { setBulkImportText(""); setShowBulkImportModal(false); }}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={!bulkImportText.trim()}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy className="w-4 h-4 inline mr-1" />
                  Import Câu Hỏi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Preview Modal */}
      {showImportPreview && parsedDocument && (
        <ExamImportPreview
          document={parsedDocument}
          onAccept={handleAcceptImport}
          onCancel={() => {
            setShowImportPreview(false);
            setParsedDocument(null);
          }}
        />
      )}
    </div>
  );
};
