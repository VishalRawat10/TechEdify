import { memo } from "react";
import { Link } from "react-router-dom";

const CourseCard = memo(({ course, isEnrolled }) => {
  return (
    <div className="col-span-1 flex justify-center">
      <div className="col-span-1 border-1 border-light-secondary/70 dark:border-dark-secondary/70 rounded-xl p-2 md:w-[22rem]">
        <img
          src={course.thumbnail.url}
          alt={course.title}
          className=" object-cover h-[12rem] w-full rounded-lg"
        />

        <div className="mt-1 flex flex-col gap-2">
          <h3 className="text-light-primay dark:text-dark-primary">
            {course.title}
          </h3>
          {/* <p className="text-sm text-justify text-light-secondary dark:text-dark-secondary">
            {course.description.length < 90
              ? course.description
              : course.description.slice(0, 87) + "..."}
          </p> */}
          <hr className="border-light-secondary/60" />
          <p className="text-light-primary dark:text-dark-primary">
            Price : &#8377;{course.price}
          </p>
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
      </div>
    </div>
  );
});

export default CourseCard;
