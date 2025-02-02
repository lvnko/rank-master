const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const User = require(path.join(__dirname, '../../models/User'));
const Survey = require(path.join(__dirname, '../../models/Survey'));
const router = express.Router();
const { standardErrorHandler, standardErrorHandlerOnPost, customErrorHandler, getFullReqUrl, getReqBodyDataAsModelSchema, validateObjectId } = require(path.join(__dirname, '../../utilities'));

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

    try {
        const params = { ...req.parentParams, ...req.params };
        validateObjectId(params.user_id, `It requires a valid User ID to find a user.`);
        const authorId = new mongoose.Types.ObjectId(`${params.user_id}`);
        
        const results = await User.aggregate([
            {
                $match: { _id: authorId }
            },{
                $limit: 1
            },{
                $lookup: {
                    from: "surveys",
                    localField: "_id",
                    foreignField: "authorId",
                    as: "surveys"
                }
            },{
                $project: {
                    "surveys.authorId": 0
                }
            }
        ]);

        console.log('results =>', results);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: results.length > 0 ? "success" : "fail",
            message: results.length > 0 ?
                results[0].surveys.length > 0 ?
                    "We found these surveys that are created by this user." : "We found this user has created no survey." :
                "There is no survey nor a user is found.",
            data: {
                user: results.length > 0 ? results[0] : null
            }
        }));
        res.end();
    } catch (error) {
        return standardErrorHandler(res, {
            status: error.message.indexOf('fail') >= 0 ? "fail" : "error",
            code: error.message.indexOf('fail') >= 0 ? 400 : 404,
            message: error.message
        });
    }
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