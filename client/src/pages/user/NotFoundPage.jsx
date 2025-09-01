import { useContext } from "react";
import { Link } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";

import { UserContext } from "../../context/UserContext";

export default function NotFoundPage() {
  const { user } = useContext(UserContext);

  return (
    <main className="p-4 md:px-[8rem] md:py-[2rem] flex flex-col gap-2 items-center">
      <div className="flex gap-8 items-center select-none">
        <img src="/images/oops.png" alt="" className="h-24 md:h-[8rem]" />
        <h2 className="text-5xl md:text-[8rem] font-semibold">404</h2>
      </div>
      <h4 className="text-3xl md:text-5xl">Page not found!</h4>
      <p className="text-center">
        The page you are looking for does not exist or is moved. Try going back
        to our homepage.
      </p>
      <button className="rounded-full bg-amber-600 px-4 py-2 text-sm cursor-pointer opacity-100 hover:opacity-85 w-fit flex items-center gap-2 text-white">
        <WestIcon />
        <Link to={user ? "/courses" : "/"}>Homepage</Link>
      </button>
    </main>
  );
}
