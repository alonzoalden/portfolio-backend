const router = require('express').Router();

router.all('*', (req, res, next) => {
    if (req.headers.origin !== 'https://alonzoalden.com') {
		return res.end('Not allowed');
	}
    next();
});

router.use('/', require('./mailer'));

router.use(function(err, req, res, next){
	if(err.name === 'ValidationError'){
		return res.status(422).json({
			errors: Object.keys(err.errors).reduce(function(errors, key){
				errors[key] = err.errors[key].message;

				return errors;
			}, {})
		});
	}

	return next(err);
});

module.exports = router;