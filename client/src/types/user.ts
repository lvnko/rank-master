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
    subscription: string;
    updatedAt: Date;
    createdAt: Date;
    surveys?: Array<SurveyType>;
    participations?: Array<ParticipationProgressType>;
    surveysCreated?: number;
    surveysParticipated?: number;
};

export type AuthorCoverType = Pick<UserType, '_id' | 'translations' | 'gender' | 'role'>;

export type UserFormDataType = Pick<UserType, 'gender' | 'dateOfBirth' | 'email' | 'mobileNum' | 'mobileCountryCode'> & {
    translations: Map<string, Pick<UserTranslationType, 'firstName' | 'lastName' | 'isPrimary'>>
};

export type UserPageDataType = Omit<UserType, 'translations'> & {
    translations: Map<string, Pick<UserTranslationType, 'firstName' | 'lastName' | 'isPrimary'>>
};
