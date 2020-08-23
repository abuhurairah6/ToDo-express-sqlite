const bcrypt = require('bcrypt');

function initSession(callback = function() {}) {
	let sql = "CREATE TABLE IF NOT EXISTS SYS_SESSION (SESS_ID INTEGER PRIMARY KEY, SESS_USERID TEXT NOT NULL, SESS_TOKEN TEXT NOT NULL, SESS_ISSUED_DATE DATE NOT NULL DEFAULT (DATETIME('now', 'localtime')), SESS_EXPIRY_DATE DATE NOT NULL DEFAULT (DATETIME('now', 'localtime', '+1 days')))";
	MEMORY.dml(sql, function(err) {
		// console.log(err);
		callback();
	});
}

function logSession() {
	let sqlSelect = 'SELECT * FROM SYS_SESSION';

	MEMORY.read(sqlSelect, function(data) {
		console.log('Session available =>');
		console.log(data['res']);
	})
}

function createSession(userid, callback) {
	let sqlInsert = 'INSERT INTO SYS_SESSION (SESS_USERID, SESS_TOKEN) VALUES (?, ?)';
	let token = String(Math.random());
	tokenHashed = bcrypt.hashSync(token, SALTROUNDS);

	MEMORY.dml(sqlInsert, function(data) {
		callback(token);
	}, [userid, tokenHashed]);
}

function verifyAuth(token, callback) {
	let sqlSelect = 'SELECT SESS_USERID, SESS_TOKEN FROM SYS_SESSION';

	MEMORY.read(sqlSelect, function(data) {
		let ret = false;

		for (let i = 0; i < data['res'].length; i++) {
			if (bcrypt.compareSync(String(token), data['res'][i]['SESS_TOKEN'])) {
				ret = true;
				break;
			}
		} 

		callback(data, ret);
	});
}


module.exports = {
	initSession: initSession,
	logSession: logSession,
	createSession: createSession,
	verifyAuth: verifyAuth
}