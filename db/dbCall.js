const { ObjectId } = require('bson');
const mango = require('../lib/mango');
const val   = require('../lib/validation');
// DB CALLS
async function getUserCount() {
	return 0;
}
async function getVideoCount() {
	return 0;
}
async function getCommentCount() {
	return 0
}
async function insertUser(user) {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	user = val.extractValidFields(user,val.userschema);
	user._id = new ObjectId(getUserCount());
	const result = collection.insertOne(user)
	console.log('insert result:',result);
	return result;
}
async function insertComment(comment) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	comment = val.extractValidFields(comment,val.commentschema);
	comment._id = new ObjectId(getCommentCount());
	const result = collection.insertOne(comment)
	console.log('insert result:',result);
	return result;
}
async function insertVideo(video) {
	const db = mango.getDBReference();
	const collection = db.collection('videos');
	video = val.extractValidFields(video,val.videoschema);
	video._id = new ObjectId(getVideoCount());
	const result = await collection.insertOne(video)
	console.log('insert result:',result);
	return result;
}
async function getUserById(id) {
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
async function getVideoById(id) {
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
async function getCommentById(id) {
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
async function getUserVideos(id) {
	const db = mango.getDBReference();
	const collection = db.collection('users');
	return null;
}
async function getUserComments(userid) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	return null;
}
async function getCommentsByVideo(id) {
	const db = mango.getDBReference();
	const collection = db.collection('comments');
	return null;
}
// inserts
exports.insertUser         = null; // 
exports.insertComment      = null; // 
exports.insertVideo        = null; // 
// gets
exports.getUserById        = null; // 
exports.getVideoById       = null; // 
exports.getCommentById     = null; // 
exports.getUserVideos      = null; // 
exports.getUserComments    = null; // 
exports.getCommentsByVideo = null; // 
// updates
exports.updateVideo        = null; // 
exports.updateComment      = null; // 
exports.updateUser         = null; // 
// deletes
exports.deleteUser         = null; // 
exports.deletevideo        = null; // 
exports.deleteComment      = null; // 