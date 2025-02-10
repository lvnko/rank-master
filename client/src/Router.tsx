import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layouts/AppLayout";
import { usersLoader } from "@/loaders";

import ErrorFallback from "@/components/error-fallback";
import NoMatch from "./pages/NoMatch";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "",
                element: <Dashboard />,
            },
            {
                path: "users",
                element: <Users />,
                loader: usersLoader,
                errorElement: <ErrorFallback />,
                
            },
            {
                path: "surveys",
                element: <Users />,
            },
        ],
    },
    {
        path: "*",
        element: <NoMatch />,
    },
], {
    basename: global.basename
});