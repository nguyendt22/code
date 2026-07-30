import {
  User,
  AcademicYear,
  SchoolClass,
  Chapter,
  Question,
  Exam,
  StudentLearningProfile,
  LeaderboardEntry
} from "../types";

export const MOCK_USERS: User[] = [
  {
    id: "user-admin",
    name: "Quản Trị Viên Hệ Thống",
    username: "admin",
    role: "admin",
    email: "admin@edumath.edu.vn",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-08-15T08:00:00Z"
  },
  {
    id: "user-teacher-1",
    name: "Thầy Nguyễn Văn Toàn",
    username: "nguyenvantoan",
    role: "teacher",
    email: "toan.nv@edumath.edu.vn",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-08-20T08:00:00Z"
  },
  {
    id: "user-student-1",
    name: "Nguyễn Minh An",
    username: "NguyenMinhAn_7A1",
    role: "student",
    classId: "class-7a1",
    className: "7A1",
    grade: 7,
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-09-01T08:00:00Z"
  },
  {
    id: "user-student-2",
    name: "Trần Đức Bình",
    username: "TranDucBinh_7A1",
    role: "student",
    classId: "class-7a1",
    className: "7A1",
    grade: 7,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-09-01T08:00:00Z"
  }
];

export const MOCK_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: "ay-2025-2026",
    yearName: "2025 – 2026",
    isCurrent: true,
    startDate: "2025-09-05",
    endDate: "2026-05-31"
  },
  {
    id: "ay-2024-2025",
    yearName: "2024 – 2025",
    isCurrent: false,
    startDate: "2024-09-05",
    endDate: "2025-05-31"
  }
];

export const MOCK_CLASSES: SchoolClass[] = [
  {
    id: "class-7a1",
    name: "Lớp 7A1",
    grade: 7,
    academicYearId: "ay-2025-2026",
    teacherId: "user-teacher-1",
    teacherName: "Thầy Nguyễn Văn Toàn",
    studentCount: 38
  },
  {
    id: "class-7a2",
    name: "Lớp 7A2",
    grade: 7,
    academicYearId: "ay-2025-2026",
    teacherId: "user-teacher-1",
    teacherName: "Thầy Nguyễn Văn Toàn",
    studentCount: 36
  },
  {
    id: "class-8a1",
    name: "Lớp 8A1",
    grade: 8,
    academicYearId: "ay-2025-2026",
    teacherId: "user-teacher-1",
    teacherName: "Thầy Nguyễn Văn Toàn",
    studentCount: 40
  }
];

