const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const User = require(path.join(__dirname, '../models/User'));
const router = express.Router();
const { standardErrorHandler, customErrorHandler } = require(path.join(__dirname, '../utilities'));



router.post('/', async (req, res) => {

    req.body;
    req.params;

});

router.get('/', async (req, res) => {
    if (!req.body.id) {
        return customErrorHandler(res, "Bad Request", "fail", 400, {
            message: "No ID provided."
        });
    }
});

router.get('/:id', async (req, res) => {

    const { id } = req.params;
    // req.params;

    try {
        // const results = await Todo.findAll({
        //     include: {
        //         model: User
        //     }
        // });
        // res.setHeader('Content-Type', 'application/json');
        // res.write(JSON.stringify(results));
        // res.end();

        // res.setHeader('Content-Type', 'application/json');
        // res.write(JSON.stringify({
        //     message: "This is the user endpoint."
        // }));
        // res.end();
        const users = await User.find({});
        console.log(users);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: "success",
            message: "This is the user endpoint.",
            data: {
                users: users
            }
        }));
        res.end();

    } catch(error) {
        return standardErrorHandler(res, error);
    }
});
router.put('/', async (req, res) => {});
router.delete('/', async (req, res) => {});

module.exports = router;