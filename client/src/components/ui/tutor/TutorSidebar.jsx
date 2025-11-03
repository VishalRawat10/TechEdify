import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { TutorContext } from "../../../context/TutorContext";

import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { MessageContext } from "../../../context/MessageContext";

export default function TutorSidebar() {
  const { setIsLoading } = useContext(TutorContext);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutTutor, tutor } = useContext(TutorContext);

  const [hideSidebar, setHideSidebar] = useState(true);

  const handleLogoutBtn = async (e) => {
    setIsLoading(true);
    try {
      const res = await logoutTutor();
      setMessageInfo("Tutor logged out successfully!", false);
      navigate("/tutor/login");
    } catch (err) {
      console.log(err);
      setMessageInfo(
        err.response.data.message || "Tutor failed to logout!",
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={`${
        !hideSidebar && "w-screen h-screen bg-black/30 absolute"
      } lg:w-fit lg:bg-transparent lg:static`}
      onClick={() => setHideSidebar(!hideSidebar)}
    >
      <div
        className={`absolute z-20 w-[12rem] h-screen top-0 bottom-0 bg-light-card dark:bg-dark-card flex flex-col py-6 shadow-md dark:shadow-white/20 ${
          hideSidebar && "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-[17rem]`}
      >
        {/* logo  */}
        <div className="w-full flex items-center justify-center relative">
          <img
            src="/images/logo.png"
            alt=""
            className="h-12 object-contain hidden lg:block"
          />
          <img
            src="/images/smallerlogo.png"
            alt=""
            className="h-12 object-contain lg:hidden"
          />
          <button
            className="cursor-pointer absolute -right-8 lg:hidden"
            onClick={() => setHideSidebar(!hideSidebar)}
          >
            {hideSidebar ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
          </button>
        </div>
        {/* side bar item-list  */}
        <div className="flex flex-col mt-12 gap-1">
          <SidebarItem
            to="/tutor/dashboard"
            icon={<SpaceDashboardIcon />}
            text="Dashboard"
            location={location}
          />
          <SidebarItem
            to="/tutor/courses"
            icon={<MenuBookIcon />}
            text="My courses"
            location={location}
          />
          <SidebarItem
            to="/tutor/courses/create-course"
            icon={<AddCircleIcon />}
            text="Create course"
            location={location}
          />
        </div>
        {/* Other settings  */}
        <div className=" mt-auto flex flex-col items-center gap-4 border-t pt-6 mx-4">
          <Link to="/tutor/profile">
            <img
              src={tutor?.profileImage?.url || "/images/User.png"}
              alt={tutor.fullname}
              className="h-14 rounded-full aspect-square object-cover hover:opacity-90"
            />
          </Link>
          {/* Logout Btn  */}
          <button
            className="bg-dark w-fit dark:bg-light hover:bg-black dark:hover:bg-white px-4 py-2 rounded-full text-sm font-semibold text-white dark:text-black cursor-pointer flex items-center gap-2"
            onClick={handleLogoutBtn}
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </div>
    </section>
  );
}

const SidebarItem = ({ to, text, icon, location }) => {
  return (
    <Link
      to={to}
      className={`flex gap-2 items-center cursor-pointer py-4 text-sm w-full px-6 ${
        location.pathname === to
          ? "bg-black/20 dark:bg-white/20"
          : "hover:bg-black/10 dark:hover:bg-white/10"
      }`}
    >
      {icon}
      {text}
    </Link>
  );
};