export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "chap-7-1",
    title: "Chương I: Số Hữu Tỉ",
    grade: 7,
    semester: 1,
    lessons: [
      {
        id: "les-7-1-1",
        title: "Bài 1: Tập hợp các số hữu tỉ",
        summary: "Định nghĩa số hữu tỉ là số viết được dưới dạng $\\frac{a}{b}$ ($a,b \\in \\mathbb{Z}, b \\neq 0$).",
        keyKnowledge: [
          "Tập hợp số hữu tỉ ký hiệu là $\\mathbb{Q}$.",
          "Mọi số nguyên, số thập phân đều là số hữu tỉ.",
          "Biểu diễn số hữu tỉ trên trục số."
        ],
        questionCount: 15,
        completedPct: 100
      },
      {
        id: "les-7-1-2",
        title: "Bài 2: Cộng, trừ, nhân, chia số hữu tỉ",
        summary: "Thực hiện các phép tính số hữu tỉ bằng cách đưa về cùng mẫu số hoặc chuyển thành phân số.",
        keyKnowledge: [
          "Quy tắc chuyển tế: $x + y = z \\Rightarrow x = z - y$.",
          "Thực hiện nhân chia phân số: $\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$.",
          "Quy tắc dấu trong chia phân số âm."
        ],
        questionCount: 20,
        completedPct: 70
      },
      {
        id: "les-7-1-3",
        title: "Bài 3: Luỹ thừa với số mũ tự nhiên của số hữu tỉ",
        summary: "Định nghĩa và các công thức luỹ thừa: $x^m \\cdot x^n = x^{m+n}$, $(x^m)^n = x^{m \\cdot n}$.",
        keyKnowledge: [
          "Luỹ thừa cùng cơ số.",
          "Luỹ thừa của luỹ thừa.",
          "Luỹ thừa của một tích, một thương."
        ],
        questionCount: 12,
        completedPct: 30
      }
    ]
  },
  {
    id: "chap-7-2",
    title: "Chương II: Số Thực & Tỉ Lệ Thức",
    grade: 7,
    semester: 1,
    lessons: [
      {
        id: "les-7-2-1",
        title: "Bài 1: Tỉ lệ thức và tính chất dãy tỉ số bằng nhau",
        summary: "Tính chất $\\frac{a}{b} = \\frac{c}{d} \\Rightarrow ad = bc$ và $\\frac{a}{b} = \\frac{c}{d} = \\frac{a+c}{b+d}$.",
        keyKnowledge: [
          "Tìm $x$ trong tỉ lệ thức.",
          "Áp dụng dãy tỉ số bằng nhau vào bài toán thực tế."
        ],
        questionCount: 18,
        completedPct: 40
      },
      {
        id: "les-7-2-2",
        title: "Bài 2: Căn bậc hai số học & Số thực $\\mathbb{R}$",
        summary: "Khái niệm số vô tỉ $\\mathbb{I}$, căn bậc hai số học $\\sqrt{a}$ ($a \\ge 0$).",
        keyKnowledge: [
          "Tính $\\sqrt{a}$ với $a$ là số chính phương.",
          "So sánh hai căn bậc hai số học."
        ],
        questionCount: 14,
        completedPct: 0
      }
    ]
  },
  {
    id: "chap-7-3",
    title: "Chương III: Góc & Đường Thẳng Song Song (Hình Học)",
    grade: 7,
    semester: 1,
    lessons: [
      {
        id: "les-7-3-1",
        title: "Bài 1: Hai góc đối đỉnh. Hai đường thẳng vuông góc",
        summary: "Tính chất hai góc đối đỉnh thì bằng nhau.",
        keyKnowledge: [
          "Định nghĩa góc đối đỉnh.",
          "Đường trung trực của đoạn thẳng."
        ],
        questionCount: 10,
        completedPct: 85
      },
      {
        id: "les-7-3-2",
        title: "Bài 2: Dấu hiệu nhận biết hai đường thẳng song song",
        summary: "Các cặp góc so le trong, đồng vị, trong cùng phía.",
        keyKnowledge: [
          "Góc so le trong bằng nhau.",
          "Góc đồng vị bằng nhau.",
          "Góc trong cùng phía bù nhau."
        ],
        questionCount: 16,
        completedPct: 50
      }
    ]
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q-1",
    text: "Kết quả của phép tính $\\frac{-3}{4} + \\frac{1}{2}$ là:",
    type: "mcq4",
    options: ["A. $\\frac{-1}{4}$", "B. $\\frac{-2}{6}$", "C. $\\frac{1}{4}$", "D. $\\frac{-5}{4}$"],
    correctAnswer: 0,
    explanation: "Quy đồng mẫu số: $\\frac{-3}{4} + \\frac{2}{4} = \\frac{-3 + 2}{4} = \\frac{-1}{4}$.",
    grade: 7,
    semester: 1,
    chapterId: "chap-7-1",
    chapterName: "Chương I: Số Hữu Tỉ",
    lessonId: "les-7-1-2",
    lessonName: "Bài 2: Cộng, trừ, nhân, chia số hữu tỉ",
    topicName: "Cộng trừ số hữu tỉ",
    cognitiveLevel: "Thông hiểu",
    difficulty: "Trung bình",
    tags: ["Số hữu tỉ", "Quy đồng"]
  },
  {
    id: "q-2",
    text: "Cho tỉ lệ thức $\\frac{x}{5} = \\frac{12}{15}$. Giá trị của $x$ là:",
    type: "mcq4",
    options: ["A. $x = 4$", "B. $x = 3$", "C. $x = 60$", "D. $x = 12$"],
    correctAnswer: 0,
    explanation: "Theo tính chất tỉ lệ thức: $x = \\frac{5 \\times 12}{15} = \\frac{60}{15} = 4$.",
    grade: 7,
    semester: 1,
    chapterId: "chap-7-2",
    chapterName: "Chương II: Số Thực & Tỉ Lệ Thức",
    lessonId: "les-7-2-1",
    lessonName: "Bài 1: Tỉ lệ thức",
    topicName: "Tìm x trong tỉ lệ thức",
    cognitiveLevel: "Thông hiểu",
    difficulty: "Dễ",
    tags: ["Tỉ lệ thức"]
  },
  {
    id: "q-3",
    text: "Phát biểu sau đúng hay sai: 'Số $0$ không phải là số hữu tỉ dương cũng không phải là số hữu tỉ âm.'",
    type: "true_false",
    options: ["Đúng", "Sai"],
    correctAnswer: "Đúng",
    explanation: "Đúng. Số 0 thuộc tập $\\mathbb{Q}$ nhưng không là số hữu tỉ âm hay dương.",
    grade: 7,
    semester: 1,
    chapterId: "chap-7-1",
    chapterName: "Chương I: Số Hữu Tỉ",
    lessonId: "les-7-1-1",
    lessonName: "Bài 1: Tập hợp các số hữu tỉ",
    topicName: "Tập hợp số hữu tỉ",
    cognitiveLevel: "Nhận biết",
    difficulty: "Dễ",
    tags: ["Lý thuyết"]
  },
  {
    id: "q-4",
    text: "Tính giá trị của căn bậc hai số học $\\sqrt{81}$:",
    type: "short_answer",
    correctAnswer: "9",
    explanation: "Vì $9 > 0$ và $9^2 = 81$ nên $\\sqrt{81} = 9$.",
    grade: 7,
    semester: 1,
    chapterId: "chap-7-2",
    chapterName: "Chương II: Số Thực",
    lessonId: "les-7-2-2",
    lessonName: "Bài 2: Căn bậc hai số học",
    topicName: "Căn bậc hai",
    cognitiveLevel: "Nhận biết",
    difficulty: "Dễ",
    tags: ["Căn bậc hai"]
  },
  {
    id: "q-5",
    text: "Cho hai đường thẳng $a$ và $b$ cắt bởi đường thẳng $c$. Nếu có một cặp góc so le trong bằng $60^\\circ$ thì hai đường thẳng $a$ và $b$ có song song không? Giải thích ngắn gọn.",
    type: "essay",
    correctAnswer: "Có song song. Vì theo dấu hiệu nhận biết hai đường thẳng song song, nếu đường thẳng c cắt a và b tạo ra một cặp góc so le trong bằng nhau thì a // b.",
    explanation: "Nếu đường thẳng c cắt hai đường thẳng a, b và trong các góc tạo thành có một cặp góc so le trong bằng nhau thì a // b.",
    grade: 7,
    semester: 1,
    chapterId: "chap-7-3",
    chapterName: "Chương III: Hình Học",
    lessonId: "les-7-3-2",
    lessonName: "Bài 2: Dấu hiệu nhận biết 2 đường thẳng song song",
    topicName: "Đường thẳng song song",
    cognitiveLevel: "Vận dụng",
    difficulty: "Trung bình",
    tags: ["Hình học", "Song song"]
  },
  {
    id: "q-6",
    text: "Sắp xếp các bước giải bài toán tìm hai số $x, y$ biết $\\frac{x}{3} = \\frac{y}{5}$ và $x + y = 16$:",
    type: "drag_drop",
    options: [
      "Bước 1: Áp dụng tính chất dãy tỉ số bằng nhau: $\\frac{x}{3} = \\frac{y}{5} = \\frac{x+y}{3+5} = \\frac{16}{8} = 2$",
      "Bước 2: Tìm $x = 3 \\times 2 = 6$",
      "Bước 3: Tìm $y = 5 \\times 2 = 10$",
      "Bước 4: Kết luận $(x, y) = (6, 10)$"
    ],
    correctAnswer: [
      "Bước 1: Áp dụng tính chất dãy tỉ số bằng nhau: $\\frac{x}{3} = \\frac{y}{5} = \\frac{x+y}{3+5} = \\frac{16}{8} = 2$",
      "Bước 2: Tìm $x = 3 \\times 2 = 6$",
      "Bước 3: Tìm $y = 5 \\times 2 = 10$",
      "Bước 4: Kết luận $(x, y) = (6, 10)$"
    ],
    explanation: "Quy trình thực hiện chuẩn theo các bước của dãy tỷ số bằng nhau.",
    grade: 7,
    semester: 1,
    chapterId: "chap-7-2",
    chapterName: "Chương II: Tỉ Lệ Thức",
    lessonId: "les-7-2-1",
    lessonName: "Bài 1: Tỉ lệ thức",
    topicName: "Dãy tỷ số bằng nhau",
    cognitiveLevel: "Vận dụng",
    difficulty: "Trung bình",
    tags: ["Thực hành"]
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: "exam-midterm-1",
    title: "Đề Kiểm Tra Giữa Kỳ I - Toán 7 (Chuẩn Ma Trận)",
    description: "Đề thi giữa kỳ I gồm 6 câu trắc nghiệm & tự luận covers Chương I và Chương II.",
    grade: 7,
    teacherId: "user-teacher-1",
    classIds: ["class-7a1", "class-7a2"],
    durationMinutes: 45,
    questions: MOCK_QUESTIONS,
    showScoreImmediately: true,
    allowReview: true,
    dueDate: "2026-08-10T23:59:00Z",
    status: "published"
  },
  {
    id: "exam-quick-quiz",
    title: "Mini Test: Phép Tính Trên Tập Hợp Số Hữu Tỉ",
    description: "Bài kiểm tra nhanh 15 phút đánh giá độ hiểu bài.",
    grade: 7,
    teacherId: "user-teacher-1",
    classIds: ["class-7a1"],
    durationMinutes: 15,
    questions: MOCK_QUESTIONS.slice(0, 3),
    showScoreImmediately: false,
    allowReview: true,
    dueDate: "2026-08-15T23:59:00Z",
    status: "published"
  }
];

