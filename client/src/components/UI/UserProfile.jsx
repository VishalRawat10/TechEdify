import { Link } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";

export default function UserProfile({ user }) {
  return (
    <>
      {/* Profile Image */}
      <div className="h-fit flex items-center justify-center gap-8 w-full md:w-fit">
        {
          <img
            src={user?.profileImg?.url || "/svg/Person.svg"}
            alt="Profile"
            loading="lazy"
            className="rounded-full object-cover w-48 aspect-square border-2 border-[var(--base)]"
          />
        }
      </div>
      <div className="text-sm w-full ">
        <p className="text-3xl font-semibold mb-4">
          {user?.fullname?.firstname + " " + user?.fullname?.lastname}
          <span className="block capitalize text-sm opacity-85 italic font-normal">
            {user?.role}
          </span>
        </p>

        <p>
          <strong>Email:</strong> <span>{user?.email}</span>
        </p>
        <p>
          <strong>About me:</strong> <span>{user?.about}</span>
        </p>
        <button
          className="hover:opacity-60 absolute top-3 right-4 cursor-pointer"
          title="Edit"
        >
          <Link to="/user/update-profile" className="flex gap-2 items-center">
            <EditIcon sx={{ fontSize: "1.2rem" }} />
          </Link>
        </button>
      </div>
    </>
  );
}
