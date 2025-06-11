import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Message from "../components/Message";

import ChatWithAiBtn from "../components/UI/ChatWithAiBtn";

export default function StudentAppLayout() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "instructor") {
      navigate("/instructor/dashboard");
    }
  }, []);

  return (
    <>
      <Message />
      <Header />
      <Outlet />
      <ChatWithAiBtn />
      <Footer />
    </>
  );
}
