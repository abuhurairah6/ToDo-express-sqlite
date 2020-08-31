const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const session = require('../server/session');
const { insertLog } = require('./_dblog');
const db = require('./Database');
const dbPath = './api/db/ToDo.db';

router.use(async(req, res, next) => {
	// res.setHeader('Access-Control-Allow-Origin', '3000');
	let proc = req.url.replace('/', '').toUpperCase();
	let user_id = req.body['login-username'] ? req.body['login-username'].toUpperCase() : '<>';
	let token = req.cookies.tdtoken ? req.cookies.tdtoken : '<>';

	await insertLog('AUTH', proc, 'USER: ' + user_id + ' Token: ' + token);
	next();
});

router.post('/register', async(req, res) => {
	let user_id = req.body['register-username'].toUpperCase();
	let user_password = req.body['register-password'];
	let Conn = new db.Database(dbPath);

	await Conn.open();

	// Check user exists
	let sqlRead = 'SELECT CASE WHEN COUNT(*) != 0 THEN 0 ELSE 1 END AS "RES" FROM SYS_USER WHERE USER_USERID = ?';
	let data = await Conn.read(sqlRead, [user_id]);

	if (data['res'][0]['RES'] == 0) {
		Conn.close();
		return res.json({authenticate: false, status: '02'});
	}
	
	// Create new user and grant cookie token
	user_password = bcrypt.hashSync(user_password, SALTROUNDS);
	let sqlInsert = 'INSERT INTO SYS_USER (USER_USERID, USER_PASSWORD) VALUES (?, ?)';
	let data2 = await Conn.dml(sqlInsert, [user_id, user_password]);

	let sqlRead2 = 'SELECT USER_ID, USER_PASSWORD FROM SYS_USER WHERE USER_USERID = ?';
	let data3 = await Conn.read(sqlRead2, [user_id]);

	Conn.close();

	if (data2['err'].length == 0) {
		let token = await session.createSession(data3['res'][0]['USER_ID']);
		res.cookie('tdtoken', token, {maxAge: 24 * 60 * 60 * 1000}); // 1 day expiry
		return res.json({authenticate: true, status: '01'});
	} else {
		return res.json({authenticate: false, status: '11'});
	}
});

router.post('/authenticate', async(req, res) => {
	let user_id = req.body['login-username'].toUpperCase();
	let user_password = req.body['login-password'];
	let ret = false;
	let status = '';
	
	let sqlUpdate = 'UPDATE SYS_USER SET USER_LAST_LOGIN_DATE = DATETIME("now", "localtime") WHERE USER_USERID = ?';
	let Conn = new db.Database(dbPath);

	await Conn.open();

	let sqlRead = 'SELECT USER_ID, USER_PASSWORD FROM SYS_USER WHERE USER_USERID = ?';
	let data = await Conn.read(sqlRead, [user_id]);

	if (data['res'].length != 0) {
		if (bcrypt.compareSync(user_password, data['res'][0]['USER_PASSWORD'])) {
			ret = true;
			status = '01';
		} else {
			status = '04';
		}
	} else {
		status = '03';
	}

	if (ret) {
		await Conn.dml(sqlUpdate, [user_id]);
		Conn.close();
		
		let token = await session.createSession(data['res'][0]['USER_ID']);

		res.cookie('tdtoken', token, {maxAge: 24 * 60 * 60 * 1000}); // 1 day expiry
		return res.json({authenticate: ret, status: status});

	} else {
		Conn.close();
		return res.json({authenticate: ret, status: status});
	}
});

router.post('/logout', async(req, res) => {
	let token = req.cookies.tdtoken;
	let status = '';
	let unauth = false;

	let ret = await session.revokeAuth(token);
	
	if (ret['err'].length == 0) {
		status = '01';
		unauth = true;
	} else {
		status = '11';
	}

	res.clearCookie('tdtoken');
	return res.json({unauth: unauth, status: status});
});

module.exports = router;