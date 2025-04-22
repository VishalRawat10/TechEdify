import { Link } from "react-router";

import EastIcon from "@mui/icons-material/East";

export default function GetStartedBtn({ className }) {
  return (
    <button
      className={
        "font-semibold text-white px-8 py-4  bg-[#f8611b] rounded-full hover:opacity-90" +
        " " +
        className
      }
    >
      <Link
        to="/user/signup"
        className="flex items-center flex-wrap justify-center gap-2"
      >
        Get started <EastIcon />
      </Link>
    </button>
  );
}
