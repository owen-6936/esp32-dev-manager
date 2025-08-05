import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../components/pages/Dashboard";
import Project from "../components/pages/Project";

// We can define our routes as an array of objects.
export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/project",
        element: <Project />,
      },
    ],
  },
];

// Then, we create a router instance from our routes.
const router = createBrowserRouter(routes);
export default router;
