import { Link, useLocation, useNavigate } from "react-router-dom";

export default function DbSideItem({ img, title, to }) {
  const location = useLocation();
  const nagivate = useNavigate();
  const selected = () => {
    if (
      title == "Dashboard Overview" &&
      location.pathname === "/user/dashboard"
    ) {
      return "bg-white/30";
    } else if (
      title == "My Courses" &&
      location.pathname === "/user/dashboard/enrolled-courses"
    ) {
      return "bg-white/30";
    } else if (
      title == "Assignments" &&
      location.pathname === "/user/dashboard/assignments"
    ) {
      return "bg-white/30";
    } else if (
      title == "Discussions" &&
      location.pathname === "/user/dashboard/discussions"
    ) {
      return "bg-white/30";
    } else {
      return "";
    }
  };
  return (
    <button
      className={
        "w-full px-4 py-3 text-white hover:bg-white/30" + " " + selected()
      }
      onClick={() => nagivate(to)}
    >
      <Link className="flex items-center gap-4 cursor-pointer">
        <img src={img} alt={title} title={title} className="h-8" />
        <p className="hidden lg:block text-sm font-semibold">{title}</p>
      </Link>
    </button>
  );
}
