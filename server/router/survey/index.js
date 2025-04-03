const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const Survey = require(path.join(__dirname, '../../models/Survey'));
const router = express.Router();
const { standardErrorHandler, standardErrorHandlerOnPost, getModelDataKeys, customErrorHandler, getFullReqUrl, getReqBodyDataAsModelSchema, validateObjectId, packDataObjectWithCountryCodeByName, payloadFilteringByKey } = require(path.join(__dirname, '../../utilities'));

router.get('/', async (req, res) => {

    const { t } = req;
    const dataKeyConfigs = getModelDataKeys(Survey).filter(e=>['authorId'].indexOf(e) < 0).reduce((accm, curr)=>{
        console.log(`'${curr}'.indexOf('.$*')`, curr.indexOf('.$*'));
        if (curr.indexOf('.$*')>=0) return accm;
        accm[curr] = 1;
        return accm;
    }, {});

    try {

        const results = await Survey.aggregate([
            {
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
                        "status": 0,
                        "__v": 0,
                    }
                }
            }
        ]);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            statusText: "success",
            message: t(results.length > 0 ? 'survey.founds' : 'survey.notFound', { ns: 'message' }),
            data: {
                surveys: results
            }
        }));
        res.end();

    } catch (error) {

        return standardErrorHandlerOnPost(res, error);

    }
    
});

router.get('/:id', async (req, res) => {

    const { t } = req;
    const dataKeyConfigs = getModelDataKeys(Survey).filter(e=>['authorId'].indexOf(e) < 0).reduce((accm, curr)=>{
        console.log(`'${curr}'.indexOf('.$*')`, curr.indexOf('.$*'));
        if (curr.indexOf('.$*')>=0) return accm;
        accm[curr] = 1;
        return accm;
    }, {});

    try {

        const apiAction = t('endpoint.action.find');
        validateObjectId(req.params.id, t('survey.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
        const id = new mongoose.Types.ObjectId(`${req.params.id}`);

        const [result] = await Survey.aggregate([
            { $match: { _id: id } },
            { $limit: 1 },
            {
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
                        "status": 0,
                        "__v": 0,
                    }
                }
            }
        ]);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            statusText: "success",
            message: t(result ? 'survey.found' : 'survey.notFound', { ns: 'message' }),
            data: {
                survey: result
            }
        }));
        res.end();

    } catch (error) {

        return standardErrorHandlerOnPost(res, error);

    }

});

router.put('/:id', async (req, res) => {

    const { t } = req;

    try {
        const apiAction = t('endpoint.action.update');
        validateObjectId(req.params.id, t('survey.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
        const id = new mongoose.Types.ObjectId(`${req.params.id}`);
        const payload = getReqBodyDataAsModelSchema(req, Survey);

        // console.log('params id =>', id);
        let result = {};
        if (!payload.translations) {
            const { authorId, ...restOfPayload } = payload;
            result = await Survey.findOneAndUpdate(
                { _id: id },
                [
                    {
                        $set: {
                            ...(authorId && { authorId: new mongoose.Types.ObjectId(`${authorId}`) }),
                            ...restOfPayload,
                            updatedAt: new Date()
                        }
                    }
                ],
                { new: true }
        );
        } else {
            const survey = await Survey.findOne({ _id: id });
            const { translations } = survey;
            const { translations: payloadTranslations, authorId, ...restOfPayload } = payload;
            Object.keys(payloadTranslations).forEach((key)=>{
                if (translations.get(key) !== undefined) {
                    translations.set(key, {
                        ...translations.toJSON()[key],
                        ...payloadTranslations[key]
                    });
                } else {
                    translations.set(key, payloadTranslations[key]);
                }
            });
            console.log(">>(?)>> authorId => ", authorId);
            result = await Survey.findOneAndUpdate(
                { _id: id },
                [
                    {
                        $set: {
                            translations: translations,
                            ...(authorId && { authorId: new mongoose.Types.ObjectId(`${authorId}`) }),
                            ...restOfPayload,
                            updatedAt: new Date()
                        }
                    }
                ],
                { new: true }
            );
        }
        console.log('result =>', result);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            statusText: "success",
            message: t('survey.updted', { ns: 'message' }),
            data: {
                survey: result
            }
        }));
        res.end();

    } catch (error) {

        return standardErrorHandler(res, {
            code: error.message.indexOf('fail') >= 0 ? "fail" : "bad_request",
            statusCode: error.message.indexOf('fail') >= 0 ? 400 : 404,
            message: error.message
        });

    }

});

router.delete('/:id', async (req, res) => {

    const { t } = req;
    try {
        const apiAction = t('endpoint.action.delete');
        validateObjectId(req.params.id, t('survey.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));

        const id = new mongoose.Types.ObjectId(`${req.params.id}`);

        // console.log('params id =>', id);
        const result = await Survey.deleteOne({
            _id: id
        });
        console.log('result =>', result);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            statusText: "success",
            message: t('survey.deleted', { ns: 'message' }),
            data: {
                operationResult: result
            }
        }));
        res.end();

    } catch(error) {

        return standardErrorHandler(res, {
            code: error.message.indexOf('fail') >= 0 ? "fail" : "bad_request",
            statusCode: error.message.indexOf('fail') >= 0 ? 400 : 404,
            message: error.message
        });

    }

});

module.exports = router;