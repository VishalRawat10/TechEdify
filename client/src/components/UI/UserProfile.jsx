import { Link } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";

export default function UserProfile({ user }) {
  return (
    <>
      {/* Profile Image */}
      <div className="h-fit flex items-center justify-center gap-8 w-full md:w-fit">
        {user?.profileImg?.url ? (
          <img
            src={user.profileImg.url}
            alt="Profile"
            loading="lazy"
            className="rounded-full object-cover w-52 aspect-square"
          />
        ) : (
          <div className="w-24 sm:w-28 md:w-32 lg:w-40 xl:w-52 aspect-square rounded-full bg-white flex justify-center items-center">
            <PersonIcon className="scale-[2] text-black" />
          </div>
        )}
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
