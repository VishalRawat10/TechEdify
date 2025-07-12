import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

const PageNotFound = lazy(() => import("./pages/PageNotFound"));
import Loader from "./components/Loader";

import AllContextProvider from "./context/AllContextProvider";
import { AdminProvider } from "./context/AdminContext";
import UserRoutes from "./routes/UserRoutes";
import InstructorRoutes from "./routes/InstructorRoutes";
import AdminRoutes from "./routes/AdminRoutes";

export default function App() {
  return (
    <AllContextProvider>
      <Suspense fallback={<Loader />}>
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
          <Route path={"/instructor/*"} element={<InstructorRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </AllContextProvider>
  );
}
