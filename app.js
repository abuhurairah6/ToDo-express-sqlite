// Dependencies required
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

// Modules used
const memory = require('./api/Database');
const router = require('./api/router');
const session = require('./api/session');
const user = require('./api/user');

// Constant configuration
const memDbPath = ':memory:';
const port = 3000;

global.MEMORY = new memory.Database(memDbPath);
global.SALTROUNDS = 10;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
session.initSession();

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
app.use('/login', express.static(__dirname + '/login'));
app.use('/user', user);

app.use(function(req, res, next) {
	// session.logSession();

	let token = req.cookies.tdtoken;
	session.verifyAuth(token, function(data, ret) {
		if (!ret) {
			res.redirect('/login');
		} else {
			req.body['sess_userid'] = data['res'][0]['SESS_USERID'];
			next();
		}
	});
});

app.use('/', express.static(__dirname + '/public'));
app.use('/api', router);

app.get('/*', function(req,res){
	res.redirect('/');
});

app.post('/*', function(req, res) {
	res.sendStatus(404);
});

app.listen(port, function() {
	console.log(`Listening in port ${port}`);
});
