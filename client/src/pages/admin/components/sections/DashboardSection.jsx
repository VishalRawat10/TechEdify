import { useEffect, useState } from "react";
import {
  School,
  Group,
  MenuBook,
  MonetizationOn,
  TrendingUp,
  Timeline,
  Star,
  CompareArrows,
} from "@mui/icons-material";
import { apiInstance } from "../../../../services/axios.config";

export default function DashboardSection() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalTutors: 0,
    totalStudents: 0,
    totalRevenue: 0,
  });

  const [enrollmentStats, setEnrollmentStats] = useState({
    totalEnrollments: 0,
    enrollmentsLastMonth: 0,
    enrollmentsThisMonth: 0,
    topCourseAllTime: null,
    topCourseThisMonth: null,
    topCourseAllTimeEnrollments: 0,
    topCourseThisMonthEnrollments: 0,
  });

  const [growthStats, setGrowthStats] = useState({
    tutorsLastMonth: 0,
    tutorsThisMonth: 0,
    studentsLastMonth: 0,
    studentsThisMonth: 0,
    coursesLastMonth: 0,
    coursesThisMonth: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, enrollmentsRes, growthRes] = await Promise.all([
          apiInstance.get("/admin/overview-stats"),
          apiInstance.get("/admin/enrollment-stats"),
          apiInstance.get("/admin/monthly-growth"),
        ]);
        setStats(statsRes.data);
        setEnrollmentStats(enrollmentsRes.data);
        setGrowthStats(growthRes.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <section
        id="dashboard"
        className="min-h-[80vh] flex items-center justify-center text-gray-500"
      >
        Loading dashboard...
      </section>
    );
  }

  return (
    <section
      id="dashboard"
      className="min-h-[100vh] py-6 border-b border-gray-300 dark:border-gray-700"
    >
      <h3 className="text-2xl font-bold mb-6">Dashboard Overview</h3>

      {/* KPI CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <KpiCard
          icon={<MenuBook className="text-blue-600" />}
          label="Total Courses"
          value={stats.totalCourses}
        />
        <KpiCard
          icon={<School className="text-green-600" />}
          label="Total Tutors"
          value={stats.totalTutors}
        />
        <KpiCard
          icon={<Group className="text-purple-600" />}
          label="Total Students"
          value={stats.totalStudents}
        />
        <KpiCard
          icon={<MonetizationOn className="text-yellow-600" />}
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
        />
      </div>

      {/* ENROLLMENT ANALYTICS */}
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 mb-10 shadow">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp /> Enrollment Analytics
        </h4>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatItem
            label="Total Enrollments"
            value={enrollmentStats.totalEnrollments}
          />
          <StatItem
            label="Enrollments Last Month"
            value={enrollmentStats.enrollmentsLastMonth}
          />
          <StatItem
            label="Enrollments This Month"
            value={enrollmentStats.enrollmentsThisMonth}
          />

          {enrollmentStats.topCourseAllTime && (
            <StatItem
              label="Top Course (All Time)"
              value={enrollmentStats.topCourseAllTime.title}
              subValue={`${enrollmentStats.topCourseAllTimeEnrollments} enrollments`}
              icon={<Star className="text-yellow-500" />}
            />
          )}
          {enrollmentStats.topCourseThisMonth && (
            <StatItem
              label="Top Course (This Month)"
              value={enrollmentStats.topCourseThisMonth.title}
              subValue={`${enrollmentStats.topCourseThisMonthEnrollments} enrollments`}
              icon={<Timeline className="text-blue-500" />}
            />
          )}
        </div>
      </div>

      {/* MONTHLY GROWTH COMPARISON */}
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 shadow">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CompareArrows /> Month-over-Month Growth
        </h4>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GrowthComparisonCard
            title="Tutor Registrations"
            lastMonth={growthStats.tutorsLastMonth}
            thisMonth={growthStats.tutorsThisMonth}
            icon={<School className="text-green-500" />}
          />
          <GrowthComparisonCard
            title="Student Registrations"
            lastMonth={growthStats.studentsLastMonth}
            thisMonth={growthStats.studentsThisMonth}
            icon={<Group className="text-purple-500" />}
          />
          <GrowthComparisonCard
            title="Courses Created"
            lastMonth={growthStats.coursesLastMonth}
            thisMonth={growthStats.coursesThisMonth}
            icon={<MenuBook className="text-blue-500" />}
          />
        </div>
      </div>
    </section>
  );
}

/* KPI CARD */
function KpiCard({ icon, label, value }) {
  return (
    <div className="bg-light-card dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h5 className="text-sm text-gray-500 dark:text-gray-400">{label}</h5>
        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
}

/* STAT ITEM */
function StatItem({ label, value, subValue, icon }) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className="text-xl">{icon}</div>}
        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </h5>
      </div>
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {value || "—"}
      </p>
      {subValue && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {subValue}
        </p>
      )}
    </div>
  );
}

/* GROWTH COMPARISON CARD */
function GrowthComparisonCard({ title, lastMonth, thisMonth, icon }) {
  const growth =
    lastMonth === 0
      ? thisMonth > 0
        ? 100
        : 0
      : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

  const growthColor =
    growth > 0
      ? "text-green-600"
      : growth < 0
      ? "text-red-600"
      : "text-gray-500";

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
          {icon}
        </div>
        <h5 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </h5>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-xs text-gray-500">Last Month</p>
          <p className="text-lg font-semibold">{lastMonth}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">This Month</p>
          <p className="text-lg font-semibold">{thisMonth}</p>
        </div>
      </div>

      <p className={`text-sm font-medium mt-2 ${growthColor}`}>
        {growth > 0
          ? `↑ ${growth}% growth`
          : growth < 0
          ? `↓ ${Math.abs(growth)}% decline`
          : "No change"}
      </p>
    </div>
  );
}
