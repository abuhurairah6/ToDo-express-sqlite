// Dependencies required
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const app = express();

// Modules used
const memory = require('./api/Database');
const router = require('./api/router');
const session = require('./server/session');
const user = require('./api/user');

// Constant configuration
const memDbPath = ':memory:';
const port = 3000;

global.MEMORY = new memory.Database(memDbPath);
global.SALTROUNDS = 10;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

cron.schedule('01 00 * * *', function() {
	session.clearExpiredSession(function(data) {
		// console.log(data);
	});
	session.logSession();
});

session.initSession();

// Logging
app.use(function(req, res, next) {
	// console.log('Requesting to: ' + req.url + '; Method: ' + req.method + '; Query: ' + JSON.stringify(req.query) + '; Body: ' + JSON.stringify(req.body));
	next();
});

app.use('/login', function(req, res, next) {
	let token = req.cookies.tdtoken;
	session.verifyAuth(token, function(data, ret) {
		if (ret) {
			res.redirect('/');
		} else {
			next();
		}
	});
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/util', express.static(__dirname + '/public/_util'));
app.use('/login', express.static(__dirname + '/public/login'));
app.use('/user', user);

app.use(function(req, res, next) {
	let token = req.cookies.tdtoken;
	session.verifyAuth(token, function(data, ret) {
		if (!ret) {
			res.redirect('/login');
		} else {
			req.body['sess_userid'] = data['SESS_USERID'];
			next();
		}
	});
});

app.use('/main', express.static(__dirname + '/public/main'));
app.use('/api', router);

app.get('/*', function(req,res){
	res.redirect('/main');
});

app.post('/*', function(req, res) {
	res.sendStatus(404);
});

app.listen(port, function() {
	console.log(`Listening in port ${port}`);
});
