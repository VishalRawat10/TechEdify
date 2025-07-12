import { useContext } from "react";

import { apiInstance } from "../../services/axios.config";
import { MessageContext } from "../../context/MessageContext";
import { UserContext } from "../../context/UserContext";

import { useNavigate } from "react-router-dom";

export default function EnrollButton({ className, courseId, setIsLoading }) {
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const enrollToCourse = async () => {
    if (!user) {
      setMessageInfo("Please login to enroll!", true);
      return navigate("/user/login");
    }
    setIsLoading(true);
    try {
      const res = await apiInstance.post(`/courses/${courseId}/enroll`);
      setUser(res.data.user);
      setMessageInfo("Your are enrolled to the course!", false);
      setIsLoading(false);
      navigate(`/courses/${courseId}/learn`);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setMessageInfo(err.response.data.message, true);
    }
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
