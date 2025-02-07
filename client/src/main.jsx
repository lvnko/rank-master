import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { usersLoader } from './loaders';
import './index.css'
import Home from './pages/Home.jsx'
import Users from './pages/Users.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ErrorFallback from './components/common/ErrorFallBack.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "/", index: true, element: <Home /> },
      { path: "/users", element: <Users />, loader: usersLoader, errorElement: <ErrorFallback /> }, 
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
