import { SchoolClass } from "../types";

export interface TeacherClassItem {
  id: string;
  name: string; // e.g. "Lớp 7A1", "Lớp 7A2", "Lớp 8A1"
  grade: number;
  schoolYear: string;
  joinCode: string;
  subject: string;
  studentCount: number;
}

export const INITIAL_TEACHER_CLASSES: TeacherClassItem[] = [
  { id: "c1", name: "Lớp 7A1", grade: 7, schoolYear: "2025–2026", joinCode: "MATH-7A1-X9", subject: "Toán THCS - Bộ Chân Trời", studentCount: 38 },
  { id: "c2", name: "Lớp 7A2", grade: 7, schoolYear: "2025–2026", joinCode: "MATH-7A2-K4", subject: "Toán THCS - Bộ Cánh Diều", studentCount: 36 },
  { id: "c3", name: "Lớp 8A1", grade: 8, schoolYear: "2025–2026", joinCode: "MATH-8A1-Z1", subject: "Toán Đại Số & Hình Học 8", studentCount: 40 }
];

const STORAGE_KEY = "teacher_managed_classes_v1";

export function getTeacherClasses(): TeacherClassItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load teacher classes from localStorage", e);
  }
  return INITIAL_TEACHER_CLASSES;
}

export function saveTeacherClasses(classes: TeacherClassItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    // Dispatch a custom event so components listening for class changes update immediately
    window.dispatchEvent(new Event("teacher_classes_updated"));
  } catch (e) {
    console.warn("Failed to save teacher classes to localStorage", e);
  }
}
