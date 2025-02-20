import VerifiedIcon from "@mui/icons-material/Verified";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { MessageContext } from "../context/MessageContext";

export default function Message() {
  const { message, setMessage, isError } = useContext(MessageContext);
  return (
    <div
      className={
        "w-full absolute top-20 duration-300 transition-[display]" +
        (!message ? " hidden" : "")
      }
    >
      <div
        className={
          "text-white mx-2 rounded-lg flex gap-4  py-2 md:w-1/2 md:mx-auto after:content-[''] after:block after:w-full after:md:w-1/2 after:h-full after:absolute after:bottom-0 after:rounded-lg dark:text-black" +
          (isError
            ? " bg-[#bb2124] after:animate-errorMsg "
            : " bg-[#04e762] after:animate-successMsg")
        }
      >
        {" "}
        <div className="ml-4 flex justify-center items-center">
          <VerifiedIcon sx={isError ? { display: "none" } : {}} />
          <NewReleasesIcon sx={!isError ? { display: "none" } : {}} />
        </div>
        <p>{message}</p>
        <button
          onClick={() => setMessage("")}
          className="ml-auto mr-4 cursor-pointer z-50"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
