import { appConfig } from "@/config/app";
// import { Icons } from "./icons";

export function Logo() {
    return (
        <>
            {/* <Icons.logo className="h-6 w-6" /> */}
            <div className="w-8 h-8 m-0 relative">
                <img src="/logo-light.svg" width="100%" height="100%" className="scale-100 dark:scale-0 absolute" />
                <img src="/logo-dark.svg" width="100%" height="100%" className="scale-0 dark:scale-100 absolute" />
            </div>
            <span className="font-bold">{appConfig.name}</span>
        </>
    )
}