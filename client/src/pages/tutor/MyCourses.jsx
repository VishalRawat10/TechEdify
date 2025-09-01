import { useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { MessageContext } from "../../context/MessageContext";
import { TutorContext } from "../../context/TutorContext";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { apiInstance } from "../../services/axios.config";

export default function MyCourses() {
  const { setIsLoading } = useContext(TutorContext);
  const [courses, setCourses] = useState([]);
  const { setMessageInfo } = useContext(MessageContext);

  // get tutor courses
  useEffect(() => {
    const getTutorCourses = async () => {
      try {
        setIsLoading(true);
        const res = await apiInstance.get("/tutors/courses");
        setCourses(res.data.courses);
      } catch (err) {
        setMessageInfo(err.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    getTutorCourses();
  }, []);

  console.log(courses);
  return (
    <div className="px-6 h-[calc(100vh-4.5rem)] flex flex-col gap-6 w-full max-w-[32rem] mx-auto py-4 lg:max-w-[64rem]">
      <span className="flex justify-between items-center">
        <h1 className="text-2xl">My Courses</h1>
        <Link
          className="text-xs hover:bg-main/30 px-2 py-2 text-black dark:text-white rounded-lg flex justify-center items-center gap-1"
          to="/tutor/courses/create-course"
        >
          <AddIcon fontSize="small" /> New Course
        </Link>
      </span>

      {/* My courses container  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
        {courses.map((course) => {
          return <TutorCourseCard course={course} key={uuidv4()} />;
        })}
        {!courses.length && (
          <div className="flex flex-col items-center col-span-3 font-semibold text-2xl text-center mt-10">
            You haven't created any course!
            <Link
              to="/tutor/courses/create-course"
              className="p-4 w-fit flex items-center justify-center gap-2 rounded-xl text-lg bg-main/30 hover:bg-main/40 font-normal"
            >
              <AddIcon fontSize="large" />
              Create course now!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const TutorCourseCard = ({ course }) => {
  return (
    <Link
      className="flex flex-col gap-1 justify-center hover:bg-gray-300/10 p-2 rounded-xl max-w-[30rem] h-fit"
      to={`/tutor/courses/${course._id}/edit`}
    >
      <img
        src={course.thumbnail.url}
        loading="lazy"
        alt=""
        className="w-full h-fit rounded-xl aspect-video object-cover"
      />
      <div className="text-xs text-light-secondary dark:text-dark-secondary">
        <p className="text-sm text-black dark:text-white font-semibold">
          {course.title}
        </p>
        <p className="capitalize">
          <strong>Status: </strong>
          {course.courseStatus}, {course.publishStatus}
        </p>
        <p className="text-xs italic">Lectures: {course.lectures.length}</p>
      </div>
    </Link>
  );
};
