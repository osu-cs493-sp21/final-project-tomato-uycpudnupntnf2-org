const router = module.exports = require('express').Router();

router.use('/users', require('./users'));
router.use('/videos',require('./videos').router);

// DELETE ME BEFORE FINAL SUBMISSION
const dbcall = require('../db/dbCall');
print = dbcall.print;
router.get("/dbtest",async function(req,res,next) {
	const result = await dbcall.getUserByEmail("noelle@mail.com");
	print("email",result);
	res.status(201).send({
		note:"the query was completed!",
		result:result
	});
});
