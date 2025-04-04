import { createContext, useEffect, useState } from "react";
import { apiInstance } from "../../services/apis";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await apiInstance.get("/user/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
