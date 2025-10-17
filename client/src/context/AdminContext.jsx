import { createContext, useState, useEffect } from "react";
import { apiInstance } from "../services/axios.config";

export const AdminContext = createContext();
export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(false);

  const getAdmin = async () => {
    return await apiInstance.get("/admin/profile");
  };

  useEffect(() => {
    setLoading(true);
    getAdmin()
      .then((res) => setAdmin(res.data.admin))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, loading, setLoading }}>
      {children}
    </AdminContext.Provider>
  );
};
