import { createContext, useState, useEffect } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }, [message]);
  return (
    <MessageContext.Provider
      value={{ message, setMessage, isError, setIsError }}
    >
      {children}
    </MessageContext.Provider>
  );
};
