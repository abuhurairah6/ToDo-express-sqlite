function initSession(callback = function() {}) {
	let sql = "CREATE TABLE IF NOT EXISTS SYS_SESSION (SESS_ID INTEGER PRIMARY KEY, SESS_USERID TEXT, SESS_TOKEN INTEGER, SESS_ISSUED_DATE DATE NOT NULL DEFAULT (DATETIME('now', 'localtime')), SESS_EXPIRY_DATE DATE NOT NULL DEFAULT (DATETIME('now', 'localtime', '+7 days')))";
	MEMORY.dml(sql, function(err) {
		// console.log(err);
		callback();
	});
}

function createToken() {
	let sqlInsert = 'INSERT INTO SYS_SESSION (SESS_TOKEN) VALUES (?)';
	let sqlSelect = 'SELECT * FROM SYS_SESSION';
	let token = Math.random();

	MEMORY.dml(sqlInsert, function(data) {
		MEMORY.read(sqlSelect, function(data) {
			console.log(data);
		});
	}, [token]);

	return token;
}

function verifyAuth(token, callback) {
	let sqlSelect = 'SELECT COUNT(*) FROM SYS_SESSION WHERE SESS_TOKEN = ?';

	MEMORY.read(sqlSelect, function(data) {
		let ret = data[0] ? data[0]['COUNT(*)'] > 0 : false;
		callback(ret);
	}, [token]);
}

module.exports = {
	initSession: initSession,
	createToken: createToken,
	verifyAuth: verifyAuth
}