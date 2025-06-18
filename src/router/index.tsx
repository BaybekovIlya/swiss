import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const AllUsersPage = lazy(() => import("@/pages/AllUsersPage/AllUsersPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AllUsersPage />,
  },
]);
