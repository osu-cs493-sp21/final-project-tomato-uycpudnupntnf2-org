const router = module.exports = require('express').Router();

router.use('/users', require('./users'));
router.use('/videos',require('./videos').router);
router.use('/comments',require('./comments'));

// DELETE ME BEFORE FINAL SUBMISSION
const dbcall = require('../db/dbCall');
print = dbcall.print;
router.get("/dbtest/:id",async function(req,res,next) {
	const result = await dbcall.getUserById(req.params.id);
	print("email",result);
	res.status(201).send({
		note:"the query was completed!",
		result:result
	});
});
