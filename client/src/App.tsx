import { Suspense } from 'react';
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { router } from "./Router";

export default function App() {

    const Loader = () => (
        <div className="flex justify-center items-center flex-grow">
          <p>loading...</p>
        </div>
    );

    return (
        <ThemeProvider>
            <Suspense fallback={<Loader />}>
                <RouterProvider router={router} />
            </Suspense>
        </ThemeProvider>
    )
}
