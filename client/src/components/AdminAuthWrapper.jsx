import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageContext } from "../context/MessageContext";

import Loader from "./Loader";

export default function AdminAuthWrapper({ children }) {
  const { admin, loading } = useContext(AdminContext);
  const { setMessageInfo } = useContext(MessageContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (!admin && !loading) {
    setMessageInfo("Please login as admin to continue!");
    navigate(`/admin/login?redirectTo=${location.pathname}`);
  }

  return loading ? <Loader /> : children;
}
