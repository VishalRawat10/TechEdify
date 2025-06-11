import { useContext, useState } from "react";

import { apiInstance } from "../../services/apis";
import { AdminContext } from "../../context/AdminContext";
import { MessageContext } from "../../context/MessageContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

export default function AdminLogin() {
  const [adminCredentials, setAdminCredentials] = useState({
    adminEmail: "",
    adminPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setAdmin, setLoading } = useContext(AdminContext);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setAdminCredentials({
      ...adminCredentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoading(true);
    try {
      const res = await apiInstance.post("/admin/login", adminCredentials);
      setLoading(false);
      console.log(res.data.admin);
      setAdmin(res.data.admin);
      setMessageInfo(res.data.message, false);
      navigate("/admin/dashboard");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setMessageInfo(err.response.data.message, true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading ? <Loader /> : ""}
      <main className="w-screen px-4 flex items-center justify-center h-[calc(100vh-var(--header-h))]">
        <form
          className="w-full rounded-xl bg-white dark:bg-[var(--dark-bg-2)] flex flex-col gap-4 items-center p-8  sm:w-[25rem] shadow-xl dark:shadow-gray-800"
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <h1 className="text-3xl font-semibold ">Admin Login</h1>

          <div className="flex flex-col gap-1 text-sm w-full">
            <label htmlFor="email" className="font-semibold">
              Email*
            </label>
            <input
              type="email"
              name="adminEmail"
              id="email"
              className="w-full px-4 py-3 border-gray-400 focus:border-black dark:focus:border-white border-1 rounded-xl focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="eg. abc@domain.com"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm w-full">
            <label htmlFor="password" className="font-semibold">
              Password*
            </label>
            <input
              type="password"
              name="adminPassword"
              id="password"
              className="w-full px-4 py-3 border-gray-400 focus:border-black dark:focus:border-white border-1 rounded-xl focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="*********"
              required
              onChange={handleInputChange}
            />
          </div>
          <button className="w-full bg-[var(--base)] text-white font-semibold py-2 rounded-lg cursor-pointer hover:opacity-90">
            Login
          </button>
        </form>
      </main>
    </>
  );
}
