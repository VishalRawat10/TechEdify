import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

import Loader from "./Loader";

export default function AdminAuthWrapper({ children }) {
  const { admin, loading } = useContext(AdminContext);
  const navigate = useNavigate();
  if (!admin && !loading) {
    navigate("/admin/login");
  }
  return loading ? <Loader /> : children;
}
