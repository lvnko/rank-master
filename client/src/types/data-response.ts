import UserType from "./user";
import SurveyType from "./survey";
import CountryCodeType from "@/types/country-code";
import LanguageType from "./languages";

export interface DataItem {
    user?: UserType;
    users?: Array<UserType> | any;
    survey?: SurveyType;
    surveys?: Array<SurveyType>;
    countryCodes?: Array<CountryCodeType>;
    languages?: Array<LanguageType>;
}

export interface DataResponse {
    status: string;
    message: string;
    code?: string;
    data?: DataItem;
};
  
// // Interface extending the basic data structure
// interface DetailedDataItem extends DataItem {
//     description: string;
// }