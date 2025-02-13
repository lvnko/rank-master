import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-9 px-0">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem className="cursor-pointer" checked={theme==='light'} onClick={() => setTheme("light")}>
                Light
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem className="cursor-pointer" checked={theme==='dark'} onClick={() => setTheme("dark")}>
                Dark
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem className="cursor-pointer" checked={theme==='system'} onClick={() => setTheme("system")}>
                System
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
