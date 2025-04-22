import { createContext, useEffect, useState } from "react";
import { apiInstance } from "../../services/apis";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const res = await apiInstance.get("/user/profile", {
        withCredentials: true,
      });
      setUser(res.data.user);
      navigate("/user/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  console.log(user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
