import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { MessageContext } from "../context/MessageContext";
import Loader from "./Loader";

export default function AuthWrapper({ children }) {
  const { isLoggedIn, loading } = useContext(UserContext);
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoggedIn && !loading) {
    setMessageInfo("Please login to continue!");
    navigate(`/login?redirectTo=${location.pathname}`);
  }

  return loading ? <Loader /> : children;
}
