const router = require('express').Router();

const { 
    videoschema, 
    validateSchema, 
    extractValidFields 
} = require('../lib/validation')


const { getVideoPage } = require('../models/videos')

exports.router = router

// get all videos with pagination
router.get('/', async (req, res, next) => {
    try {
        const videoPage = await getVideoPage(parseInt(req.query.page) || 1);
        res.status(200).send({
            videoPage
        });
    } catch (error) {
        console.log('===  ERROR: ', error);
        res.status(500).send({
            err: "Error fetching videos page from the DB."
        });
    }
});