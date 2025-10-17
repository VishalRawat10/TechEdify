import Drawer from "@mui/material/Drawer";
import Sidebar from "../Sidebar";

/**
 * DrawerSidebar.jsx
 * A responsive sidebar drawer for mobile and tablet devices.
 * It reuses the Sidebar component for content consistency.
 */
export default function DrawerSidebar({ isOpen, onClose }) {
  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 260,
          backgroundColor: "var(--tw-bg-light-card)",
          color: "var(--tw-text-light-primary)",
        },
      }}
    >
      {/* Wrapper for Sidebar Content */}
      <div className="h-full bg-light-card dark:bg-dark-card text-light-primary dark:text-dark-primary">
        <Sidebar onItemClick={onClose} />
      </div>
    </Drawer>
  );
}