export const MOCK_STUDENT_PROFILE: StudentLearningProfile = {
  studentId: "user-student-1",
  studentName: "Nguyễn Minh An",
  grade: 7,
  overallCompetencyPct: 74,
  overallAccuracyPct: 78,
  totalQuestionsAttempted: 142,
  streaksCount: 6,
  xpPoints: 1250,
  level: 4,
  subjectAreas: [
    { name: "Đại số (Số hữu tỉ & Số thực)", percentage: 82, status: "Tốt", color: "#10b981" },
    { name: "Hình học (Góc & Đường thẳng)", percentage: 68, status: "Khá", color: "#f59e0b" },
    { name: "Thống kê & Xác suất", percentage: 55, status: "Cần cải thiện", color: "#ef4444" }
  ],
  errorPatterns: [
    {
      id: "err-1",
      topicName: "Phép chia phân số âm",
      patternDescription: "Học sinh thường quên đảo ngược phân số thứ hai hoặc nhầm lẫn dấu khi chia cho phân số âm.",
      frequencyCount: 4,
      severity: "High",
      recommendedLessonId: "les-7-1-2",
      recommendedLessonTitle: "Bài 2: Cộng, trừ, nhân, chia số hữu tỉ"
    },
    {
      id: "err-2",
      topicName: "Góc so le trong & đồng vị",
      patternDescription: "Chưa xác định đúng đường thẳng c đóng vai trò đường cắt hai đường thẳng song song.",
      frequencyCount: 2,
      severity: "Medium",
      recommendedLessonId: "les-7-3-2",
      recommendedLessonTitle: "Bài 2: Dấu hiệu nhận biết 2 đường thẳng song song"
    }
  ],
  recommendations: [
    {
      id: "rec-1",
      title: "Củng cố quy tắc dấu chia phân số âm",
      description: "AI phát hiện bạn đã sai 4 lần ở dạng bài này. Ôn lại lý thuyết 3 phút và làm 5 câu bài tập tương tự.",
      type: "review_theory",
      topicName: "Phép chia số hữu tỉ",
      priority: "High"
    },
    {
      id: "rec-2",
      title: "Luyện bài tập Dãy tỷ số bằng nhau",
      description: "Dạng bài vận dụng tìm x, y qua dãy tỷ số bằng nhau để đạt mức điểm 8.5+.",
      type: "practice_advanced",
      topicName: "Tỉ lệ thức",
      priority: "Medium"
    }
  ],
  badges: [
    { id: "b1", name: "Chăm Chỉ 5 Ngày", description: "Duy trì chuỗi học tập 5 ngày liên tiếp", icon: "🔥", unlockedAt: "2026-07-25" },
    { id: "b2", name: "Thần Đồng Đại Số", description: "Đạt điểm tuyệt đối 3 bài test Đại số", icon: "📐", unlockedAt: "2026-07-28" },
    { id: "b3", name: "Trùm Giải Đố", description: "Hoàn thành 100 câu hỏi trắc nghiệm", icon: "🏆", unlockedAt: "2026-07-29" }
  ]
};

