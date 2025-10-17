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
        setIsLoading(false);
        setCourses(res.data.courses);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setMessageInfo(err.response.data.message);
      }
    };

    getCourses();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <main className="flex flex-col gap-12 mx-auto w-screen py-6 px-4 lg:w-[64rem]">
        <section className="flex justify-between gap-4 items-center">
          <h1 className="text-2xl font-semibold">Courses</h1>
          <SearchBox
            className="max-w-[24rem]"
            placeholder={"Type the course name or keyword..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        {/*All Courses Section  */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const searchText =
              course.title.toLowerCase() +
              " " +
              course.description.toLowerCase() +
              " " +
              course.chapters.map(({ content }) => content).join(" ");

            if (search.trim().length) {
              if (
                searchText.toLowerCase().includes(search.toLowerCase().trim())
              ) {
                return (
                  <CourseCard
                    course={course}
                    key={course._id}
                    isEnrolled={user?.enrolledCourses?.some(
                      (c) => course._id === c._id
                    )}
                  />
                );
              } else return;
            }
            return (
              <CourseCard
                course={course}
                key={course._id}
                isEnrolled={user?.enrolledCourses?.some(
                  (c) => course._id === c._id
                )}
              />
            );
          })}
        </section>
      </main>
    </>
  );
}
