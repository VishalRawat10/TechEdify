import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import ShowCourse from "./pages/ShowCourse";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { MessageProvider } from "./context/MessageContext";
import { CookiesProvider } from "react-cookie";
import { UserProvider } from "./context/UserContext";
import UserProfile from "./pages/UserProfile";
import AuthWrapper from "./components/AuthWrapper";
import { CoursesProvider } from "./context/CoursesContext";

export default function App() {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ThemeProvider>
        <MessageProvider>
          <CoursesProvider>
            <UserProvider>
              <Header />
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
              <Footer />
            </UserProvider>
          </CoursesProvider>
        </MessageProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}