// Leaderboard Data Across Classes and Grades
export const MOCK_LEADERBOARD: (LeaderboardEntry & { grade?: number })[] = [
  // Grade 7 - 7A1 & 7A2
  { rank: 1, studentId: "std-top-1", studentName: "Lê Hoàng Yến", className: "7A1", grade: 7, xpPoints: 2450, level: 7 },
  { rank: 2, studentId: "std-top-2", studentName: "Trần Bảo Nam", className: "7A2", grade: 7, xpPoints: 2320, level: 7 },
  { rank: 3, studentId: "user-student-1", studentName: "Nguyễn Minh An (Bạn)", className: "7A1", grade: 7, xpPoints: 2150, level: 6, isCurrentUser: true },
  { rank: 4, studentId: "std-top-4", studentName: "Phạm Khánh Linh", className: "7A1", grade: 7, xpPoints: 1980, level: 5 },
  { rank: 5, studentId: "std-top-5", studentName: "Đỗ Quốc Anh", className: "7A2", grade: 7, xpPoints: 1850, level: 5 },
  { rank: 6, studentId: "std-top-6", studentName: "Vũ Phương Thảo", className: "7A1", grade: 7, xpPoints: 1740, level: 4 },
  { rank: 7, studentId: "std-top-9", studentName: "Dương Văn Khoa", className: "7A2", grade: 7, xpPoints: 1620, level: 4 },
  { rank: 8, studentId: "std-top-10", studentName: "Nguyễn Hà My", className: "7A1", grade: 7, xpPoints: 1510, level: 4 },
  { rank: 9, studentId: "std-7a1-9", studentName: "Hoàng Tấn Phát", className: "7A1", grade: 7, xpPoints: 1400, level: 3 },
  { rank: 10, studentId: "std-7a2-10", studentName: "Lê Ngọc Trinh", className: "7A2", grade: 7, xpPoints: 1320, level: 3 },

  // Grade 6
  { rank: 11, studentId: "std-6a1-1", studentName: "Nguyễn Văn Đạt", className: "6A1", grade: 6, xpPoints: 2280, level: 6 },
  { rank: 12, studentId: "std-top-8", studentName: "Bùi Thị Mai", className: "6A2", grade: 6, xpPoints: 2110, level: 6 },
  { rank: 13, studentId: "std-6a1-3", studentName: "Đinh Hoài Nam", className: "6A1", grade: 6, xpPoints: 1950, level: 5 },
  { rank: 14, studentId: "std-6a2-4", studentName: "Phan Thị Yến", className: "6A2", grade: 6, xpPoints: 1780, level: 4 },
  { rank: 15, studentId: "std-6a1-5", studentName: "Trịnh Minh Huy", className: "6A1", grade: 6, xpPoints: 1650, level: 4 },

  // Grade 8
  { rank: 16, studentId: "std-top-7", studentName: "Ngô Đức Trí", className: "8A1", grade: 8, xpPoints: 2510, level: 7 },
  { rank: 17, studentId: "std-8a2-2", studentName: "Trương Mỹ Linh", className: "8A2", grade: 8, xpPoints: 2390, level: 7 },
  { rank: 18, studentId: "std-8a1-3", studentName: "Lê Thanh Sơn", className: "8A1", grade: 8, xpPoints: 2180, level: 6 },
  { rank: 19, studentId: "std-8a2-4", studentName: "Hà Bích Ngọc", className: "8A2", grade: 8, xpPoints: 1920, level: 5 },

  // Grade 9
  { rank: 20, studentId: "std-9a1-1", studentName: "Trần Quang Đạt", className: "9A1", grade: 9, xpPoints: 2680, level: 8 },
  { rank: 21, studentId: "std-9a1-2", studentName: "Nguyễn Thùy Dung", className: "9A1", grade: 9, xpPoints: 2420, level: 7 },
  { rank: 22, studentId: "std-9a2-3", studentName: "Phạm Hải Đăng", className: "9A2", grade: 9, xpPoints: 2250, level: 6 }
];
