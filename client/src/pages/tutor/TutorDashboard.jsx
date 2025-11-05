import { useEffect, useState, useContext } from "react";
import {
  MenuBook,
  Publish,
  Lock,
  TrendingUp,
  Group,
  CalendarToday,
  VideoLibrary,
  CheckCircle,
  AccessTime,
} from "@mui/icons-material";
import { apiInstance } from "../../services/axios.config";
import { TutorContext } from "../../context/TutorContext";
import { MessageContext } from "../../context/MessageContext";

export default function TutorDashboard() {
  const { tutor, setIsLoading } = useContext(TutorContext);
  const { setMessageInfo } = useContext(MessageContext);

  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    unpublishedCourses: 0,
    ongoingCourses: 0,
    completedCourses: 0,
    upcomingCourses: 0,

    totalEnrollments: 0,
    lastMonthEnrollments: 0,
    thisMonthEnrollments: 0,

    lastMonthCourses: 0,
    thisMonthCourses: 0,

    lastMonthLectures: 0,
    thisMonthLectures: 0,
  });

  useEffect(() => {
    const fetchTutorDashboard = async () => {
      setIsLoading(true);
      try {
        const res = await apiInstance.get(`/tutors/dashboard`);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load tutor dashboard:", err);
        setMessageInfo(
          err.response.data.message || "Failed to load dashboard details!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (tutor?._id) fetchTutorDashboard();
  }, [tutor]);

  return (
    <section className="py-6 px-4 sm:px-8 border-b border-gray-400 dark:border-gray-700 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* COURSES OVERVIEW */}
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MenuBook /> Course Overview
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            label="Total Courses"
            value={stats.totalCourses}
            icon={<MenuBook className="text-blue-500" />}
          />
          <StatCard
            label="Published"
            value={stats.publishedCourses}
            icon={<Publish className="text-green-500" />}
          />
          <StatCard
            label="Unpublished"
            value={stats.unpublishedCourses}
            icon={<Lock className="text-red-500" />}
          />
          <StatCard
            label="Ongoing"
            value={stats.ongoingCourses}
            icon={<AccessTime className="text-orange-500" />}
          />
          <StatCard
            label="Completed"
            value={stats.completedCourses}
            icon={<CheckCircle className="text-emerald-500" />}
          />
          <StatCard
            label="Upcoming"
            value={stats.upcomingCourses}
            icon={<CalendarToday className="text-purple-500" />}
          />
        </div>
      </div>

      {/* ENROLLMENT ANALYTICS */}
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Group /> Enrollment Statistics
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            label="Total Enrollments"
            value={stats.totalEnrollments}
            icon={<TrendingUp className="text-blue-600" />}
          />
          <StatCard
            label="Last Month Enrollments"
            value={stats.lastMonthEnrollments}
            icon={<CalendarToday className="text-yellow-600" />}
          />
          <StatCard
            label="This Month Enrollments"
            value={stats.thisMonthEnrollments}
            icon={<CalendarToday className="text-green-600" />}
          />
        </div>
      </div>

      {/* COURSE CREATION STATS */}
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MenuBook /> Course Creation Stats
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            label="Courses Created Last Month"
            value={stats.lastMonthCourses}
            icon={<CalendarToday className="text-blue-600" />}
          />
          <StatCard
            label="Courses Created This Month"
            value={stats.thisMonthCourses}
            icon={<CalendarToday className="text-green-600" />}
          />
        </div>
      </div>

      {/* LECTURE ANALYTICS */}
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <VideoLibrary /> Lecture Statistics
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            label="Lectures Last Month"
            value={stats.lastMonthLectures}
            icon={<CalendarToday className="text-blue-600" />}
          />
          <StatCard
            label="Lectures This Month"
            value={stats.thisMonthLectures}
            icon={<CalendarToday className="text-green-600" />}
          />
        </div>
      </div>
    </section>
  );
}

/* Reusable Stat Card Component */
function StatCard({ label, value, icon }) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h5 className="text-sm text-gray-500 dark:text-gray-400">{label}</h5>
        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}
