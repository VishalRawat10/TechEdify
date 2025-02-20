import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { MessageProvider } from "./context/MessageContext";
import { CookiesProvider } from "react-cookie";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ThemeProvider>
        <MessageProvider>
          <UserProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/user/login" element={<Login />} />
              <Route path="/user/signup" element={<Signup />} />
            </Routes>
            <Footer />
          </UserProvider>
        </MessageProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}
