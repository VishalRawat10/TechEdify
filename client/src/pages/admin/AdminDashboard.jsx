import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import DashboardSection from "./components/sections/DashboardSection";
import CoursesSection from "./components/sections/CoursesSection";
import TutorsSection from "./components/sections/TutorsSection";
import StudentsSection from "./components/sections/StudentsSection";
import ProfileSection from "./components/sections/ProfileSection";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <MainLayout setIsLoading={setIsLoading} isLoading={isLoading}>
      <DashboardSection setIsLoading={setIsLoading} />
      <CoursesSection setIsLoading={setIsLoading} />
      <TutorsSection setIsLoading={setIsLoading} />
      <StudentsSection setIsLoading={setIsLoading} />
      <ProfileSection setIsLoading={setIsLoading} />
    </MainLayout>
  );
}
