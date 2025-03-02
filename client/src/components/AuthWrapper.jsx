import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function AuthWrapper({ children }) {
  const { user } = useContext(UserContext);

  return user ? <>{children}</> : <Navigate to="/" />;
}
