const router = require('express').Router();

const { 
    videoschema, 
    validateSchema, 
    extractValidFields 
} = require('../lib/validation')


const { getVideoPage } = require('../models/videos')
const { getVideoById } = require('../db/dbCall')

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

// get video by video id
router.get('/:id', async (req, res, next) =>{
    // console.log(" == timestamp: " , (new Date(Date.now()).toString()))
    // requested id
    const vid = req.params.id;
    console.log(" -- vid: " , vid)

    try {
        const video = await getVideoById(vid);
        console.log(' -- video from db: ', video)
        if(video){
            res.status(200).send(video);
        }else{
            next();
        }        
    } catch (error) {
        console.log(" === ERROR: ", error);
        res.status(500).send({
            err: "Unable to fetch video " + vid 
        })
    }
})



// post video
router.post('/', async (req, res, next) =>{
    if(validateSchema(req.body, videoschema)){
        try {
            
        } catch (error) {
            console.log("  === ERROR: ",error);
           res.status(500).send({
                err: "Unable to post video, try again."
           }) 
        }
    }else{
        res.status(400).send({
            error: "Request video contents invalid."
        })
    }
})

// put video by vidoe id

// delete video by video id

// likes videos by  video and user id