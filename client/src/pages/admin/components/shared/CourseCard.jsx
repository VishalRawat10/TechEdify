import { useState } from "react";
import CourseModal from "./CourseModal";

export default function CourseCard({ setIsLoading, course, setCourses }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="
          cursor-pointer 
          bg-light-card dark:bg-dark-card 
          border border-gray-200 dark:border-gray-700 
          rounded-xl shadow-sm 
          hover:shadow-md dark:hover:shadow-lg 
          hover:-translate-y-1 
          hover:ring-2 hover:ring-main/40 
          transition-all duration-200 
          overflow-hidden
        "
      >
        {/* Thumbnail */}
        <img
          src={course.thumbnail?.url || "/images/course-placeholder.jpg"}
          alt={course.title}
          className="w-full h-40 object-cover"
        />

        {/* Details */}
        <div className="p-4 space-y-2">
          <h4 className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">
            {course.title}
          </h4>

          <p
            className={`text-sm font-medium ${
              course.isPublished ? "text-green-600" : "text-red-500"
            }`}
          >
            {course.isPublished ? "Published" : "Unpublished"}
          </p>

          {/* Tutor Info */}
          <div className="flex items-center gap-2 mt-2">
            <img
              src={course.tutor?.profileImage?.url || "/images/User.png"}
              alt="Tutor"
              className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {course.tutor?.fullname || "Unknown Tutor"}
            </span>
          </div>
        </div>
      </div>

      {open && (
        <CourseModal
          open={open}
          onClose={() => setOpen(false)}
          course={course}
          setIsLoading={setIsLoading}
          setCourses={setCourses}
        />
      )}
    </>
  );
}
