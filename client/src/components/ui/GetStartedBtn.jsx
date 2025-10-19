import { Link } from "react-router";

import EastIcon from "@mui/icons-material/East";

export default function GetStartedBtn({ className }) {
  return (
    <Link
      to="/signup"
      className={
        "font-semibold text-white px-8 py-4  bg-[#f8611b] rounded-full hover:opacity-90 flex items-center flex-wrap justify-center gap-2 w-fit " +
        " " +
        className
      }
    >
      Get started <EastIcon />
    </Link>
  );
}
