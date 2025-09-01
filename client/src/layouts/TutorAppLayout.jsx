import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";

import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import Loader from "../components/Loader";
import TutorAppLayoutSidebar from "../components/ui/tutor/TutorAppLayoutSidebar";
import { ThemeContext } from "../context/ThemeContext";
import Message from "../components/Message";
import { TutorContext } from "../context/TutorContext";

export default function TutorAppLayout() {
  const { changeTheme, theme } = useContext(ThemeContext);
  const { isLoading } = useContext(TutorContext);
  return (
    <>
      <main className="bg-light w-screen h-screen overflow-hidden dark:bg-dark flex text-light-primary dark:text-dark-primary">
        <Message />
        {isLoading && <Loader />}
        {/* Sidebar */}
        <TutorAppLayoutSidebar />

        {/* Right section */}
        <section className="h-full overflow-hidden w-full lg:w-[calc(100vw-17rem)] flex flex-col overflow-x-hidden">
          {/* Header  */}
          <header className="flex h-18 justify-end items-center gap-x-8 px-6 border-b-1 border-b-gray-300 dark:border-b-gray-700 w-full">
            {/* <span
              className={
                location.pathname === "/tutor/my-courses"
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
            </span> */}
            <span className="bg-light-card dark:bg-dark-subcard shadow-md px-4 py-2 rounded-full flex justify-between gap-4 ">
              <Link
                to="/tutor/discussions"
                className="hover:scale-115 cursor-pointer"
                title="discussions"
              >
                <MessageIcon fontSize="small" />
              </Link>
              <Link
                to="/tutor/nitifications"
                className="hover:scale-115 cursor-pointer"
                title="notifications"
              >
                <NotificationsIcon fontSize="small" />
              </Link>
            </span>

            <button
              className="bg-light-card dark:bg-dark-subcard px-4 py-2 rounded-full align-baseline flex justify-between gap-3 cursor-pointer hover:opacity-85"
              title="theme"
              onClick={changeTheme}
            >
              {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </button>
          </header>

          {/* main pages  */}
          <Outlet />
        </section>
      </main>
    </>
  );
}
