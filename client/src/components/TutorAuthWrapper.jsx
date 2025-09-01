import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TutorContext } from "../context/TutorContext";
import Loader from "./Loader";

export default function TutorAuthWrapper({ children }) {
  const navigate = useNavigate();
  const { loading, tutor } = useContext(TutorContext);

  if (loading) {
    return <Loader />;
  }

  if (!tutor) {
    navigate("/tutor/login");
  }

  return children;
}
