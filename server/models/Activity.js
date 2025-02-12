const mongoose = require('mongoose');
const path = require('path');
const { ACTIVITY_TYPES, ACTION_TYPES } = require(path.join(__dirname, '../constants'));
const { Schema } = mongoose;

const activitySchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    affected: {
        type: Schema.Types.String,
        enum: ACTIVITY_TYPES,
        required: true
    },
    action: {
        type: Schema.Types.String,
        enum: ACTION_TYPES,
        required: true
    },
    affectedId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now,
        immutable: true
    }
});

module.exports = mongoose.model('Activity', activitySchema);