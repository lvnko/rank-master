const express = require("express");
const path = require('path');
const he = require('he');
const router = express.Router();
const userRouter = require('./user');
const { commonNonActiveEndpointReply } = require(path.join(__dirname, '../utilities'));
const { LANGUAGES_LIB } = require(path.join(__dirname, '../constants'));

router.use('/user', userRouter);

router.get('/languages', async(req, res) => {

    const { t, i18n } = await req;
    // console.log("Server : i18n.options => ", i18n.options.supportedLngs);
    const languages = i18n.options.supportedLngs;
    const result = LANGUAGES_LIB.filter(({name})=>languages.indexOf(name) >= 0)
    
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
        status: "success",
        message: t('languages.found', { ns: 'message' }),
        data: {
            languages: result
        }
    }));
    res.end();

});

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