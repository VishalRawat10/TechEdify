import { useState } from "react";
import { Info } from "@mui/icons-material";
import StudentModal from "./StudentModal";

export default function StudentCard({ student, onAction, setIsLoading }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="
          bg-light-card dark:bg-dark-card
          border border-gray-200 dark:border-gray-700
          rounded-xl shadow-sm
          overflow-hidden flex flex-col items-center text-center p-5 relative
        "
      >
        {/* Profile Image */}
        <img
          src={student.profileImage?.url || "/images/User.png"}
          alt={student.fullname}
          className="w-24 h-24 rounded-full object-cover border mb-3"
        />

        {/* Student Info */}
        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {student.fullname}
        </h4>
        <p className="text-sm text-gray-500 mb-2">{student.email}</p>

        {/* Status */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            !student.isSuspended
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {!student.isSuspended ? "Active" : "Suspended"}
        </span>

        {/* View Button */}
        <button
          onClick={() => setOpen(true)}
          className="mt-4 flex items-center gap-1 text-main hover:underline text-sm cursor-pointer"
        >
          <Info fontSize="small" /> View Details
        </button>
      </div>

      {/* Student Modal */}
      {open && (
        <StudentModal
          open={open}
          onClose={() => setOpen(false)}
          student={student}
          onAction={onAction}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
