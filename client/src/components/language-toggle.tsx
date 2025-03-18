import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { fetchLanguages } from "@/loaders";
import { Icons } from "./icons";

interface LanguageType {
    name: string;
    label: string;
    variations: String[];
}

export function LanguageToggle() {
    
    const { t, i18n } = useTranslation();
    const { changeLanguage, language } = i18n;

    const [languages, setLanguages] = useState<LanguageType[]>([]);

    const [currentLanguage, setCurrentLanguage] = useState(language);

    useEffect(()=>{
        console.log(`Current Language has changed to : ${currentLanguage}`);
        changeLanguage(currentLanguage, (err, t) => {
            if (err) return console.error('something went wrong loading', err);
            // t('key'); // -> same as i18next.t
        });
    },[currentLanguage]);
    
    useEffect(()=>{
        // console.log('LanguageToggle => i18n =>', i18n);
        // console.log('LanguageToggle => language =>', language);
        fetchLanguages().then((res)=>{
            if (res.statusText && res.statusText === "success") {
                console.log('LanguageToggle => languagesLib =>', res.data);
                return res.data.languages;
            }
            throw new Error('Something went wrong');
        })
        .then((languages) => {
            // Do something with the response
            console.log('LanguageToggle => languages => ',languages);
            setLanguages(languages);
        })
        .catch((error) => {
            console.log('LanguageToggle => ERROR');
            console.error(error);
        });;
    },[]);

    return (
        <div>
            {languages && languages.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <Icons.multilingual className="!h-[1.6rem] !w-[1.6rem]" />
                            {languages.filter(({name})=>name===currentLanguage)[0]?.label || 'Languages'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>{t('languages', { ns: 'common' })}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={currentLanguage} onValueChange={setCurrentLanguage}>
                            {languages.map(({name, label})=>(
                                <DropdownMenuRadioItem key={`radio-${name}`} value={name}>{label}</DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );

}