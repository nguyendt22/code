/**
 * ExamImportPreview - Preview and validate imported exam from DOCX
 * Displays parsed questions with math rendering, allows teacher review/edit
 */

import React, { useState } from 'react';
import { 
  ParsedExamDocument, 
  EnhancedQuestion, 
  ValidationIssue,
  ContentBlock 
} from '../../types/exam';
import { MathRenderer } from '../common/MathRenderer';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown,
  ChevronRight,
  Edit3,
  Trash2,
  Save,
  X,
  FileText,
  Image as ImageIcon,
  Table as TableIcon,
  FunctionSquare
} from 'lucide-react';

interface ExamImportPreviewProps {
  document: ParsedExamDocument;
  onAccept: (questions: EnhancedQuestion[]) => void;
  onCancel: () => void;
  onEditQuestion?: (question: EnhancedQuestion, index: number) => void;
}

export const ExamImportPreview: React.FC<ExamImportPreviewProps> = ({
  document,
  onAccept,
  onCancel,
  onEditQuestion
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set([0]));
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'issues' | 'metadata'>('preview');

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const expandAll = () => {
    setExpandedQuestions(new Set(document.allQuestions.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedQuestions(new Set());
  };

  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'error': return 'text-rose-600 bg-rose-50 border-rose-200';
    }
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
    }
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        return (
          <span key={index} className="inline">
            {block.value}
          </span>
        );
      
      case 'math':
        if (block.latex) {
          return (
            <span key={index} className="inline-block mx-1">
              <MathRenderer content={`$${block.latex}$`} />
            </span>
          );
        } else if (block.fallbackText) {
          return (
            <span key={index} className="inline-block mx-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-xs">
              <FunctionSquare className="w-3 h-3 inline mr-1" />
              {block.fallbackText}
              <span className="text-amber-600 ml-1">(chưa convert)</span>
            </span>
          );
        }
        return null;
      
      case 'image':
        return (
          <div key={index} className="my-2">
            <img 
              src={block.src} 
              alt={block.alt || 'Image'} 
              className="max-w-sm rounded-lg border border-slate-200"
              style={{ maxHeight: block.height || 300 }}
            />
            {block.isMathEquation && (
              <p className="text-xs text-slate-500 mt-1">
                <FunctionSquare className="w-3 h-3 inline" /> Equation as image
              </p>
            )}
          </div>
        );
      
      case 'table':
        return (
          <div key={index} className="my-3 overflow-x-auto">
            <table className="min-w-full border border-slate-300 text-sm">
              <tbody>
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-100 font-semibold' : ''}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="border border-slate-300 px-3 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'paragraph_break':
        return <br key={index} />;
      
      default:
        return null;
    }
  };

  const renderQuestion = (question: EnhancedQuestion, index: number) => {
    const isExpanded = expandedQuestions.has(index);
    const statusColor = getStatusColor(question.parseMetadata.parseStatus);
    const statusIcon = getStatusIcon(question.parseMetadata.parseStatus);

    return (
      <div key={question.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Question Header */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => toggleQuestion(index)}
        >
          <div className="flex items-center gap-3 flex-1">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
            )}
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm px-2 py-1 bg-indigo-100 text-indigo-900 rounded">
                {question.originalNumber || `#${index + 1}`}
              </span>
              {question.section && (
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {question.section}
                </span>
              )}
            </div>

            <div className={`flex items-center gap-1 px-2 py-1 rounded border text-xs ${statusColor}`}>
              {statusIcon}
              <span className="font-semibold capitalize">{question.parseMetadata.parseStatus}</span>
            </div>

            {question.parseMetadata.hasEquations && (
              <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                <FunctionSquare className="w-3 h-3" />
                {question.parseMetadata.equationCount}
              </div>
            )}

            {question.parseMetadata.hasImages && (
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                <ImageIcon className="w-3 h-3" />
                {question.parseMetadata.imageCount}
              </div>
            )}

            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {question.type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEditQuestion && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditQuestion(question, index);
                }}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Content (Expanded) */}
        {isExpanded && (
          <div className="p-6 pt-0 space-y-4 border-t border-slate-100">
            {/* Question Text */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-700">Nội dung câu hỏi:</h4>
              <div className="text-base text-slate-900 leading-relaxed">
                {question.content.map((block, idx) => renderContentBlock(block, idx))}
              </div>
            </div>

            {/* Choices (MCQ) */}
            {question.choices && question.choices.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-700">Đáp án:</h4>
                <div className="space-y-2">
                  {question.choices.map((choice, cIdx) => (
                    <div 
                      key={cIdx}
                      className={`p-3 rounded-lg border text-sm ${
                        choice.isCorrect 
                          ? 'bg-emerald-50 border-emerald-300' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="font-bold mr-2">{choice.label}.</span>
                      {choice.content.map((block, bIdx) => renderContentBlock(block, bIdx))}
                      {choice.isCorrect && (
                        <span className="ml-2 text-xs text-emerald-700 font-semibold">✓ Đúng</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-questions (True/False) */}
            {question.subQuestions && question.subQuestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-700">Các câu con:</h4>
                <div className="space-y-2">
                  {question.subQuestions.map((sub, sIdx) => (
                    <div key={sIdx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                      <span className="font-bold mr-2">{sub.label})</span>
                      {sub.content.map((block, bIdx) => renderContentBlock(block, bIdx))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings/Errors */}
            {(question.parseMetadata.warnings.length > 0 || question.parseMetadata.errors.length > 0) && (
              <div className="space-y-2">
                {question.parseMetadata.errors.length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm">
                    <div className="flex items-center gap-2 font-bold text-rose-900 mb-2">
                      <XCircle className="w-4 h-4" />
                      Lỗi:
                    </div>
                    <ul className="list-disc list-inside text-rose-800 space-y-1">
                      {question.parseMetadata.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {question.parseMetadata.warnings.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                    <div className="flex items-center gap-2 font-bold text-amber-900 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Cảnh báo:
                    </div>
                    <ul className="list-disc list-inside text-amber-800 space-y-1">
                      {question.parseMetadata.warnings.map((warn, idx) => (
                        <li key={idx}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="px-2 py-1 bg-slate-100 rounded">
                Độ tin cậy: {(question.parseMetadata.confidence * 100).toFixed(0)}%
              </span>
              <span className="px-2 py-1 bg-slate-100 rounded">
                {question.cognitiveLevel}
              </span>
              <span className="px-2 py-1 bg-slate-100 rounded">
                {question.difficulty}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Preview Đề Thi Import
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {document.metadata.fileName}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Summary */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">
                {document.parseReport.successfullyParsed}/{document.parseReport.totalQuestions} câu thành công
              </span>
            </div>
            
            {document.parseReport.withWarnings > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-semibold">{document.parseReport.withWarnings} cảnh báo</span>
              </div>
            )}
            
            {document.parseReport.withErrors > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 rounded-lg">
                <XCircle className="w-4 h-4" />
                <span className="font-semibold">{document.parseReport.withErrors} lỗi</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6">
          {[
            { id: 'preview', label: 'Xem Trước', icon: FileText },
            { id: 'issues', label: `Vấn Đề (${document.parseReport.validationIssues.length})`, icon: AlertTriangle },
            { id: 'metadata', label: 'Thông Tin', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={expandAll}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors"
                  >
                    Mở tất cả
                  </button>
                  <button
                    onClick={collapseAll}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors"
                  >
                    Đóng tất cả
                  </button>
                </div>

                <p className="text-sm text-slate-600">
                  {document.allQuestions.length} câu hỏi
                </p>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {document.allQuestions.map((question, index) => 
                  renderQuestion(question, index)
                )}
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-4">
              {document.parseReport.validationIssues.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-emerald-900">
                    Không có vấn đề nào!
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Tất cả câu hỏi đã được parse thành công.
                  </p>
                </div>
              ) : (
                document.parseReport.validationIssues.map((issue, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      issue.type === 'error' 
                        ? 'bg-rose-50 border-rose-200' 
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {issue.type === 'error' ? (
                        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        {issue.questionIndex !== undefined && (
                          <p className="text-xs font-bold mb-1">
                            Câu {issue.questionIndex + 1}
                          </p>
                        )}
                        <p className="text-sm font-semibold">
                          {issue.message}
                        </p>
                        {issue.suggestion && (
                          <p className="text-sm mt-1 text-slate-600">
                            💡 {issue.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Tên file</p>
                  <p className="text-sm font-semibold">{document.metadata.fileName}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Kích thước</p>
                  <p className="text-sm font-semibold">
                    {(document.metadata.fileSize / 1024).toFixed(2)} KB
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Công thức toán</p>
                  <p className="text-sm font-semibold">
                    {document.metadata.hasEquations ? '✓ Có' : '✗ Không'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Hình ảnh</p>
                  <p className="text-sm font-semibold">
                    {document.metadata.hasImages ? '✓ Có' : '✗ Không'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Bảng</p>
                  <p className="text-sm font-semibold">
                    {document.metadata.hasTables ? '✓ Có' : '✗ Không'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Thời gian parse</p>
                  <p className="text-sm font-semibold">
                    {new Date(document.metadata.parsedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm font-semibold text-indigo-900 mb-2">
                  Tóm tắt:
                </p>
                <p className="text-sm text-indigo-800">
                  {document.parseReport.summary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
          >
            Hủy
          </button>

          <button
            onClick={() => onAccept(document.allQuestions)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Chấp Nhận & Import {document.allQuestions.length} Câu
          </button>
        </div>
      </div>
    </div>
  );
};
