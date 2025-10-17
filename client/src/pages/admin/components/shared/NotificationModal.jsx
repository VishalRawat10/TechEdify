import { Modal, Box, Button, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { apiInstance } from "../../../../services/axios.config";
import { Done, Close, Mail, Person } from "@mui/icons-material";

export default function NotificationModal({ open, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Fetch notifications (user queries)
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const res = await apiInstance.get("/query-messages");
      setNotifications(res.data.queryMessages || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setMessageInfo("Failed to load notifications!");
    }
  };

  const handleStatusChange = async (id, isResolved) => {
    setLoading(true);
    try {
      await apiInstance.patch(`/query-messages/${id}`, {
        isResolved: !isResolved,
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isResolved: !isResolved } : n))
      );
    } catch (err) {
      console.error("Error updating notification:", err);
      setMessageInfo(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "resolved") return n.isResolved;
    if (filter === "unresolved") return !n.isResolved;
    return true;
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          bg-white dark:bg-dark-card
          rounded-lg shadow-xl w-[90%] max-w-3xl p-6 max-h-[90vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <Button onClick={onClose} variant="outlined" size="small">
            Close
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-5">
          {["all", "resolved", "unresolved"].map((type) => (
            <Button
              key={type}
              variant={filter === type ? "contained" : "outlined"}
              color={filter === "resolved" ? "success" : "primary"}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No notifications found.
          </p>
        ) : (
          <ul className="space-y-4">
            {filteredNotifications.map((n) => (
              <li
                key={n._id}
                className="
                  border border-gray-200 dark:border-gray-700 rounded-lg
                  p-4 flex flex-col gap-2 bg-light-card dark:bg-dark-card
                "
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="flex items-center gap-2">
                      <Person fontSize="small" />
                      <span className="font-medium">{n.fullname}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail fontSize="small" /> {n.email}
                    </p>
                  </div>

                  <Chip
                    label={n.isResolved ? "Resolved" : "Unresolved"}
                    color={n.isResolved ? "success" : "warning"}
                    size="small"
                  />
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {n.queryMessage}
                </p>

                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="outlined"
                    size="small"
                    color={n.isResolved ? "warning" : "success"}
                    startIcon={n.isResolved ? <Close /> : <Done />}
                    disabled={loading}
                    onClick={() => handleStatusChange(n._id, n.isResolved)}
                  >
                    {n.isResolved ? "Mark Unresolved" : "Mark Resolved"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Box>
    </Modal>
  );
}
