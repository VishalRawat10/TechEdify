import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

import AdminAuthWrapper from "../components/AdminAuthWrapper";
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const NotFoundPage = lazy(() => import("../pages/user/NotFoundPage"));

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <>
            <AdminLogin />
          </>
        }
      />

      <Route
        path="dashboard"
        element={
          <AdminAuthWrapper>
            <AdminDashboard />
          </AdminAuthWrapper>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
