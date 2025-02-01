const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const User = require(path.join(__dirname, '../../models/User'));
const router = express.Router();
const surveyRouter = require('./survey');
const { standardErrorHandler, customErrorHandler, getFullReqUrl, getReqBodyDataAsModelSchema, validateObjectId } = require(path.join(__dirname, '../../utilities'));

router.use('/:user_id/survey', surveyRouter);

router.post('/', async (req, res) => {
    
    try {
        const payload = getReqBodyDataAsModelSchema(req, User);
        const result = await User.create(payload);
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: "success",
            message: "A new user has been created.",
            data: {
                user: result
            }
        }));
        res.end();

    } catch (error) {
        console.log('error.message =>', error.message);
        const fullStatusText = error.message.split(/:/, 1)[0];
        const messageText = error.message.replace(fullStatusText, '').trim();
        return standardErrorHandler(res, {
            status: fullStatusText.toLowerCase().indexOf('fail') >= 0 ? "fail" : "error",
            code: 400,
            message: messageText
        });
    }

});

router.get('/', async (req, res) => {
    return customErrorHandler(res, "Bad Request", "fail", 400, {
        message: `It requires more info to the end of ${getFullReqUrl(req)}/... as an ID to find a user.`
    });
});

router.get('/:id', async (req, res) => {
    
    try {

        validateObjectId(req.params.id, `It requires a valid ID to find a user.`);
        const id = new mongoose.Types.ObjectId(`${req.params.id}`);

        console.log('params id =>', id);
        const result = await User.findById(id);
        console.log('result =>', result);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: "success",
            message: "A user profile is found.",
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

router.put('/:id', async (req, res) => {

    try {

        validateObjectId(req.params.id, `It requires a valid ID to update a user.`);
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
            message: "A user profile is updated.",
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

    try {

        validateObjectId(req.params.id, `It requires a valid ID to delete a user.`);
        const id = new mongoose.Types.ObjectId(`${req.params.id}`);

        console.log('params id =>', id);
        const result = await User.deleteOne({
            _id: id
        });
        console.log('result =>', result);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: "success",
            message: "A user profile is deleted.",
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