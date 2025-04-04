import { createContext, useState, useEffect } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState({
    text: "",
    isError: false,
  });

  useEffect(() => {
    setTimeout(() => {
      setMessage({ message: "", isError: false });
    }, 1750);
  }, [message]);
  return (
    <MessageContext.Provider
      value={{
        message,
        setMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
