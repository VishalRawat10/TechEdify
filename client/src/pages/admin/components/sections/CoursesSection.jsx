import { useState, useEffect, useContext } from "react";
import AdminFilterBar from "../shared/AdminFilterBar";
import CourseCard from "../shared/CourseCard";
import { apiInstance } from "../../../../services/axios.config";
import { MessageContext } from "../../../../context/MessageContext";

export default function CoursesSection({ setIsLoading }) {
  const [courses, setCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { setMessageInfo } = useContext(MessageContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiInstance.get("/admin/courses");
        setCourses(res.data?.courses || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setMessageInfo(
          err?.response?.data?.message || "Failed to load courses!"
        );
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesFilter =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
        ? course.isPublished
        : !course.isPublished;

    const matchesSearch = (
      course?.title?.toLowerCase() +
      " " +
      course?.tutor?.fullname?.toLowerCase()
    ).includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <section
      id="courses"
      className="min-h-[100vh] py-6 border-b border-b-gray-300 dark:border-b-gray-600"
    >
      <h3 className="text-2xl font-bold mb-6">All Courses</h3>

      <AdminFilterBar
        filters={[
          { label: "All", value: "all" },
          { label: "Published", value: "published" },
          { label: "Unpublished", value: "unpublished" },
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search courses..."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              setIsLoading={setIsLoading}
              setCourses={setCourses}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
            No courses found.
          </p>
        )}
      </div>
    </section>
  );
}
