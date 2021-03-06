const e = require('express');
const { ObjectId, ObjectID } = require('mongodb');
const mango = require('../lib/mango');
const val   = require('../lib/validation');
// DB CALLS
// ************************************************************
// Helpful count functions
// 3/3 complete
// ************************************************************
async function getUserCount() {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	return await collection.countDocuments();
}
async function getVideoCount() {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	return await collection.countDocuments();
}
async function getCommentCount() {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	return await collection.countDocuments();
}
// ************************************************************
// Insert functions
// 3/3 complete
// ************************************************************
async function insertU(user) {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	const check = await getUByE(user.email);
	if(!check) {
		user = val.extractValidFields(user,val.userschema);
		user._id = new ObjectId(await getUserCount());
		console.log(user._id);
		const result = await collection.insertOne(user);
		return user._id;
	}
	console.log({ "n":0, "ok":0 });
	return { "n":0, "ok":0 };
}
async function insertC(comment) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	comment = val.extractValidFields(comment,val.commentschema);
	comment._id = new ObjectId(await getCommentCount());
	comment.likes = 0; //comments always initially have 0 likes
	console.log(comment._id);
	const vidid = comment.videoid;
	const vid = await getVById(vidid);
    await addCtoV(comment._id, vidid, vid);
	const result = await collection.insertOne(comment);
	return result.result;
}
async function insertV(video) {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	//video = val.extractValidFields(video,val.videoschema);
	video._id = new ObjectId(await getVideoCount());
	video.comments = [];
	video.likes = 0;
	console.log(video._id);
	const result = await collection.insertOne(video);
	//console.log("after insert:", result.result)
	return {
		result: result.result,
		_id: video._id
	};
}
// ************************************************************
// Get document functions
// 4/4 complete
// ************************************************************
async function getUById(id) {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	if(ObjectId.isValid(id)) {
		const result = await collection.find({
			_id: new ObjectId(id)
		}).toArray();
		if(result[0]) console.log(result[0]._id);
		return result[0];
	}
	else {
		return null;
	}
}
async function getUByE(useremail) {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	const result = await collection.find({
		email: useremail
	}).toArray();
	// console.log(result[0]);
	return result[0];
}
async function getVById(id) {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	if(ObjectId.isValid(id)) {
		const result = await collection.find({
			_id: new ObjectId(id)
		}).toArray();

		return result[0];
	}
	else {
		return null;
	}
}
async function getCById(id) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	if(ObjectId.isValid(id)) {
		const result = await collection.find({
			_id: new ObjectId(id)
		}).toArray();
		// console.log(result[0]);
		return result[0];
	}
	else {
		return null;
	}
}
// ************************************************************
// Complex get document functions
// 3/3 complete
// ************************************************************
async function getUV(userid) {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	if(ObjectId.isValid(userid)) {
		const result = await collection.find({
			userid: new ObjectId(userid)
		}).toArray();
		return result;
	}
	else {
		return null;
	}
}
async function getUC(userid) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	if(ObjectId.isValid(userid)) {
		const result = await collection.find({
			userid: new ObjectId(userid)
		}).toArray();
		return result;
	}
	else {
		return null;
	}
}
async function getCByV(commentid) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	if(ObjectId.isValid(videoid)) {
		const result = await collection.find({
			videoid: new ObjectId(commentid)
		}).toArray();
		return result;
	}
	else {
		return null;
	}
}
// ************************************************************
// Update functions
// 5/5 complete
// ************************************************************
async function updateVideo(id, video){
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	videoValues = val.extractValidFields(video, val.videoschema);
	const result = await collection.replaceOne(
		{ _id: new ObjectID(id) },
		{ $set:videoValues }
	);
	return result.matchedCount > 0;
}
async function updateV(videoid,video)     {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	const validdoc = val.extractValidFields(video,val.videoschema);
	const result = await collection.updateOne(
		{ _id:new ObjectId(videoid) },
		{ $set:validdoc }
	);
	return result.result;
}
async function updateC(commentid,comment) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	const validdoc = val.extractValidFields(comment,val.commentschema);
	const result = await collection.updateOne(
		{ _id:new ObjectId(commentid) },
		{ $set:validdoc }
	);
	return result.result;
}
async function updateU(userid,user)       {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	const validdoc = val.extractValidFields(user,val.userschema);
	const result = await collection.updateOne(
		{ _id:new ObjectId(userid) },
		{ $set:validdoc }
	);
	return result.result;
}
async function subU   (userid,subid)      {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	if(ObjectId.isValid(userid)) {
		const user = await collection.find({ 
			_id:new ObjectId(userid) 
		}).toArray();
		if(!user[0].subs) {
			user[0].subs = [];
		}
		user[0].subs.push(subid);
		const result = await collection.updateOne(
			{ _id:new ObjectId(userid) },
			{$set:{subs:user[0].subs}}
		);
		return result.result;
	}
	else {
		return null;
	}
}
async function usubU  (userid,subid)      {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	if(ObjectId.isValid(userid)) {
		const user = await collection.find({ 
			_id:new ObjectId(userid) 
		}).toArray();
		if(!user[0].subs) {
			user[0].subs = [];
		}
		const idx = user[0].subs.indexOf(subid);
		if(idx > -1) {
			user[0].subs.splice(idx,1);
		}
		const result = await collection.updateOne(
			{ _id:new ObjectId(userid) },
			{$set:{subs:user[0].subs}}
		);
		return result.result;
	}
	else {
		return null;
	}
}
async function likeVideo(id, fieldValue){
	const db = mango.getDBReference();
	const collection = db.collection('videos');

	if(ObjectId.isValid(id)) {
		const result = await collection.find({
			_id: new ObjectId(id)
		}).toArray();	
		
		if(result[0].likes) {
			fieldValue.likes = result[0].likes + parseInt(fieldValue.likes);
		}
		console.log(fieldValue);
		const newResult = await collection.updateOne(
			{ _id: new ObjectID(id) },
			{ $set: fieldValue }
		);
		//console.log(newResult)
		return newResult.matchedCount > 0;
	}else{
		return null;
	}
}
async function likeC(id, fieldValue){
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	if(ObjectId.isValid(id)) {
		const result = await collection.find({
			_id: new ObjectId(id)
		}).toArray();	
		if(result[0].likes) {
			fieldValue.likes = result[0].likes + parseInt(fieldValue.likes);
		}
		console.log(fieldValue);
		const newResult = await collection.updateOne(
			{ _id: new ObjectID(id) },
			{ $set: fieldValue }
		);
		//console.log(newResult)
		return newResult.matchedCount > 0;
	}else{
		return null;
	}
}
// ************************************************************
// Delete functions
// 3/3 complete
// ************************************************************
async function delU(userid) {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	const result = await collection.deleteOne({ 
		_id:new ObjectId(userid) 
	});
	return result.result;
}
async function delC(commentid) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	const result = await collection.deleteOne({ 
		_id:new ObjectId(commentid)  
	});
	return result.result;
}
async function delV(videoid) {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	const result = await collection.deleteOne({ 
		_id:new ObjectId(videoid)  
	});
	return result.result;
}
async function deleteVideoById(id){
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	const result = await collection.deleteOne({
		_id: new ObjectID(id)
	});
	return result.deletedCount > 0;
}

