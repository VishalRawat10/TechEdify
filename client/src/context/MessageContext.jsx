import { createContext, useState, useEffect } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 1000);
  }, [message]);
  return (
    <MessageContext.Provider
      value={{
        message,
        setMessage,
        isError,
        setIsError,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
