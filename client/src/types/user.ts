import ParticipationProgressType from './participation-progress';
import SurveyType from './survey';

export interface UserTranslationType {
    _id: string;
    firstName: string;
    lastName: string;
    isPrimary: boolean;
}

export default interface UserType {
    _id: string;
    translations: Record<string, UserTranslationType>
    gender: string;
    dateOfBirth: Date;
    email: string;
    mobileNum: string;
    mobileCountryCode: string;
    role: string;
    status: "active" | "inactive" | "pending" | "suspended" | "deleted";
    subscription: string;
    updatedAt: Date;
    createdAt: Date;
    surveys?: Array<SurveyType>;
    participations?: Array<ParticipationProgressType>;
    surveysCreated?: number;
    surveysParticipated?: number;
};

export interface UserRawType {
    _id?: string;
    translations: Record<string, { firstName: string; lastName: string, isPrimary: boolean }>;
    gender: string;
    dateOfBirth: Date;
    email: string;
    role?: string;
    status: "active" | "inactive" | "pending" | "suspended" | "deleted";
    mobileCountryCode?: string;
    mobileNum?: string;
    subscription?: string;
    surveysCreated?: number;
    surveysParticipated?: number;
    updatedAt?: Date;
    createdAt?: Date;
}

export type UserPayloadType = {
    translations?: Record<string, Pick<UserTranslationType, 'firstName' | 'lastName' | 'isPrimary'>>
    gender?: string;
    dateOfBirth?: Date;
    mobileNum?: string;
    mobileCountryCode?: string;
    email?: string;
};

export type AuthorCoverType = Pick<UserType, '_id' | 'translations' | 'gender' | 'role'>;

export type UserFormDataType = Pick<UserType, 'gender' | 'dateOfBirth' | 'email' | 'mobileNum' | 'mobileCountryCode'> & {
    translations: Map<string, Pick<UserTranslationType, 'firstName' | 'lastName' | 'isPrimary'>>
};

export type UserPageDataType = Omit<UserType, 'translations'> & {
    translations: Map<string, Pick<UserTranslationType, 'firstName' | 'lastName' | 'isPrimary'>>
};
