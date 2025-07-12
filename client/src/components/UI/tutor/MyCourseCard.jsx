import { useNavigate } from "react-router-dom";

export default function MyCourseCard({ course }) {
  const navigate = useNavigate();
  return (
    <button
      className="w-[20rem] h-max text-left cursor-pointer hover:opacity-80 "
      style={{ transition: "opacity 0.1s linear" }}
      onClick={(e) => navigate(`/instructor/my-courses/${course._id}/edit`)}
      title="Click to edit manage course"
    >
      <div className="w-full relative">
        <img
          src={course.profileImg}
          alt={course.name}
          className="h-full aspect-auto rounded-xl"
        />
      </div>

      <p className="mt-1 font-semibold w-full">{course.name}</p>
    </button>
  );
}
