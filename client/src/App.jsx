import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

const NotFoundPage = lazy(() => import("./pages/user/NotFoundPage"));

import AllContextProvider from "./context/AllContextProvider";
import UserRoutes from "./routes/UserRoutes";
import TutorRoutes from "./routes/TutorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { UserProvider } from "./context/UserContext";
import { TutorProvider } from "./context/TutorContext";
import { AdminProvider } from "./context/AdminContext";

export default function App() {
  return (
    <AllContextProvider>
      <Routes>
        <Route
          path={"/*"}
          element={
            <UserProvider>
              <UserRoutes />
            </UserProvider>
          }
        />
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
