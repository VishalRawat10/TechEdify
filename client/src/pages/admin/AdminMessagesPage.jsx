import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { apiInstance } from "../../services/apis";

export default function AdminContactMessagesPage() {
  const [messages, setMessage] = useState([]);
  const { setMessageInfo } = useContext(MessageContext);
  useEffect(() => {
    apiInstance
      .get("/messages")
      .then((res) => setMessage(res.data.messages))
      .catch((err) => setMessageInfo(err.response.data.message, true));
  });
  return (
    <div>
      {messages.map((message, idx) => (
        <div key={idx}>{message.message}</div>
      ))}
    </div>
  );
}
