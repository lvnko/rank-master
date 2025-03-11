const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const User = require(path.join(__dirname, '../../models/User'));
const Survey = require(path.join(__dirname, '../../models/Survey'));
const router = express.Router();
const { standardErrorHandler, standardErrorHandlerOnPost, getModelDataKeys, getReqBodyDataAsModelSchema, validateObjectId, payloadFilteringByKey } = require(path.join(__dirname, '../../utilities'));

router.post('/', async (req, res) => {

    const { t } = req;

    try {
            const params = { ...req.parentParams, ...req.params };
            const apiAction = t('endpoint.action.find');
            validateObjectId(params.user_id, t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
            const authorId = new mongoose.Types.ObjectId(`${params.user_id}`);
            const payload = {
                authorId,
                ...getReqBodyDataAsModelSchema(req, Survey)
            };
            const result = await Survey.create(payload);
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify({
                status: "success",
                message: t('user.survey.created', { ns: 'message' }),
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

    const { t } = req;

    try {
        const params = { ...req.parentParams, ...req.params };
        const apiAction = t('endpoint.action.find');
        validateObjectId(params.user_id, t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));

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
                    t('user.survey.founds', { ns: 'message' }) : t('user.survey.notFound', { ns: 'message' }) :
                t('user.survey.notFounds', { ns: 'message' }),
            data: {
                user: results.length > 0 ? results[0] : null
            }
        }));
        res.end();
    } catch (error) {
        return standardErrorHandler(res, {
            code: error.message.indexOf('fail') >= 0 ? "fail" : "error",
            statusCode: error.message.indexOf('fail') >= 0 ? 400 : 404,
            message: error.message
        });
    }
});

router.get('/:survey_id', async (req, res) => {

    const { t } = req;

    try {

        const params = { ...req.parentParams, ...req.params };
        const apiAction = t('endpoint.action.find');
        validateObjectId(params.user_id, t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
        validateObjectId(params.survey_id, t('user.survey.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
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
                message: t('user.survey.notFound', { ns: 'message' })
            } : {
                status: "success",
                messsage: t('user.survey.found', { ns: 'message' })
            },
            data: {
                survey: result
            }
        }));
        res.end();

    } catch (error) {

        return standardErrorHandler(res, {
            code: error.message.indexOf('fail') >= 0 ? "fail" : "error",
            statusCode: error.message.indexOf('fail') >= 0 ? 400 : 404,
            message: error.message
        });

    }
});

router.put('/:survey_id', async (req, res) => {
    
    const { t } = req;

    try {

        const params = { ...req.parentParams, ...req.params };
        const apiAction = t('endpoint.action.update');
        validateObjectId(params.user_id, t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
        validateObjectId(params.survey_id, t('user.survey.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
        const authorId = new mongoose.Types.ObjectId(`${params.user_id}`);
        const surveyId = new mongoose.Types.ObjectId(`${params.survey_id}`);
        const payload = getReqBodyDataAsModelSchema(req, Survey);

        const result = await Survey.findOneAndUpdate(
            {
                _id: surveyId,
                authorId
            },
            [
                {
                    $set: payload.translations ? {
                        ...payloadFilteringByKey(payload, ["translations"]),
                        translations: {
                            $mergeObjects: [
                                "$translations", // Keep existing translations
                                payload.translations // Merge new translations
                            ],
                        },
                    } : payload,
                },
            ],
            { new: true }
        );

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            ...result === null ? {
                status: "fail",
                message: t('user.survey.cannotFoundToDo', { ns: "message", action: apiAction })
            } : {
                status: "success",
                messsage: t("user.survey.updted", { ns: "message" })
            },
            data: {
                survey: result
            }
        }));
        res.end();

    } catch (error) {

        return standardErrorHandler(res, {
            code: error.message.indexOf('fail') >= 0 ? "fail" : "error",
            statusCode: error.message.indexOf('fail') >= 0 ? 400 : 404,
            message: error.message
        });

    }

});

router.delete('/:survey_id', async (req, res) => {

    const { t } = req;

    try {

        const params = { ...req.parentParams, ...req.params };
        const apiAction = t('endpoint.action.delete');
        validateObjectId(params.user_id, t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
        validateObjectId(params.survey_id, t('user.survey.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
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
                message: t('user.survey.cannotFoundToDo', { ns: "message", action: apiAction })
            } : {
                status: "success",
                messsage: t("user.survey.deleted", { ns: "message" })
            },
            data: {
                survey: result
            }
        }));
        res.end();

    } catch (error) {

        return standardErrorHandler(res, {
            code: error.message.indexOf('fail') >= 0 ? "fail" : "error",
            statusCode: error.message.indexOf('fail') >= 0 ? 400 : 404,
            message: error.message
        });

    }

});

module.exports = router;