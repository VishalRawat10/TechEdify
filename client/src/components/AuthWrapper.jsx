import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import Loader from "./Loader";

export default function AuthWrapper({ children }) {
  const { user, loading } = useContext(UserContext);
  if (loading) {
    return <Loader />;
  }
  return <>{user ? children : <Navigate to="/user/login" />}</>;
}
