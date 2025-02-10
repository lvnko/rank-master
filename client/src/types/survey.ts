import { AuthorCoverType } from "./user";

export default interface SurveyType {
    id: string;
    title: string;
    body: string;
    author?: AuthorCoverType;
    status: string;
    minPairAppearance: number;
    highestSingleAppearance: number;
    voteCountEachSurvey: number;
    fullfilled: boolean;
    updatedAt: Date;
    createdAt: Date;
}