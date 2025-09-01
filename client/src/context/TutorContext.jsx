import { createContext, useEffect, useState } from "react";
import { apiInstance } from "../services/axios.config";

export const TutorContext = createContext();

export const TutorProvider = ({ children }) => {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <TutorContext.Provider
      value={{
        loading,
        tutor,
        tutorLogin,
        logoutTutor,
        setIsLoading,
        isLoading,
      }}
    >
      {children}
    </TutorContext.Provider>
  );
};
