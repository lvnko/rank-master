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

const standardErrorHandler = (res, err) => {
    res.status(err.status || 500);
    console.log('err => ', err);
    res.json({
        err: err.message,
        // ...message ? { message } : null
    });
    res.end();
    return;
}

const customErrorHandler = (res, message, statysText = "error", code = 404, moreInfo) => {
    const resCode = code;
    res.status(code);
    res.json({
        status: "error",
        code: resCode,
        message: message,
        ...(moreInfo ? moreInfo : null),
        timestamp: Date.now()
    });
    res.end();
    return;
}

const customFaultHandler = (res, message) => {
    return res.send({
        statusText: "fail",
        message: message
    });
};

// exports.standardErrorHandler = standardErrorHandler;
//  customErrorHandler, customFaultHandler };

module.exports = {
    standardErrorHandler: standardErrorHandler,
    customErrorHandler: customErrorHandler,
    customFaultHandler: customFaultHandler
};