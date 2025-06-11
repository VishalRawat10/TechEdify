import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("../pages/student/Home"));
const About = lazy(() => import("../pages/student/About"));
const Contact = lazy(() => import("../pages/student/Contact"));
const Courses = lazy(() => import("../pages/student/Courses"));
const ShowCourse = lazy(() => import("../pages/student/ShowCourse"));
const Signup = lazy(() => import("../pages/student/Signup"));
const UpdateProfile = lazy(() => import("../pages/UpdateProfile"));
const Lectures = lazy(() => import("../pages/student/Lectures"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const Login = lazy(() => import("../pages/Login"));
const UpdatePassword = lazy(() => import("../pages/UpdatePassword"));
const ChatBotPage = lazy(() => import("../pages/student/ChatBotPage"));
import AuthWrapper from "../components/AuthWrapper";
import StudentAppLayout from "../layouts/StudentAppLayout";
import StudentDashboard from "../pages/student/StudentDashboard";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StudentAppLayout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<ShowCourse />} />
        <Route
          path="courses/:id/learn"
          element={
            <AuthWrapper>
              <Lectures />
            </AuthWrapper>
          }
        />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="user/signup" element={<Signup />} />
        <Route path="user/login" element={<Login />} />
        <Route
          path="user/update-password"
          element={
            <AuthWrapper>
              <UpdatePassword />
            </AuthWrapper>
          }
        />

        <Route
          path="user/update-profile"
          element={
            <AuthWrapper>
              <UpdateProfile />
            </AuthWrapper>
          }
        />
        <Route
          path="user/dashboard"
          element={
            <AuthWrapper>
              <StudentDashboard />
            </AuthWrapper>
          }
        />
        <Route path="/ai-mentor/chat" element={<ChatBotPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
