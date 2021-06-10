const router = require('express').Router();

const { 
    videoschema, 
    validateSchema, 
    extractValidFields 
} = require('../lib/validation')


const { getVideoPage } = require('../models/videos')
const { 
    getVideoById, 
    insertVideo,
    updateVideo,
    deleteVideo,
    likeVideo
} = require('../db/dbCall');
const { ObjectID } = require('bson');

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
    //console.log("req.body: ", req.body.likes);
  
    if(validateSchema(req.body, videoschema)){
        try {
            //req.body.likes = parseInt(req.body.likes);
            req.body.timestamp = Date.now();
            const result = await insertVideo(req.body);
            res.status(200).send({
                result: result.result,
                _id: result._id
            })
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
router.put('/:id', async (req,res, next)=>{
    
    if(validateSchema(req.body, videoschema)){
        try {
            const vid = req.params.id;
            const updateSuccessful = await updateVideo(vid, req.body);

            if(updateSuccessful){
                res.status(200).send(
                    "status: updateSuccessful"
                )
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({
                err: "unable to update videos."
            });   
        }
    }else{
        res.status(400).send({
            error: "Request body invalid."
        })
    }
})

// delete video by video id
router.delete('/:id', async (req, res, next) =>{
    try {
        const id = req.params.id;
        const deleteSuccessful = await deleteVideo(id);

        if (deleteSuccessful) {
            res.status(200).send("Delete successful");
        }else{
            next();
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            err: "Unable to delete video from the DB."
        })   
    }
})

// likes videos by  video and user id
router.patch('/:id', async (req, res, next) => {

    if((req.body.likes) && ((req.body.likes == 1) || req.body.likes == -1)){
        try {
            const id = req.params.id;
            const updateSuccessful = await likeVideo(id, req.body);
            if(updateSuccessful){
                 res.status(200).send("update likes successful");
             }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                err: "unable to update likes in DB"
            })
        }
    }else{
        res.status(400).send({
            err: "Request body invalid for like/dislike"
        })
    }
})