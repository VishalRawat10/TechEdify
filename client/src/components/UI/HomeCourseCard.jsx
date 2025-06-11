import { Link } from "react-router-dom";

export default function HomeCourseCard({ course }) {
  return (
    <div className="rounded-xl bg-white dark:bg-[var(--dark-bg-2)] max-w-[25rem] sm:w-[calc(50%-1rem)]">
      <img
        src={course.profileImg}
        alt=""
        className="rounded-t-xl w-full h-[10rem]"
      />
      <p className="my-4 pl-4 opacity-85">{course.name}</p>
      {/* <p>{course.about}</p> */}
      <button className="font-semibold hover:opacity-75 hover:border-black/75 dark:hover:border-white/75 ml-4 border-2 px-6 py-2 mb-4 cursor-pointer text-sm rounded-lg">
        <Link to={`/courses/${course._id}`}>Explore</Link>
      </button>
    </div>
  );
}
