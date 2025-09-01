import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import TutorAuthWrapper from "../components/TutorAuthWrapper";
import UserAppLayout from "../layouts/UserAppLayout";

const TutorLoginPage = lazy(() => import("../pages/tutor/TutorLoginPage"));
const TutorDashboard = lazy(() => import("../pages/tutor/TutorDashboard"));
const EditCourse = lazy(() => import("../pages/tutor/EditCourse"));
const TutorAppLayout = lazy(() => import("../layouts/TutorAppLayout"));
const MyCourses = lazy(() => import("../pages/tutor/MyCourses"));
const CreateCourse = lazy(() => import("../pages/tutor/CreateCourse"));
const AddLecture = lazy(() => import("../pages/tutor/AddLecture"));
const EditLecture = lazy(() => import("../pages/tutor/EditLecture"));

export default function TutorRoutes() {
  return (
    <Routes>
      <Route path="" element={<UserAppLayout />}>
        <Route path="login" element={<TutorLoginPage />} />
      </Route>
      <Route
        path="/*"
        element={
          <TutorAuthWrapper>
            <TutorAppLayout />
          </TutorAuthWrapper>
        }
      >
        <Route path="dashboard" element={<TutorDashboard />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="courses/create-course" element={<CreateCourse />} />
        <Route path="courses/:courseId/edit" element={<EditCourse />} />
        <Route
          path="courses/:courseId/lectures/add-lecture"
          element={<AddLecture />}
        />
        <Route
          path="courses/:courseId/lectures/:lectureId/edit"
          element={<EditLecture />}
        />
      </Route>
    </Routes>
  );
}
