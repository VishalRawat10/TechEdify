import { useState } from "react";
import TutorModal from "./TutorModal";
import { Info } from "@mui/icons-material";

export default function TutorCard({ tutor, onAction, setIsLoading }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="
          bg-light-card dark:bg-dark-card 
          border border-gray-200 dark:border-gray-700 
          rounded-xl shadow-sm 
          overflow-hidden flex flex-col items-center text-center p-5 relative
          transition-all duration-200
        "
      >
        {/* Profile Image */}
        <img
          src={tutor.profileImage?.url || "/images/default-avatar.png"}
          alt={tutor.fullname}
          className="w-24 h-24 rounded-full object-cover border mb-3"
        />

        {/* Tutor Info */}
        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {tutor.fullname}
        </h4>
        <p className="text-sm text-gray-500 mb-3">{tutor.email}</p>

        {/* Status */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            !tutor.isSuspended
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {tutor.isSuspended ? "Suspended" : "Active"}
        </span>

        {/* View Details Button */}
        <button
          onClick={() => setOpen(true)}
          className="mt-4 flex items-center gap-1 text-main hover:underline text-sm cursor-pointer"
        >
          <Info fontSize="small" /> View Details
        </button>
      </div>

      {/* Modal */}
      {open && (
        <TutorModal
          open={open}
          onClose={() => setOpen(false)}
          tutor={tutor}
          onAction={onAction}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
