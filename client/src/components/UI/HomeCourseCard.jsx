import { Link } from "react-router-dom";

export default function HomeCourseCard({ course }) {
  return (
    <div className="rounded-xl bg-light-card dark:bg-dark-subcard max-w-[25rem] sm:w-[calc(50%-1rem)] text-light-primary dark:text-dark-primary shadow-lg">
      <img
        src={course?.thumbnail?.url}
        loading="lazy"
        alt=""
        className="rounded-t-xl w-full h-[10rem]"
      />
      <p className="my-4 pl-4 ">{course?.title || "MERN Stack Development"}</p>
      <button className="font-semibold hover:opacity-75 hover:border-black/75 dark:hover:border-white/75 ml-4 border-2 px-6 py-2 mb-4 cursor-pointer text-sm rounded-lg">
        <Link to={`/courses/${course?._id}`}>Explore</Link>
      </button>
    </div>
  );
}
