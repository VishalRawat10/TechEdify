import { useEffect, useState } from "react";
import { apiInstance } from "../../services/apis";
import AdminCourseCard from "../../components/UI/Admin/AdminCourseCard";

export default function AdminAllCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState("");

  const getCourses = async () => {
    return await apiInstance.get("/admin/courses");
  };

  useEffect(() => {
    setIsLoading(true);
    getCourses()
      .then((res) => setCourses(res.data.courses))
      .catch((err) => setMessageInfo(err.response.message))
      .finally(() => setIsLoading(false));
  }, []);

  console.log(courses);

  return (
    <div className="flex flex-col items-center px-6 h-[calc(100vh-6rem)] rounded-xl mx-auto w-full ">
      <h1 className="text-3xl font-semibold mb-2  w-[80%] ">
        Total Courses({courses.length})
      </h1>
      <div className="mb-6 text-[13px] flex gap-2 w-[80%] ">
        <button
          className={
            "rounded-full border-1 border-green-500 px-3 py-1 cursor-pointer hover:bg-green-500/20" +
            " " +
            (selected === "" ? "bg-green-500/20" : "")
          }
          onClick={() => setSelected("")}
        >
          All
        </button>
        <button
          className={
            "rounded-full border-1 border-green-500 px-3 py-1 cursor-pointer hover:bg-green-500/20" +
            " " +
            (selected === "published" ? "bg-green-500/20" : "")
          }
          onClick={() => setSelected("published")}
        >
          Published
        </button>
        <button
          className={
            "rounded-full border-1 border-green-500 px-3 py-1 cursor-pointer hover:bg-green-500/20" +
            " " +
            (selected === "unpublished" ? "bg-green-500/20" : "")
          }
          onClick={() => setSelected("unpublished")}
        >
          Unpublished
        </button>
      </div>
      <div className="w-full flex flex-col items-center gap-1 h-[calc(100vh-6rem)] overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
        {courses?.map((course, idx) => {
          if (!selected) {
            return (
              <AdminCourseCard
                courses={courses}
                setCourses={setCourses}
                idx={idx}
                key={idx}
              />
            );
          } else if (course.publishStatus === selected) {
            return (
              <AdminCourseCard
                courses={courses}
                setCourses={setCourses}
                idx={idx}
                key={idx}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
