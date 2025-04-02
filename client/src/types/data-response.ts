import UserType from "./user";
import SurveyType, { SurveyRawType } from "./survey";
import CountryCodeType from "@/types/country-code";
import LanguageType from "./languages";

export interface DataItem {
    user?: UserType;
    users?: Array<UserType> | any;
    survey?: SurveyRawType;
    surveys?: Array<SurveyRawType>;
    countryCodes?: Array<CountryCodeType>;
    languages?: Array<LanguageType>;
    operationResult?: OperaionResult;
}

export interface OperaionResult {
    acknowledged?: boolean;
    deletedCount?: number;
    matchedCount?: number;
    modifiedCount?: number;
    upsertedId?: string;
    upsertedCount?: number;
}

export interface DataResponse {
    statusText: string;
    message: string | string[];
    code?: string;
    data?: DataItem;
};

export interface ApiFetchPromiseMessage {
    title: string,
    description: string
};
  
// // Interface extending the basic data structure
// interface DetailedDataItem extends DataItem {
//     description: string;
// }