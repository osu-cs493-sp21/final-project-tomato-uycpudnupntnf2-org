const { ObjectId } = require('mongodb');
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
		return result.result;
	}
	console.log({ "n":0, "ok":0 });
	return { "n":0, "ok":0 };
}
async function insertC(comment) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	comment = val.extractValidFields(comment,val.commentschema);
	comment._id = new ObjectId(await getCommentCount());
	console.log(comment._id);
	const result = await collection.insertOne(comment);
	return result.result;
}
async function insertV(video) {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	video = val.extractValidFields(video,val.videoschema);
	video._id = new ObjectId(await getVideoCount());
	console.log(video._id);
	const result = await collection.insertOne(video);
	return result.result;
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
			_id: id
		}).toArray();
		console.log(result[0]._id);
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
			_id: id
		}).toArray();
		// console.log(result[0]);
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
			_id: id
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
			userid: userid
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
			userid: userid
		}).toArray();
		return result;
	}
	else {
		return null;
	}
}
async function getCByV(videoid) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	if(ObjectId.isValid(videoid)) {
		const result = await collection.find({
			videoid: videoid
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
async function updateV(videoid,video)     {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	const validdoc = val.extractValidFields(video,val.videoschema);
	const result = await collection.updateOne(
		{ _id:videoid },
		validdoc
	).toArray();
	return result.result;
}
async function updateC(commentid,comment) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	const validdoc = val.extractValidFields(comment,val.commentschema);
	const result = await collection.updateOne(
		{ _id:commentid },
		validdoc
	).toArray();
	return result.result;
}
async function updateU(userid,user)       {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	const validdoc = val.extractValidFields(user,val.userschema);
	const result = await collection.updateOne(
		{ _id:userid },
		validdoc
	).toArray();
	return result.result;
}
async function subU   (userid,subid)      {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	if(ObjectId.isValid(userid)) {
		const user = await collection.find({ 
			_id = userid 
		}).toArray();
		if(!user[0].subs) {
			user[0].subs = [];
		}
		user[0].subs.push(subid);
		const result = await collection.updateOne(
			{ _id:userid },
			{$set:{subs:user[0].subs}}
		).toArray();
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
			_id = userid 
		}).toArray();
		if(!user[0].subs) {
			user[0].subs = [];
		}
		const idx = user[0].subs.indexOf(subid);
		if(idx > -1) {
			user[0].subs.remove(idx);
		}
		const result = await collection.updateOne(
			{ _id:userid },
			{$set:{subs:user[0].subs}}
		).toArray();
		return result.result;
	}
	else {
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
	const result = await collection.updateOne({ 
		_id:videoid 
	}).toArray();
	return result.result;
}
async function delC(commentid) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	const result = await collection.updateOne({ 
		_id:videoid 
	}).toArray();
	return result.result;
}
async function delV(videoid) {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	const result = await collection.updateOne({ 
		_id:videoid 
	}).toArray();
	return result.result;
}
// ************************************************************
// The exports for all the db calls
// 18/18 complete
// ************************************************************

exports.insertUser         = insertU;  // insert a user
exports.insertComment      = insertC;  // insert a comment
exports.insertVideo        = insertV;  // insert a video

exports.getUserById        = getUById; // get user by userid
exports.getUserByEmail     = getUByE;  // get user by email
exports.getVideoById       = getVById; // get video by videoid
exports.getCommentById     = getCById; // get comment by commentid
exports.getUserVideos      = getUV;    // get videos with userid
exports.getUserComments    = getUC;    // get comments with userid
exports.getCommentsByVideo = getCByV;  // get comments with videoid

exports.updateVideo        = updateV;  // update a video object in db
exports.updateComment      = updateC;  // update a comment object in db
exports.updateUser         = updateU;  // update a user object in db
exports.subUser            = subU;     // subscribe a user to a user
exports.unsubUser          = usubU;    // unsubscribe a user to a user

exports.deleteUser         = delU; // delete a user object from db
exports.deleteVideo        = delV; // delete a video object from db
exports.deleteComment      = delC; // delete a comment object from db

exports.print              = console.log; // Because typing console.log is too long