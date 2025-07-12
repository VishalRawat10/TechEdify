import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import UserProfile from "../components/ui/UserProfile";
import Chart from "../components/ui/Chart";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (user.role === "instructor") {
    navigate("/instructor/dashboard");
  }

  return (
    <div className="student-dashboard py-2 px-2 md:py-4 md:px-16 h-fit flex gap-2 sm:gap-4 ">
      {/* Sidebar */}
      <DashboardSidebar />
      {/* Main Section  */}
      <main className="lg:w-[calc(100vw-19rem-8rem)]  h-[calc(100vh-var(--header-h)-2rem)]  overflow-y-auto flex flex-col gap-4">
        {/* Profile Section */}
        <section className="rounded-xl max-w-full bg-white dark:bg-[var(--dark-bg-2)] p-4 sm:p-8 flex flex-col md:flex-row gap-4 items-center relative">
          <UserProfile user={user} />
        </section>
        {/* Stats section  */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[var(--dark-bg-2)] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Courses Enrolled</h3>
            <p className="text-3xl mt-2 text-blue-600">5</p>
          </div>
          <div className="bg-white dark:bg-[var(--dark-bg-2)] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Hours Learned</h3>
            <p className="text-3xl mt-2 text-green-600">32 hrs</p>
          </div>
          <div className="bg-white dark:bg-[var(--dark-bg-2)] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Assignments Completed</h3>
            <p className="text-xl mt-2 text-purple-600">8 / 10</p>
          </div>
          <div className="bg-white dark:bg-[var(--dark-bg-2)] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Average Quiz Score</h3>
            <p className="text-2xl mt-2 text-yellow-600">84%</p>
          </div>
          <div className="bg-white dark:bg-[var(--dark-bg-2)] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Discussions Participated</h3>
            <p className="text-xl mt-2 text-pink-600">15</p>
          </div>
        </section>
        <section className="w-full">
          <Chart />
        </section>
        <section
          className="p-6 bg-white dark:bg-[var(--dark-bg-2)] rounded-lg"
          id="#my-courses"
        >
          <h3 className="text-xl font-semibold">My Courses</h3>
          <div></div>
        </section>
      </main>
    </div>
  );
}
