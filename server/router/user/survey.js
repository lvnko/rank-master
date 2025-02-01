const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const User = require(path.join(__dirname, '../../models/User'));
const router = express.Router();
const { standardErrorHandler, customErrorHandler, getFullReqUrl, getReqBodyDataAsModelSchema, validateObjectId } = require(path.join(__dirname, '../utilities'));

module.exports = router;