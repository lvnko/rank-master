const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const Survey = require(path.join(__dirname, '../../models/Survey'));
const router = express.Router();
const { standardErrorHandler, customErrorHandler, getFullReqUrl, getReqBodyDataAsModelSchema, validateObjectId } = require(path.join(__dirname, '../../utilities'));

router.post('/', async (req, res) => {});
router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
        status: "success",
        message: "Testing is succeeded.",
        // data: {
        //     user: result
        // }
    }));
    res.end();
});
router.get('/:survey_id', async (req, res) => {});
router.put('/:survey_id', async (req, res) => {});
router.delete('/:survey_id', async (req, res) => {});

module.exports = router;