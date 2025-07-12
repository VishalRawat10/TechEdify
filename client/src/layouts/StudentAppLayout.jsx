import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Message from "../components/Message";

export default function StudentAppLayout() {
  return (
    <>
      <Header />
      <Message />
      <Outlet />
      <Footer />
    </>
  );
}
