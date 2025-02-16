const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const User = require(path.join(__dirname, '../../models/User'));
const router = express.Router();
const surveyRouter = require('./survey');
const { standardErrorHandler, standardErrorHandlerOnPost, customErrorHandler, getFullReqUrl, getReqBodyDataAsModelSchema, validateObjectId, packDataObjectWithCountryCodeByName } = require(path.join(__dirname, '../../utilities'));
const { passParentParamsForward } = require(path.join(__dirname, '../../middlewares'));

router.use('/:user_id/survey', passParentParamsForward, surveyRouter);

router.post('/', async (req, res) => {
    
    try {
        const payload = getReqBodyDataAsModelSchema(req, User);
        const result = await User.create(payload);
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: "success",
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
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: "success",
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

        console.log('params id =>', id);
        const result = await User.findById(id);
        // console.log('result =>', result);
        console.log('result.packed =>', packDataObjectWithCountryCodeByName(result));

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
            status: error.message.indexOf('fail') >= 0 ? "fail" : "error",
            code: error.message.indexOf('fail') >= 0 ? 400 : 404,
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

        console.log('params id =>', id);
        const result = await User.updateOne({
            _id: id
        }, {
            ...payload
        });
        console.log('result =>', result);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: "success",
            message: t('user.updted', { ns: 'message' }),
            data: {
                user: result
            }
        }));
        res.end();

    } catch(error) {

        return standardErrorHandler(res, {
            status: error.message.indexOf('fail') >= 0 ? "fail" : "error",
            code: error.message.indexOf('fail') >= 0 ? 400 : 404,
            message: error.message
        });

    }

});

router.delete('/:id', async (req, res) => {

    const { t } = req;

    try {
        const apiAction = t('endpoint.action.delete');
        validateObjectId(req.params.id, t('user.requirement', { ns: 'message', requirement: 'ID', action: apiAction }));
        const id = new mongoose.Types.ObjectId(`${req.params.id}`);

        console.log('params id =>', id);
        const result = await User.deleteOne({
            _id: id
        });
        console.log('result =>', result);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: "success",
            message: t('user.deleted', { ns: 'message' }),
            data: {
                user: result
            }
        }));
        res.end();

    } catch(error) {

        return standardErrorHandler(res, {
            status: error.message.indexOf('fail') >= 0 ? "fail" : "error",
            code: error.message.indexOf('fail') >= 0 ? 400 : 404,
            message: error.message
        });

    }

});

module.exports = router;