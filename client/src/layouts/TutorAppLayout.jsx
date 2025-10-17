import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";

import MessageIcon from "@mui/icons-material/Message";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import Loader from "../components/Loader";
import TutorAppLayoutSidebar from "../components/ui/tutor/TutorAppLayoutSidebar";
import { ThemeContext } from "../context/ThemeContext";
import Message from "../components/Message";
import { TutorContext } from "../context/TutorContext";
import NewMessage from "../components/NewMessage";

export default function TutorAppLayout() {
  const { changeTheme, theme } = useContext(ThemeContext);
  const { isLoading, unreadMessages, newMessage, setNewMessage, markRead } =
    useContext(TutorContext);

  return (
    <>
      <main className="bg-light w-screen overflow-hidden dark:bg-dark flex text-light-primary dark:text-dark-primary ">
        <Message />
        <NewMessage
          message={newMessage}
          onClose={() => setNewMessage(null)}
          onMarkAsRead={() => markRead()}
        />
        {isLoading && <Loader />}
        {/* Sidebar */}
        <TutorAppLayoutSidebar />

        {/* Right section */}
        <section className="h-screen overflow-hidden w-full lg:w-[calc(100vw-17rem)] flex flex-col">
          {/* Header  */}
          <header className="flex py-3 justify-end items-center gap-x-8 px-6 border-b-1 border-b-gray-300 dark:border-b-gray-700 w-full">
            <div className=" bg-light-card dark:bg-dark-subcard shadow-md px-4 py-2 rounded-full flex justify-between gap-6">
              <Link
                to="/tutor/discussions"
                className="group relative cursor-pointer"
              >
                <MessageIcon fontSize="small" />
                {unreadMessages.length != 0 && (
                  <span className="absolute text-[10px] bg-[#eb3b50] text-white py-0 p-1 rounded-full left-[50%] -top-1 border-[2px] dark:border-dark-card">
                    {unreadMessages.length}
                  </span>
                )}
                <p
                  className="group-hover:opacity-100 opacity-0 absolute -bottom-6 text-[10px]"
                  style={{ transition: "opacity 0.3s linear" }}
                >
                  Discussions
                </p>
              </Link>
              <button
                className="relative group cursor-pointer"
                onClick={changeTheme}
              >
                {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}{" "}
                <p
                  className="group-hover:opacity-100 opacity-0 absolute -bottom-6 text-[10px] "
                  style={{ transition: "opacity 0.5s linear" }}
                >
                  Theme
                </p>
              </button>
            </div>
          </header>
          {/* main pages  */}
          <Outlet />
        </section>
      </main>
    </>
  );
}
