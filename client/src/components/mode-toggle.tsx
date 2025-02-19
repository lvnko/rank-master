import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
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

    const { t } = useTranslation();
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-9 px-0">
                    <SunIcon className="!h-[1.2rem] !w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute !h-[1.2rem] !w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">{t('theme.toggle', {ns: 'common'})}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem className="cursor-pointer" checked={theme==='light'} onClick={() => setTheme("light")}>
                    {t('theme.light', {ns: 'common'})}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem className="cursor-pointer" checked={theme==='dark'} onClick={() => setTheme("dark")}>
                    {t('theme.dark', {ns: 'common'})}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem className="cursor-pointer" checked={theme==='system'} onClick={() => setTheme("system")}>
                    {t('theme.system', {ns: 'common'})}
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
