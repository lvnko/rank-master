const express = require("express");
const path = require('path');
const he = require('he');
const router = express.Router();
const userRouter = require('./user');
const { commonNonActiveEndpointReply } = require(path.join(__dirname, '../utilities'));

router.use('/user', userRouter);

router.post('/', async (req, res) => {
    return await commonNonActiveEndpointReply(req, res);
});

router.get('/', async (req, res) => {
    return await commonNonActiveEndpointReply(req, res);
});

router.put('/', async (req, res) => {
    return await commonNonActiveEndpointReply(req, res);
});

router.delete('/', async (req, res) => {
    return await commonNonActiveEndpointReply(req, res);
});

module.exports = router;