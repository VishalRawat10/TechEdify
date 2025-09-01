import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import AdminAppLayout from "../layouts/AdminAppLayout";
import AdminAuthWrapper from "../components/AdminAuthWrapper";
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const AdminMessagesPage = lazy(() =>
  import("../pages/admin/AdminMessagesPage")
);
const AdminAllStudentsPage = lazy(() =>
  import("../pages/admin/AdminAllStudentsPage")
);
const AdminShowStudentPage = lazy(() =>
  import("../pages/admin/AdminShowStudentPage")
);
const AdminAllCourses = lazy(() => import("../pages/admin/AdminAllCourses"));
const AdminAllInstructorsPage = lazy(() =>
  import("../pages/admin/AdminAllInstructorsPage")
);
const CreateInstructor = lazy(() => import("../pages/admin/CreateInstructor"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <>
            <Header />
            <AdminLogin />
            <Footer />
          </>
        }
      />
      <Route
        path=""
        element={
          <AdminAuthWrapper>
            <AdminAppLayout />
          </AdminAuthWrapper>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="courses" element={<AdminAllCourses />} />
        <Route path="students" element={<AdminAllStudentsPage />} />
        <Route path="students/:studentId" element={<AdminShowStudentPage />} />
        <Route path="instructors" element={<AdminAllInstructorsPage />} />
        <Route path="instructors/new" element={<CreateInstructor />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Route>
    </Routes>
  );
}
