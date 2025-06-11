import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function StudentAuthWrapper({ children }) {
  const { user } = useContext(UserContext);

  return user || user?.role !== "student" ? <Navigate to="/" /> : children;
}
