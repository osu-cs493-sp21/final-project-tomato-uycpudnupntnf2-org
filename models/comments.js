const { extractValidFields, commentschema } = require('../lib/validation');
const { insertComment, getCommentById, getVideoById } = require('../db/dbCall');
const { getDBReference } = require('../lib/mango');

//page for comments just for debug may take this out later
exports.getCommentPage = async function (page){
    const db = getDBReference();
    const collection = db.collection('comments');
    const count = await collection.countDocuments();
    const pageSize = 10;
    const lastPage = Math.ceil(count/pageSize);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;
    const results = await collection.find({}).sort({ _id: 1}).skip(offset).limit(pageSize).toArray();
    return{
        comments: results,
        page: page,
        totalPages: lastPage,
        count: count
    };
};

exports.insertNewComment = async function (comment){
    const commentToInsert = extractValidFields(comment, commentschema);
    const vidid = commentToInsert.videoid;
    const id = await insertComment(commentToInsert);
    console.log("video id of new comment: ", vidid);
    return id;
};
