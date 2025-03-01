import { UserTranslationType } from "@/types/user"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UserFormDataType } from "@/types/user";
import { DataResponse } from "@/types/data-response";
import CountryCodeType from "@/types/country-code";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractPrimaryNameLang(translations: Map<string, {
  firstName: string,
  lastName: string,
  isPrimary: boolean
}>): string {
  console.log('[1] : extractPrimaryNameLang => translations => ', translations);
  console.log('[2] : extractPrimaryNameLang => Object.keys(translations) => ', Object.keys(translations));
  const translationLangKeys = Object.keys(translations);
  if (translationLangKeys.length === 1) return translationLangKeys[0];
  if (translationLangKeys.length > 1) {
    const primLangs = translationLangKeys.filter((key) => translations.get(key)?.isPrimary === true);
    return primLangs.length > 0 ? primLangs[0] : translationLangKeys[0];
  } 
  return 'en-US';
}

// export function extractSecondaryNameLang(translations: Map<string, {
//   firstName: string,
//   lastName: string,
//   isPrimary: boolean
// }>): string {
//   const translationLangKeys = Object.keys(translations);
// }

interface UserRawType {
  translations: Record<string, { firstName: string; lastName: string, isPrimary: boolean }>;
  gender: string;
  dateOfBirth: Date;
  mobileCountryCode: string;
  mobileNum: string;
  email: string;
}

function convertUserTranslationsObjectToMap (userRaw: UserRawType) {
  return {
    ...userRaw,
    translations: new Map(Object.keys(userRaw.translations).map((key)=>[key, userRaw.translations[key]]))
  }
}

export function extractUserFormData(response: DataResponse): {
  primFirstName: string,
  primLastName: string,
  primNameLang: string,
  secFirstName: string,
  secLastName: string,
  secNameLang: string,
  gender: string,
  dateOfBirth: Date,
  countryCode: string,
  mobileNum: string,
  email: string
} {
  const userDataRaw: UserRawType = response?.data?.user || {
    translations: {
      'en-US': {
        firstName: "",
        lastName: "",
        isPrimary: true,
      }
    },
    gender: "",
    dateOfBirth: new Date(),
    email: "",
    mobileNum: "",
    mobileCountryCode: ""
  };
  const userData: UserFormDataType = convertUserTranslationsObjectToMap(userDataRaw);
  const countryCodes: CountryCodeType[] = response?.data?.countryCodes || [];
  const {
      translations,
      gender,
      dateOfBirth,
      mobileNum = '',
      mobileCountryCode,
      email
  } = userData;
  console.log("extractUserFormData : called => extractPrimaryNameLang ...");
  const primNameLang = extractPrimaryNameLang(translations);
  const {
      firstName: primFirstName,
      lastName: primLastName,
  } = translations.get(primNameLang) || {
      firstName: "",
      lastName: "",
  };
  return {
    primFirstName,
    primLastName,
    primNameLang,
    secFirstName: '',
    secLastName: '',
    secNameLang: '',
    gender,
    dateOfBirth: new Date(dateOfBirth),
    mobileNum,
    countryCode: countryCodes.filter(({ code }) => code === mobileCountryCode)[0].name || "",
    email
  };

}

