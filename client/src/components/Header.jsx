import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";

import Message from "./Message";
import { apiInstance } from "../../services/apis";
import { MessageContext } from "../context/MessageContext";

export default function Header() {
  const [sideMenu, setSideMenu] = useState(false); //Side menu draw
  const { theme, changeTheme } = useContext(ThemeContext);
  const { user, token, setToken } = useContext(UserContext);
  const { setMessage, setIsError } = useContext(MessageContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = apiInstance.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch {}
    setToken("");
    setIsError(false);
    setMessage("Logged out successfully!");
  };

  return (
    <header className="z-50">
      <nav className="max-w-screen overflow-x-hidden h-16 flex items-center px-4 md:px-12 bg-black/30 justify-between dark:bg-[var(--dark-bg-3)] border-b-2 border-[var(--base)]">
        {/* Logo */}
        <Link to="/" title="coding-shala">
          <img
            src="/images/logo.png"
            alt="logo"
            className="h-8 hidden md:block"
          />
          <img
            src="/images/smallerlogo.png"
            alt="logo"
            className="h-8 md:hidden"
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
            "fixed top-2 right-0 transition-transform flex  flex-col w-fit items-center rounded-l-xl  gap-4 bg-white pb-6 shadow-[0_0_2px_1px_grey] dark:bg-[var(--dark-bg-2)] md:flex md:static md:bg-transparent md:flex-row md:h-full md:min-w-fit md:py-0 md:rounded-none md:dark:bg-transparent md:shadow-none md:px-6 md:gap-6 md:translate-x-0"
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
          <div onClick={changeTheme} className="dark:text-white cursor-pointer">
            {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </div>
          {/* Navigation Links  */}
          <NavLink to="/" className={"nav-link "}>
            Home
          </NavLink>
          <NavLink to="/courses" className={"nav-link"}>
            Courses
          </NavLink>
          <NavLink to="/about" className={"nav-link"}>
            About
          </NavLink>
          <NavLink to="/contact" className={"nav-link"}>
            Contact
          </NavLink>
          {/* Log In / Sign up Buttons  */}
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
        </div>
      </nav>
      <Message />
    </header>
  );
}
