import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../components/pages/Dashboard";
import Workshop from "../components/pages/Workshop";
import LearnHub from "../components/pages/LearnHub";
import TutorialDetail from "../components/pages/TutorialDetail";
import Account from "../components/pages/Account";
import AdminPanel from "../components/pages/AdminPanel";
import Login from "../components/pages/Login";
import Leaderboard from "../components/pages/Leaderboard";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import AdminRoute from "../components/ui/AdminRoute";
import AuthCallback from "../components/pages/AuthCallback";

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
                path: "/workshop",
                element: <Workshop />,
            },
            {
                path: "/learn",
                element: <LearnHub />,
            },
            {
                path: "/tutorials/:id",
                element: <TutorialDetail />,
            },
            {
                path: "/account",
                element: (
                    <ProtectedRoute>
                        <Account />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin",
                element: (
                    <AdminRoute>
                        <AdminPanel />
                    </AdminRoute>
                ),
            },
            {
                path: "/leaderboard",
                element: <Leaderboard />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                // OAuth PKCE callback — exchanges ?code= for a session
                path: "/auth/callback",
                element: <AuthCallback />,
            },
            {
                // Legacy/AI-generated path — redirect to home
                path: "/dashboard",
                element: <Navigate to="/" replace />,
            },
            {
                path: "*",
                element: <Navigate to="/" replace />,
            },
        ],
    },
];

const router = createBrowserRouter(routes);
export default router;
