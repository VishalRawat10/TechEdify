import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MessageContext } from "../context/MessageContext";
import { UserContext } from "../context/UserContext";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { setMessageInfo } = useContext(MessageContext);
  const { updatePassword } = useContext(UserContext);

  //handleFormSubmit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setPassword("");
    setConfirmPassword("");
    if (confirmPassword !== password) {
      return setMessageInfo("Passwords do not match!", true);
    }
    updatePassword(password)
      .then((res) => {
        setMessageInfo("Password changed successfylly.", false);
        navigate("/user/dashboard");
      })
      .catch((err) => {
        console.log(err);
        setMessageInfo("Unable to change password!", true);
      });
  };

  return (
    <main className="flex items-center justify-center h-[calc(100vh-var(--header-h))] p-4">
      <section className="p-6 md:p-10 bg-white dark:bg-[var(--dark-bg-2)] mt-4 rounded-xl flex flex-col  items-center justify-center gap-4 md:gap-8 w-full md:w-[35rem] shadow-2xl dark:shadow-white/20 ">
        <img src="/images/logo.png" alt="" className="h-12 object-contain" />
        <h1 className="text-2xl md:text-3xl font-medium text-center ">
          Change password
        </h1>
        <form
          className="w-full md:w-[20rem] flex flex-col item-center gap-4"
          onSubmit={handleFormSubmit}
        >
          <div className="text-left flex flex-col text-sm">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
              className=" focus:outline-none border-1 border-black dark:border-white p-3 rounded-lg placeholder:text-gray-400"
            />
          </div>
          <div className="text-left flex flex-col text-sm">
            <input
              type="text"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm the password"
              className=" focus:outline-none border-1 border-black dark:border-white p-3 rounded-lg placeholder:text-gray-400"
            />
          </div>
          <button className="px-6 py-3 rounded-xl bg-[#188acc] text-white  cursor-pointer text-sm font-semibold hover:opacity-85 ">
            UPDATE PASSWORD
          </button>
        </form>
      </section>
    </main>
  );
}
