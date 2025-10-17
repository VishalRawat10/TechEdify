import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Message from "../components/Message";
import NewMessage from "../components/NewMessage";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function UserAppLayout() {
  const { newMessage, setNewMessage, markRead } = useContext(UserContext);
  return (
    <>
      <Header />
      <Message />
      <NewMessage
        message={newMessage}
        onClose={() => setNewMessage(null)}
        onMarkAsRead={markRead}
      />
      <Outlet />
      <Footer />
    </>
  );
}
