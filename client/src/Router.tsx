import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layouts/AppLayout";
import { usersLoader, userLoader, countryCodesLoader, userFormLoader } from "@/loaders";

import ErrorFallback from "@/components/error-fallback";
import NoMatch from "./pages/NoMatch";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Surveys from "./pages/Surveys";
import User from "./pages/User";
import UserForm from "./pages/UserNewForm";


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
                element: <Surveys />,
            },
            {
                path: "user",
                children: [
                    {
                        path: "add",
                        element: <UserForm />,
                        loader: countryCodesLoader,
                        errorElement: <ErrorFallback />
                    },
                    {
                        path: "edit/:id",
                        element: <UserForm />,
                        loader: userFormLoader,
                        errorElement: <ErrorFallback />
                    },
                    {
                        path: ":id",
                        element: <User />,
                        loader: userLoader,
                        errorElement: <ErrorFallback />
                    },
                ]
            }
        ],
    },
    {
        path: "*",
        element: <NoMatch />,
    },
], {
    basename: global.basename
});