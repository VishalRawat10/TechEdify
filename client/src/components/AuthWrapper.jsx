import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import Loader from "./Loader";

export default function AuthWrapper({ children }) {
  const { isLoggedIn, loading } = useContext(UserContext);
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {isLoggedIn ? (
        children
      ) : (
        <Navigate to={`/login?redirectTo=${location.pathname}`} />
      )}
    </>
  );
}
