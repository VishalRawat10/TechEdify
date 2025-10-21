import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import TutorAuthWrapper from "../components/TutorAuthWrapper";
import UserAppLayout from "../layouts/UserAppLayout";
import { UserProvider } from "../context/UserContext";
import DiscussionsPage from "../pages/tutor/DiscussionsPage";
import TutorProfile from "../pages/tutor/TutorProfile";

const NotFoundPage = lazy(() => import("../pages/user/NotFoundPage"));
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
      {/* Tutor Login Route  */}
      <Route
        path=""
        element={
          <UserProvider>
            <UserAppLayout />
          </UserProvider>
        }
      >
        <Route path="login" element={<TutorLoginPage />} />
      </Route>

      {/* Tutor App Routes  */}
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
        <Route path="courses/:courseId/lectures" element={<EditLecture />} />
        <Route path="discussions" element={<DiscussionsPage />} />
        <Route path="profile" element={<TutorProfile />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
