import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useLocation, useNavigate } from "react-router-dom";

import Loader from "./Loader";

export default function AdminAuthWrapper({ children }) {
  const { admin, loading } = useContext(AdminContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (!admin && !loading) {
    navigate(`/admin/login?redirectTo=${location.pathname}`);
  }

  return loading ? <Loader /> : children;
}
