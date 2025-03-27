import { AuthorCoverType } from "./user";

export interface SurveyTranslationType {
    _id: string;
    title: string;
    body: string;
}

export interface SurveyRawType {
    _id: string;
    translations: Record<string, SurveyTranslationType>;
    authorId: string;
    author?: AuthorCoverType;
    status: "draft" | "inactive" | "active" | "suspended";
    minPairAppearance: number;
    highestSingleAppearance: number;
    voteCountEachSurvey: number;
    fullfilled: boolean;
    updatedAt: Date;
    createdAt: Date;
}

export type SurveyPayloadType = {
    translations?: Record<string, Omit<SurveyTranslationType, '_id'>>;
    authorId?: string;
    status?: "draft" | "inactive" | "active" | "suspended";
    minPairAppearance?: number;
    voteCountEachSurvey?: number;
}

type SurveyType = Omit<SurveyRawType, '_id' | 'translations' | 'authorId'> & {
    id: string;
    translations: Map<string, SurveyTranslationType>;
    // author?: AuthorCoverType;
};

export default SurveyType;