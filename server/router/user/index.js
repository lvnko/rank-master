const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const User = require(path.join(__dirname, '../../models/User'));
const router = express.Router();
const surveyRouter = require('./survey');
const { standardErrorHandler, standardErrorHandlerOnPost, customErrorHandler, getFullReqUrl, getReqBodyDataAsModelSchema, validateObjectId, packDataObjectWithCountryCodeByName, payloadFilteringByKey } = require(path.join(__dirname, '../../utilities'));
const { passParentParamsForward } = require(path.join(__dirname, '../../middlewares'));

router.use('/:user_id/survey', passParentParamsForward, surveyRouter);

router.post('/', async (req, res) => {

    const { t } = req;
    
    try {
        const payload = getReqBodyDataAsModelSchema(req, User);
        const result = await User.create(payload);
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            statusText: "success",
            message: t('user.created', { ns: 'message' }),
            data: {
                user: result
            }
        }));
        res.end();

    } catch (error) {

        return standardErrorHandlerOnPost(res, error);
        
    }

});

router.get('/', async (req, res) => {

    const { t } = req;

    // console.log('req =>', req);

    try {

        const results = await User.aggregate([
            {
                $lookup: {
                    from: "surveys",
                    localField: "_id",
                    foreignField: "authorId",
                    as: "surveys"
                }
            },{
                $addFields: {
                    surveysCreated: { $size: "$surveys" }
                }
            },{
                $project: {
                    surveys: 0
                }
            }
        ]);
        // results.forEach((ur)=>{
        //     Object.keys(ur.translations).forEach((key)=>{
        //         console.log('Users get result.translations => ', ur.translations[key]._id);
        //     });
        // });
        
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            statusText: "success",
            message: t(results.length > 0 ? 'user.founds' : 'user.notFound', { ns: 'message' }),
            data: {
                users: results.map(packDataObjectWithCountryCodeByName)
            }
        }));
        res.end();

    } catch (error) {

        return standardErrorHandlerOnPost(res, error);

    }
    
});

router.get('/:id', async (req, res) => {
    
    const { t } = req;
    
    try {
        const apiAction = t('endpoint.action.find');
        validateObjectId(req.params.id, t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
        const id = new mongoose.Types.ObjectId(`${req.params.id}`);

        // console.log('params id =>', id);
        const result = await User.findById(id);
        // console.log('result =>', result);
        // console.log('result.packed =>', packDataObjectWithCountryCodeByName(result));

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: result === null ? "fail" : "success",
            message: t(result === null ? 'user.cannotFound' : 'user.found', { ns: 'message' }),
            data: {
                user: packDataObjectWithCountryCodeByName(result.toJSON())
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

router.put('/:id', async (req, res) => {

    const { t } = req;

    try {
        const apiAction = t('endpoint.action.update');
        validateObjectId(req.params.id, t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
        const id = new mongoose.Types.ObjectId(`${req.params.id}`);
        const payload = getReqBodyDataAsModelSchema(req, User);

        // console.log('params id =>', id);
        let result = {};
        if (!payload.translations) {
            result = await User.findOneAndUpdate({ _id: id },[
                {
                    $set: {
                        ...payload,
                        updatedAt: new Date()
                    }
                }
            ],
            { new: true });
        } else {
            const user = await User.findOne({ _id: id });
            const { translations } = user;
            const { translations: payloadTranslations, ...restOfPayload } = payload;
            Object.keys(payloadTranslations).forEach((key)=>{
                if (translations.get(key) !== undefined) {
                    translations.set(key, {
                        ...translations.toJSON()[key],
                        ...payloadTranslations[key]
                    });
                } else {
                    // console.log("Array.from(user.translations.keys()) => ", Array.from(translations.keys()));
                    const { isPrimary : payloadTranslationIsPrimary } = payloadTranslations[key];
                    const correspondingUserTranslationKey = Array.from(translations.keys()).reduce((accm, curr) => {
                        // console.log('translations.get(curr).isPrimary => ', translations.get(String(curr)).isPrimary);
                        // console.log('payloadTranslationIsPrimary => ', payloadTranslationIsPrimary);
                        if (accm !== '') return accm;
                        if (translations.get(String(curr)).isPrimary === payloadTranslationIsPrimary) return curr;
                        else return accm;
                    }, '');
                    if (correspondingUserTranslationKey !== '') {
                        translations.delete(correspondingUserTranslationKey);
                    }
                    translations.set(key, payloadTranslations[key]);
                }
            });
            result = await User.findOneAndUpdate(
                { _id: id },
                [
                    {
                        $set: {
                            translations: translations,
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
            message: t('user.updted', { ns: 'message' }),
            data: {
                user: result
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

router.delete('/:id', async (req, res) => {

    const { t } = req;
    setTimeout(()=>{

        try {
            const apiAction = t('endpoint.action.delete');
            validateObjectId(req.params.id, t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));

            throw new Error(t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
            
            // const id = new mongoose.Types.ObjectId(`${req.params.id}`);

            // // console.log('params id =>', id);
            // const result = await User.deleteOne({
            //     _id: id
            // });
            // console.log('result =>', result);

            // res.setHeader('Content-Type', 'application/json');
            // res.write(JSON.stringify({
            //     statusText: "success",
            //     message: t('user.deleted', { ns: 'message' }),
            //     data: {
            //         operationResult: result
            //     }
            // }));
            // res.end();

        } catch(error) {

            return standardErrorHandler(res, {
                code: error.message.indexOf('fail') >= 0 ? "fail" : "bad_request",
                statusCode: error.message.indexOf('fail') >= 0 ? 400 : 404,
                message: error.message
            });

        }

            
    }, 500);

});

module.exports = router;