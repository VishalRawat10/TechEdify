import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiInstance } from "../services/apis";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  //Authentication
  async function checkAuth() {
    try {
      setLoading(true);
      const res = await apiInstance.get("/user/profile", {
        withCredentials: true,
      });
      setUser(res.data.user);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  //signup
  async function signup(userDetails) {
    setLoading(true);
    const res = await apiInstance.post("/user/signup", userDetails);
    setUser(res.data.user);
    setLoading(false);
  }

  //login
  async function login(userCredentials) {
    setLoading(true);
    const res = await apiInstance.post("/user/login", userCredentials);
    // if (res.data.user.isTempPassword) {
    //   return navigate("/user/update-password");
    // }
    setUser(res.data.user);
    setLoading(false);
    return res;
  }

  //logout
  async function logout() {
    setLoading(true);
    const res = apiInstance.post("/user/logout");
    setUser(null);
    setLoading(false);
  }

  //update profile
  async function updateProfile(userPersonalDetails) {
    setLoading(true);
    const res = await apiInstance.put("/user/profile", userPersonalDetails);
    setUser(res.data.user);
    setLoading(false);
  }

  //update profile-image
  async function updateProfileImg(formData) {
    const res = await apiInstance.put("/user/profile/profileImg", formData);
    setUser(res.data.user);
  }

  //delete profile-image
  async function deleteProfileImg() {
    const res = await apiInstance.delete("/user/profile/profileImg");
    setUser(res.data.user);
  }

  //updatePassword
  async function updatePassword(password) {
    const res = await apiInstance.put("/user/update-password", { password });
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        updateProfileImg,
        deleteProfileImg,
        updatePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
