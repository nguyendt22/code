import React, { useState } from "react";
import { StudentLearningProfile } from "../../types";
import { MOCK_LEADERBOARD } from "../../data/mockData";
import { Trophy, Award, Crown, Sparkles, Zap, Calendar, School, Users, GraduationCap } from "lucide-react";

interface GamificationViewProps {
  profile: StudentLearningProfile;
}

// Shiny Realistic SVG Medal Component with Metallic Gradients & Ribbon
const MedalIconSVG: React.FC<{
  type: "gold" | "silver" | "bronze";
  size?: "sm" | "md" | "lg";
  rankNumber?: number;
}> = ({ type, size = "md", rankNumber }) => {
  const sizePx = size === "sm" ? 28 : size === "lg" ? 52 : 38;
  const uniqueId = `${type}-${size}-${rankNumber || "x"}`;

  return (
    <svg width={sizePx} height={sizePx} viewBox="0 0 64 64" fill="none" className="drop-shadow-md shrink-0 inline-block">
      <defs>
        {/* Gold Metallic Gradients */}
        <linearGradient id={`goldGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="25%" stopColor="#FBC02D" />
          <stop offset="60%" stopColor="#F57F17" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
        <radialGradient id={`goldShine-${uniqueId}`} cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FFF59D" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F57F17" stopOpacity="0" />
        </radialGradient>

        {/* Silver Metallic Gradients */}
        <linearGradient id={`silverGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#ECEFF1" />
          <stop offset="70%" stopColor="#90A4AE" />
          <stop offset="100%" stopColor="#37474F" />
        </linearGradient>

        {/* Bronze Metallic Gradients */}
        <linearGradient id={`bronzeGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFCC80" />
          <stop offset="30%" stopColor="#FB8C00" />
          <stop offset="70%" stopColor="#BF360C" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>

        {/* Ribbon Gradients */}
        <linearGradient id={`ribbonLeft-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E53935" />
          <stop offset="100%" stopColor="#C62828" />
        </linearGradient>
        <linearGradient id={`ribbonRight-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
      </defs>

      {/* Ribbon Top */}
      <path d="M 20 2 L 32 22 L 10 22 Z" fill={`url(#ribbonLeft-${uniqueId})`} />
      <path d="M 44 2 L 32 22 L 54 22 Z" fill={`url(#ribbonRight-${uniqueId})`} />
      <path d="M 16 22 L 48 22 L 32 30 Z" fill="#9A0007" opacity="0.85" />

      {/* Outer Medal Ring */}
      <circle
        cx="32"
        cy="40"
        r="21"
        fill={
          type === "gold"
            ? `url(#goldGrad-${uniqueId})`
            : type === "silver"
            ? `url(#silverGrad-${uniqueId})`
            : `url(#bronzeGrad-${uniqueId})`
        }
        stroke={type === "gold" ? "#FFF9C4" : type === "silver" ? "#FFFFFF" : "#FFE0B2"}
        strokeWidth="2.2"
      />

      {/* Inner Metallic Bevel Ring */}
      <circle
        cx="32"
        cy="40"
        r="16"
        fill="none"
        stroke={type === "gold" ? "#B78103" : type === "silver" ? "#455A64" : "#4E342E"}
        strokeWidth="1.2"
        strokeDasharray="2.5 1.5"
        opacity="0.75"
      />

      {/* Glossy Reflection Overlay */}
      {type === "gold" && <circle cx="32" cy="40" r="20" fill={`url(#goldShine-${uniqueId})`} />}

      {/* Center Rank Number */}
      <text
        x="32"
        y="45"
        textAnchor="middle"
        fontSize="15"
        fontWeight="900"
        fontFamily="sans-serif"
        fill={type === "gold" ? "#3E2723" : type === "silver" ? "#0D47A1" : "#1A237E"}
      >
        {rankNumber ? rankNumber : type === "gold" ? "1" : type === "silver" ? "2" : "3"}
      </text>

      {/* Small Star Emblem Above Number */}
      <path
        d="M 32 26.5 L 33.1 29 L 35.8 29 L 33.6 30.6 L 34.4 33.1 L 32 31.5 L 29.6 33.1 L 30.4 30.6 L 28.2 29 L 30.9 29 Z"
        fill={type === "gold" ? "#E65100" : type === "silver" ? "#263238" : "#3E2723"}
        opacity="0.9"
      />
    </svg>
  );
};

// Laurel Wreath Frame Component
const LaurelWreathBorder: React.FC<{ type: "gold" | "silver" | "bronze" }> = ({ type }) => {
  const color = type === "gold" ? "#F59E0B" : type === "silver" ? "#64748B" : "#B45309";

  return (
    <div className="absolute -inset-4 pointer-events-none flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id={`laurelGrad-${type}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={type === "gold" ? "#FBBF24" : type === "silver" ? "#CBD5E1" : "#D97706"} />
          </linearGradient>
        </defs>

        {/* Left Laurel Branch */}
        <g fill={`url(#laurelGrad-${type})`} stroke={color} strokeWidth="0.5">
          <path d="M 22,95 C 10,75 10,45 32,22" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 24,90 C 14,88 12,78 20,78 C 24,78 26,86 24,90 Z" />
          <path d="M 18,80 C 8,76 8,66 16,66 C 20,66 21,75 18,80 Z" />
          <path d="M 15,68 C 5,62 7,52 15,53 C 19,53 18,63 15,68 Z" />
          <path d="M 15,55 C 6,48 10,38 18,40 C 22,41 19,51 15,55 Z" />
          <path d="M 18,42 C 10,34 16,24 23,28 C 27,30 22,39 18,42 Z" />
          <path d="M 25,30 C 18,22 26,14 32,19 C 35,22 29,28 25,30 Z" />
        </g>

        {/* Right Laurel Branch */}
        <g fill={`url(#laurelGrad-${type})`} stroke={color} strokeWidth="0.5">
          <path d="M 98,95 C 110,75 110,45 88,22" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 96,90 C 106,88 108,78 100,78 C 96,78 94,86 96,90 Z" />
          <path d="M 102,80 C 112,76 112,66 104,66 C 100,66 99,75 102,80 Z" />
          <path d="M 105,68 C 115,62 113,52 105,53 C 101,53 102,63 105,68 Z" />
          <path d="M 105,55 C 114,48 110,38 102,40 C 98,41 101,51 105,55 Z" />
          <path d="M 102,42 C 110,34 104,24 97,28 C 93,30 98,39 102,42 Z" />
          <path d="M 95,30 C 102,22 94,14 88,19 C 85,22 91,28 95,30 Z" />
        </g>
      </svg>
    </div>
  );
};

// Mascot Data mapping for Top 10
const MASCOTS = [
  { id: 1, name: "Cú Siêu Trí Tuệ", avatar: "🦉" },
  { id: 2, name: "Cáo Nhanh Trí", avatar: "🦊" },
  { id: 3, name: "Mèo Sáng Tạo", avatar: "🐱" },
  { id: 4, name: "Gấu Chăm Chỉ", avatar: "🐼" },
  { id: 5, name: "Robot Tự Động", avatar: "🤖" },
  { id: 6, name: "Sư Tử Dũng Cảm", avatar: "🦁" },
  { id: 7, name: "Cá Heo Thông Thái", avatar: "🐬" },
  { id: 8, name: "Đại Bàng Tinh Anh", avatar: "🦅" },
  { id: 9, name: "Kỳ Lân May Mắn", avatar: "🦄" },
  { id: 10, name: "Hổ Tốc Độ", avatar: "🐯" }
];

export const GamificationView: React.FC<GamificationViewProps> = ({ profile }) => {
  const [scope, setScope] = useState<"class" | "grade" | "school">("school");
  const [selectedClass, setSelectedClass] = useState<string>("7A1");
  const [selectedGrade, setSelectedGrade] = useState<number>(7);
  const [period, setPeriod] = useState<"week" | "month" | "semester">("week");

  // Available classes and grades
  const ALL_CLASSES = ["6A1", "6A2", "7A1", "7A2", "8A1", "8A2", "9A1", "9A2"];
  const ALL_GRADES = [
    { value: 6, label: "Khối 6" },
    { value: 7, label: "Khối 7" },
    { value: 8, label: "Khối 8" },
    { value: 9, label: "Khối 9" }
  ];

  // Multiplier according to selected period
  const getPeriodMultiplier = (p: "week" | "month" | "semester") => {
    if (p === "month") return 3.5;
    if (p === "semester") return 12;
    return 1;
  };

  const periodMultiplier = getPeriodMultiplier(period);

  // Filter leaderboard data according to Scope (Class / Grade / School)
  const filteredData = MOCK_LEADERBOARD.filter((item) => {
    if (scope === "class") {
      return item.className === selectedClass;
    }
    if (scope === "grade") {
      const itemGrade = (item as any).grade || parseInt(item.className[0], 10);
      return itemGrade === selectedGrade;
    }
    return true; // "school" - entire school
  });

  // Calculate XP & Re-rank strictly 1..N
  const leaderboardData = filteredData
    .map((item) => ({
      ...item,
      xpPoints: Math.round(item.xpPoints * periodMultiplier)
    }))
    .sort((a, b) => b.xpPoints - a.xpPoints)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  // Top 3 Podium Items
  const rank1 = leaderboardData.find((i) => i.rank === 1);
  const rank2 = leaderboardData.find((i) => i.rank === 2);
  const rank3 = leaderboardData.find((i) => i.rank === 3);

  // Top 3 Podium Stage Configuration (Left: #2 Silver, Center: #1 Gold, Right: #3 Bronze)
  const podiumTop3 = [
    {
      item: rank2,
      mascot: MASCOTS[1],
      type: "silver" as const,
      medalTitle: "Huy Chương Bạc",
      heightClass: "h-40 sm:h-48",
      bgClass: "bg-gradient-to-t from-slate-400/30 via-slate-200/50 to-slate-50 border-slate-300 shadow-md",
      accentColor: "text-slate-800 font-extrabold"
    },
    {
      item: rank1,
      mascot: MASCOTS[0],
      type: "gold" as const,
      medalTitle: "Huy Chương Vàng",
      heightClass: "h-56 sm:h-64",
      bgClass:
        "bg-gradient-to-t from-amber-400/40 via-yellow-200/60 to-amber-50 border-amber-400 shadow-2xl ring-4 ring-amber-400/30",
      accentColor: "text-amber-950 font-black",
      isWinner: true
    },
    {
      item: rank3,
      mascot: MASCOTS[2],
      type: "bronze" as const,
      medalTitle: "Huy Chương Đồng",
      heightClass: "h-36 sm:h-40",
      bgClass: "bg-gradient-to-t from-amber-900/20 via-amber-700/10 to-amber-50/80 border-amber-300 shadow-sm",
      accentColor: "text-amber-900 font-bold"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg border border-purple-700/50 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-extrabold border border-amber-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              Bảng Vinh Danh •{" "}
              {scope === "class"
                ? `Lớp ${selectedClass}`
                : scope === "grade"
                ? `Khối ${selectedGrade} THCS`
                : "Toàn Trường THCS"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-display flex items-center gap-2 tracking-tight">
            <Trophy className="w-7 h-7 text-amber-400 drop-shadow-md" />
            <span>BỤC VINH DANH HUY CHƯƠNG TOÁN HỌC</span>
          </h1>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">
            Học sinh tích lũy XP qua bài tập & kiểm tra để tranh Huy Chương Vàng, Bạc, Đồng và sở hữu Mascot Linh Vật độc quyền!
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center shadow-inner">
            <div className="text-amber-300 font-black text-lg font-mono">{profile.xpPoints} XP</div>
            <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Điểm XP Của Bạn</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center shadow-inner">
            <div className="text-emerald-300 font-black text-lg font-mono">Cấp {profile.level}</div>
            <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Danh Hiệu</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Controls & Podium Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Scope & Period Filter Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500 fill-amber-400" />
              <span>
                BẢNG VÀNG{" "}
                {scope === "class"
                  ? `LỚP ${selectedClass}`
                  : scope === "grade"
                  ? `KHỐI ${selectedGrade}`
                  : "TOÀN TRƯỜNG"}{" "}
                - TOP 10 XUẤT SẮC
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Xếp hạng cập nhật liên tục theo điểm XP tích lũy ({period === "week" ? "Theo Tuần" : period === "month" ? "Theo Tháng" : "Theo Học Kỳ"})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Scope Filter Buttons (Theo Lớp, Theo Khối, Toàn Trường) */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setScope("class")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  scope === "class"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Theo Lớp
              </button>
              <button
                onClick={() => setScope("grade")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  scope === "grade"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Theo Khối
              </button>
              <button
                onClick={() => setScope("school")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  scope === "school"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                <School className="w-3.5 h-3.5" /> Toàn Trường
              </button>
            </div>

            {/* Time Period Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setPeriod("week")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  period === "week"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Tuần
              </button>
              <button
                onClick={() => setPeriod("month")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  period === "month"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Tháng
              </button>
              <button
                onClick={() => setPeriod("semester")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  period === "semester"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                <Trophy className="w-3.5 h-3.5" /> Học Kỳ
              </button>
            </div>
          </div>
        </div>

        {/* SECONDARY SELECTOR BAR (Choose specific Class or specific Grade) */}
        {scope === "class" && (
          <div className="flex flex-wrap items-center gap-2.5 bg-indigo-50/90 border border-indigo-200/80 p-3 rounded-2xl">
            <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5 shrink-0 pl-1">
              <Users className="w-4 h-4 text-indigo-600" /> Chọn Lớp Cần Vinh Danh:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {ALL_CLASSES.map((cName) => (
                <button
                  key={cName}
                  onClick={() => setSelectedClass(cName)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                    selectedClass === cName
                      ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  Lớp {cName}
                </button>
              ))}
            </div>
          </div>
        )}

        {scope === "grade" && (
          <div className="flex flex-wrap items-center gap-2.5 bg-indigo-50/90 border border-indigo-200/80 p-3 rounded-2xl">
            <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5 shrink-0 pl-1">
              <GraduationCap className="w-4 h-4 text-indigo-600" /> Chọn Khối Cần Vinh Danh:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {ALL_GRADES.map((gItem) => (
                <button
                  key={gItem.value}
                  onClick={() => setSelectedGrade(gItem.value)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                    selectedGrade === gItem.value
                      ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {gItem.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TOP 3 PODIUM STAGE (Rank 2 Silver | Rank 1 Gold | Rank 3 Bronze) */}
        <div className="pt-12 pb-6 px-4 bg-gradient-to-b from-indigo-50/70 via-slate-50 to-amber-50/40 rounded-3xl border border-indigo-100 relative overflow-hidden">
          <div className="text-center mb-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-900 bg-indigo-100/90 px-3.5 py-1 rounded-full border border-indigo-200 shadow-2xs">
              👑 BỤC VINH DANH TOP 3{" "}
              {scope === "class"
                ? `LỚP ${selectedClass}`
                : scope === "grade"
                ? `KHỐI ${selectedGrade}`
                : "TOÀN TRƯỜNG"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-2xl mx-auto">
            {podiumTop3.map((pod, idx) => {
              const { item, mascot, type, medalTitle, heightClass, bgClass, accentColor, isWinner } = pod;

              if (!item) {
                return (
                  <div key={idx} className="flex flex-col items-center opacity-40">
                    <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs mb-2">
                      ?
                    </div>
                    <div className="text-[11px] text-slate-400 font-bold mb-2">Chưa có HS</div>
                    <div className={`w-full ${heightClass} bg-slate-100/60 rounded-t-3xl border-t-2 border-x-2 border-slate-200 p-2 flex items-center justify-center`}>
                      <span className="text-[10px] text-slate-400 font-bold">Trống</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="flex flex-col items-center group relative">
                  {/* Winner Crown Header */}
                  {isWinner && (
                    <div className="absolute -top-11 flex flex-col items-center z-20">
                      <Crown className="w-9 h-9 text-amber-400 fill-amber-400 animate-bounce drop-shadow-lg" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-950 bg-gradient-to-r from-amber-300 to-amber-400 px-2.5 py-0.5 rounded-full shadow-xs border border-amber-500">
                        QUÁN QUÂN
                      </span>
                    </div>
                  )}

                  {/* Avatar Container with Laurel Wreath & Shiny SVG Medal Badge */}
                  <div className="relative mb-3 flex flex-col items-center">
                    <LaurelWreathBorder type={type} />

                    {/* Mascot Avatar Box */}
                    <div
                      className={`relative z-10 w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-extrabold text-3xl sm:text-4xl border-2 transition-transform group-hover:scale-110 shadow-xl ${
                        isWinner
                          ? "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 text-slate-950 border-amber-400 ring-4 ring-amber-400/40"
                          : type === "silver"
                          ? "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 text-slate-900 border-slate-300"
                          : "bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 text-amber-100 border-amber-700"
                      }`}
                    >
                      <span>{mascot.avatar}</span>
                    </div>

                    {/* Medal Icon Badge */}
                    <div className="absolute -bottom-3 z-20 bg-white p-0.5 rounded-full shadow-lg border border-slate-200">
                      <MedalIconSVG type={type} size="sm" rankNumber={item.rank} />
                    </div>
                  </div>

                  {/* Student Name & Mascot Tag */}
                  <div className="text-center mb-2 px-1 relative z-10 pt-2">
                    <div className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-[100px] sm:max-w-[150px]">
                      {item.studentName.replace(" (Bạn)", "")}
                    </div>

                    <div className="text-[10px] text-indigo-900 font-extrabold bg-indigo-100 px-2 py-0.5 rounded-md my-0.5 truncate max-w-[100px] sm:max-w-[130px] inline-block border border-indigo-200/60">
                      {mascot.name}
                    </div>

                    {item.isCurrentUser && (
                      <div>
                        <span className="text-[9px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded-full inline-block shadow-xs">
                          BẠN
                        </span>
                      </div>
                    )}

                    <div className="text-xs font-black text-indigo-700 font-mono mt-0.5">
                      {item.xpPoints} XP
                    </div>
                  </div>

                  {/* Podium Pillar Block */}
                  <div
                    className={`w-full ${heightClass} ${bgClass} rounded-t-3xl border-t-2 border-x-2 p-3 flex flex-col items-center justify-between text-center transition-all shadow-md`}
                  >
                    <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 pt-1">
                      HẠNG #{item.rank}
                    </div>

                    <div className="flex flex-col items-center my-auto">
                      <MedalIconSVG type={type} size="lg" rankNumber={item.rank} />
                    </div>

                    <div className={`text-xs font-black ${accentColor} pb-1`}>
                      {medalTitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAILED TOP 10 LEADERBOARD TABLE */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>BẢNG XẾP HẠNG CHI TIẾT TOP 10 HỌC SINH:</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              Hiển thị {Math.min(10, leaderboardData.length)} / {leaderboardData.length} học sinh
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            {leaderboardData.slice(0, 10).map((item, idx) => {
              const mascot = MASCOTS[idx % MASCOTS.length];
              const isGold = item.rank === 1;
              const isSilver = item.rank === 2;
              const isBronze = item.rank === 3;

              return (
                <div
                  key={item.studentId || idx}
                  className={`p-3.5 flex items-center justify-between transition-colors ${
                    item.isCurrentUser
                      ? "bg-amber-50/90 font-bold border-l-4 border-l-amber-500"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Medal / Rank Emblem */}
                    <div className="shrink-0 flex items-center justify-center w-9 h-9">
                      {isGold ? (
                        <MedalIconSVG type="gold" size="md" rankNumber={1} />
                      ) : isSilver ? (
                        <MedalIconSVG type="silver" size="md" rankNumber={2} />
                      ) : isBronze ? (
                        <MedalIconSVG type="bronze" size="md" rankNumber={3} />
                      ) : (
                        <div className="w-8 h-8 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 font-extrabold text-xs flex items-center justify-center font-mono">
                          #{item.rank}
                        </div>
                      )}
                    </div>

                    {/* Mascot Avatar */}
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      {mascot.avatar}
                    </div>

                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                        <span>{item.studentName}</span>
                        {item.isCurrentUser && (
                          <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.2 rounded-full font-black">
                            BẠN
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Linh vật: <strong className="text-indigo-900 font-bold">{mascot.name}</strong> • Lớp{" "}
                        <span className="font-bold text-slate-700">{item.className}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 text-right">
                    <div>
                      <div className="text-xs font-black text-indigo-700 font-mono">{item.xpPoints} XP</div>
                      <div className="text-[10px] text-slate-400 font-medium">Cấp {item.level}</div>
                    </div>

                    {/* Medal Badge Pill */}
                    <div className="shrink-0">
                      {isGold ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 text-amber-950 border border-amber-400 font-black text-xs shadow-xs">
                          <MedalIconSVG type="gold" size="sm" rankNumber={1} />
                          <span>Huy Chương Vàng</span>
                        </span>
                      ) : isSilver ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-slate-300 font-extrabold text-xs shadow-xs">
                          <MedalIconSVG type="silver" size="sm" rankNumber={2} />
                          <span>Huy Chương Bạc</span>
                        </span>
                      ) : isBronze ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-700/20 text-amber-950 border border-amber-300 font-extrabold text-xs shadow-xs">
                          <MedalIconSVG type="bronze" size="sm" rankNumber={3} />
                          <span>Huy Chương Đồng</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs">
                          <Award className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Top {item.rank} Xuất Sắc</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Bộ Huy Hiệu & Danh Hiệu Đã Mở Khóa</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profile.badges.map((badge) => (
            <div key={badge.id} className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
              <div className="text-3xl p-2 bg-white rounded-2xl shadow-xs border border-indigo-100 shrink-0">
                {badge.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">{badge.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
