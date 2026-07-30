export interface TeacherStudent {
  id: string;
  name: string;
  username: string;
  className: string; // Normalized clean class name e.g. "7A1"
  role: "student";
  tempPassword?: string;
  avatar?: string;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  completionRate: number;
  aiNote: string;
  weeklyProgress: number[];
  topicMastery: { topic: string; mastery: number }[];
  practiceHours: number;
  completedExercises: number;
}

export function normalizeClassName(cName: string): string {
  return cName.replace(/^Lớp\s*/i, "").trim();
}

export const INITIAL_TEACHER_STUDENTS: TeacherStudent[] = [
  // Lớp 7A1
  {
    id: "std-1",
    name: "Nguyễn Văn An",
    username: "NguyenVanAn_7A1",
    className: "7A1",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    score1: 8.5,
    score2: 8.0,
    score3: 9.0,
    score4: 8.2,
    completionRate: 98,
    aiNote: "Học lực Giỏi. Nắm chắc kiến thức Tập hợp & Số hữu tỉ. Cần rèn thêm chứng minh Hình học.",
    weeklyProgress: [7.5, 7.8, 8.0, 8.2, 8.5, 8.5],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 92 },
      { topic: "Số thực & Căn bậc hai", mastery: 85 },
      { topic: "Góc & Đường thẳng song song", mastery: 88 },
      { topic: "Tam giác bằng nhau", mastery: 80 }
    ],
    practiceHours: 14.5,
    completedExercises: 128
  },
  {
    id: "std-2",
    name: "Trần Thị Bình",
    username: "TranThiBinh_7A1",
    className: "7A1",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    score1: 7.0,
    score2: 6.5,
    score3: 8.0,
    score4: 7.2,
    completionRate: 92,
    aiNote: "Tiến bộ rõ rệt ở phần Phép tính số hữu tỉ. Hay mắc lỗi trình bày bài hình.",
    weeklyProgress: [6.0, 6.2, 6.8, 7.0, 7.2, 7.3],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 80 },
      { topic: "Số thực & Căn bậc hai", mastery: 75 },
      { topic: "Góc & Đường thẳng song song", mastery: 70 },
      { topic: "Tam giác bằng nhau", mastery: 68 }
    ],
    practiceHours: 11.2,
    completedExercises: 95
  },
  {
    id: "std-3",
    name: "Lê Minh Cường",
    username: "LeMinhCuong_7A1",
    className: "7A1",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    score1: 4.5,
    score2: 5.0,
    score3: 6.0,
    score4: 5.2,
    completionRate: 75,
    aiNote: "Hổng kiến thức cơ bản về Căn bậc hai & Tam giác. Cần phụ đạo thêm sau giờ học.",
    weeklyProgress: [4.0, 4.2, 4.5, 4.8, 5.0, 5.2],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 60 },
      { topic: "Số thực & Căn bậc hai", mastery: 48 },
      { topic: "Góc & Đường thẳng song song", mastery: 55 },
      { topic: "Tam giác bằng nhau", mastery: 42 }
    ],
    practiceHours: 6.5,
    completedExercises: 45
  },
  {
    id: "std-4",
    name: "Hoàng Thị Dung",
    username: "HoangThiDung_7A1",
    className: "7A1",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    score1: 9.8,
    score2: 9.5,
    score3: 10.0,
    score4: 9.6,
    completionRate: 100,
    aiNote: "Học sinh xuất sắc nhất lớp. Tư duy giải toán sáng tạo, tốc độ làm bài rất nhanh.",
    weeklyProgress: [9.0, 9.2, 9.5, 9.6, 9.8, 9.8],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 100 },
      { topic: "Số thực & Căn bậc hai", mastery: 98 },
      { topic: "Góc & Đường thẳng song song", mastery: 96 },
      { topic: "Tam giác bằng nhau", mastery: 98 }
    ],
    practiceHours: 22.0,
    completedExercises: 195
  },
  {
    id: "std-5",
    name: "Phạm Hải Nam",
    username: "PhamHaiNam_7A1",
    className: "7A1",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    score1: 6.0,
    score2: 5.5,
    score3: 7.0,
    score4: 6.0,
    completionRate: 90,
    aiNote: "Cần củng cố đọc hiểu bài toán có lời văn và kỹ năng phân tích đề.",
    weeklyProgress: [5.0, 5.5, 5.8, 6.0, 6.2, 6.5],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 70 },
      { topic: "Số thực & Căn bậc hai", mastery: 64 },
      { topic: "Góc & Đường thẳng song song", mastery: 60 },
      { topic: "Tam giác bằng nhau", mastery: 55 }
    ],
    practiceHours: 8.5,
    completedExercises: 72
  },
  {
    id: "std-6",
    name: "Vũ Bảo Ngọc",
    username: "VuBaoNgoc_7A1",
    className: "7A1",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    score1: 8.5,
    score2: 8.0,
    score3: 9.0,
    score4: 8.5,
    completionRate: 100,
    aiNote: "Tiến bộ vượt bậc môn Hình học. Làm bài cẩn thận và có tư duy logic tốt.",
    weeklyProgress: [7.2, 7.5, 8.0, 8.2, 8.5, 8.8],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 88 },
      { topic: "Số thực & Căn bậc hai", mastery: 84 },
      { topic: "Góc & Đường thẳng song song", mastery: 90 },
      { topic: "Tam giác bằng nhau", mastery: 82 }
    ],
    practiceHours: 13.0,
    completedExercises: 110
  },
  // Lớp 7A2
  {
    id: "std-7A2-1",
    name: "Phùng Gia Huy",
    username: "PhungGiaHuy_7A2",
    className: "7A2",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    score1: 9.5,
    score2: 9.0,
    score3: 9.5,
    score4: 9.2,
    completionRate: 100,
    aiNote: "Top 1 lớp 7A2. Tư duy logic xuất sắc, giải bài nhanh và cẩn thận.",
    weeklyProgress: [8.5, 8.8, 9.0, 9.2, 9.3, 9.5],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 98 },
      { topic: "Số thực & Căn bậc hai", mastery: 95 },
      { topic: "Góc & Đường thẳng song song", mastery: 90 },
      { topic: "Tam giác bằng nhau", mastery: 92 }
    ],
    practiceHours: 18.2,
    completedExercises: 160
  },
  {
    id: "std-7A2-2",
    name: "Nguyễn Mai Phương",
    username: "NguyenMaiPhuong_7A2",
    className: "7A2",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    score1: 8.0,
    score2: 8.5,
    score3: 8.0,
    score4: 8.2,
    completionRate: 96,
    aiNote: "Chăm chỉ, làm bài đầy đủ. Cần rèn thêm kỹ năng giải toán thực tế.",
    weeklyProgress: [7.0, 7.5, 7.8, 8.0, 8.2, 8.4],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 85 },
      { topic: "Số thực & Căn bậc hai", mastery: 82 },
      { topic: "Góc & Đường thẳng song song", mastery: 80 },
      { topic: "Tam giác bằng nhau", mastery: 86 }
    ],
    practiceHours: 12.8,
    completedExercises: 112
  },
  {
    id: "std-7A2-3",
    name: "Hoàng Minh Trí",
    username: "HoangMinhTri_7A2",
    className: "7A2",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    score1: 6.5,
    score2: 6.0,
    score3: 7.0,
    score4: 6.5,
    completionRate: 88,
    aiNote: "Cần cải thiện tốc độ tính nhẩm đại số và xem kỹ công thức hình học.",
    weeklyProgress: [5.5, 5.8, 6.0, 6.2, 6.5, 6.7],
    topicMastery: [
      { topic: "Số hữu tỉ & Phép tính", mastery: 72 },
      { topic: "Số thực & Căn bậc hai", mastery: 68 },
      { topic: "Góc & Đường thẳng song song", mastery: 65 },
      { topic: "Tam giác bằng nhau", mastery: 60 }
    ],
    practiceHours: 9.0,
    completedExercises: 80
  },
  // Lớp 8A1
  {
    id: "std-8A1-1",
    name: "Bùi Khánh Linh",
    username: "BuiKhanhLinh_8A1",
    className: "8A1",
    role: "student",
    tempPassword: "123456",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150",
    score1: 9.8,
    score2: 9.5,
    score3: 10.0,
    score4: 9.6,
    completionRate: 100,
    aiNote: "Xuất sắc Hằng đẳng thức & Phân thức đại số. Nắm vững định lý Thalès.",
    weeklyProgress: [9.0, 9.2, 9.4, 9.5, 9.6, 9.8],
    topicMastery: [
      { topic: "Hằng đẳng thức đáng nhớ", mastery: 98 },
      { topic: "Phân thức đại số", mastery: 95 },
      { topic: "Tứ giác & Hình bình hành", mastery: 92 },
      { topic: "Tam giác đồng dạng", mastery: 94 }
    ],
    practiceHours: 20.5,
    completedExercises: 185
  }
];

