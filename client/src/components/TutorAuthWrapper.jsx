import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TutorContext } from "../context/TutorContext";
import Loader from "./Loader";
import { MessageContext } from "../context/MessageContext";

export default function TutorAuthWrapper({ children }) {
  const navigate = useNavigate();
  const { loading, tutor } = useContext(TutorContext);
  const { setMessageInfo } = useContext(MessageContext);
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!tutor) {
    setMessageInfo("Login as tutor to continue!", true);
    navigate(`/tutor/login?redirectTo=${location.pathname}`);
  }

  return children;
}
