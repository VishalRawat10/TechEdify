import { useContext, useState } from "react";
import { MessageContext } from "../../../context/MessageContext";
import { apiInstance } from "../../../services/apis";
import Delete from "@mui/icons-material/Delete";

export default function AdminCourseCard({ courses, setCourses, idx }) {
  const [isLoading, setIsLoading] = useState(false);

  const { setMessageInfo } = useContext(MessageContext);

  const publishCourse = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.put(
        `admin/courses/${courses[idx]._id}/publish`
      );
      const updatedCourses = [...courses];
      updatedCourses[idx] = res.data.course;
      setCourses(updatedCourses);
    } catch (er) {
      console.log(er);
      setMessageInfo(er.response.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const unpublishCourse = async () => {
    setIsLoading(true);
    try {
      const res = await apiInstance.put(
        `admin/courses/${courses[idx]._id}/unpublish`
      );
      const updatedCourses = [...courses];
      updatedCourses[idx] = res.data.course;
      setCourses(updatedCourses);
    } catch (er) {
      console.log(er);
      setMessageInfo(er.response.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async () => {
    setIsLoading(true);
    apiInstance
      .delete(`admin/courses/${courses[idx]._id}`)
      .then((res) => {
        const updatedCourses = courses.filter(
          (course) => course._id !== courses[idx]._id
        );
        setCourses(updatedCourses);
        setMessageInfo("Course deleted successfylly!", false);
      })
      .catch((err) =>
        setMessageInfo(
          err.response.data.message || "Unable to delete course!",
          true
        )
      )
      .finally(() => setIsLoading(false));
  };
  return (
    <div className="flex px-3 py-3 bg-white dark:bg-[var(--dark-bg-2)] justify-between rounded-lg shadow-md dark:shadow-gray-800  cursor-pointer w-[80%]">
      <div className="flex gap-2">
        <img
          src={courses[idx]?.profileImg}
          className="w-28 aspect-video rounded-md "
          loading="lazy"
          alt=""
        />
        <span className="grid text-gray-700 dark:text-gray-300">
          <p className="font-semibold">{courses[idx]?.name}</p>
          <i className="text-[12px]">
            Instructor: {courses[idx]?.instructor?.name}
          </i>
          <i className="text-[12px]">Price: &#8377;{courses[idx]?.price}</i>
          <i className="text-[12px] capitalize">
            Status: {courses[idx]?.courseStatus}
          </i>
        </span>
      </div>
      <div className="flex gap-6 justify-center items-center">
        {isLoading ? (
          <button
            className="cursor-pointer text-sm  font-semibold disabled:cursor-not-allowed"
            disabled
          >
            Loading...
          </button>
        ) : courses[idx].publishStatus === "published" ? (
          <button
            className="cursor-pointer text-sm hover:underline font-semibold text-red-500"
            onClick={(e) => unpublishCourse()}
          >
            Unpublish
          </button>
        ) : (
          <button
            className="cursor-pointer text-sm hover:underline font-semibold text-green-500"
            onClick={(e) => publishCourse()}
          >
            Publish
          </button>
        )}
        <button
          className="cursor-pointer text-sm hover:underline font-semibold opacity-75 hover:opacity-100"
          onClick={(e) => deleteCourse()}
        >
          <Delete fontSize="small" />
        </button>
      </div>
    </div>
  );
}
