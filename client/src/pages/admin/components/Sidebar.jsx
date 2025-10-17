import {
  Dashboard,
  MenuBook,
  School,
  Group,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../../services/axios.config";
import { useContext } from "react";
import { AdminContext } from "../../../context/AdminContext";
import { MessageContext } from "../../../context/MessageContext";

export default function Sidebar({ setIsLoading, onItemClick }) {
  const navigate = useNavigate();
  const { admin } = useContext(AdminContext);
  const { setMessageInfo } = useContext(MessageContext);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await apiInstance.post("/admin/logout");
      navigate("/admin/login");
      setMessageInfo("Logged out successfully!", false);
    } catch (err) {
      console.error(err);
      setMessageInfo(err.response.data.message || "Couldn't log out!");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
    if (onItemClick) onItemClick();
  };

  return (
    <aside className="flex flex-col justify-between w-full h-full py-5 bg-light-card dark:bg-dark-card">
      <div className="flex flex-col gap-8">
        <img
          src="/images/logo.png"
          alt="TechEdify Logo"
          className="h-12 mx-auto"
        />

        <nav className="flex flex-col gap-1 text-sm">
          {[
            { label: "Dashboard", icon: <Dashboard />, id: "dashboard" },
            { label: "All Courses", icon: <MenuBook />, id: "courses" },
            { label: "All Tutors", icon: <School />, id: "tutors" },
            { label: "All Students", icon: <Group />, id: "students" },
          ].map(({ label, icon, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="flex items-center gap-3 py-3 px-6 hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </div>

      <footer className="flex flex-col items-center mx-4 border-t pt-4 gap-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-main border-2 border-main text-white rounded-full px-4 py-2 font-semibold hover:bg-white hover:text-black transition cursor-pointer text-sm"
        >
          <Logout /> Logout
        </button>

        <button
          className="flex items-center gap-3 cursor-pointer hover:opacity-85"
          onClick={() => scrollTo("profile")}
        >
          <img
            src={admin?.profileImage?.url || "/images/User.png"}
            alt={admin?.fullname}
            loading="lazy"
            className=" rounded-full h-14"
          />
        </button>
      </footer>
    </aside>
  );
}
