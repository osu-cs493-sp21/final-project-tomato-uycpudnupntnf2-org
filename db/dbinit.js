const mango = require('../lib/mango');
const dbjson = require('./data/db.json');
const dbcall = require('./dbcall');
mango.connectToDB(async () => {
	// Fill the db with data from a json
	console.log("== connected to db");
	const dbujson = dbjson.users;
	const dbvjson = dbjson.videos;
	const dbcjson = dbjson.comments
	for(c = 0;c < dbujson.length;c++) {
		await dbcall.insertUser(dbujson[c]);
	}
	for(c = 0;c < dbvjson.length;c++) {
		await dbcall.insertVideo(dbvjson[c]);
	}
	for(c = 0;c < dbcjson.length;c++) {
		await dbcall.insertComment(dbcjson[c]);
	}
});