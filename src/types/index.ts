export type UserRole = "student" | "teacher" | "admin" | "parent";

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  email?: string;
  avatarUrl?: string;
  classId?: string;
  className?: string;
  grade?: number; // 6, 7, 8
  createdAt: string;
}

export interface AcademicYear {
  id: string;
  yearName: string; // "2025-2026"
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

export interface SchoolClass {
  id: string;
  name: string; // "7A1"
  grade: number; // 7
  academicYearId: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
}

export type CognitiveLevel = "Nhận biết" | "Thông hiểu" | "Vận dụng" | "Vận dụng cao";
export type QuestionType =
  | "mcq4"
  | "true_false"
  | "short_answer"
  | "essay"
  | "drag_drop"
  | "math_formula"
  | "chart"
  | "geometry";

export interface Question {
  id: string;
  text: string; // Math formulas encoded in LaTeX e.g. $\frac{a}{b}$
  type: QuestionType;
  options?: string[]; // For MCQ4, drag_drop, etc.
  correctAnswer: string | number | boolean | string[];
  explanation: string;
  grade: number; // 6, 7, 8
  semester: 1 | 2;
  chapterId: string;
  chapterName: string;
  lessonId: string;
  lessonName: string;
  topicName: string;
  cognitiveLevel: CognitiveLevel;
  difficulty: "Dễ" | "Trung bình" | "Khó" | "Rất khó";
  tags: string[];
}

export interface QuestionAttempt {
  id: string;
  studentId: string;
  questionId: string;
  studentAnswer: any;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string;
  errorPatternDetected?: string;
  aiFeedback?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  grade: number;
  chapterId?: string;
  teacherId: string;
  classIds: string[];
  durationMinutes: number;
  questions: Question[];
  showScoreImmediately: boolean; // Teacher score visibility setting
  allowReview: boolean;
  dueDate: string;
  status: "published" | "draft" | "closed";
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  startedAt: string;
  submittedAt: string;
  durationSeconds: number;
  answers: Record<string, any>;
  aiSummaryReport?: {
    strengths: string[];
    weaknesses: string[];
    errorPatterns: string[];
    recommendedActions: string[];
  };
}

export interface CompetencySubjectArea {
  name: string; // "Đại số", "Hình học", "Thống kê & Xác suất"
  percentage: number; // 0 - 100
  status: "Tốt" | "Khá" | "Cần cải thiện";
  color: string;
}

export interface ErrorPatternItem {
  id: string;
  topicName: string;
  patternDescription: string;
  frequencyCount: number;
  severity: "High" | "Medium" | "Low";
  recommendedLessonId: string;
  recommendedLessonTitle: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: "review_theory" | "practice_basic" | "practice_advanced";
  topicName: string;
  targetUrl?: string;
  priority: "High" | "Medium" | "Low";
}

export interface StudentLearningProfile {
  studentId: string;
  studentName: string;
  grade: number;
  overallCompetencyPct: number;
  subjectAreas: CompetencySubjectArea[];
  errorPatterns: ErrorPatternItem[];
  recommendations: AIRecommendation[];
  totalQuestionsAttempted: number;
  overallAccuracyPct: number;
  streaksCount: number;
  xpPoints: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  className: string;
  xpPoints: number;
  level: number;
  isCurrentUser?: boolean;
}

export interface Chapter {
  id: string;
  title: string; // e.g. "Chương 1: Số hữu tỉ"
  grade: number;
  semester: 1 | 2;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string; // e.g. "Bài 1: Tập hợp các số hữu tỉ"
  summary: string;
  keyKnowledge: string[];
  questionCount: number;
  completedPct?: number;
}
