const router = require('express').Router();
const { getCommentById, getCommentsByVideo, deleteComment, likeComment, updateComment } = require('../db/dbCall');
const { commentschema, validateSchema } = require('../lib/validation');
const { insertNewComment, getCommentPage } = require('../models/comments');

router.get('/', async (req, res, next) => {
    try{
        const commentPage = await getCommentPage(parseInt(req.query.page) || 1);
        res.status(200).send({
            commentPage
        });
    }
    catch (error){
        console.log('=== ERROR: ', error);
        res.status(500).send({
            err: "Error fetching comments page from the DB."
        });
    }
}
);

router.post('/', async (req, res, next) =>{
    if (validateSchema(req.body, commentschema)){
        try{
            const id = await insertNewComment(req.body)
            res.status(200).send({ id: id});
        }
        catch (err){
            console.error(err);
            res.status(500).send({
                error: "Unable to insert comment. Please try again later."
            });
        }
    }
    else{
        res.status(400).send({
            error: "Request body is not a valid comment object."
        });
    }
}
);

router.put('/:id', async (req,res, next) =>{
    if (validateSchema(req.body, commentschema)){
        try{
            const com = req.params.id;
            const updateSuccessful = await updateComment(com, req.body);
            if(updateSuccessful){
                res.status(200).send(
                    "status: updateSuccessful"
                )
            }
        }
        catch (error){
            console.log(error);
            res.status(500).send({
                err: "unable to update comments."
            });   
        }
    }
    else{
        res.status(400).send({
            error: "Request body invalid."
        })
    }
});

router.get('/:id', async (req, res, next) =>{
    const com = req.params.id;
    console.log(" -- comment : ", com)
    try{
        const comment = await getCommentById(com);
        console.log(' -- comment from db: ', comment)
        if(comment){
            res.status(200).send(comment);
        }
        else{
            next();
        }
    }
    catch (error){
        console.log(" == ERROR: ", error);
        res.status(500).send({
            err: "Unable to fetch comment " + com
        })
    }
}
);

router.delete('/:id', async (req, res, next) =>{
    try{
        const id = req.params.id;
        const deleteSuccessful = await deleteComment(id);
        if (deleteSuccessful){
            res.status(200).send("Delete successful");
        }
        else{
            next();
        }
    }
    catch (error){
        console.log(error);
        res.status(500).send({
            err: "Unable to delete comment from the DB."
        })
    }
}
);

router.patch('/:id', async (req, res, next) =>{
    if ((req.body.likes) && ((req.body.likes == 1) || req.body.likes == -1)){
        try{
            const id = req.params.id;
            const updateSuccessful = await likeComment(id, req.body);
            if (updateSuccessful){
                res.status(200).send("update likes successful");
            }
        }
        catch (error){
            console.log(error);
            res.status(500).send({
                err: "unable to update likes in DB"
            })
        }
    }
    else{
        res.status(400).send({
            err: "Request body invalid for like/dislike"
        })
    }
}
);

module.exports = router;