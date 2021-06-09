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
	if(ObjectId.isValid(userid)) {
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
// 0/3 complete
// ************************************************************

// ************************************************************
// Delete functions
// 0/3 complete
// ************************************************************

// ************************************************************
// The exports for all the db calls
// 10/16 complete
// ************************************************************

// inserts
exports.insertUser         = insertU;  // insert a user
exports.insertComment      = insertC;  // insert a comment
exports.insertVideo        = insertV;  // insert a video
// gets
exports.getUserById        = getUById; // get user by userid
exports.getUserByEmail     = getUByE;  // get user by email
exports.getVideoById       = getVById; // get video by videoid
exports.getCommentById     = getCById; // get comment by commentid
exports.getUserVideos      = getUV;    // get videos with userid
exports.getUserComments    = getUC;    // get comments with userid
exports.getCommentsByVideo = getCByV;  // get comments with videoid
// updates
exports.updateVideo        = null; // update a video object in db
exports.updateComment      = null; // update a comment object in db
exports.updateUser         = null; // update a user object in db
// deletes
exports.deleteUser         = null; // delete a user object from db
exports.deleteVideo        = null; // delete a video object from db
exports.deleteComment      = null; // delete a comment object from db
// print
exports.print              = console.log; // Because typing console.log is too long