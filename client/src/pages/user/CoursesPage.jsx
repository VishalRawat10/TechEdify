import { useContext, useEffect, useState } from "react";
import { apiInstance } from "../../services/axios.config";
import { MessageContext } from "../../context/MessageContext";
import { UserContext } from "../../context/UserContext";
import Loader from "../../components/Loader";
import { SearchBox } from "../../components/FormComponents";
import CourseCard from "../../components/ui/CourseCard";

export default function CoursesPage() {
  const { setMessageInfo } = useContext(MessageContext);
  const { user } = useContext(UserContext);

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        setIsLoading(true);
        const res = await apiInstance.get("/courses/published");
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error(err);
        setMessageInfo(
          err.response?.data?.message || "Failed to fetch courses."
        );
      } finally {
        setIsLoading(false);
      }
    };
    getCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const text =
      (course.title || "").toLowerCase() +
      " " +
      (course.description || "").toLowerCase() +
      " " +
      course.chapters
        ?.map((ch) => ch.content)
        .join(" ")
        .toLowerCase();
    return text.includes(search.toLowerCase().trim());
  });

  return (
    <main className="min-h-screen w-full bg-light dark:bg-dark-card text-light-primary dark:text-dark-primary transition-colors duration-300">
      {isLoading && <Loader />}

      {/* === HEADER SECTION === */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 py-10 px-4 md:px-16 border-b border-gray-200 dark:border-gray-700 bg-light-card dark:bg-dark-subcard shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Explore <span className="text-main">Courses</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
            Browse through a wide range of expert-led courses and start your
            learning journey today.
          </p>
        </div>

        <SearchBox
          className="max-w-[20rem] md:max-w-[24rem]"
          placeholder="Search by course name or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* === COURSE GRID === */}
      <section className="py-10 px-4 md:px-16">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={user?.enrolledCourses?.some(
                  (c) => course._id === c._id
                )}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {search.trim()
                ? "No courses match your search."
                : "No courses available at the moment."}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please check back later or try different keywords.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
