import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Courses = lazy(() => import("./pages/Courses"));
const ShowCourse = lazy(() => import("./pages/ShowCourse"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

import Loader from "./components/Loader";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

import AuthWrapper from "./components/AuthWrapper";
import AllContextProvider from "./context/AllContextProvider";

export default function App() {
  return (
    <AllContextProvider>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<ShowCourse />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/signup" element={<Signup />} />
          <Route
            path="/user/profile"
            element={
              <AuthWrapper>
                <UserProfile />
              </AuthWrapper>
            }
          />
        </Routes>
      </Suspense>
      <Footer />
    </AllContextProvider>
  );
}