// ************************************************************
// Added for comments functionality, adds comment to video's comment array
// ************************************************************
async function addCtoV(commentid, videoid, vid){
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	if(ObjectId.isValid(videoid)) {
		const result = await collection.find({
			_id: new ObjectId(videoid)
		}).toArray();	
		const newComments = result[0].comments.push(commentid);
		console.log(result[0].comments);
		vid.comments = result[0].comments;
		const newResult = await collection.updateOne(
			{ _id: new ObjectID(videoid) },
			{ $set: vid }
		);
		return null;
	}
	else{
		return null;
	}
}

// ************************************************************
// The exports for all the db calls
// 18/18 complete
// ************************************************************

exports.insertUser         = insertU;     // insert a user
exports.insertComment      = insertC;     // insert a comment
exports.insertVideo        = insertV;     // insert a video

exports.getUserById        = getUById;    // get user by userid
exports.getUserByEmail     = getUByE;     // get user by email
exports.getVideoById       = getVById;    // get video by videoid
exports.getCommentById     = getCById;    // get comment by commentid
exports.getUserVideos      = getUV;       // get videos with userid
exports.getUserComments    = getUC;       // get comments with userid
exports.getCommentsByVideo = getCByV;     // get comments with videoid

exports.updateVideo        = updateVideo; // update a video object in db
exports.updateComment      = updateC;     // update a comment object in db
exports.updateUser         = updateU;     // update a user object in db
exports.subUser            = subU;        // subscribe a user to a user
exports.unsubUser          = usubU;       // unsubscribe a user to a user

exports.deleteUser         = delU;        // delete a user object from db
exports.deleteVideo        = deleteVideoById; // delete a video object from db
exports.deleteComment      = delC;        // delete a comment object from db

exports.likeVideo          = likeVideo;   // modify like or dislike videos
exports.likeComment        = likeC;
exports.print              = console.log; // Because typing console.log is too long

exports.addCommentToVideo  = addCtoV;