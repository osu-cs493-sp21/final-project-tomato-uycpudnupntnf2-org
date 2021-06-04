const express = require("express");
const morgan = require('morgan');
const { 
	connectToDB
} = require('./lib/mango');
const api = require('./api');
const app = express();
const port = process.env.PORT || 8008;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/', api);

app.use('*', function (req, res, next) {
	res.status(404).json({
		error: "Requested resource " + req.originalUrl + " does not exist"
	});
});

connectToDB(() => {
	console.log(__dirname);
	app.listen(port, () => {
	 	console.log("== Server is running on port", port);
	});
});
