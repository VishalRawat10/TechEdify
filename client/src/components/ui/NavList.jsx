import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import ChatIcon from "@mui/icons-material/Chat";

export default function NavList() {
  const { user, unreadMessages } = useContext(UserContext);

  return (
    <>
      {user ? (
        <Link className=" relative" title="discussions" to="/discussions">
          <ChatIcon sx={{ fontSize: "1.4rem" }} />
          {unreadMessages.length != 0 && (
            <span className="absolute text-[10px] bg-[#eb3b50] text-white py-0 p-1 rounded-full left-[50%] -top-1 border-[2px] dark:border-black">
              {unreadMessages.length}
            </span>
          )}
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
