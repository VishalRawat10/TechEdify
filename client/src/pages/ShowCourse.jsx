import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CoursesContext } from "../context/CoursesContext";

export default function ShowCourse() {
  const { id } = useParams();
  const { findCourseById } = useContext(CoursesContext);
  const course = findCourseById(id);
  if (!course) {
    <Navigate to={"/courses"} />;
  }
  return (
    <>
      <main
        className="p-2 xl:px-24 py-12"
        style={{ fontFamily: "Ubuntu, Poppins, sans-serif" }}
      >
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-center">{course?.name}</h1>
        </div>
        <section className="flex gap-8 w-full ">
          <div className="border-[#188acc] rounded-xl border-1 p-12 w-[60%] bg-white dark:bg-[var(--dark-bg-2)]">
            <h4 className="text-2xl font-semibold mb-4">Course Details</h4>
            <p>{course?.about}</p>
          </div>
          <div className="border-[#188acc] rounded-xl border-1 w-[40%] bg-white shadow-[3px_3px_1px_1px_var(--base-dim)] p-12 dark:bg-[var(--dark-bg-2)]">
            <h4 className="text-xl font-semibold mb-4">Chapters : </h4>
            <ol>
              {course?.content.map((chapter, idx) => (
                <li key={idx} className="mt-2">
                  {idx + 1 + ".  " + chapter}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}
