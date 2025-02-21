import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { apiInstance } from "../../services/apis";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState();
  const [token, setToken] = useState(() => {
    return cookie.token ? cookie.token : "";
  });

  const getUser = async () => {
    try {
      const res = await apiInstance.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (err) {
      console.log(err.response.data.message);
      removeCookie("token");
    }
  };

  useEffect(() => {
    if (token) {
      setCookie("token", token, {
        maxAge: 24 * 60 * 60,
      });
      getUser();
    } else {
      removeCookie("token");
      setUser();
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
