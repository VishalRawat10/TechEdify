import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Message from "../components/Message";

export default function UserAppLayout() {
  return (
    <>
      <Header />
      <Message />
      <Outlet />
      <Footer />
    </>
  );
}
