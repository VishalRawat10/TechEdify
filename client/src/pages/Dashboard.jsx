import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import StudentDashboard from "../components/StudentDashboard";
import InstructorDashboard from "../components/InstructorDashboard";
import AdminDashboard from "../components/AdminDashboard";

export default function Dashboard() {
  const { user } = useContext(UserContext);

  if (user?.role === "admin") {
    return <AdminDashboard />;
  } else if (user?.role === "instructor") {
    return <InstructorDashboard />;
  } else {
    return <StudentDashboard />;
  }
}
