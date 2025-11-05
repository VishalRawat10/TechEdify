import { Link } from "react-router-dom";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function Footer() {
  return (
    <footer className="bg-light-footer dark:bg-dark-footer mt-auto text-white flex flex-col gap-4 p-8 text-justify sm:p-12 lg:py-24 lg:px-24 lg:flex-row lg:justify-between">
      <div className="flex gap-2 flex-col items-start lg:max-w-[14rem]">
        <img src="/images/logo.png" alt="" className="h-12 aspect-auto" />
        <p className="text-sm">
          Learn. Build. Grow. | TechEdify - Your Gateway to IT Education
        </p>
      </div>

      {/* Helpful Links  */}
      <div className="flex flex-col gap-2">
        <h3 className=" font-semibold text-dark-primary">Helpful Links</h3>
        <div className="flex flex-col gap-1 text-xm">
          <Link to="/" className="opacity-80 hover:opacity-100 hover:underline">
            Home
          </Link>
          <Link
            to="/courses"
            className="opacity-80 hover:opacity-100 hover:underline"
          >
            Courses
          </Link>
          <Link
            to="/tutor/login"
            className="opacity-80 hover:opacity-100 hover:underline"
          >
            Tutor Login
          </Link>
          <Link className="opacity-80 hover:opacity-100 hover:underline">
            Privacy Policy
          </Link>
          <Link className="opacity-80 hover:opacity-100 hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </div>

      {/* Connect with us  */}
      <div className="flex flex-col gap-2">
        <h3 className=" font-semibold text-dark-primary">Connect With Us</h3>
        <div className="flex gap-4 lg:flex-col">
          <a
            href="www.x.com/VishalR06462015"
            className="hover:text-black text-lg w-fit"
          >
            <XIcon />
          </a>
          <a
            href="www.linkedin.com/in/vishalrawat10052005"
            className="hover:text-[#0270AD] text-lg w-fit"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://www.instagram.com/vishal_rwt_10"
            className="hover:text-[#F10669] text-lg w-fit"
          >
            <InstagramIcon />
          </a>
          <a href="" className="hover:text-[#1152D1] text-lg w-fit">
            <FacebookIcon />
          </a>
        </div>
      </div>

      {/* copywrite  */}
      <div className="lg:max-w-[12rem] text-center">
        &copy;2025 TechEdify Pvt. Ltd. All Rights Reserved.
      </div>
    </footer>
  );
}
