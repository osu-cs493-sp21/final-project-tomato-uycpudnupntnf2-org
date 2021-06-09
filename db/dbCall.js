const { ObjectId } = require('bson');
const mango = require('../lib/mango');
const val   = require('../lib/validation');
// DB CALLS
async function getUserCount() {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	return await collection.count();
}
async function getVideoCount() {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	return await collection.count();
}
async function getCommentCount() {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	return await collection.count();
}
async function insertU(user) {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	user = val.extractValidFields(user,val.userschema);
	user._id = new ObjectId(getUserCount());
	const result = collection.insertOne(user)
	console.log('insert result:',result);
	return result;
}
async function insertC(comment) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	comment = val.extractValidFields(comment,val.commentschema);
	comment._id = new ObjectId(getCommentCount());
	const result = collection.insertOne(comment)
	console.log('insert result:',result);
	return result;
}
async function insertV(video) {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	video = val.extractValidFields(video,val.videoschema);
	video._id = new ObjectId(getVideoCount());
	const result = await collection.insertOne(video)
	console.log('insert result:',result);
	return result;
}
async function getUById(id) {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	if(ObjectId.isValid(id)) {
		const result = collection.find({
			_id: id
		}).toArray();
		console.log('insert result:',result[0]);
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
	console.log('insert result:',result[0]);
	return result[0];
}
async function getVById(id) {
	const db = mango.getDBReference();
	const collection = db.collection('video');
	if(ObjectId.isValid(id)) {
		const result = collection.find({
			_id: id
		}).toArray();
		console.log('insert result:',result[0]);
		return result[0];
	}
	else {
		return null;
	}
}
async function getCById(id) {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	if(ObjectId.isValid(id)) {
		const result = await collection.find({
			_id: id
		}).toArray();
		console.log('insert result:',result[0]);
		return result[0];
	}
	else {
		return null;
	}
}
async function getUV(userid) {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	return null;
}
async function getUC(userid) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	return null;
}
async function getCByV(videoid) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	return null;
}
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