const STORAGE_KEY = "teacher_managed_students_v2";

export function getTeacherStudents(): TeacherStudent[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load teacher students from localStorage", e);
  }
  return INITIAL_TEACHER_STUDENTS;
}

export function saveTeacherStudents(students: TeacherStudent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    window.dispatchEvent(new Event("teacher_students_updated"));
  } catch (e) {
    console.warn("Failed to save teacher students to localStorage", e);
  }
}

// Convert Vietnamese string to non-accented string for username generation
function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9]/g, "");
}

export function createStudentItem(name: string, rawClassName: string, index: number = 0): TeacherStudent {
  const cleanClass = normalizeClassName(rawClassName);
  const cleanName = name.trim();
  const nameAscii = removeVietnameseTones(cleanName);
  const username = `${nameAscii}_${cleanClass}`;
  const pass = Math.floor(100000 + Math.random() * 900000).toString();

  // Generate realistic initial baseline scores for newly imported students
  const baseScore = Number((7.0 + Math.random() * 2.5).toFixed(1));
  const score1 = Number((baseScore + (Math.random() * 1.0 - 0.5)).toFixed(1));
  const score2 = Number((baseScore + (Math.random() * 1.0 - 0.5)).toFixed(1));
  const score3 = Number((baseScore + (Math.random() * 1.0 - 0.5)).toFixed(1));
  const score4 = Number((baseScore + (Math.random() * 1.0 - 0.5)).toFixed(1));

  const clamp = (val: number) => Math.min(10, Math.max(4, val));

  return {
    id: `std-imp-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    name: cleanName,
    username,
    className: cleanClass,
    role: "student",
    tempPassword: pass,
    avatar: `https://images.unsplash.com/photo-${1500000000000 + (index % 10) * 1000}?auto=format&fit=crop&q=80&w=150`,
    score1: clamp(score1),
    score2: clamp(score2),
    score3: clamp(score3),
    score4: clamp(score4),
    completionRate: Math.floor(85 + Math.random() * 15),
    aiNote: `Mới nhập danh sách Lớp ${cleanClass}. Điểm kiểm tra khởi đầu đạt khá/giỏi, cần tiếp tục phát huy.`,
    weeklyProgress: [
      clamp(baseScore - 0.6),
      clamp(baseScore - 0.4),
      clamp(baseScore - 0.2),
      clamp(baseScore),
      clamp(baseScore + 0.2)
    ],
    topicMastery: [
      { topic: "Chương I: Kiến thức nền tảng", mastery: Math.floor(80 + Math.random() * 18) },
      { topic: "Chương II: Đại số & Phép tính", mastery: Math.floor(75 + Math.random() * 20) },
      { topic: "Chương III: Hình học & Đo lường", mastery: Math.floor(70 + Math.random() * 25) }
    ],
    practiceHours: Number((8 + Math.random() * 10).toFixed(1)),
    completedExercises: Math.floor(60 + Math.random() * 80)
  };
}
