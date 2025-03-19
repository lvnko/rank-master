import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useTranslation } from "react-i18next";

export function AppLayout() {
    const { i18n: { language } } = useTranslation();
    return (
        <>
            <Header />
            <div className="flex-grow flex flex-col">
                <div className="container mx-auto px-4 md:px-8 flex-grow flex flex-col">
                    <Outlet context={{language}} />
                </div>
            </div>
            <div className="px-4 md:px-8">
                <Footer />
            </div>
            <Toaster />
        </>
    )
}