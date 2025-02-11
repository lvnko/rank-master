import ParticipationProgressType from './participation-progress';
import SurveyType from './survey';

export default interface UserType {
    _id: string;
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
    participations?: Array<ParticipationProgressType>;
    surveysCreated?: number;
    surveysParticipated?: number;
};

export type AuthorCoverType = Pick<UserType, '_id' | 'firstName' | 'lastName' | 'gender' | 'role'>;