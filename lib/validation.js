const bcrypt = require('bcryptjs');
// SCHEMAS
// These schemas are how the items are represented in the database.
// _id is added by the dbcalls so you dont have to add that yourself.
// you just need to add the rest of the items.
const userschema = {
	_id:       { required:true  }, // id of user
	email:     { required:true  }, // user email
	name:      { required:true  }, // user name
	pass:      { required:true  }, // user password
	birth:     { required:true  }, // user birthday
	subs:      { required:false }, // array of user subscriptions (userid)
	vids:      { required:false }  // array of user videos (videoid)
};
const videoschema = {
	_id:       { required:true  }, // id of video
	userid:    { required:true  }, // id of user who posted video
	likes:     { required:true  }, // number of likes for this video
	comments:  { required:false }, // array of video comments (commentid)
	thumnail:  { required:true  }, // path to video thumbnail file
	file:      { required:true  }, // path to video file
	length:    { required:true  }, // length of video in seconds
	timestamp: { required:true  }  // timestamp of video
}
const commentschema = {
	_id:       { required:true }, // id of comment
	userid:    { required:true }, // id of user who posted comment
	videoid:   { required:true }, // id of video this comment is attached to
	text:      { required:true }, // text of the comment
	likes:     { required:true }, // number of likes for this comment
	timestamp: { required:true }  // timestamp of comment
}
// VALIDATION FUNCTIONS
// These are just taken from hess, they should work just fine.
function validate(obj, schema) {
    return obj && Object.keys(schema).every(
    	field => !schema[field].required || obj[field]
	);
}
function extract(obj,schema) {
	let validObj = {};
    Object.keys(schema).forEach((field) => {
    	if (obj[field]) {
    		validObj[field] = obj[field];
    	}
    });
    return validObj;
}
async function validateUser (email, password) {
    const user = await getUserByEmailPassword(email);
    return await bcrypt.compare(password, user.password);
  }

exports.userschema = userschema;
exports.videoschema = videoschema;
exports.commentschema = commentschema;
exports.validateSchema = validate;
exports.extractValidFields = extract;
exports.validateUser =validateUser;
