import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TutorContext } from "../context/TutorContext";
import Loader from "./Loader";

export default function TutorAuthWrapper({ children }) {
  const navigate = useNavigate();
  const { loading, tutor } = useContext(TutorContext);
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!tutor) {
    navigate(`/tutor/login?redirectTo=${location.pathname}`);
  }

  return children;
}
