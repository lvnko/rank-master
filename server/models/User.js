const mongoose = require('mongoose');
const path = require('path');
const { COUNTRIES_OR_REGIONS, ROLE_TYPES, SUBSCRIPTION_TYPES } = require(path.join(__dirname, '../constants'));
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    firstName: Schema.Types.String,
    lastName: Schema.Types.String,
    email: Schema.Types.String,
    mobileNum: Schema.Types.Number,
    mobileCountryCode: {
        type: Schema.Types.String,
        enum: COUNTRIES_OR_REGIONS.map(e=>e.name)
    },
    role: {
        type: Schema.Types.String,
        enum: ROLE_TYPES
    },
    subscription: {
        type: Schema.Types.String,
        enum: SUBSCRIPTION_TYPES
    },
    updatedAt: {
        type: Schema.Types.Date
    },
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);