import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { Users, Upload, FileSpreadsheet, KeyRound, Check, RefreshCw, Plus, Edit2, Copy, School, GraduationCap, Sparkles, AlertCircle, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { getTeacherClasses, saveTeacherClasses, TeacherClassItem } from "../../data/teacherClassStore";
import {
  getTeacherStudents,
  saveTeacherStudents,
  createStudentItem,
  normalizeClassName,
  TeacherStudent
} from "../../data/teacherStudentStore";

export const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<TeacherClassItem[]>(() => getTeacherClasses());

  const [students, setStudents] = useState<TeacherStudent[]>(() => getTeacherStudents());
  const [inputText, setInputText] = useState("");
  const [selectedClass, setSelectedClass] = useState("Lớp 7A1");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState(7);
  const [newSchoolYear, setNewSchoolYear] = useState("2025–2026");
  const [newSubject, setNewSubject] = useState("Toán Học THCS - Chương Trình Chuẩn GDPT 2018");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [generatedBatch, setGeneratedBatch] = useState<
    { name: string; username: string; initialPass: string; className: string }[]
  >([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<"file" | "text">("file");
  const [parseStatusMsg, setParseStatusMsg] = useState<string | null>(null);

  // Sync class counts dynamically based on student list
  useEffect(() => {
    const syncClassCounts = () => {
      const currentStudents = getTeacherStudents();
      const currentClasses = getTeacherClasses();
      const updatedClasses = currentClasses.map((c) => {
        const count = currentStudents.filter(
          (s) => normalizeClassName(s.className) === normalizeClassName(c.name)
        ).length;
        return { ...c, studentCount: count };
      });
      setClasses(updatedClasses);
      setStudents(currentStudents);
    };

    window.addEventListener("teacher_students_updated", syncClassCounts);
    window.addEventListener("teacher_classes_updated", syncClassCounts);
    return () => {
      window.removeEventListener("teacher_students_updated", syncClassCounts);
      window.removeEventListener("teacher_classes_updated", syncClassCounts);
    };
  }, []);

  // Save classes on changes
  useEffect(() => {
    saveTeacherClasses(classes);
  }, [classes]);

  // Generate unique Join Code
  const generateJoinCode = (className: string) => {
    const clean = className.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MATH-${clean}-${rand}`;
  };

  const handleCreateNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newCode = generateJoinCode(newClassName);
    const newRoom: TeacherClassItem = {
      id: `class-${Date.now()}`,
      name: newClassName.trim().startsWith("Lớp") ? newClassName.trim() : `Lớp ${newClassName.trim()}`,
      grade: newClassGrade,
      schoolYear: newSchoolYear,
      joinCode: newCode,
      subject: newSubject,
      studentCount: 0
    };

    const updated = [newRoom, ...classes];
    setClasses(updated);
    saveTeacherClasses(updated);
    setSelectedClass(newRoom.name);
    setNewClassName("");
    setShowCreateClassModal(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Automatic Username Generator
  const generateUsername = (fullName: string, className: string, existingNames: string[]) => {
    const cleanName = fullName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-zA-Z0-9]/g, "");

    let baseUsername = `${cleanName}_${className.replace(/\s+/g, "")}`;
    let candidate = baseUsername;
    let counter = 1;

    while (existingNames.includes(candidate)) {
      candidate = `${baseUsername}${counter}`;
      counter++;
    }

    return candidate;
  };

  // Enhanced Excel & CSV File Parser using SheetJS
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setParseStatusMsg(null);

    const isExcelOrCsv = /\.(xlsx|xls|ods|csv)$/i.test(file.name);

    if (isExcelOrCsv) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          const workbook = XLSX.read(buffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

          const extractedNames: string[] = [];

          const isHeaderOrTitle = (text: string) => {
            const lower = text.toLowerCase().trim();
            if (!lower) return true;
            const keywords = [
              "bảng danh sách", "trường thcs", "sở giáo dục", "phòng giáo dục",
              "danh sách học sinh", "năm học", "stt", "họ va ten", "họ và tên",
              "họ tên", "ngày sinh", "giới tính", "môn học", "lớp", "mã học sinh",
              "số thứ tự", "ghi chú", "chữ ký", "ho_ten", "full_name"
            ];
            return keywords.some((k) => lower.includes(k));
          };

          rows.forEach((row) => {
            if (!row || !Array.isArray(row)) return;
            const stringCells = row.map((cell) => String(cell || "").trim()).filter(Boolean);
            if (stringCells.length === 0) return;

            const rowText = stringCells.join(" ");
            if (isHeaderOrTitle(rowText)) return;

            const cleanCells = stringCells.map((c) => c.replace(/^[0-9]+[\.\,\t\s\-\/]+/, "").trim());

            let possibleName = "";

            // If split into "Họ và đệm" + "Tên" in adjacent columns
            if (cleanCells.length >= 2 && cleanCells[0].length > 1 && cleanCells[1].length >= 1 && !cleanCells[0].includes(" ") && cleanCells[1].split(" ").length === 1) {
              possibleName = `${cleanCells[0]} ${cleanCells[1]}`.trim();
            } else {
              // Find first cell that contains a multi-word name
              const found = cleanCells.find((c) => {
                const words = c.split(/\s+/).filter(Boolean);
                return words.length >= 2 && !/^\d+$/.test(c) && c.length >= 4;
              });
              if (found) {
                possibleName = found;
              } else if (cleanCells[0] && cleanCells[0].length >= 3 && !/^\d+$/.test(cleanCells[0])) {
                possibleName = cleanCells[0];
              }
            }

            possibleName = possibleName
              .replace(/^[0-9]+[\.\,\t\s\-\/]+/, "")
              .replace(/\s+/g, " ")
              .trim();

            if (possibleName && possibleName.length >= 3 && !isHeaderOrTitle(possibleName) && !/^\d+$/.test(possibleName)) {
              extractedNames.push(possibleName);
            }
          });

          if (extractedNames.length > 0) {
            setInputText(extractedNames.join("\n"));
            setParseStatusMsg(`Đã đọc thành công file Excel "${file.name}" — tìm thấy ${extractedNames.length} học sinh!`);
          } else {
            // Fallback plain text decode
            const text = new TextDecoder("utf-8").decode(buffer);
            const lines = text
              .split(/\r?\n/)
              .map((l) => l.replace(/^[0-9]+[\.\,\t\s\-\/]+/, "").trim())
              .filter((l) => l.length > 2 && !isHeaderOrTitle(l));
            setInputText(lines.join("\n"));
            setParseStatusMsg(`Trích xuất file text "${file.name}" — ${lines.length} học sinh.`);
          }
        } catch (err) {
          console.error("Error reading excel file", err);
          setParseStatusMsg("⚠️ Lỗi đọc cấu trúc Excel. Vui lòng chuyển file sang định dạng CSV/TXT hoặc dán trực tiếp danh sách.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const lines = content
            .split(/\r?\n/)
            .map((l) => l.replace(/^[0-9]+[\.\,\t\s\-\/]+/, "").trim())
            .filter((l) => l.length > 1 && !l.toLowerCase().includes("ho va ten"));
          setInputText(lines.join("\n"));
          setParseStatusMsg(`Đã trích xuất ${lines.length} học sinh từ file "${file.name}".`);
        }
      };
      reader.readAsText(file, "UTF-8");
    }
  };

  const handleProcessImport = () => {
    const lines = inputText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const existingUsernames = students.map((s) => s.username);
    const batch: { name: string; username: string; initialPass: string; className: string }[] = [];

    lines.forEach((name) => {
      const uname = generateUsername(name, selectedClass, [
        ...existingUsernames,
        ...batch.map((b) => b.username)
      ]);
      const pass = Math.random().toString(36).slice(-6);
      batch.push({
        name,
        username: uname,
        initialPass: pass,
        className: selectedClass
      });
    });

    setGeneratedBatch(batch);
  };

  const handleConfirmBatchCreate = () => {
    const newStudentItems: TeacherStudent[] = generatedBatch.map((item, idx) =>
      createStudentItem(item.name, selectedClass, idx)
    );

    const allStudents = [...students, ...newStudentItems];
    setStudents(allStudents);
    saveTeacherStudents(allStudents);

    // Update class counts for all classes
    const updatedClasses = classes.map((c) => {
      const count = allStudents.filter(
        (s) => normalizeClassName(s.className) === normalizeClassName(c.name)
      ).length;
      return { ...c, studentCount: count };
    });
    setClasses(updatedClasses);
    saveTeacherClasses(updatedClasses);

    setGeneratedBatch([]);
    setInputText("");
    setParseStatusMsg(null);
    setShowImportModal(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa học sinh "${name}" khỏi danh sách?`)) {
      const updatedStudents = students.filter((s) => s.id !== id);
      setStudents(updatedStudents);
      saveTeacherStudents(updatedStudents);

      const updatedClasses = classes.map((c) => {
        const count = updatedStudents.filter(
          (s) => normalizeClassName(s.className) === normalizeClassName(c.name)
        ).length;
        return { ...c, studentCount: count };
      });
      setClasses(updatedClasses);
      saveTeacherClasses(updatedClasses);
    }
  };

  const handleResetPassword = (studentName: string) => {
    const newPass = Math.random().toString(36).slice(-6);
    alert(`Đã khôi phục mật khẩu thành công cho học sinh ${studentName}.\nMật khẩu mới: ${newPass}`);
  };

  const filteredStudents = students.filter((s) => {
    if (selectedClass === "ALL") return true;
    return normalizeClassName(s.className) === normalizeClassName(selectedClass);
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
            <School className="w-6 h-6 text-indigo-600" />
            <span>Quản Lý Lớp Học & Cấp Tài Khoản Học Sinh</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tạo lớp học mới, cấp mã tham gia lớp học và tự động sinh danh sách tài khoản theo chuẩn ngành.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCreateClassModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Tạo Lớp Học Mới
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> Import Excel / Thêm Học Sinh
          </button>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Danh Sách Lớp Học Đang Giảng Dạy ({classes.length} Lớp)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((c) => {
            const isSelected = selectedClass === c.name;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedClass(c.name)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white border-indigo-700 shadow-md ring-2 ring-indigo-500/30"
                    : "bg-white hover:border-indigo-200 border-slate-200 text-slate-900 shadow-xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isSelected ? "bg-indigo-400/20 text-indigo-200 border border-indigo-400/30" : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      Khối {c.grade} • {c.schoolYear}
                    </span>
                    <h3 className="font-black text-base mt-2">{c.name}</h3>
                  </div>

                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-xl font-mono ${
                      isSelected ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {c.studentCount} em
                  </span>
                </div>

                <p className={`text-xs mt-2 truncate ${isSelected ? "text-indigo-200" : "text-slate-500"}`}>
                  {c.subject}
                </p>

                {/* Join Code Box */}
                <div className={`mt-4 p-2.5 rounded-2xl flex items-center justify-between border ${
                  isSelected ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-200"
                }`}>
                  <div>
                    <div className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? "text-indigo-300" : "text-slate-400"}`}>
                      Mã Lớp Luyện Tập:
                    </div>
                    <div className="font-mono font-black text-xs tracking-wider">{c.joinCode}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCode(c.joinCode);
                    }}
                    className={`p-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isSelected ? "bg-white/20 hover:bg-white/30 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    }`}
                  >
                    {copiedCode === c.joinCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === c.joinCode ? "Đã copy" : "Sao chép"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white text-xs font-bold flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Danh Sách Học Sinh:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-800 text-white font-bold border border-slate-700 rounded-lg px-2 py-1 text-xs"
            >
              <option value="ALL">-- Tất Cả Các Lớp --</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.studentCount} học sinh)
                </option>
              ))}
            </select>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Tổng: {filteredStudents.length} học sinh</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Họ & Tên Học Sinh</th>
                <th className="p-3.5">Lớp Học</th>
                <th className="p-3.5">Username Đăng Nhập</th>
                <th className="p-3.5">Trạng Thái Kích Hoạt</th>
                <th className="p-3.5 text-right">Thao Tác Quản Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">
                    Chưa có học sinh nào trong lớp {selectedClass}. Vui lòng nhấn "Import Excel / Thêm Học Sinh".
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-extrabold text-slate-900">{std.name}</td>
                    <td className="p-3.5">
                      <span className="bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-xl text-[11px] border border-indigo-100">
                        {std.className || selectedClass}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-indigo-700 font-bold">{std.username}</td>
                    <td className="p-3.5">
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-extrabold text-[11px] border border-emerald-200">
                        ✓ Đã kích hoạt
                      </span>
                    </td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResetPassword(std.name)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-indigo-600" /> Reset Mật Khẩu
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(std.id, std.name)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-xl transition-colors inline-flex items-center gap-1 border border-rose-200"
                        title="Xóa học sinh khỏi danh sách"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Create New Class Modal */}
      {showCreateClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <School className="w-5 h-5 text-emerald-600" />
                <span>Tạo Lớp Học Mới</span>
              </h3>
              <button onClick={() => setShowCreateClassModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateNewClass} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tên Lớp Học (ví dụ: Lớp 7A3, Lớp 8N2):</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên lớp..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Khối Học:</label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Niên Học:</label>
                  <input
                    type="text"
                    value={newSchoolYear}
                    onChange={(e) => setNewSchoolYear(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Chương Trình / Môn Học:</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mã tham gia lớp học sẽ được hệ thống sinh tự động sau khi nhấn Tạo Lớp!</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateClassModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm"
                >
                  Xác Nhận Tạo Lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Import Student Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Import Danh Sách Học Sinh & Sinh Tài Khoản</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            {generatedBatch.length === 0 ? (
              <div className="space-y-4">
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  <button
                    onClick={() => setImportMode("file")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                      importMode === "file" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Tải Lên File (Excel/CSV/TXT)
                  </button>
                  <button
                    onClick={() => setImportMode("text")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                      importMode === "text" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Dán Danh Sách Nhập Tay
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Chọn Lớp Học Cần Cấp Tài Khoản:</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.studentCount} học sinh)
                      </option>
                    ))}
                  </select>
                </div>

                {importMode === "file" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Tải Lên File Danh Sách (.xlsx, .csv, .txt):</label>
                    <label className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center space-y-2">
                      <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
                      <div>
                        <span className="font-bold text-xs text-indigo-900 block">Kéo thả file vào đây hoặc nhấp để chọn file</span>
                        <span className="text-[11px] text-slate-500">Hỗ trợ Excel (.xlsx, .xls), CSV hoặc TXT (Họ tên mỗi dòng)</span>
                      </div>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {parseStatusMsg && (
                      <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                        parseStatusMsg.startsWith("⚠️")
                          ? "bg-amber-50 border-amber-200 text-amber-900"
                          : "bg-emerald-50 border-emerald-200 text-emerald-900"
                      }`}>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{parseStatusMsg}</span>
                        </div>
                        <span className="text-xs font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-100">
                          {inputText.split("\n").filter(Boolean).length} học sinh
                        </span>
                      </div>
                    )}

                    {inputText && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          Danh Sách Họ & Tên Đã Trích Xuất (Bạn có thể chỉnh sửa nếu cần):
                        </label>
                        <textarea
                          rows={6}
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Dán Danh Sách Họ & Tên Học Sinh (Mỗi dòng 1 học sinh):</label>
                    <textarea
                      rows={5}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={"Nguyễn Minh An\nTrần Hoàng Yến\nĐỗ Quốc Anh"}
                      className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                )}

                <button
                  onClick={handleProcessImport}
                  disabled={!inputText.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Xử Lý Danh Sách & Sinh Mật Khẩu Tự Động ({inputText.split("\n").filter(Boolean).length} em)</span>
                </button>
              </div>
            ) : (
              /* Review Batch Table */
              <div className="space-y-4">
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-semibold">
                  Đã đề xuất {generatedBatch.length} tài khoản mới cho lớp {selectedClass}. Vui lòng kiểm tra trước khi xác nhận:
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-2.5">Họ tên</th>
                        <th className="p-2.5">Username Đề Xuất</th>
                        <th className="p-2.5">Mật Khẩu Tạo Tự Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {generatedBatch.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-sans font-bold text-slate-900">{item.name}</td>
                          <td className="p-2.5 text-indigo-700">{item.username}</td>
                          <td className="p-2.5 text-emerald-700">{item.initialPass}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setGeneratedBatch([])}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Làm Lại
                  </button>
                  <button
                    onClick={handleConfirmBatchCreate}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    Xác Nhận Tạo Tất Cả Tài Khoản
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

