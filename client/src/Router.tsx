import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layouts/AppLayout";
import { usersLoader, userLoader, countryCodesLoader, userFormLoader } from "@/loaders";

import ErrorFallback from "@/components/error-fallback";
import NoMatch from "./pages/NoMatch";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users/index";
import Surveys from "./pages/Surveys";
import User from "./pages/User";
import UserNewForm from "./pages/UserNewForm";
import UserEditForm from "./pages/UserEditForm";


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
                        element: <UserNewForm />,
                        loader: countryCodesLoader,
                        errorElement: <ErrorFallback />
                    },
                    {
                        path: "edit/:id",
                        element: <UserEditForm />,
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