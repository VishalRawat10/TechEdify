import { useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import Loader from "../components/Loader";

export default function Courses() {
  const { courses } = useContext(CoursesContext);
  console.log(courses);
  return (
    <>
      {!courses ? <Loader /> : ""}
      <div>
        {courses?.map((course, idx) => (
          <p key={idx}>{course.name}</p>
        ))}
      </div>
    </>
  );
}
