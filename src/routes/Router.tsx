import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../components/pages/Dashboard";
import Project from "../components/pages/Project";
import Analytics from "../components/pages/Analytics";
import Learning from "../components/pages/Learning";
import Inventory from "../components/pages/Inventory";
import Journal from "../components/pages/Journal";
import Account from "../components/pages/Account";

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
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/learning",
        element: <Learning />,
      },
      {
        path: "/inventory",
        element: <Inventory />,
      },
      {
        path: "/journal",
        element: <Journal />,
      },
      {
        path: "/account",
        element: <Account />,
      },
    ],
  },
];

// Then, we create a router instance from our routes.
const router = createBrowserRouter(routes);
export default router;
