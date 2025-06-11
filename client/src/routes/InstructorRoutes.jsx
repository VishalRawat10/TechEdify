import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import AuthWrapper from "../components/AuthWrapper";

const InstructorDashboard = lazy(() =>
  import("../pages/instructor/InstructorDashboard")
);
const EditCourse = lazy(() => import("../pages/instructor/EditCourse"));
const InstructorAppLayout = lazy(() =>
  import("../layouts/InstructorAppLayout")
);
const MyCourses = lazy(() => import("../pages/instructor/MyCourses"));
const CreateCourse = lazy(() => import("../pages/instructor/CreateCourse"));
const AddLecture = lazy(() => import("../pages/instructor/AddLecture"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));

export default function InstructorRoutes() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <AuthWrapper>
            <InstructorAppLayout />
          </AuthWrapper>
        }
      >
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="my-courses/new" element={<CreateCourse />} />
        <Route path="my-courses/:courseId/edit" element={<EditCourse />} />
        <Route
          path="my-courses/:courseId/add-lecture"
          element={<AddLecture />}
        />

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
