const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const session = require('./session');
const db = require('./Database');
const dbPath = './api/db/ToDo.db';

router.use(function(req, res, next) {
	// res.setHeader('Access-Control-Allow-Origin', '3000');
	next();
});

router.post('/register', function(req, res) {
	console.log(req.body);
	let user_id = req.body['register-username'].toUpperCase();
	let user_password = req.body['register-password'];

	user_password = bcrypt.hashSync(user_password, SALTROUNDS);

	let Conn = new db.Database(dbPath);
	let sqlRead = 'SELECT CASE WHEN COUNT(*) != 0 THEN 0 ELSE 1 END AS "RES" FROM SYS_USER WHERE USER_USERID = ?';
	let sqlInsert = 'INSERT INTO SYS_USER (USER_USERID, USER_PASSWORD) VALUES (?, ?)';

	Conn.read(sqlRead, function(data) {
		if (data['res'][0]['RES'] == 0) {
			return res.json({authenticate: false, status: '02'});
		}

		Conn.dml(sqlInsert, function(data) {
			Conn.close();

			if (data['err'].length == 0) {
				session.createSession(user_id, function(token) {
					res.cookie('tdtoken', token);
					// res.redirect('/');
					return res.json({authenticate: true, status: '01'});
				});
			} else {
				// Throw exception
				// res.redirect('/login');
				return res.json({authenticate: false, status: '11'});
			}

		}, [user_id, user_password])
	}, [user_id]);
});

router.post('/authenticate', function(req, res) {
	console.log(req.body);

	let user_id = req.body['login-username'].toUpperCase();
	let user_password = req.body['login-password'];
	
	let Conn = new db.Database(dbPath);
	let sql = 'SELECT USER_PASSWORD FROM SYS_USER WHERE USER_USERID = ?';

	Conn.read(sql, function(data) {
		Conn.close();
		let ret = false;
		let status = '';

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
			session.createSession(user_id, function(token) {
				res.cookie('tdtoken', token);
				// res.redirect('/');
				return res.json({authenticate: ret, status: status});
			});
		} else {
			// res.redirect('/login');
			return res.json({authenticate: ret, status: status});
		}
		

	}, [user_id]);
});

module.exports = router;