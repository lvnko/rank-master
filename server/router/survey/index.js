const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const Survey = require(path.join(__dirname, '../../models/Survey'));
const router = express.Router();
const { standardErrorHandler, standardErrorHandlerOnPost, getModelDataKeys, customErrorHandler, getFullReqUrl, getReqBodyDataAsModelSchema, validateObjectId, packDataObjectWithCountryCodeByName, payloadFilteringByKey } = require(path.join(__dirname, '../../utilities'));

router.get('/', async (req, res) => {

    const { t } = req;
    const dataKeyConfigs = getModelDataKeys(Survey).filter(e=>['authorId'].indexOf(e) < 0).reduce((accm, curr)=>{
        console.log(`'${curr}'.indexOf('.$*')`, curr.indexOf('.$*'));
        if (curr.indexOf('.$*')>=0) return accm;
        accm[curr] = 1;
        return accm;
    }, {});

    try {

        const results = await Survey.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },{
                $project:  {
                    ...dataKeyConfigs,
                    author: {
                        $arrayElemAt: ["$author", 0],
                    }        
                }
            },{
                $project: {
                    author: {
                        "dateOfBirth": 0,
                        "email": 0,
                        "mobileNum": 0,
                        "mobileCountryCode": 0,
                        "subscription": 0,
                        "updatedAt": 0,
                        "createdAt": 0,
                        "status": 0,
                        "__v": 0,
                    }
                }
            }
        ]);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            statusText: "success",
            message: t(results.length > 0 ? 'survey.founds' : 'survey.notFound', { ns: 'message' }),
            data: {
                surveys: results
            }
        }));
        res.end();

    } catch (error) {

        return standardErrorHandlerOnPost(res, error);

    }
    
});

module.exports = router;