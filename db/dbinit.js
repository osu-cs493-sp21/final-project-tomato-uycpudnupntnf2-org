const mango  = require('../lib/mango');
const dbjson = require('./data/db.json');
const dbcall = require('./dbCall');
const print  = dbcall.print;
mango.connectToDB(async () => {
	// Fill the db with data from a json
	print("== connected to db");
	const dbujson = dbjson.users;
	const dbvjson = dbjson.videos;
	const dbcjson = dbjson.comments
	for(c = 0;c < dbujson.length;c++) {
		await dbcall.insertUser(dbujson[c]);
	}
	const user = await dbcall.getUserByEmail("noelle@mail.com");
	if(user) {
		for(c = 0;c < dbvjson.length;c++) {
			dbvjson[c].userid = user._id;
			dbvjson[c].timestamp = Date.now();
			await dbcall.insertVideo(dbvjson[c]);
		}
		const videos = await dbcall.getUserVideos(user._id);
		if(videos) {
			const video = videos[0];
			for(c = 0;c < dbcjson.length;c++) {
				dbcjson[c].userid = user._id;
				dbcjson[c].videoid = video._id;
				dbcjson[c].timestamp = Date.now();
				await dbcall.insertComment(dbcjson[c]);
			}
		}
	}
});