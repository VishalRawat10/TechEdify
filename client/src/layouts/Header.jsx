import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { MessageContext } from "../context/MessageContext";

import Message from "../components/Message";
import { apiInstance } from "../../services/apis";

export default function Header() {
  const [sideMenu, setSideMenu] = useState(false); //Side menu draw
  const { theme, changeTheme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

  //logout function
  const logout = async () => {
    try {
      const res = apiInstance.post("/user/logout");
    } catch {}
    setMessageInfo("Logged out successfully!", false);
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <header className="z-50">
        <nav className="max-w-screen overflow-x-hidden h-18 flex items-center px-4 md:px-8 bg-white justify-between dark:bg-[var(--dark-bg-3)]">
          {/* Logo */}
          <Link to="/" title="TechEdify">
            <img
              src="/images/logo.png"
              alt="logo"
              className="h-12 hidden md:block"
            />
            <img
              src="/images/smallerlogo.png"
              alt="logo"
              className="h-12 md:hidden"
            />
          </Link>
          {/* Menu Button  */}
          <div
            className="text-[var(--base)] text-2xl flex items-center md:hidden"
            onClick={() => setSideMenu(true)}
          >
            <MenuIcon sx={{ fontSize: "2rem" }} />
          </div>
          {/* Side Menu or Menu  */}
          <div
            className={
              (sideMenu ? "translate-x-0 " : "translate-x-full ") +
              "fixed top-0 right-0 transition-transform flex  flex-col  w-2/3 items-center rounded-l-xl  gap-4 bg-white shadow-[0_0_2px_1px_grey] dark:bg-[var(--dark-bg-3)] md:flex md:static md:bg-transparent md:flex-row h-full md:w-fit md:min-w-none md:py-0 md:rounded-none md:dark:bg-transparent md:shadow-none md:px-4 md:gap-4 md:translate-x-0"
            }
          >
            {/* Menu close button  */}
            <span
              className="border-b-2 border-[var(--base)] md:hidden text-black dark:text-white h-14 w-full flex items-center justify-center"
              onClick={() => setSideMenu(false)}
            >
              <CloseIcon sx={{ fontSize: "2rem" }} />
            </span>
            {/* Theme Toggle  */}
            <div
              onClick={changeTheme}
              className="dark:text-white cursor-pointer"
              title="theme"
            >
              {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </div>
            {/* Navigation Links  */}
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
            {/* Log In / Sign up /Log out Buttons  */}
            <div className="flex border-2 border-[var(--base)] rounded-[2rem] bg-[var(--base)] text-white font-semibold mx-6 md:mx-0">
              {user ? (
                <button className="nav-btns" onClick={() => logout()}>
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
                className="flex flex-row items-center justify-center gap-2 cursor-pointer hover:opacity-75 hover:underline"
                title="dashboard"
                to="/user/dashboard"
              >
                {user.profileImg?.url ? (
                  <img
                    src={user.profileImg.url}
                    className="h-12 w-12 object-cover rounded-full border-2"
                    alt={user.profileImg.filename}
                    loading="lazy"
                  />
                ) : (
                  <span className="flex items-center justify-center h-12 w-12 aspect-square rounded-full border-2  ">
                    <PersonIcon />
                  </span>
                )}
              </Link>
            )}
          </div>
        </nav>
        <Message />
      </header>
    </>
  );
}
