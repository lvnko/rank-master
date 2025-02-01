const mongoose = require('mongoose');
const { type } = require('os');
const ObjectId = mongoose.Schema.Types.ObjectId;
const path = require('path');
const { SURVEY_STATUS } = require(path.join(__dirname, '../constants'));
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
    highestAppearance: {
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

surveySchema.pre('save', function (next) {
    if (this.isModified()) {
      this.updatedAt = Date.now();
    }
    next();
});

surveySchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Survey', surveySchema);