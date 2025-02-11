export default interface ParticipationProgressType {
    _id: string;
    userId: string;
    surveyId: string;
    progress: number;
    complete: boolean;
    updatedAt: Date;
    createdAt: Date;
}