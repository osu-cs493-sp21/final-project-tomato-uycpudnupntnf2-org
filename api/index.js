const router = module.exports = require('express').Router();

// DELETE ME BEFORE FINAL SUBMISSION
const dbcall = require('../db/dbCall');
router.get("/dbtest",async function(req,res,next) {
	const result = await dbcall.getUserByEmail("noelle@mail.com");
	console.log("result",result);
	res.status(201).send({
		note:"the query was completed!",
		result:result
	});
});