const mongoose = require('mongoose');
const path = require('path');
const { SURVEY_STATUS } = require(path.join(__dirname, '../constants'));
const { logUpdateDateTime, logSaveDateTime } = require(path.join(__dirname, '../middlewares'));
const { Schema } = mongoose;

const surveySchema = new mongoose.Schema({
    title: {
        type: Schema.Types.String,
        required: true
    },
    body: {
        type: Schema.Types.String
    },
    authorId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: Schema.Types.String,
        enum: SURVEY_STATUS,
        required: true,
        default: 'draft'
    },
    minPairAppearance: {
        type: Schema.Types.Number,
        required: true,
        default: 3,
        min: 1,
    },
    highestSingleAppearance: {
        type: Schema.Types.Number,
        default: 0,
    },
    voteCountEachSurvey: {
        type: Schema.Types.Number,
        default: 0,
    },
    fullfilled: {
        type: Schema.Types.Boolean,
        default: false
    },
    updatedAt: {
        type: Schema.Types.Date,
        default: Date.now
    },
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now,
        immutable: true
    }
});

surveySchema.pre('save', logSaveDateTime);

surveySchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], logUpdateDateTime);

module.exports = mongoose.model('Survey', surveySchema);