import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useContext, useState } from "react";
import { MessageContext } from "../context/MessageContext";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

export default function Login() {
  const { setMessageInfo } = useContext(MessageContext);
  const { user } = useContext(UserContext);
  const { login } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Handle Input Change function
  const handleInputChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  //Login Form Submission Function
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setUserCredentials({
      email: "",
      password: "",
    });

    setIsLoading(true);
    try {
      login(userCredentials)
        .then((res) => {
          setIsLoading(false);
          setMessageInfo("Welcome back to TechEdify!", false);
          if (res.data.user?.role === "instructor") {
            navigate("/instructor/my-courses");
          } else {
            navigate("/user/dashboard");
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setMessageInfo(err.response.data.message, true);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="bg-[var(--user-bg)] flex flex-col items-center justify-center md:min-h-screen md:p-16 text-white ">
        <div className="h-[calc(100vh-var(--header-h)-var(--footer-h))] bg-[var(--user-card-bg)] w-full md:w-min md:p-2 md:rounded-xl flex flex-col items-center pt-14 md:flex-row  md:h-fit">
          <img
            src="/images/Login.avif"
            alt=""
            className=" hidden md:block md:rounded-xl max-w-[23rem] h-[27rem]"
          />
          <form
            className=" font-['Poppins'_sans-serif] p-4 md:p-16 w-full max-w-[27rem] md:min-w-[27rem] flex flex-col gap-6"
            onSubmit={handleFormSubmit}
          >
            <h2 className="text-4xl">Welcome Back!</h2>
            <p className="text-[14px] text-[#A8A8A8]">
              Don't have an account?{" "}
              <Link
                to="/user/signup"
                className="underline text-sm hover:opacity-80"
              >
                Sign up
              </Link>
            </p>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="user-input"
                name="email"
                value={userCredentials.email}
                onChange={handleInputChange}
                required
              />
              <p>Enter a valid email address.</p>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                className="user-input"
                name="password"
                value={userCredentials.password}
                onChange={handleInputChange}
                required
              />
              <button
                className="text-sm absolute top-2 right-4 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  return setShowPassword(!showPassword);
                }}
              >
                <VisibilityIcon sx={showPassword ? { display: "none" } : {}} />
                <VisibilityOffIcon
                  sx={!showPassword ? { display: "none" } : {}}
                />
              </button>
            </div>

            <button
              className="bg-[var(--user-btn-bg)] py-3 rounded-lg text-sm cursor-pointer hover:opacity-85"
              disabled={isLoading}
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
