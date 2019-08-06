const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const errorhandler = require('errorhandler');

const key = require('./env-config.js');

const isProduction = process.env.NODE_ENV === 'production';
const isSQL = process.argv.slice(2)[0] === 'sql';

//Global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/dist'));

app.use(session({ secret: 'pickup', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
	app.use(errorhandler());
}

app.use(cors({
	origin: 'https://alonzoalden.com'
}));

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
	app.use(function(err, req, res, next) {
		console.log(err.stack);

		res.status(err.status || 500);

		res.json({'errors': {
			message: err.message,
			error: err
		}});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({'errors': {
		message: err.message,
		error: {}
	}});
});

//starting server
app.listen(3001, function () {
	console.log('DEV server listening on port 3001!');
});

module.exports = app;