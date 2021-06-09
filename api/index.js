const router = module.exports = require('express').Router();

// DELETE ME BEFORE FINAL SUBMISSION
const dbcall = require('../db/dbcall');
router.get("/dbtest",async function(req,res,next) {
	user = {
		email:"a@b.com",
		name:"noelle",
		pass:"fischerPriceTurtle",
		birth:"10/31/1995"
	}
	const result = await dbcall.getUserByEmail("a@b.com");
	console.log("result",result);
	res.status(201).send({
		result:"the query was completed!"
	});
});