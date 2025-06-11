import { apiInstance } from "./apis";

// Get max Dob
export const getMaxDob = () => {
    const year = new Date().getFullYear() - 18;
    const month =
        new Date().getMonth() < 9
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth();
    const date =
        new Date().getDate() < 9
            ? "0" + new Date().getDate()
            : new Date().getDate();
    return `${year}-${month}-${date}`;
};


//getMyCourse
export const getMyCourses = async (setMyCourses) => {
    const res = await apiInstance.get("/courses/instructor/my-courses");
    console.log(res);
    setMyCourses(res.data.myCourses);
}

//getCourse
export const getInstructorCourse = async (courseId) => {
    const res = await apiInstance.get(`/courses/instructor/my-courses/${courseId}`);
    return res;
}