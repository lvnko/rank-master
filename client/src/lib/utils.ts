import { UserTranslationType } from "@/types/user"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractPrimaryNameLang(translations: { [key: string]: UserTranslationType }): string {
  const translationLangKeys = Object.keys(translations);
  if (translationLangKeys.length === 1) return translationLangKeys[0];
  if (translationLangKeys.length > 1) {
    const primLangs = translationLangKeys.filter((key) => (translations as Record<string, UserTranslationType>)[key].isPrimary === true);
    return primLangs.length > 0 ? primLangs[0] : translationLangKeys[0];
  } 
  return 'en-US';
}