import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthInput } from "../../components/FormComponents";
import { AuthButton } from "../../components/FormComponents";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Loader from "../../components/Loader";
import { UserContext } from "../../context/UserContext";
import { MessageContext } from "../../context/MessageContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState({});

  const { signup } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);

  const handleInputChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const error = {};

    // validation for fullname
    if (userCredentials.fullname && userCredentials.fullname.length < 2) {
      error.fullname = "Fullname must contain minimum 2 alphabate!";
    }

    // validation for email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userCredentials.email)) {
      if (userCredentials.email !== "") error.email = "Enter a valid email!";
    }

    // validation for password
    if (userCredentials.password !== "") {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z\d!@#$%^&*()-_+=]{8,}$/.test(
          userCredentials.password
        ) ||
        userCredentials.password.length < 8
      ) {
        error.password =
          "Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special character and 8 characters!";
      }
    }

    // validation for confirm-password
    if (
      confirmPassword !== "" &&
      confirmPassword === userCredentials.password
    ) {
      error.confirmPassword = "Please enter correct password!";
    }

    setError(error);
  };

  useEffect(validateForm, [userCredentials]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUserCredentials({ email: "", password: "", fullname: "" });
    setConfirmPassword("");
    try {
      const res = await signup(userCredentials);
      setIsLoading(false);
      setMessageInfo(res.data.message, false);
      navigate("/dashboard");
    } catch (err) {
      setIsLoading(false);
      setMessageInfo(err.response.data.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <main className="bg-light dark:bg-dark w-full min-h-[calc(100vh-var(--header-h))] max-h-fit flex items-center justify-center relative ">
        {/* main-container  */}
        <div className="absolute w-full bg-main min-h-full max-h-fit flex flex-col gap-6 items-center justify-center px-6 py-10 lg:min-h-fit lg:w-fit lg:flex-row">
          {/* image side*/}
          <div className="text-white flex flex-col gap-4 items-center xsm:w-[28rem] lg:w-[22rem] ">
            <h2 className="text-3xl  font-semibold text-center xsm:text-4xl lg:text-3xl">
              Welcome to TechEdify
            </h2>
            <p className="text-center sm:text-md md:text-sm opacity-70">
              Unlock a world of knowledge with expert-led courses designed to
              boost your tech skills.
            </p>
            <img
              src="/images/signup.png"
              alt=""
              className="w-2/3 hidden lg:block"
            />
            <div className="flex gap-2 justify-center items-center text-sm ">
              Already have an account?
              <Link to="/login" className="cursor-pointer hover:underline">
                Login
              </Link>
            </div>
          </div>
          {/* form side  */}
          <div className="bg-light-card dark:bg-dark-subcard w-full p-8 flex flex-col gap-3 shadow-md xsm:w-[25rem] lg:w-[22rem]">
            <h1 className="text-3xl  text-center">Create Account</h1>
            <form
              className="flex flex-col gap-7 text-sm"
              onSubmit={handleFormSubmit}
            >
              <AuthInput
                label="fullname"
                name="fullname"
                value={userCredentials.fullname}
                type="text"
                placeholder="Enter the fullname..."
                error={error.fullname}
                onChange={handleInputChange}
              />
              <AuthInput
                label="email"
                type="email"
                placeholder="Enter the email..."
                name="email"
                value={userCredentials.email}
                error={error.email}
                onChange={handleInputChange}
              />
              <AuthInput
                label="password"
                type="password"
                placeholder="Enter the password..."
                name="password"
                value={userCredentials.password}
                error={error.password}
                onChange={handleInputChange}
              />
              <AuthInput
                label="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm the password..."
                name="confirmPassword"
                value={confirmPassword}
                error={error.confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              >
                <span
                  className="absolute  right-2 cursor-pointer hover:opacity-70"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </AuthInput>

              <AuthButton>Create Account</AuthButton>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
