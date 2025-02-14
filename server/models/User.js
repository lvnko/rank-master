const mongoose = require('mongoose');
const path = require('path');
const { COUNTRIES_OR_REGIONS, ROLE_TYPES, SUBSCRIPTION_TYPES, GENDER_TYPES, USER_STATUS_TYPES } = require(path.join(__dirname, '../constants'));
const { logUpdateDateTime, logSaveDateTime } = require(path.join(__dirname, '../middlewares'));
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    translations: {
        type: Schema.Types.Map,
        of: new mongoose.Schema({
            firstName: {
                type: Schema.Types.String,
                required: true
            },
            lastName: {
                type: Schema.Types.String,
                required: true
            },
        })
    },
    gender: {
        type: Schema.Types.String,
        enum: GENDER_TYPES,
        required: true
    },
    dateOfBirth: {
        type: Schema.Types.Date,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    mobileNum: {
        type: Schema.Types.String,
        required: true
    },
    mobileCountryCode: {
        type: Schema.Types.String,
        enum: COUNTRIES_OR_REGIONS.map(e=>e.name),
        required: true
    },
    role: {
        type: Schema.Types.String,
        enum: ROLE_TYPES,
        default: 'fair'
    },
    subscription: {
        type: Schema.Types.String,
        enum: SUBSCRIPTION_TYPES,
        default: 'fair'
    },
    status: {
        type: Schema.Types.String,
        enum: USER_STATUS_TYPES,
        default: 'pending'
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

userSchema.pre('save', logSaveDateTime);

userSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], logUpdateDateTime);

module.exports = mongoose.model('User', userSchema);