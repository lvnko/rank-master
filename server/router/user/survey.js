const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const Survey = require(path.join(__dirname, '../../models/Survey'));
const router = express.Router();
const { standardErrorHandlerOnPost, customErrorHandler, getFullReqUrl, getReqBodyDataAsModelSchema, validateObjectId } = require(path.join(__dirname, '../../utilities'));

router.post('/', async (req, res) => {

    try {
            const params = { ...req.parentParams, ...req.params };
            validateObjectId(params.user_id, `It requires a valid User ID to find a user.`);
            const authorId = new mongoose.Types.ObjectId(`${params.user_id}`);
            const payload = {
                authorId,
                ...getReqBodyDataAsModelSchema(req, Survey)
            };
            const result = await Survey.create(payload);
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify({
                status: "success",
                message: "A new survey has been created.",
                data: {
                    survey: result
                }
            }));
            res.end();

    } catch (error) {

        return standardErrorHandlerOnPost(res, error);
        
    }

});

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
router.get('/:survey_id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
        status: "success",
        message: "Testing is succeeded.",
        params: {
            ...req.params,
            ...(req.parentParams ? req.parentParams : {})
        }
        // data: {
        //     user: result
        // }
    }));
    res.end();
});
router.put('/:survey_id', async (req, res) => {});
router.delete('/:survey_id', async (req, res) => {});

module.exports = router;