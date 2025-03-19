import { useNavigate } from "react-router-dom";

export default function CourseCard({ course, key }) {
  const navigate = useNavigate();
  return (
    <button
      key={key}
      className="w-[23rem] h-max cursor-pointer text-left hover:opacity-75 after:content-seecourse"
      style={{ transition: "opacity 0.1s linear" }}
      onClick={() => navigate(`/courses/${course._id}`)}
    >
      <div className="w-full relative">
        <img
          src={course.profileImg}
          alt={course.name}
          className="h-full aspect-auto rounded-xl"
        />
      </div>

      <div className="mt-1">
        <p className="opacity-75 font-semibold">{course.name}</p>
        <p className="text-sm ">{course.content.join(" | ")}</p>
      </div>
    </button>
  );
}
