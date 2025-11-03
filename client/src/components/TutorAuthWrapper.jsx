import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TutorContext } from "../context/TutorContext";
import { MessageContext } from "../context/MessageContext";
import Loader from "./Loader";

export default function TutorAuthWrapper({ children }) {
  const navigate = useNavigate();
  const { loading, tutor } = useContext(TutorContext);
  const { setMessageInfo } = useContext(MessageContext);
  const location = useLocation();

  if (!tutor && !loading) {
    setMessageInfo("Please login as tutor to continue!");
    navigate(`/tutor/login?redirectTo=${location.pathname}`);
  }

  return loading ? <Loader /> : children;
}
