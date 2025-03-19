import { useContext } from "react";
import { useParams } from "react-router-dom";
import { CoursesContext } from "../context/CoursesContext";

export default function ShowCourse() {
  const { id } = useParams();
  const { findCourseById } = useContext(CoursesContext);
  const course = findCourseById(id);
  return (
    <>
      <main className="p-2 xl:px-24 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-center">{course.name}</h1>
        </div>
        <section className="flex gap-8 w-full">
          <div className="border-[#188acc]/60 rounded-lg border-1 p-12 w-[60%] bg-white">
            <h4 className="text-2xl font-semibold mb-8">Course Details</h4>
            <p>{course.about}</p>
          </div>
          <div className="border-[#188acc]/60 rounded-lg border-1 w-[40%] bg-white shadow-[4px_4px_4px_2px_#188acc] dark:bg-[--dark-bg-">
            <h4>Included in this course:</h4>
            <p>{course.content.join(" | ")}</p>
          </div>
        </section>
      </main>
    </>
  );
}
