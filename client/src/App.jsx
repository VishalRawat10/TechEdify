import { lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Courses = lazy(() => import("./pages/Courses"));
const ShowCourse = lazy(() => import("./pages/ShowCourse"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const UpdateProfile = lazy(() => import("./pages/UpdateProfile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Lectures = lazy(() => import("./pages/Lectures"));
const ChatBotPage = lazy(() => import("./pages/ChatBotPage"));

import Loader from "./components/Loader";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

import AuthWrapper from "./components/AuthWrapper";
import AllContextProvider from "./context/AllContextProvider";
import ChatWithAiBtn from "./components/UI/ChatWithAiBtn";

export default function App() {
  return (
    <AllContextProvider>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<ShowCourse />} />
          <Route
            path="/courses/:id/learn"
            element={
              <AuthWrapper>
                <Lectures />
              </AuthWrapper>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/signup" element={<Signup />} />
          <Route
            path="/user/dashboard"
            element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            }
          />
          <Route
            path="/user/update-profile"
            element={
              <AuthWrapper>
                <UpdateProfile />
              </AuthWrapper>
            }
          />
          <Route path="/chatbot/chat" element={<ChatBotPage />} />
        </Routes>
      </Suspense>
      <ChatWithAiBtn />

      <Footer />
    </AllContextProvider>
  );
}
