import { Modal, Box, Button } from "@mui/material";
import { useState, useContext } from "react";
import { apiInstance } from "../../../../services/axios.config";
import {
  Delete,
  Block,
  CheckCircle,
  CalendarToday,
  Email,
  Phone,
  Cake,
  Book,
  AccessTime,
} from "@mui/icons-material";
import { MessageContext } from "../../../../context/MessageContext";

export default function StudentModal({
  open,
  onClose,
  student,
  onAction,
  setIsLoading,
}) {
  const [loading, setLoading] = useState(false);
  const [studentDetails, setStudentDetails] = useState(student);
  const { setMessageInfo } = useContext(MessageContext);

  // Suspend / Unsuspend Student
  const handleToggleSuspend = async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const res = await apiInstance.patch(
        `/admin/students/${student._id}/status`,
        {
          isSuspended: !studentDetails.isSuspended,
        }
      );
      const updated = {
        ...studentDetails,
        isSuspended: !studentDetails.isSuspended,
      };
      setStudentDetails(updated);
      onAction?.("toggleSuspend", student._id);
      setMessageInfo(res.data.message, false);
    } catch (err) {
      console.error("Error updating student status:", err);
      setMessageInfo("Failed to update student status.");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  // Delete Student
  const handleDeleteStudent = async () => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    setLoading(true);
    setIsLoading(true);
    try {
      await apiInstance.delete(`/admin/students/${student._id}`);
      onAction?.("delete", student._id);
      onClose();
      setMessageInfo("Student deleted successfully.");
    } catch (err) {
      console.error("Error deleting student:", err);
      setMessageInfo("Failed to delete student.");
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
            src={studentDetails.profileImage?.url || "/images/User.png"}
            alt="Student"
            className="w-24 h-24 rounded-full object-cover border mb-3"
          />
          <h2 className="text-xl font-semibold">{studentDetails.fullname}</h2>

          {/* Status */}
          <span
            className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
              !studentDetails.isSuspended
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {!studentDetails.isSuspended ? "Active" : "Suspended"}
          </span>
        </div>

        {/* Student Info */}
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2">
            <Email fontSize="small" />
            <span className="font-medium">Email:</span> {studentDetails.email}
          </p>

          {studentDetails.contact && (
            <p className="flex items-center gap-2">
              <Phone fontSize="small" />
              <span className="font-medium">Contact:</span>{" "}
              {studentDetails.contact}
            </p>
          )}

          {studentDetails.dob && (
            <p className="flex items-center gap-2">
              <Cake fontSize="small" />
              <span className="font-medium">Date of Birth:</span>{" "}
              {new Date(studentDetails.dob).toLocaleDateString()}
            </p>
          )}

          <p className="flex items-center gap-2">
            <CalendarToday fontSize="small" />
            <span className="font-medium">Registered On:</span>{" "}
            {new Date(studentDetails.createdAt).toLocaleDateString()}
          </p>

          {studentDetails.lastLogin && (
            <p className="flex items-center gap-2">
              <AccessTime fontSize="small" />
              <span className="font-medium">Last Login:</span>{" "}
              {new Date(studentDetails.lastLogin).toLocaleString()}
            </p>
          )}
        </div>

        {/* Enrolled Courses */}
        {student.enrolledCourses.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2 flex items-center gap-1">
              <Book fontSize="small" /> Enrolled Courses
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {student.enrolledCourses.map((course) => (
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
            onClick={handleDeleteStudent}
            color="error"
            startIcon={<Delete />}
            disabled={loading}
          >
            Delete
          </Button>

          <Button
            onClick={handleToggleSuspend}
            variant="contained"
            color={!studentDetails.isSuspended ? "warning" : "success"}
            startIcon={
              !studentDetails.isSuspended ? <Block /> : <CheckCircle />
            }
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : studentDetails.isSuspended
              ? "Activate"
              : "Suspend"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
