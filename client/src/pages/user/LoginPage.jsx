import { useContext, useState } from "react";
import { AuthInput } from "../../components/FormComponents";
import { AuthButton } from "../../components/FormComponents";
import Loader from "../../components/Loader";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { UserContext } from "../../context/UserContext";
import { MessageContext } from "../../context/MessageContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const { login } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUserCredentials({
      email: "",
      password: "",
    });
    setIsLoading(true);
    try {
      const res = await login(userCredentials);
      setMessageInfo(
        `Welcome back to TechEdify, ${res?.data?.user?.fullname}!`,
        false
      );
      navigate(searchParams.get("redirectTo") || "/dashboard");
    } catch (err) {
      setMessageInfo(err.response.data.message || "Failed to login!");
    } finally {
      setIsLoading(false);
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
            <h2 className="text-3xl  font-semibold text-center xsm:text-4xl lg:text-2xl">
              Welcome back to TechEdify
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
              Don't have an account?
              <Link to="/signup" className="cursor-pointer hover:underline">
                Signup
              </Link>
            </div>
          </div>
          {/* form side  */}
          <div className="bg-light-card dark:bg-dark-subcard h-[25rem] w-full p-8 flex flex-col gap-4 shadow-md xsm:w-[25rem] lg:w-[22rem] justify-center">
            <h1 className="text-3xl  text-center">Login</h1>
            <form
              className="flex flex-col gap-8 text-sm"
              onSubmit={handleFormSubmit}
            >
              <AuthInput
                label="email"
                type="email"
                placeholder="Enter the email..."
                name="email"
                value={userCredentials["email"]}
                onChange={handleInputChange}
                required={true}
              />
              <AuthInput
                label="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter the password..."
                name="password"
                value={userCredentials["password"]}
                onChange={handleInputChange}
                required={true}
              >
                <span
                  className="absolute  right-2 cursor-pointer hover:opacity-70"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </AuthInput>

              <AuthButton disabled={isLoading}>Login</AuthButton>
            </form>
            <div className="text-right ">
              <Link
                to="/tutor/login"
                className="text-light-primary dark:text-dark-primary hover:underline "
              >
                Tutor Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
