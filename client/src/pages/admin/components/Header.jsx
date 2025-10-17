import { useContext, useState } from "react";
import { WbSunny, Notifications, Menu } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { ThemeContext } from "../../../context/ThemeContext";
import NotificationModal from "../components/shared/NotificationModal";

export default function Header({ onMenuClick }) {
  const { changeTheme } = useContext(ThemeContext);
  const [openNotifications, setOpenNotifications] = useState(false);

  return (
    <>
      <header className="lg:relative fixed top-0 left-0 w-full lg:w-auto z-40 flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 bg-light-card dark:bg-dark-card h-[70px]">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="block lg:hidden">
            <Menu className="text-main" />
          </button>
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <IconButton onClick={changeTheme}>
            <WbSunny className="dark:text-yellow-400 text-black" />
          </IconButton>
          <IconButton onClick={() => setOpenNotifications(true)}>
            <Notifications className="dark:text-white text-black" />
          </IconButton>
        </div>
      </header>

      {/* Notification Modal */}
      <NotificationModal
        open={openNotifications}
        onClose={() => setOpenNotifications(false)}
      />
    </>
  );
}
