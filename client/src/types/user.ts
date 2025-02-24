import ParticipationProgressType from './participation-progress';
import SurveyType from './survey';

interface UserTranslationType {
    _id: string;
    firstName: string;
    lastName: string;
}

export default interface UserType {
    _id: string;
    translations: { [key: string]: UserTranslationType }
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

export type UserNewDataType = Pick<UserType, 'gender' | 'dateOfBirth' | 'email' | 'mobileNum' | 'mobileCountryCode'> & {
    translations: { [key: string]: Pick<UserTranslationType, 'firstName' | 'lastName'> }
};