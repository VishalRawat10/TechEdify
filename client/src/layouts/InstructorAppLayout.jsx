import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";

import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";

import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";
import { MessageContext } from "../context/MessageContext";
import { ThemeContext } from "../context/ThemeContext";
import Message from "../components/Message";

export default function InstructorAppLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const { logout, user } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);
  const { changeTheme, theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const currPageStyle = "bg-black/20 dark:bg-white/20";

  if (user.role !== "instructor") {
    navigate("/user/dashboard");
  }

  const handleLogoutBtn = (e) => {
    setIsLoading(true);
    logout()
      .then((res) => {
        setIsLoading(false);
        setMessageInfo("Logged out successfully!", false);
        navigate("/");
      })
      .catch((err) => {
        setIsLoading(false);
        setMessageInfo("Unable to log out!", true);
      });
  };

  return (
    <>
      <Message />
      <main className="bg-[#F0F3FA] w-screen h-screen dark:bg-black flex">
        {isLoading ? <Loader /> : ""}
        {/* sidebar */}
        <section className="h-full w-[18rem] bg-white  dark:bg-[var(--dark-bg-2)] flex flex-col py-6">
          {/* logo  */}
          <div className="w-full">
            <img
              src="/images/logo.png"
              alt=""
              className="h-12 object-contain mx-auto"
            />
          </div>
          {/* side bar item-list  */}
          <div className="flex flex-col items-start mt-12 gap-1">
            <Link
              to="/instructor/dashboard"
              className={
                "flex gap-2 items-center cursor-pointer px-6 py-4 text-sm w-full" +
                " " +
                (location.pathname === "/instructor/dashboard"
                  ? currPageStyle
                  : "hover:bg-black/10 dark:hover:bg-white/10")
              }
            >
              <SpaceDashboardIcon />
              Dashboard
            </Link>
            <Link
              to="/instructor/my-courses"
              className={
                "flex gap-2 items-center cursor-pointer px-6 py-4 text-sm w-full" +
                " " +
                (location.pathname === "/instructor/my-courses"
                  ? currPageStyle
                  : "hover:bg-black/10 dark:hover:bg-white/10")
              }
            >
              <MenuBookIcon />
              My Courses
            </Link>
            <Link
              to="/instructor/my-courses/new"
              className={
                "flex gap-2 items-center cursor-pointer px-6 py-4 text-sm w-full" +
                " " +
                (location.pathname === "/instructor/my-courses/new"
                  ? currPageStyle
                  : "hover:bg-black/10 dark:hover:bg-white/10")
              }
            >
              <AddCircleIcon />
              Create Course
            </Link>
          </div>
          {/* Other settings  */}
          <div className="absolute bottom-8 flex flex-col gap-4 px-6">
            <button
              className="bg-[var(--base)] px-6 py-2 rounded-full text-sm font-semibold border-2 border-[var(--base)] hover:bg-white text-white hover:text-black cursor-pointer flex items-center gap-2"
              onClick={handleLogoutBtn}
            >
              <LogoutIcon /> Logout
            </button>
          </div>
        </section>
        {/* Right portion  */}
        <section className="h-full w-full">
          {/* Header  */}
          <header className="flex  h-18 justify-end items-center gap-x-8 px-6">
            <span
              className={
                location.pathname === "/instructor/my-courses"
                  ? "bg-white dark:bg-[var(--dark-bg-2)] px-4 py-2 lg:w-1/2 flex justify-center items-center gap-4 rounded-full mr-auto lg:ml-[5rem]"
                  : "hidden"
              }
            >
              <input
                type="search"
                className="w-full focus:outline-none text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400"
                placeholder="Seach course"
              />
              <SearchIcon size="small" />
            </span>
            <span className="bg-white px-4 py-2 rounded-full flex justify-between gap-4 dark:bg-[var(--dark-bg-2)]">
              <Link
                to="/instructor/discussions"
                className="hover:scale-115 cursor-pointer"
                title="discussions"
              >
                <MessageIcon fontSize="small" />
              </Link>
              <Link
                to="/instructor/nitifications"
                className="hover:scale-115 cursor-pointer"
                title="notifications"
              >
                <NotificationsIcon fontSize="small" />
              </Link>
            </span>
            <span className="bg-white px-4 py-2 rounded-full align-baseline flex justify-between gap-3 dark:bg-[var(--dark-bg-2)]">
              <button
                className="hover:scale-115 cursor-pointer"
                title="theme"
                onClick={changeTheme}
              >
                {theme === "light" ? (
                  <DarkModeIcon fontSize="small" />
                ) : (
                  <LightModeIcon fontSize="small" />
                )}
              </button>
            </span>
          </header>
          {/* main pages  */}

          <Outlet />
        </section>
      </main>
    </>
  );
}
