import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

import { apiInstance } from "../services/axios.config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState();
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const res = await apiInstance.get("/users/unread-messages");
        setUnreadMessages(res.data.unreadMessages);
      } catch (err) {
        console.log(err);
      }
    };

    if (user) {
      const newSocket = io(import.meta.env.VITE_SERVER_URL);
      newSocket.on("connect", () => {
        console.log("Socket is conneted: ", newSocket.id);
        newSocket.emit("connect-user", user._id);
      });
      setSocket(newSocket);

      fetchUnreadMessages();

      newSocket.on("new-message", (newMsg) => {
        setNewMessage(newMsg);
        setUnreadMessages((prev) => [...prev, newMsg]);
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
  }, [user]);

  //Authentication
  async function checkAuth() {
    try {
      const res = await apiInstance.get("/users/profile");
      setLoading(false);
      setUser(res.data.user);
      setIsLoggedIn(true);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  //signup
  async function signup(userDetails) {
    const res = await apiInstance.post("/users/signup", userDetails);
    setUser(res.data.user);
    setIsLoggedIn(true);
  }

  //login
  async function login(userCredentials) {
    const res = await apiInstance.post("/users/login", userCredentials);
    setUser(res.data.user);
    setIsLoggedIn(true);
    return res;
  }

  //logout
  async function logout() {
    const res = await apiInstance.post("/users/logout");
    setUser(null);
    setIsLoggedIn(false);
    socket.on("disconnect", () => {
      console.log("Socket is disconnected : ", socket.id);
      setSocket();
    });
  }

  //update profile
  async function updateProfile(userDetails) {
    const res = await apiInstance.put("/users/profile", userDetails);
    setUser(res.data.user);
    return res;
  }

  //update profile-image
  async function updateProfileImage(formData) {
    const res = await apiInstance.put("/users/profile/profile-image", formData);
    setUser(res.data.user);
    return res;
  }

  //delete profile-image
  async function deleteProfileImage() {
    const res = await apiInstance.delete("/users/profile/profile-image");
    setUser(res.data.user);
    return res;
  }

  //updatePassword
  async function updatePassword({ currentPassword, newPassword }) {
    const res = await apiInstance.put("/users/update-password", {
      currentPassword,
      newPassword,
    });
    return res;
  }

  //mark as read in new message notification
  const markRead = () => {
    socket.emit("mark-read", { messageId: newMessage._id, memberId: user._id });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signup,
        login,
        logout,
        updateProfile,
        updateProfileImage,
        deleteProfileImage,
        updatePassword,
        isLoggedIn,
        checkAuth,
        loading,
        socket,
        unreadMessages,
        newMessage,
        setNewMessage,
        markRead,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
