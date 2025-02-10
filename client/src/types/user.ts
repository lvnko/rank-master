import SurveyType from './survey';

export default interface UserType {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBrith: Date;
    email: string;
    mobileNum: string;
    mobileCountryCode: string;
    role: string;
    subscription: string;
    updatedAt: Date;
    createdAt: Date;
    surveys?: Array<SurveyType>;
};

export type AuthorCoverType = Pick<UserType, 'id' | 'firstName' | 'lastName' | 'gender' | 'role'>;