import React, { useState } from "react";
import { User, UserRole, StudentLearningProfile } from "./types";
import { MOCK_USERS, MOCK_STUDENT_PROFILE } from "./data/mockData";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { LandingPage } from "./components/landing/LandingPage";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { LearningPath } from "./components/student/LearningPath";
import { PracticeSession } from "./components/student/PracticeSession";
import { CompetencyMap } from "./components/student/CompetencyMap";
import { ExamSimulator } from "./components/student/ExamSimulator";
import { GamificationView } from "./components/student/GamificationView";
import { TeacherDashboard } from "./components/teacher/TeacherDashboard";
import { ClassManagement } from "./components/teacher/ClassManagement";
import { QuestionBank } from "./components/teacher/QuestionBank";
import { AIDocAnalyzer } from "./components/teacher/AIDocAnalyzer";
import { AssignmentManager } from "./components/teacher/AssignmentManager";
import { ClassAnalytics } from "./components/teacher/ClassAnalytics";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ArchitectureDocModal } from "./components/docs/ArchitectureDocModal";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[2]); // Student Nguyễn Minh An
  const [activeView, setActiveView] = useState<string>("landing");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedPracticeLesson, setSelectedPracticeLesson] = useState<{ id?: string; title?: string }>({});

  const handleRoleSwitch = (newRole: UserRole) => {
    if (newRole === "student") {
      setCurrentUser(MOCK_USERS[2]); // Nguyễn Minh An
      setActiveView("dashboard");
    } else if (newRole === "teacher") {
      setCurrentUser(MOCK_USERS[1]); // Thầy Nguyễn Văn Toàn
      setActiveView("teacher_dashboard");
    } else if (newRole === "admin") {
      setCurrentUser(MOCK_USERS[0]); // Admin
      setActiveView("admin_overview");
    }
  };

  const handleSelectRoleFromLanding = (role: UserRole, targetView?: string) => {
    handleRoleSwitch(role);
    if (targetView) setActiveView(targetView);
  };

  const handleStartPractice = (lessonId: string, lessonTitle: string) => {
    setSelectedPracticeLesson({ id: lessonId, title: lessonTitle });
    setActiveView("practice");
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "landing":
        return (
          <LandingPage
            onSelectRole={handleSelectRoleFromLanding}
            onOpenDocModal={() => setIsDocModalOpen(true)}
          />
        );

      // Student Views
      case "dashboard":
        return (
          <StudentDashboard
            profile={MOCK_STUDENT_PROFILE}
            onNavigate={(v) => setActiveView(v)}
          />
        );
      case "learning":
        return <LearningPath onStartPractice={handleStartPractice} isTeacher={currentUser.role === "teacher"} />;
      case "practice":
        return (
          <PracticeSession
            lessonId={selectedPracticeLesson.id}
            lessonTitle={selectedPracticeLesson.title}
            onFinish={() => setActiveView("profile_ai")}
          />
        );
      case "exam":
        return <ExamSimulator onBack={() => setActiveView("dashboard")} />;
      case "profile_ai":
        return (
          <CompetencyMap
            profile={MOCK_STUDENT_PROFILE}
            onNavigatePractice={(lessonId) => handleStartPractice(lessonId, "Bài tập củng cố AI")}
          />
        );
      case "gamification":
        return <GamificationView profile={MOCK_STUDENT_PROFILE} />;

      // Teacher Views
      case "teacher_dashboard":
        return <TeacherDashboard onNavigate={(v) => setActiveView(v)} />;
      case "teacher_classes":
        return <ClassManagement />;
      case "teacher_questions":
        return <QuestionBank />;
      case "teacher_ai_docs":
        return <AIDocAnalyzer />;
      case "teacher_assignments":
        return <AssignmentManager />;
      case "teacher_analytics":
        return <ClassAnalytics />;

      // Admin Views
      case "admin_overview":
        return <AdminDashboard />;

      default:
        return (
          <LandingPage
            onSelectRole={handleSelectRoleFromLanding}
            onOpenDocModal={() => setIsDocModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        currentUser={currentUser}
        onRoleSwitch={handleRoleSwitch}
        onOpenDocModal={() => setIsDocModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentRole={currentUser.role}
          activeView={activeView}
          onNavigate={(view) => setActiveView(view)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      <ArchitectureDocModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />
    </div>
  );
}
