// Dependencies required
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

// Modules used
const memory = require('./api/Database');
const router = require('./api/router');
const login = require('./api/login');
const auth = require('./api/authFunc');

// Constant configuration
const memDbPath = ':memory:';
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

global.MEMORY = new memory.Database(memDbPath);
auth.initSession();

app.use('/login', function(req, res, next) {
	let token = req.cookies.tdtoken;
	auth.verifyAuth(token, function(data) {
		if (data) {
			res.redirect('/');
		} else {
			res.cookie('tdtoken', auth.createToken());
			next();
		}
	});
});

app.use('/login', express.static(__dirname + '/login'));
app.use('/auth', login);

app.use(function(req, res, next) {
	let token = req.cookies.tdtoken;

	auth.verifyAuth(token, function(data) {
		if (!data) {
			res.redirect('/login');
		} else {
			next();
		}
	});
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/', express.static(__dirname + '/public'));
app.use('/api', router);

app.get('/*', function(req,res){
	res.redirect('/');
});

app.listen(port, function() {
	console.log(`Listening in port ${port}`);
});
