import { NavLink } from "react-router-dom";

export default function InstructorNavList() {
  return (
    <>
      <NavLink to="/instructor/my-courses" className="nav-link">
        My courses
      </NavLink>
      <NavLink
        to="/instructor/discussions"
        className="nav-link"
        title="add course"
      >
        Discussions
      </NavLink>
    </>
  );
}
