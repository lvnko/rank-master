const express = require("express");
const path = require('path');
const he = require('he');
const router = express.Router();
const userRouter = require('./user');
const surveyRouter = require('./survey');
const errorRouter = require('./error');
const { commonNonActiveEndpointReply } = require(path.join(__dirname, '../utilities'));
const { LANGUAGES_LIB, COUNTRIES_OR_REGIONS } = require(path.join(__dirname, '../constants'));

router.use('/user', userRouter);
router.use('/survey', surveyRouter);
router.use('/error', errorRouter);

router.get('/languages', async(req, res) => {

    const { t, i18n } = await req;
    // console.log("Server : i18n.options => ", i18n.options.supportedLngs);
    const languages = i18n.options.supportedLngs;
    const result = LANGUAGES_LIB.filter(({name})=>languages.indexOf(name) >= 0)
    
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
        statusText: "success",
        message: t('languages.found', { ns: 'message' }),
        data: {
            languages: result
        }
    }));
    res.end();

});

router.get('/country-codes', async(req, res) => {
    
    const { t, i18n } = await req;
    const result = COUNTRIES_OR_REGIONS.map(({ name, code})=>{
        return {name, code};
    });
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
        statusText: "success",
        message: t('countryCodes.found', { ns: 'message' }),
        data: {
            countryCodes: result
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