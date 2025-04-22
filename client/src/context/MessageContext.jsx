import { createContext, useState, useEffect } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState();
  const [isError, setIsError] = useState();

  const setMessageInfo = (message, isError = true) => {
    setMessage(message);
    setIsError(isError);
  };
  useEffect(() => {
    setTimeout(() => {
      setMessageInfo("", false);
    }, 1750);
  }, [message]);
  return (
    <MessageContext.Provider
      value={{
        message,
        isError,
        setMessageInfo,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
