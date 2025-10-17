import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("../pages/user/HomePage"));
const AboutPage = lazy(() => import("../pages/user/AboutPage"));
const ContactPage = lazy(() => import("../pages/user/ContactPage"));
const CoursesPage = lazy(() => import("../pages/user/CoursesPage"));
const ShowCoursePage = lazy(() => import("../pages/user/ShowCoursePage"));
const SignupPage = lazy(() => import("../pages/user/SignupPage"));

const LecturePage = lazy(() => import("../pages/user/LecturePage"));
const NotFoundPage = lazy(() => import("../pages/user/NotFoundPage"));
const LoginPage = lazy(() => import("../pages/user/LoginPage"));
const DashboardPage = lazy(() => import("../pages/user/DashboardPage"));
const DiscussionsPage = lazy(() => import("../pages/user/DiscussionsPage"));

import Loader from "../components/Loader";
import AuthWrapper from "../components/AuthWrapper";
import UserAppLayout from "../layouts/UserAppLayout";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserAppLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<Loader />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="courses"
          element={
            <Suspense fallback={<Loader />}>
              <CoursesPage />
            </Suspense>
          }
        />
        <Route
          path="courses/:id"
          element={
            <Suspense fallback={<Loader />}>
              <ShowCoursePage />
            </Suspense>
          }
        />
        <Route
          path="courses/:id/learn"
          element={
            <AuthWrapper>
              <Suspense fallback={<Loader />}>
                <LecturePage />
              </Suspense>
            </AuthWrapper>
          }
        />
        <Route
          path="about"
          element={
            <Suspense fallback={<Loader />}>
              <AboutPage />
            </Suspense>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense fallback={<Loader />}>
              <ContactPage />
            </Suspense>
          }
        />
        <Route
          path="signup"
          element={
            <Suspense fallback={<Loader />}>
              <SignupPage />
            </Suspense>
          }
        />
        <Route
          path="login"
          element={
            <Suspense fallback={<Loader />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="dashboard"
          element={
            <AuthWrapper>
              <Suspense fallback={<Loader />}>
                <DashboardPage />
              </Suspense>
            </AuthWrapper>
          }
        />
        <Route
          path="discussions"
          element={
            <AuthWrapper>
              <Suspense fallback={<Loader />}>
                <DiscussionsPage />
              </Suspense>
            </AuthWrapper>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<Loader />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
