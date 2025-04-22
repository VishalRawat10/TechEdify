import { useNavigate } from "react-router-dom";

export default function StartLearningBtn({ courseId, className }) {
  const navigate = useNavigate();
  return (
    <button
      className={
        "bg-[#ffaa00] px-8 py-3 rounded-lg font-semibold text-black cursor-pointer hover:scale-105" +
        " " +
        className
      }
      onClick={(e) => navigate(`/courses/${courseId}/learn`)}
    >
      Start learning
    </button>
  );
}
