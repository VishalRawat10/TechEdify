import { Link } from "react-router-dom";

export default function HomeCourseCard({ course }) {
  return (
    <div className="relative w-full max-w-sm bg-light-card dark:bg-dark-subcard rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={course?.thumbnail?.url || "/images/default-course.jpg"}
          alt={course?.title || "Course Thumbnail"}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-5">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
            {course?.title || "Untitled Course"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {course?.description}
          </p>
        </div>

        {/* Tutor Info & CTA */}
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <img
              src={course?.tutor?.profileImage?.url || "/images/User.png"}
              alt={course?.tutor?.fullname || "Tutor"}
              className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {course?.tutor?.fullname || "TechEdify Tutor"}
            </p>
          </div>

          <Link
            to={`/courses/${course?._id}`}
            className="text-sm font-semibold text-main hover:text-main/80 transition-colors duration-200"
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  );
}
