import { createContext, useEffect, useState } from "react";
import { apiInstance } from "../services/axios.config";
import { io } from "socket.io-client";

export const TutorContext = createContext();

export const TutorProvider = ({ children }) => {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState();
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);

  const authTutor = async () => {
    try {
      const res = await apiInstance.get("/tutors/profile");
      setLoading(false);
      setTutor(res.data.tutor);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    authTutor();
  }, []);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const res = await apiInstance.get("/tutors/messages/unread");
        setUnreadMessages(res.data.unreadMessages);
      } catch (err) {
        console.log(err);
      }
    };

    if (tutor) {
      const newSocket = io(import.meta.env.VITE_SERVER_URL);

      newSocket.on("connect", () => {
        console.log("Socket is connected : ", newSocket.id);
      });

      newSocket.emit("connect-tutor", tutor._id);
      setSocket(newSocket);

      fetchUnreadMessages();

      newSocket.on("new-message", (newMessage) => {
        setNewMessage(newMessage);
        setTimeout(() => {
          setNewMessage(null);
        }, 2000);
        setUnreadMessages((prev) => [...prev, newMessage]);
      });

      newSocket.on("mark-read", (message) => {
        setNewMessage(null);
        setUnreadMessages((prev) =>
          prev.filter((msg) => {
            if (msg._id === message._id) {
              return false;
            }
            return true;
          })
        );
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [tutor]);

  const tutorLogin = async (tutorCredentials) => {
    const res = await apiInstance.post("/tutors/login", tutorCredentials);
    setTutor(res.data?.tutor || null);
    return res;
  };

  const logoutTutor = async () => {
    const res = await apiInstance.post("/tutors/logout");
    setTutor(res.data.tutor);
    return res;
  };

  const markRead = () => {
    socket.emit("mark-read", {
      memberId: tutor._id,
      messageId: newMessage._id,
    });
  };

  return (
    <TutorContext.Provider
      value={{
        loading,
        tutor,
        tutorLogin,
        logoutTutor,
        setIsLoading,
        isLoading,
        socket,
        setUnreadMessages,
        unreadMessages,
        newMessage,
        setNewMessage,
        markRead,
      }}
    >
      {children}
    </TutorContext.Provider>
  );
};
