import { UserTranslationType, UserRawType } from "@/types/user"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UserFormDataType } from "@/types/user";
import { DataResponse } from "@/types/data-response";
import CountryCodeType from "@/types/country-code";
import { UserTableRow } from "@/pages/Users/columns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractPrimaryNameLang(translations: Map<string, {
  firstName: string,
  lastName: string,
  isPrimary: boolean
}>): string {
  // console.log('[1] : extractPrimaryNameLang => translations => ', translations);
  // console.log('[2] : extractPrimaryNameLang => Object.keys(translations) => ', Object.keys(translations));
  // console.log('[3] : extractPrimaryNameLang => Array.from(translations.keys()) => ', Array.from(translations.keys()));
  const translationLangKeys = Array.from(translations.keys()) || [];
  if (translationLangKeys.length === 1) return translationLangKeys[0];
  if (translationLangKeys.length > 1) {
    const primLangs = translationLangKeys.filter((key) => translations.get(key)?.isPrimary === true);
    return primLangs.length > 0 ? primLangs[0] : translationLangKeys[0];
  } 
  return 'en-US';
}

function extractSecondaryNameLang(translations: Map<string, {
  firstName: string,
  lastName: string,
  isPrimary: boolean
}>): string {
  // console.log('[1] : extractPrimaryNameLang => translations => ', translations);
  // console.log('[2] : extractPrimaryNameLang => Object.keys(translations) => ', Object.keys(translations));
  // console.log('[3] : extractPrimaryNameLang => Array.from(translations.keys()) => ', Array.from(translations.keys()));
  const translationLangKeys = Array.from(translations.keys()) || [];
  if ( translationLangKeys.length < 2 ) return '';
  if (translationLangKeys.length >= 2) {
    const [secLang] = translationLangKeys.filter((key) => translations.get(key)?.isPrimary === false);
    return secLang ? secLang : '';
  } 
  return '';
}

// export function extractSecondaryNameLang(translations: Map<string, {
//   firstName: string,
//   lastName: string,
//   isPrimary: boolean
// }>): string {
//   const translationLangKeys = Object.keys(translations);
// }

export function covertObjectOfRecordsToMap<T extends any>(records: Record<string, T>): Map<string, T> {
  return new Map(Object.keys(records).map((key)=>[key, records[key]]));
}

function convertUserTranslationsObjectToMap ({ mobileNum, mobileCountryCode, ...userRaw }: UserRawType) {
  return {
    ...userRaw,
    ...(mobileNum ? { mobileNum } : {mobileNum:''}),
    ...(mobileCountryCode ? { mobileCountryCode } : {mobileCountryCode:''}),
    translations: covertObjectOfRecordsToMap(userRaw.translations)
    // translations: new Map(Object.keys(userRaw.translations).map((key)=>[key, userRaw.translations[key]]))
    // covertObjectOfRecordsToMap(userRaw.translations)
  }
}

export function composeFullName(args: {
  firstName: string, lastName: string, language: string
}): string {
  const { firstName, lastName, language } = args;
  const nameArr = [firstName, lastName];
  const familyNameFirst = ['zh-Hans', 'zh-TW', 'zh'].indexOf(language) > -1;

  return (familyNameFirst ? nameArr.reverse() : nameArr).join(" ");
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
    mobileCountryCode: "",
    status: "pending"
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
  const primNameLang = extractPrimaryNameLang(translations);
  const {
    firstName: primFirstName,
    lastName: primLastName,
  } = translations.get(primNameLang) || {
    firstName: "",
    lastName: "",
  };
  const secNameLang = extractSecondaryNameLang(translations);
  const {
    firstName: secFirstName,
    lastName: secLastName,
  } = translations.get(secNameLang) || {
    firstName: "",
    lastName: "",
  };
  return {
    primFirstName,
    primLastName,
    primNameLang,
    secFirstName,
    secLastName,
    secNameLang,
    gender,
    dateOfBirth: new Date(dateOfBirth),
    mobileNum,
    countryCode: countryCodes.filter(({ code }) => code === mobileCountryCode)[0].name || "",
    email
  };

}

export function covertRawUsersToTableData (usersRaw: UserRawType[]): UserTableRow[] {

  return usersRaw.map(({
    _id: recordId = '',
    translations,
    mobileNum = '',
    mobileCountryCode = '',
    subscription = '',
    ...props
  }: UserRawType) => {

    const composeNameSet = (nameSet: { firstName: string; lastName: string, isPrimary: boolean }, lang: string) => {
        return {
            name: composeFullName({
                firstName: nameSet.firstName,
                lastName: nameSet.lastName,
                language: lang
            }),
            lang: lang
        };
    }

    const {
        prim: {
            name: primName,
            lang: primNameLang
        },
        sec: {
            name: secName,
            lang: secNameLang
        }
    } = Object.keys(translations).reduce((accm, key)=>{

        if (translations[key].isPrimary) {
            return {
                ...accm,
                prim: composeNameSet(translations[key], key)
            };
        } else {
            return {
                ...accm,
                sec: composeNameSet(translations[key], key)
            };
        }

    }, {
        prim: {
            name: "", lang: ""
        },
        sec: {
            name: "", lang: ""
        }
    });
    return {
        recordId,
        primName,
        primNameLang,
        secName,
        secNameLang,
        mobileNum,
        mobileCountryCode,
        subscription,
        ...props
    };
  });
}

export function extractFullNameFromRawTranslations<T extends any>(
  translations: Record<string, T>,
  {
    toGetPrimary = true
  } : {
    toGetPrimary: boolean
  }
): string {
  const namesMap = covertObjectOfRecordsToMap(translations) as Map<string, { firstName: string; lastName: string; isPrimary: boolean }> || new Map([['en-US', {firstName: '', lastName: '', isPrimary: true}]]);
  const nameLang = toGetPrimary ? extractPrimaryNameLang(namesMap) || 'en-US' : extractSecondaryNameLang(namesMap) || '';
  if (nameLang === '') return '';
  const { firstName, lastName } = namesMap.get(nameLang) || {firstName: '', lastName: ''};
  const fullName = composeFullName({ firstName, lastName, language: nameLang });
  return fullName;
}

