const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const User = require(path.join(__dirname, '../../models/User'));
const Survey = require(path.join(__dirname, '../../models/Survey'));
const router = express.Router();
const { standardErrorHandler, standardErrorHandlerOnPost, getModelDataKeys, getReqBodyDataAsModelSchema, validateObjectId } = require(path.join(__dirname, '../../utilities'));

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
    try {

        const params = { ...req.parentParams, ...req.params };
        validateObjectId(params.user_id, `It requires a valid User ID to find a user.`);
        validateObjectId(params.survey_id, `It requires a valid Survey ID to find a survey.`);
        const dataKeyConfigs = getModelDataKeys(Survey).filter(e=>['authorId'].indexOf(e) < 0).reduce((accm, curr)=>{
            accm[curr] = 1;
            return accm;
        }, {});
        const authorId = new mongoose.Types.ObjectId(`${params.user_id}`);
        const surveyId = new mongoose.Types.ObjectId(`${params.survey_id}`);

        const results = await Survey.aggregate([
            {
                $match: { _id: surveyId, authorId: authorId }
            },{
                $limit: 1
            },{
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },{
                $project:  {
                    ...dataKeyConfigs,
                    author: {
                        $arrayElemAt: ["$author", 0],
                    }
                }
            },{
                $project: {
                    author: {
                        "dateOfBirth": 0,
                        "email": 0,
                        "mobileNum": 0,
                        "mobileCountryCode": 0,
                        "subscription": 0,
                        "updatedAt": 0,
                        "createdAt": 0,
                        "__v": 0,
                    }
                }
            }
        ]);

        const result = results.length > 0 ? results[0] : null;

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            ...result === null ? {
                status: "fail",
                message: "We found nothing from this user."
            } : {
                status: "success",
                messsage: "We found a survey that was created by this user."
            },
            data: {
                survey: result
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

router.put('/:survey_id', async (req, res) => {
    try {

        const params = { ...req.parentParams, ...req.params };
        validateObjectId(params.user_id, `It requires a valid User ID to find a user.`);
        validateObjectId(params.survey_id, `It requires a valid Survey ID to find a survey.`);
        const authorId = new mongoose.Types.ObjectId(`${params.user_id}`);
        const surveyId = new mongoose.Types.ObjectId(`${params.survey_id}`);
        const payload = getReqBodyDataAsModelSchema(req, Survey);

        const result = await Survey.updateOne({
            _id: surveyId,
            authorId
        }, {
            ...payload
        });

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            ...result === null ? {
                status: "fail",
                message: "We cannot found any survey from this user to update."
            } : {
                status: "success",
                messsage: "A survey from this user is updated."
            },
            data: {
                survey: result
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

router.delete('/:survey_id', async (req, res) => {

    try {

        const params = { ...req.parentParams, ...req.params };
        validateObjectId(params.user_id, `It requires a valid User ID to find a user.`);
        validateObjectId(params.survey_id, `It requires a valid Survey ID to find a survey.`);
        const authorId = new mongoose.Types.ObjectId(`${params.user_id}`);
        const surveyId = new mongoose.Types.ObjectId(`${params.survey_id}`);
        const result = await Survey.deleteOne({
            _id: surveyId,
            authorId
        });

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            ...result === null || result?.deletedCount === 0 ? {
                status: "fail",
                message: "We cannot found any survey from this user to delete."
            } : {
                status: "success",
                message: "A survey created by this user is deleted."
            },
            data: {
                survey: result
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

module.exports = router;