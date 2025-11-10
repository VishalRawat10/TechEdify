import { memo } from "react";
import { Link } from "react-router-dom";

const CourseCard = memo(({ course, isEnrolled }) => {
  return (
    <div className="col-span-1 flex flex-col gap-2 border-1 border-light-secondary/70 dark:border-dark-secondary/70 rounded-xl p-2 md:w-[22rem]">
      {/* Course Info  */}
      <div className="flex flex-col gap-1  border-b-gray-400 border-b-1 pb-2">
        <img
          src={course.thumbnail.url}
          alt={course.title}
          className=" object-cover h-[12rem] w-full rounded-lg"
        />

        <h3 className="text-light-primay dark:text-dark-primary font-semibold">
          {course.title}
        </h3>
        <p className="line-clamp-3 text-xs text-justify text-light-primary dark:text-dark-secondary">
          {course.description}
        </p>

        <p className="text-main italic">@&#8377;{course.price} only</p>
      </div>
      {/* Tutor Info  */}
      <div className="flex items-center gap-2">
        <img
          src={course.tutor?.profileImage?.url || "/images/User.png"}
          alt="Tutor image"
          loading="lazy"
          className="h-10 object-cover rounded-full aspect-square"
        />
        <p className="text-sm font-semibold">
          {course.tutor?.fullname || "TechEdify Tutor"}
        </p>
      </div>

      {/* CTA Buttons  */}
      <div className="flex gap-4 text-sm">
        <Link
          className=" rounded-md py-1 px-3 cursor-pointer bg-green-600 text-white hover:bg-green-800"
          style={{ transition: "background-color 0.2s linear" }}
          to={`/courses/${course._id}`}
        >
          {isEnrolled ? "See Courses" : "Buy Course"}
        </Link>
        {isEnrolled && (
          <Link
            className=" rounded-md py-1 px-3 cursor-pointer bg-green-600 text-white hover:bg-green-800"
            style={{ transition: "background-color 0.2s linear" }}
            to={`/courses/${course._id}/learn`}
          >
            Learn
          </Link>
        )}
      </div>
    </div>
  );
});

export default CourseCard;
