import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { MessageContext } from "../context/MessageContext";
import StudentNavList from "../components/ui/StudentNavList";
import InstructorNavList from "../components/ui/tutor/InstructorNavList";

export default function Header() {
  const [sideMenu, setSideMenu] = useState(false); //Side menu draw
  const { theme, changeTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

  //logout function
  const handleLogout = () => {
    logout()
      .then((res) => {
        setMessageInfo("Logged out successfully!", false);
        navigate("/");
      })
      .catch((err) => setMessageInfo("Could not log out!", true));
  };

  return (
    <>
      <header className={"z-50 relative"}>
        <nav
          className={
            "max-w-screen overflow-x-hidden h-[var(--header-h)] flex items-center px-4 md:px-8 bg-white justify-between dark:bg-[var(--dark-bg-3)]  md:after:content-none shadow-xl dark:shadow-white/10 relative" +
            " " +
            (sideMenu
              ? "after:content-[''] after:w-screen after:h-screen after:fixed after:top-0 after:left-0 after:bg-black/20"
              : "")
          }
          onClick={(e) => {
            if (sideMenu) return setSideMenu(false);
          }}
        >
          {/* Logo */}
          <Link to="/" title="TechEdify">
            <img
              src="/images/logo.png"
              alt="logo"
              className="h-12 hidden md:block"
              loading="lazy"
            />
            <img
              src="/images/smallerlogo.png"
              alt="logo"
              className="h-12 md:hidden"
              loading="lazy"
            />
          </Link>
          {/* Menu Button  */}
          <div
            className="text-[var(--base)] text-2xl flex items-center md:hidden"
            onClick={() => setSideMenu(!sideMenu)}
          >
            <MenuIcon sx={{ fontSize: "2rem" }} />
          </div>
          {/* Side Menu or Menu  */}
          <div
            className={
              (sideMenu ? "translate-x-0 " : "-translate-x-full ") +
              "fixed top-0 left-0 transition-transform flex  flex-col  w-2/3 items-center rounded-r-xl  gap-4 bg-white shadow-[0_0_2px_1px_grey] dark:bg-[var(--dark-bg-3)] z-50 md:flex md:static md:bg-transparent md:flex-row h-full md:w-fit md:min-w-none md:py-0 md:rounded-none md:dark:bg-transparent md:shadow-none md:px-4 md:gap-4 md:translate-x-0"
            }
          >
            {/* Menu logo */}
            <button className="border-b-2 border-[var(--base)] md:hidden text-black dark:text-white h-[var(--header-h)] w-full flex items-center justify-center">
              <img
                src="/images/smallerlogo.png"
                alt=""
                className="h-10"
                loading="lazy"
              />
            </button>
            {/* Theme Toggle  */}
            <div
              onClick={changeTheme}
              className="dark:text-white cursor-pointer"
              title="theme"
            >
              {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </div>
            {/* Navigation Links  */}
            {/* Role based nav-list items  */}
            {user?.role === "instructor" ? (
              <InstructorNavList />
            ) : (
              <StudentNavList />
            )}
            {/* Log In / Sign up /Log out Buttons  */}
            <div className="flex border-2 border-[var(--base)] rounded-[2rem] bg-[var(--base)] text-white font-semibold mx-6 mt-auto md:mt-0 md:mx-0 ">
              {user ? (
                <button className="nav-btns" onClick={handleLogout}>
                  Log out
                </button>
              ) : (
                <>
                  <button
                    className="nav-btns"
                    onClick={() => navigate("/user/signup")}
                  >
                    Sign up
                  </button>
                  <button
                    className="nav-btns"
                    onClick={() => navigate("/user/login")}
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
            {/* Dashboard Button  */}
            {user && (
              <Link
                className="flex flex-row items-center justify-center gap-2 cursor-pointer hover:opacity-75 hover:underline mb-12 md:mb-0"
                title="dashboard"
                to={
                  user?.role === "instructor"
                    ? "/instructor/dashboard"
                    : "/user/dashboard"
                }
              >
                <img
                  src={user?.profileImg?.url || "/svg/Person.svg"}
                  className="h-12 w-12 object-cover rounded-full border-2"
                  alt={user?.profileImg?.filename}
                  loading="lazy"
                />
              </Link>
            )}
          </div>
        </nav>
        {/* <Message /> */}
      </header>
    </>
  );
}
