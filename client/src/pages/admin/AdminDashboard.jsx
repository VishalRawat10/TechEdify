import React from "react";
import { Box, Grid, Paper, Typography, Avatar } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const StatCard = ({ icon, label, value, bgColor }) => (
  <Paper elevation={3} className="p-4 rounded-2xl flex items-center gap-4">
    <Avatar sx={{ bgcolor: bgColor }}>{icon}</Avatar>
    <Box>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const AdminDashboard = () => {
  // Replace with real data from API or props
  const stats = [
    {
      label: "Total Students",
      value: 1200,
      icon: <SchoolIcon />,
      bgColor: "#3b82f6", // Tailwind's blue-500
    },
    {
      label: "Total Instructors",
      value: 85,
      icon: <PersonIcon />,
      bgColor: "#10b981", // Tailwind's green-500
    },
    {
      label: "Total Courses",
      value: 240,
      icon: <MenuBookIcon />,
      bgColor: "#f59e0b", // Tailwind's yellow-500
    },
  ];

  return (
    <Box className="p-6 bg-gray-100 dark:bg-[var(--dark-bg)] min-h-screen">
      <Typography variant="h4" gutterBottom className="mb-6 font-bold">
        Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <StatCard {...stat} className="dark:bg-[var(--dark-bg-2)]" />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
