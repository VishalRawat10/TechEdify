import { Link } from "react-router-dom";

export default function BecomeInstructorBtn({ className }) {
  return (
    <button
      className={
        "mt-8 mx-auto px-6 w-fit py-4 bg-[#f8611b] hover:opacity-85 rounded-full text-sm text-white cursor-pointer font-semibold" +
        " " +
        className
      }
    >
      <Link to="/user/apply-for-instructor">Become instructor</Link>
    </button>
  );
}
