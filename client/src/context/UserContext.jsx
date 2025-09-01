import { createContext, useEffect, useState } from "react";

import { apiInstance } from "../services/axios.config";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  //Authentication
  async function checkAuth() {
    try {
      const res = await apiInstance.get("/users/profile");
      setLoading(false);
      setUser(res.data.user);
      setIsLoggedIn(true);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  //signup
  async function signup(userDetails) {
    const res = await apiInstance.post("/users/signup", userDetails);
    setUser(res.data.user);
    setIsLoggedIn(true);
  }

  //login
  async function login(userCredentials) {
    const res = await apiInstance.post("/users/login", userCredentials);
    setUser(res.data.user);
    setIsLoggedIn(true);
    return res;
  }

  //logout
  async function logout() {
    const res = await apiInstance.post("/users/logout");
    setUser(null);
    setIsLoggedIn(false);
  }

  //update profile
  async function updateProfile(userDetails) {
    const res = await apiInstance.put("/users/profile", userDetails);
    setUser(res.data.user);
    return res;
  }

  //update profile-image
  async function updateProfileImage(formData) {
    const res = await apiInstance.put("/users/profile/profile-image", formData);
    setUser(res.data.user);
    return res;
  }

  //delete profile-image
  async function deleteProfileImage() {
    const res = await apiInstance.delete("/users/profile/profile-image");
    setUser(res.data.user);
    return res;
  }

  //updatePassword
  async function updatePassword({ currentPassword, newPassword }) {
    const res = await apiInstance.put("/users/update-password", {
      currentPassword,
      newPassword,
    });
    return res;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signup,
        login,
        logout,
        updateProfile,
        updateProfileImage,
        deleteProfileImage,
        updatePassword,
        isLoggedIn,
        checkAuth,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
