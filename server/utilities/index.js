/**
 * Common API Error Codes for Failures:
 * 
 * 4xx (Client-side errors): These codes usually indicate an issue with the request sent by the client.
 * 400 Bad Request: The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).   
 * 401 Unauthorized: Authentication is required and has failed or has not yet been provided.   
 * 403 Forbidden: The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource.   
 * 404 Not Found: The requested resource could not be found.   
 * 408 Request Timeout: The server timed out waiting for the request.
 * 429 Too Many Requests: The user has sent too many requests in a given amount of time ("rate limiting").
 * 
 * 5xx (Server-side errors): These codes indicate that the server encountered an unexpected condition that prevented it from fulfilling the request.   
 * 500 Internal Server Error: A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.   
 * 502 Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server.
 * 503 Service Unavailable: The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.   
 * 504 Gateway Timeout: The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.   
 * 505 HTTP Version Not Supported: The server does not support the HTTP protocol version used in the request.
 */

const mongoose = require("mongoose");
const path = require('path');
const he = require('he');
const { COUNTRIES_OR_REGIONS } = require(path.join(__dirname, '../constants'));

const standardErrorHandler = (res, err) => {
    res.status(err.code || 500);
    console.log('err => ', err);
    console.log('err.status => ', err.status);
    console.log('err.errors => ', err.errors);
    console.log('err.message => ', err.message);
    console.log('Object.keys(err) => ', Object.keys(err));
    res.json({
        status: err.status || "error",
        message: err.message,
        // ...message ? { message } : null
        ...err.code ? { code: err.code } : null
    });
    res.end();
    return;
}

const standardErrorHandlerOnPost = (res, error) => {
    console.log('error.message =>', error.message);
    const fullStatusText = error.message.split(/:/, 1)[0];
    const messageText = error.message.replace(fullStatusText, '').trim();
    return standardErrorHandler(res, {
        status: fullStatusText.toLowerCase().indexOf('fail') >= 0 ? "fail" : "error",
        code: 400,
        message: messageText
    });
}

const customErrorHandler = (res, message, statusText = "error", code = 404, moreInfo) => {
    const resCode = code;
    res.status(code).send({
        status: statusText,
        code: resCode,
        error: message,
        ...(moreInfo ? moreInfo : null),
        timestamp: Date.now()
    });
    // res.end();
    // return;
}

const customFaultHandler = (res, message) => {
    return res.send({
        status: "fail",
        message: message
    });
};

const getFullReqUrl = (req) => {
    return `${req.protocol}://${req.headers.host}${req.originalUrl}`;
}

const getModelDataKeys = (Model) => {
    return Object.keys(Model.schema.paths).filter(e=>['_id','_v','__v'].indexOf(e) < 0);
}

const getReqBodyDataAsModelSchema = (req, Model) => {
    const keysOfData = getModelDataKeys(Model);
    return Object.keys(req.body).reduce((accm, curr)=>{
        if (keysOfData.indexOf(curr) >= 0) {
            accm[curr] = req.body[curr];
        }
        return accm;
    }, {});
}

const validateObjectId = (id, message = `It requires a valid ID.`) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(`${id}`)) {
            throw new Error(message);
        }
        return true;
    } catch (error) {
        throw error;
    }
}

const getCountryCodeByName = (codeName = "") => {
    if (codeName === undefined || codeName === null || codeName === "") return null;
    return COUNTRIES_OR_REGIONS.filter(({name})=>name === codeName)[0]?.code || null
}

const packDataObjectWithCountryCodeByName = (dataObj) => {
    // console.log("dataObj =>", dataObj);
    return {
        ...dataObj,
        mobileCountryCode: getCountryCodeByName(dataObj.mobileCountryCode || "")
    }
}

const commonNonActiveEndpointReply = async (req, res) => {

    const { t } = req;

    const fullUrl = getFullReqUrl(req);
    // console.log('Full URL:', fullUrl);
    res.setHeader('Content-Type', 'application/json');
    return customErrorHandler(
        res,
        he.decode(t('endpoint.notFound', { ns: 'common', fullUrl: fullUrl })), "error", 500,
        {
            suggestions: [
                t('endpoint.suggestions.checkTypo', { ns: 'common'}),
                t('endpoint.suggestions.apiDocumentation', { ns: 'common'})
            ]
        }
    );
}

const payloadFilteringByKey = (_object, _keysToFilterOut) => {
    if (!_object) return null;
    if (_object.length <= 0) return _object;
    const keys = Object.keys(_object).filter(key => _keysToFilterOut.indexOf(key) < 0);
    return keys.reduce((accm, curr)=>{
        return {
            ...accm,
            [curr]: _object[curr]
        };
    }, {});

}

function genericLogErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}

function genericErrorHandler (err, req, res, next) {
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        error: err
    })
}

// exports.standardErrorHandler = standardErrorHandler;
//  customErrorHandler, customFaultHandler };

module.exports = {
    standardErrorHandler,
    standardErrorHandlerOnPost,
    customErrorHandler,
    customFaultHandler,
    getFullReqUrl,
    getModelDataKeys,
    getReqBodyDataAsModelSchema,
    validateObjectId,
    packDataObjectWithCountryCodeByName,
    commonNonActiveEndpointReply,
    payloadFilteringByKey,
    genericLogErrors,
    genericErrorHandler
};