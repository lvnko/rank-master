const express = require("express");
const path = require('path');
const router = express.Router();

router.get('/', async (req, res, next) => {
    Promise.resolve().then(() => {
        throw new Error('BROKEN')
    }).catch(next) // Errors will be passed to Express.
});

module.exports = router;