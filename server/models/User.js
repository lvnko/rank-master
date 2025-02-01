const mongoose = require('mongoose');
const path = require('path');
const { COUNTRIES_OR_REGIONS, ROLE_TYPES, SUBSCRIPTION_TYPES, GENDER_TYPES } = require(path.join(__dirname, '../constants'));
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    firstName: {
        type: Schema.Types.String,
        required: true
    },
    lastName: {
        type: Schema.Types.String,
        required: true
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

userSchema.pre('save', function (next) {
    if (this.isModified()) {
      this.updatedAt = Date.now();
    }
    next();
});

userSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model('User', userSchema);