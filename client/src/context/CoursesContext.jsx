import { createContext, useEffect, useReducer, useState } from "react";
import { apiInstance } from "../../services/apis.js";
export const CoursesContext = createContext();

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState();
  async function getCourses() {
    try {
      const res = await apiInstance.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <CoursesContext.Provider value={{ courses }}>
      {children}
    </CoursesContext.Provider>
  );
};
