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

  const findCourseById = (id) => {
    const course = courses?.find((course) => course._id === id);
    if (!course) {
      return null;
    }
    return course;
  };

  return (
    <CoursesContext.Provider value={{ courses, findCourseById }}>
      {children}
    </CoursesContext.Provider>
  );
};
