import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import Loader from "./Loader";

export default function AuthWrapper({ children }) {
  const { isLoggedIn, loading } = useContext(UserContext);

  if (loading) {
    return <Loader />;
  }

  return <>{isLoggedIn ? children : <Navigate to="/login" />}</>;
}
