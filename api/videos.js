const router = require('express').Router();
const express = require("express");
const app = express();
router.use('/media/video' ,express.static(`${__dirname}/../db/data/files/videos`))

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

const multer = require('multer');
const crypto = require('crypto');

//const upload = multer({ dest: `${__dirname}/../db/data/files`})

const acceptedFileTypes={
  'video/mp4': 'mp4',
  'video/mov': 'mov',
  'video/wmv': 'wmv',
  'video/flv': 'flv',
  'video/avi': 'avi',
  'video/jpeg': 'jpg',
  'video/png': 'png',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};



const upload = multer({

  storage: multer.diskStorage({
    destination: `${__dirname}/../db/data/files/videos`,
    filename: (req, file, callback) => {
      const filename = crypto.pseudoRandomBytes(16).toString('hex');
      const extension = acceptedFileTypes[file.mimetype];
      callback(null, `${filename}.${extension}`);
    }
  }),
  fileFilter: (req, file, callback) => {
      callback(null, !!acceptedFileTypes[file.mimetype])
    }
});


exports.router = router

// get all videos with pagination
router.get('/', async (req, res, next) => {
    try {
        const videoPage = await getVideoPage(parseInt(req.query.page) || 1);
        array.forEach(element => {
            
        });
        
        delete videoPage.file
        delete videoPage.thumnail
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

    const vid = req.params.id;
    try {
        const video = await getVideoById(vid);
        
        delete video.file
        delete video.thumnail
        

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

// , uploadThumnail.array('image')
// upload.array('video')
// post video
router.post('/', upload.any(), async (req, res, next) =>{
  
    
    //console.log("req file: ", req.file)
    console.log("req files: ", req.files)
    console.log(" req body", req.body)

    if(validateSchema(req.body, videoschema) && req.files){
        try {
            // timestamp for video

            req.body.filename = req.files[0].filename
            req.body.contentType = req.files[0].mimetype;
            req.body.timestamp = Date.now();

            req.body.file = `${__dirname}/../db/data/files/videos/`  + req.files[0].filename
            req.body.thumnail = `${__dirname}/../db/data/files/videos/`  + req.files[1].filename
            req.body.length = parseInt(req.body.length);
            req.body.likes = parseInt(req.body.likes)
            
            console.log(req.body)
            
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

router.use('*', (err, req, res, next) => {
  console.error(err);
  res.status(500).send({
    error: "An error occurred.  Try again later."
  });
});
