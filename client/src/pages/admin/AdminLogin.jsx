import { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiInstance } from "../../services/axios.config";
import { AdminContext } from "../../context/AdminContext";
import { MessageContext } from "../../context/MessageContext";

import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from "@mui/icons-material";
import Message from "../../components/Message";

export default function AdminLogin() {
  const { setAdmin } = useContext(AdminContext);
  const { setMessageInfo } = useContext(MessageContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    adminEmail: "",
    adminPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiInstance.post("/admin/login", formData);
      setAdmin(res.data.admin);
      setMessageInfo("Logged in as admin!", false);
      navigate(searchParams.get("redirectTo") || "/admin/dashboard");
    } catch (err) {
      console.log("Login error: ", err);
      setMessageInfo(err.response.data.message, true);
      setFormData({ adminEmail: "", adminPassword: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-black">
      <Message />
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <AdminPanelSettings sx={{ fontSize: 50, color: "#2563eb" }} />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Admin Login
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Sign in to access your admin dashboard
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="adminEmail"
              placeholder="admin@example.com"
              value={formData.adminEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="adminPassword"
              placeholder="••••••••"
              value={formData.adminPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[38px] right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition cursor-pointer ${
              isSubmitting && "opacity-70 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </button>
        </form>

        {/* Optional Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Not an admin?
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Go to user login
          </span>
        </p>
      </div>
    </div>
  );
}
