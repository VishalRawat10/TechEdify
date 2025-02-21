import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useContext, useState, useRef } from "react";
import { apiInstance } from "../../services/apis";
import { MessageContext } from "../context/MessageContext";

export default function Signup() {
  const { setMessage, setIsError } = useContext(MessageContext);
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const confirmPassword = useRef();
  const navigate = useNavigate();

  // Handle Input Change function
  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  //Create Account Function
  const createAccount = async (e) => {
    e.preventDefault();
    setUserDetails({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    });
    if (confirmPassword.current.value === userDetails.password) {
      try {
        const res = await apiInstance.post("/user/signup", userDetails);
        setCookie("token", res.data.token);
        setMessage("Welcome to CodingShala");
        setIsError(false);
        navigate(-1);
      } catch (err) {
        setMessage(err.response.data.message);
        setIsError(true);
        confirmPassword.current.value = "";
      }
    } else {
      setMessage("Confirm password does not match the password!");
      setIsError(true);
      confirmPassword.current.value = "";
    }
  };

  return (
    <div className="bg-[var(--user-bg)] flex flex-col items-center md:justify-center md:min-h-screen md:p-16 text-white ">
      <div className="h-[calc(100vh-var(--footer-h)-var(--header-h))]  bg-[var(--user-card-bg)] w-full md:w-min md:p-2 md:rounded-xl flex flex-col items-center md:flex-row md:h-[33rem]">
        <img
          src="/images/Signup.avif"
          alt=""
          className=" hidden md:block md:rounded-xl max-w-[25rem] h-full "
        />
        <form
          className=" font-['Poppins'_sans-serif] h-full p-4 md:px-16 w-full max-w-[27rem] md:min-w-[27rem] flex flex-col gap-5 md:justify-center"
          onSubmit={(e) => createAccount(e)}
        >
          <h2 className="text-4xl">Create an account</h2>
          <p className="text-[14px] text-[#A8A8A8]">
            Already have an account? &nbsp;
            <Link
              to="/user/login"
              className="underline text-sm hover:opacity-80"
            >
              Log in
            </Link>
          </p>
          <div className="flex w-full flex-wrap justify-between gap-x-2">
            <input
              type="text"
              placeholder="First Name"
              className="user-input "
              style={{ width: "48%" }}
              minLength={2}
              name="firstname"
              value={userDetails.firstname}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="user-input"
              style={{ width: "48%" }}
              name="lastname"
              value={userDetails.lastname}
              onChange={handleInputChange}
            />
            <p style={{ position: "static" }}>
              Firstname must contain min 2 characters.
            </p>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="user-input"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              required
            />
            <p>Enter a valid email address.</p>
          </div>
          <div>
            {" "}
            <input
              type="password"
              placeholder="Enter your password"
              className="user-input"
              minLength={8}
              maxLength={20}
              name="password"
              value={userDetails.password}
              onChange={handleInputChange}
              required
            />
            <p>Password must be min 6 character long.</p>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="user-input pr-16"
              minLength={8}
              ref={confirmPassword}
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
          <span className="text-[12px]  flex items-center flex-wrap">
            <input
              type="checkbox"
              className="checkbox cursor-pointer mr-3 invalid:text-red"
              defaultChecked
              required
            />
            I agree to &nbsp;
            <a href="" className="underline text-[#A8A8A8] hover:opacity-80">
              terms & conditions.
            </a>
            <p>Please agree to terms & conditions to create account.</p>
          </span>
          <button className="bg-[var(--user-btn-bg)] py-3 rounded-lg text-sm cursor-pointer hover:opacity-85">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
