import UserType from "./user";
import SurveyType from "./survey";

export type DataItem = {
    user?: UserType;
    users?: Array<UserType>;
    survey?: SurveyType;
    surveys?: Array<SurveyType>;
}

export interface DataResponse {
    status: string;
    message: string;
    code?: string;
};
  
// // Interface extending the basic data structure
// interface DetailedDataItem extends DataItem {
//     description: string;
// }