const express = require("express");
const path = require('path');
const router = express.Router();
const userRouter = require('./user');
const { customErrorHandler, getFullReqUrl } = require(path.join(__dirname, '../utilities'));

router.use('/user', userRouter);

const commonNonActiveEndpointReply = async (req, res) => {

    const { language, languages, t } = req;
    console.log("CHECK : req.language => ", language);
    console.log("CHECK : req.languages => ", languages);
    console.log("CHECK : req.t => ", t);
    console.log("CHECK : req.t('greeting') => ", t('greeting', 'Translation not found!'));
    console.log("CHECK system locale => ", Intl.DateTimeFormat().resolvedOptions().locale)

    const fullUrl = getFullReqUrl(req);
    console.log('Full URL:', fullUrl);
    res.setHeader('Content-Type', 'application/json');
    return customErrorHandler(
        res,
        `Endpoint not found: ${fullUrl}`, "error", 400,
        {
            suggestions: [
                "Check the API endpoint URL for typos.",
                "Visit the API documentation at https://github.com/lvnko/rank-master for valid routes."
            ]
        }
    );
}

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