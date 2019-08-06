const router = require('express').Router();
const nodemailer = require("nodemailer");
const keys = require('./../../env-config');

const headers = (token) => {
	return { headers: { 'Authorization' : 'Bearer ' + token }};
}

//retreive listings/rides
router.post('/email', async (req, res, next) => {
	try {
		// async..await is not allowed in global scope, must use a wrapper
		async function main(){

			// Generate test SMTP service account from ethereal.email
			// Only needed if you don't have a real mail account for testing
			let testAccount = await nodemailer.createTestAccount();

			// create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
				host: keys.host,
				port: keys.port,
				secure: true, // true for 465, false for other ports
				auth: {
					user: keys.auth.user,
					pass: keys.auth.pass
				}
			});

			let info = await transporter.sendMail({
				from: req.body.from,
				to: 'alonzoalden@gmail.com', // list of receivers
				subject: 'New Inquiry From: alonzoalden.com', // Subject line
				//text: req.body.from + ' /n ' + req.body.text, // plain text body
				html: 'From: ' + req.body.from + ' <br /><br /> '
					+ 'Subject: ' + req.body.subject + ' <br /><br /> '
					+ 'Text: ' + req.body.text
			});

			console.log("Message sent: %s", info.messageId);
			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

			// Preview only available when sending through an Ethereal account
			console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		}

		await main().catch(console.error);
		res.send(200);
	}
	catch(e) {
		console.log(e);
	}
});

module.exports = router;