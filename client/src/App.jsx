import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

const NotFoundPage = lazy(() => import("./pages/user/NotFoundPage"));

import AllContextProvider from "./context/AllContextProvider";
import { AdminProvider } from "./context/AdminContext";
import UserRoutes from "./routes/UserRoutes";
import TutorRoutes from "./routes/TutorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { TutorProvider } from "./context/TutorContext";

export default function App() {
  return (
    <AllContextProvider>
      <Routes>
        <Route path={"/*"} element={<UserRoutes />} />
        <Route
          path={"/admin/*"}
          element={
            <AdminProvider>
              <AdminRoutes />
            </AdminProvider>
          }
        />
        <Route
          path={"/tutor/*"}
          element={
            <TutorProvider>
              <TutorRoutes />
            </TutorProvider>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AllContextProvider>
  );
}
