import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { MessageContext } from "../context/MessageContext";
import NavList from "../components/ui/NavList";
import Loader from "../components/Loader";

export default function Header() {
  const [sideMenu, setSideMenu] = useState(false); //Side menu draw
  const [isLoading, setIsLoading] = useState(false);
  const { theme, changeTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

  //logout function
  const handleLogout = () => {
    setIsLoading(true);
    logout()
      .then((res) => {
        setMessageInfo("Logged out successfully!", false);
        navigate("/");
      })
      .catch((err) => setMessageInfo("Failed to logout!", true))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loader />}
      <header className="z-10 relative font-heading">
        <nav
          className={
            "max-w-screen overflow-x-hidden h-[var(--header-h)] flex items-center px-4 lg:px-8 bg-header-light dark:bg-header-dark justify-between lg:after:content-none shadow-sm dark:shadow-white/10 relative" +
            " " +
            (sideMenu
              ? "after:content-[''] after:w-screen after:h-screen after:fixed after:top-0 after:left-0 after:bg-dark/20"
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
              className="h-12 hidden lg:block"
              loading="lazy"
            />
            <img
              src="/images/smallerlogo.png"
              alt="logo"
              className="h-12 lg:hidden"
              loading="lazy"
            />
          </Link>

          {/* Menu Button  */}
          <div
            className="flex items-center lg:hidden"
            onClick={() => setSideMenu(!sideMenu)}
          >
            <MenuIcon sx={{ fontSize: "2rem", color: "var(--main)" }} />
          </div>

          {/* Side Menu or Menu  */}
          <div
            className={
              (sideMenu ? "translate-x-0 " : "-translate-x-full ") +
              "fixed top-0 left-0 transition-transform flex  flex-col min-w-[15rem] items-center rounded-r-xl gap-6 pb-12  bg-header-light shadow-sm dark:bg-header-dark z-40 lg:flex lg:static lg:bg-transparent lg:flex-row h-full lg:w-fit lg:min-w-none lg:py-0 lg:rounded-none lg:dark:bg-transparent lg:shadow-none lg:px-4 lg:gap-6 lg:translate-x-0"
            }
          >
            {/* Menu logo */}
            <button className="border-b-2 border-main lg:hidden text-light-primary dark:text-dark-primary h-[var(--header-h)] w-full flex items-center justify-center">
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
              className="dark:text-dark-primary text-light-primary cursor-pointer"
              title="theme"
            >
              {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </div>
            <NavList />

            {/* Log In / Sign up /Log out Buttons  */}
            <div className="flex border-2 border-main rounded-[2rem] bg-main font-semibold mx-6 mt-auto lg:mt-0 lg:mx-0 ">
              {user ? (
                <button className="nav-btns" onClick={handleLogout}>
                  Log out
                </button>
              ) : (
                <>
                  <button
                    className="nav-btns"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </button>
                  <button
                    className="nav-btns"
                    onClick={() => navigate("/login")}
                  >
                    Log in
                  </button>
                </>
              )}
            </div>

            {/* Dashboard Button  */}
            {user && (
              <Link
                className="flex flex-row items-center justify-center gap-2 cursor-pointer hover:opacity-75 hover:underline mb-12 lg:mb-0"
                title="dashboard"
                to="/dashboard"
              >
                <img
                  src={user?.profileImage?.url || "/images/User.png"}
                  className="h-12 w-12 object-cover rounded-full border-2"
                  alt={user?.profileImage?.filename}
                  loading="lazy"
                />
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
