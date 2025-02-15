const express = require("express");
const path = require('path');
const he = require('he');
const router = express.Router();
const userRouter = require('./user');
const { customErrorHandler, getFullReqUrl } = require(path.join(__dirname, '../utilities'));

router.use('/user', userRouter);

const commonNonActiveEndpointReply = async (req, res) => {

    const { t } = req;

    const fullUrl = getFullReqUrl(req);
    // console.log('Full URL:', fullUrl);
    res.setHeader('Content-Type', 'application/json');
    return customErrorHandler(
        res,
        he.decode(t('endpoint.notFound', { ns: 'common', fullUrl: fullUrl })), "error", 400,
        {
            suggestions: [
                t('endpoint.suggestions.checkTypo', { ns: 'common'}),
                t('endpoint.suggestions.apiDocumentation', { ns: 'common'})
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