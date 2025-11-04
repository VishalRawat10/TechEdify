import { useContext } from "react";

import { apiInstance } from "../../services/axios.config";
import { MessageContext } from "../../context/MessageContext";
import { UserContext } from "../../context/UserContext";

import { useLocation, useNavigate } from "react-router-dom";

export default function EnrollButton({ className, courseId, setIsLoading }) {
  const { setMessageInfo } = useContext(MessageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const enrollToCourse = async () => {
    if (!user) {
      setMessageInfo("Please login to enroll!", true);
      return navigate(`/login?redirectTo=${location.pathname}`);
    }
    setIsLoading(true);
    try {
      const paymentRes = await apiInstance.post(`/payments`, {
        courseId: courseId,
      });

      // Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentRes.data.order.amount,
        currency: paymentRes.data.order.currency,
        name: "TechEdify",
        image: "/images/logo.png",
        description: paymentRes.data.course.title,
        order_id: paymentRes.data.order.id,
        callback_url: `${
          import.meta.env.VITE_SERVER_URL
        }/api/v1/payments/verify`,
        prefill: {
          name: user?.fullname,
          email: user?.email,
          contact: user?.phone || null,
        },
        theme: {
          color: "#F37254",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      setMessageInfo(err.response.data.message, true);
    } finally {
      setIsLoading(false);
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
