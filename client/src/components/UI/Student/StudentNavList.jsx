import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function StudentNavList() {
  const { user } = useContext(UserContext);
  return (
    <>
      {user?.email ? (
        <Link className=" relative" title="notifications">
          <span className=" absolute  right-0.5 h-3 w-3 flex justify-center items-center dark:bg-black bg-white rounded-full px-0.2 py-0.2">
            <span className="bg-black dark:bg-white w-2 h-2 rounded-full"></span>
          </span>
          <NotificationsIcon sx={{ fontSize: "1.6rem" }} />
        </Link>
      ) : (
        <NavLink to="/" className={"nav-link "}>
          Home
        </NavLink>
      )}
      <NavLink to="/courses" className={"nav-link"}>
        Courses
      </NavLink>
      <NavLink to="/about" className={"nav-link"}>
        About
      </NavLink>
      <NavLink to="/contact" className={"nav-link"}>
        Contact
      </NavLink>
    </>
  );
}
