import { useContext } from "react";

import { apiInstance } from "../../../services/apis";
import { MessageContext } from "../../context/MessageContext";
import { UserContext } from "../../context/UserContext";

import { useNavigate } from "react-router-dom";

export default function EnrollButton({ className, courseId, setIsLoading }) {
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const enrollToCourse = async () => {
    if (!user) {
      setMessageInfo("Please login to enroll!", true);
      navigate("/user/login");
    }
    setIsLoading(true);
    try {
      const res = await apiInstance.post(`/courses/${courseId}/enroll`);
      setMessageInfo("Your are enrolled to the course!", false);
      navigate(`/courses/${course._id}/learn`);
    } catch (err) {
      console.log(err);
      setMessageInfo(err.response.data.message, true);
    }
    setIsLoading(false);
  };
  return (
    <button
      className={
        "bg-[#ffaa00] px-8 py-3 rounded-lg font-semibold text-black cursor-pointer hover:scale-105" +
        " " +
        className
      }
      onClick={(e) => enrollToCourse()}
    >
      Enroll now
    </button>
  );
}
