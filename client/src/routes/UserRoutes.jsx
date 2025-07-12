import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Courses = lazy(() => import("../pages/Courses"));
const ShowCourse = lazy(() => import("../pages/ShowCourse"));
const Signup = lazy(() => import("../pages/Signup"));
const UpdateProfile = lazy(() => import("../pages/UpdateProfile"));
const Lectures = lazy(() => import("../pages/Lectures"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const Login = lazy(() => import("../pages/Login"));
const UpdatePassword = lazy(() => import("../pages/UpdatePassword"));
import AuthWrapper from "../components/AuthWrapper";
import StudentAppLayout from "../layouts/StudentAppLayout";
import StudentDashboard from "../pages/StudentDashboard";

export default function UserRoutes() {
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
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route
          path="update-password"
          element={
            <AuthWrapper>
              <UpdatePassword />
            </AuthWrapper>
          }
        />

        <Route
          path="update-profile"
          element={
            <AuthWrapper>
              <UpdateProfile />
            </AuthWrapper>
          }
        />
        <Route
          path="dashboard"
          element={
            <AuthWrapper>
              <StudentDashboard />
            </AuthWrapper>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
