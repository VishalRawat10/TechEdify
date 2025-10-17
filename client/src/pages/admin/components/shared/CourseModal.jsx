import { Modal, Box, Button } from "@mui/material";
import { useContext, useState } from "react";
import { apiInstance } from "../../../../services/axios.config";
import {
  Delete,
  CloudDone,
  CloudOff,
  CalendarToday,
  People,
  VideoLibrary,
} from "@mui/icons-material";
import { MessageContext } from "../../../../context/MessageContext";

export default function CourseModal({
  setIsLoading,
  open,
  onClose,
  course,
  setCourses,
}) {
  const [localCourse, setLocalCourse] = useState(course);
  const { setMessageInfo } = useContext(MessageContext);
  const [loading, setLoading] = useState(false);

  const handleTogglePublish = async () => {
    setIsLoading(true);
    setLoading(true);
    try {
      const res = await apiInstance.patch(
        `/admin/courses/${course._id}/publish-status`,
        {
          isPublished: !localCourse.isPublished,
        }
      );
      setLocalCourse(res.data.course);
      setMessageInfo(res.data.message, false);
      setCourses((prev) => {
        const updatedCourses = prev.map((course) => {
          if (course._id === res.data.course._id) return res.data.course;
          return course;
        });

        return updatedCourses;
      });
    } catch (err) {
      console.error("Failed to update course status:", err);
      setMessageInfo(err.response.data.message);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    setIsLoading(true);
    try {
      await apiInstance.delete(`/admin/courses/${course._id}`);
      setMessageInfo("Course deleted successfully.", false);
      setCourses((prev) => {
        return prev.map((c) => {
          return !course._id === c._id;
        });
      });
      onClose();
    } catch (err) {
      console.error("Error deleting course:", err);
      setMessageInfo("Failed to delete course.");
    } finally {
      setLoading(true);
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 bg-white dark:bg-dark-card p-6 rounded-lg shadow-xl transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500">
        <h2 className="text-2xl font-semibold mb-4">{localCourse.title}</h2>

        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          {/* Thumbnail */}
          <img
            src={localCourse.thumbnail?.url || "/images/course-placeholder.jpg"}
            alt="Course thumbnail"
            className="w-full h-48 object-cover rounded-lg mb-3"
          />

          {/* Tutor Info */}
          <div className="flex items-center gap-2">
            <img
              src={localCourse.tutor?.profileImage?.url || "/images/User.png"}
              alt="Tutor"
              className="w-10 h-10 rounded-full border object-cover"
            />
            <span>{localCourse.tutor?.fullname || "Unknown Tutor"}</span>
          </div>

          {/* Course Meta */}
          <div className="flex flex-wrap gap-4 mt-3">
            <p className="flex items-center gap-1">
              <CalendarToday fontSize="small" /> Created on:
              {new Date(localCourse.createdAt).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-1">
              <VideoLibrary fontSize="small" /> Lectures:
              {localCourse.lectures?.length || 0}
            </p>
            <p className="flex items-center gap-1">
              <People fontSize="small" /> Enrolled Students:
              {localCourse.enrolledStudents?.length || 0}
            </p>
          </div>

          {/* Status */}
          <div className="mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                localCourse.isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {localCourse.isPublished ? "Published" : "Unpublished"}
            </span>
          </div>

          {/* Optional Details */}
          {localCourse.description && (
            <div className="mt-4">
              <h4 className="font-semibold mb-1">Description:</h4>
              <p className="text-sm">{localCourse.description}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            startIcon={<Delete />}
            disabled={loading}
          >
            Delete
          </Button>
          <Button
            onClick={handleTogglePublish}
            variant="contained"
            color={localCourse.isPublished ? "warning" : "success"}
            startIcon={localCourse.isPublished ? <CloudOff /> : <CloudDone />}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : localCourse.isPublished
              ? "Unpublish"
              : "Publish"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
