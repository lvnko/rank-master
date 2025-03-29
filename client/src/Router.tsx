import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layouts/AppLayout";
import { usersLoader, userLoader, countryCodesLoader, userFormLoader, SurveysLoader, SupportedLanguagesLoader } from "@/loaders";

import ErrorFallback from "@/components/error-fallback";
import NoMatch from "./pages/NoMatch";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users/index";
import Surveys from "./pages/Surveys/index";
import User from "./pages/User/index";
import UserNewForm from "./pages/User/UserNewForm";
import UserEditForm from "./pages/User/UserEditForm";
import SurveyNewForm from "./pages/Survey/SurveyNewForm";


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
                loader: SurveysLoader,
                errorElement: <ErrorFallback />,
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
            },
            {
                path: "survey",
                children: [
                    {
                        path: "add",
                        element: <SurveyNewForm />,
                        loader: SupportedLanguagesLoader,
                        errorElement: <ErrorFallback />
                    }
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