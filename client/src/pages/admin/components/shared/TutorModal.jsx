import { Modal, Box, Button } from "@mui/material";
import { useState, useContext } from "react";
import { apiInstance } from "../../../../services/axios.config";
import {
  Delete,
  Block,
  CheckCircle,
  CalendarToday,
  MenuBook,
  Email,
  AlternateEmail,
} from "@mui/icons-material";
import { MessageContext } from "../../../../context/MessageContext";

export default function TutorModal({
  open,
  onClose,
  tutor,
  onAction,
  setIsLoading,
}) {
  const [loading, setLoading] = useState(false);
  const [tutorDetails, setTutorDetails] = useState(tutor);

  const { setMessageInfo } = useContext(MessageContext);

  // Suspend / Activate tutor
  const handleToggleSuspend = async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const res = await apiInstance.patch(`/admin/tutors/${tutor._id}/status`, {
        isSuspended: !tutorDetails.isSuspended,
      });
      const updated = {
        ...tutorDetails,
        isSuspended: !tutorDetails.isSuspended,
      };
      setTutorDetails(updated);
      setMessageInfo(res.data.message, false);
      onAction?.("toggleSuspend", tutor._id);
    } catch (err) {
      console.error("Error updating tutor status:", err);
      setMessageInfo("Failed to update tutor status!");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  // Delete tutor
  const handleDeleteTutor = async () => {
    if (!window.confirm("Are you sure you want to delete this tutor?")) return;
    setLoading(true);
    setIsLoading(true);
    try {
      await apiInstance.delete(`/admin/tutors/${tutor._id}`);
      onAction?.("delete", tutor._id);
      onClose();
      setMessageInfo("Tutor deleted successfully.", false);
    } catch (err) {
      console.error("Error deleting tutor:", err);
      setMessageInfo("Failed to delete tutor.");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="
          absolute top-1/2 left-1/2 bg-white dark:bg-dark-card 
          p-6 rounded-lg shadow-xl transform -translate-x-1/2 -translate-y-1/2 
          w-[90%] max-w-2xl overflow-y-auto max-h-[90vh]
        "
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={tutorDetails.profileImage?.url || "/images/default-avatar.png"}
            alt="Tutor"
            className="w-24 h-24 rounded-full object-cover border mb-3"
          />
          <h2 className="text-xl font-semibold">{tutorDetails.fullname}</h2>

          {/* Status */}
          <span
            className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
              !tutorDetails.isSuspended
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {!tutorDetails.isSuspended ? "Active" : "Suspended"}
          </span>
        </div>

        {/* Tutor Info */}
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2">
            <Email fontSize="small" />
            <span className="font-medium">Official Email:</span>
            {tutorDetails.email}
          </p>

          {tutorDetails.personalEmail && (
            <p className="flex items-center gap-2">
              <AlternateEmail fontSize="small" />
              <span className="font-medium">Personal Email:</span>
              {tutorDetails.personalEmail}
            </p>
          )}

          <p className="flex items-center gap-2">
            <CalendarToday fontSize="small" />
            <span className="font-medium">Joined On:</span>
            {new Date(tutorDetails.createdAt).toLocaleDateString()}
          </p>

          <p className="flex items-center gap-2">
            <MenuBook fontSize="small" />
            <span className="font-medium">Total Courses:</span>
            {tutor.myCourses.length}
          </p>
        </div>

        {/* Courses List */}
        {tutor.myCourses.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Courses Created:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {tutor.myCourses.map((course) => (
                <li
                  key={course._id}
                  className="text-gray-700 dark:text-gray-300 text-sm"
                >
                  {course.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>

          <Button
            onClick={handleDeleteTutor}
            color="error"
            startIcon={<Delete />}
            disabled={loading}
          >
            Delete
          </Button>

          <Button
            onClick={handleToggleSuspend}
            variant="contained"
            color={tutorDetails.isSuspended ? "success" : "warning"}
            startIcon={tutorDetails.isSuspended ? <CheckCircle /> : <Block />}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : tutorDetails.isSuspended
              ? "Activate"
              : "Suspend"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
