import { createContext, useState, useEffect } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState({});

  const setMessageInfo = (text, isError = true) => {
    setMessage({ text, isError });
  };

  return (
    <MessageContext.Provider
      value={{
        message,
        setMessageInfo,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
