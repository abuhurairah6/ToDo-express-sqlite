const fs = require('fs');
const bcrypt = require('bcrypt');
const { EOL } = require('os');

async function initSession() {
	let sql = "CREATE TABLE IF NOT EXISTS SYS_SESSION (SESS_ID INTEGER PRIMARY KEY, SESS_USERID INTEGER NOT NULL, SESS_TOKEN TEXT NOT NULL, SESS_ISSUED_DATE DATE NOT NULL DEFAULT (DATETIME('now', 'localtime')), SESS_EXPIRY_DATE DATE NOT NULL DEFAULT (DATETIME('now', 'localtime', '+1 days')))";

	await MEMORY.open();
	await MEMORY.dml(sql);

	return;
}

async function createSession(userid, callback) {
	let sqlInsert = 'INSERT INTO SYS_SESSION (SESS_USERID, SESS_TOKEN) VALUES (?, ?)';
	let token = bcrypt.hashSync(String(Math.random()), SALTROUNDS);
	tokenHashed = bcrypt.hashSync(token, SALTROUNDS);

	await MEMORY.dml(sqlInsert, [userid, tokenHashed]);

	return token;
}

async function deleteExpiredSession() {
	let sqlDelete = 'DELETE FROM SYS_SESSION WHERE SESS_EXPIRY_DATE < DATETIME("NOW", "localtime")';

	await MEMORY.dml(sqlDelete);
}

async function createSessionLog() {
	let sqlSelect = 'SELECT * FROM SYS_SESSION';

	await MEMORY.read(sqlSelect)
		.then((res) => {
			let [ month, day, year ] = (new Date()).toLocaleDateString().split('/');
			let filename = 'session_' + year + '_' + month + '_' + day + '.log';
			let content = {};

			for (let i = 0; i < data['res'].length; i++) {
				content[i] = data['res'][i];
			}

			fs.appendFile(logFilePath + filename, JSON.stringify(content) + EOL, function(err) {
				// console.log('Created: ' + logFilePath + filename);
			});
		})
}

function deleteSessionLog() {
	fs.readdir(logFilePath, function(err, files) {
		for (let i = 0; i < files.length; i++) {
			fs.stat(logFilePath + files[i], function(err, stats) {
				let now = (new Date()).getTime();
				let ctime = stats.birthtimeMs +  (7 * 24 * 60 * 60 * 1000);
				// let ctime = stats.birthtimeMs + (1.5 * 60 * 1000);

				if (ctime < now) {
					fs.unlink(logFilePath + files[i], function(err) {
						// console.log('Deleted: ' + logFilePath + files[i]);
					});
				}
			});
		}
	});
}

async function verifyAuth(token, callback) {
	let sqlSelect = 'SELECT SESS_USERID, SESS_TOKEN FROM SYS_SESSION';
	let ret = false;
	
	let data = await MEMORY.read(sqlSelect)

	for (let i = 0; i < data['res'].length; i++) {
		if (bcrypt.compareSync(String(token), data['res'][i]['SESS_TOKEN'])) {
			ret = true;
			data = data['res'][i];
			break;
		}
	}
	
	return [data, ret];
}

async function revokeAuth(token, callback) {
	let ret = {err: 1};
	let sqlSelect = 'SELECT SESS_TOKEN FROM SYS_SESSION';
	let sqlDelete = 'DELETE FROM SYS_SESSION WHERE SESS_TOKEN = ?';
	let data = await MEMORY.read(sqlSelect)
	
	for (let i = 0; i < data['res'].length; i++) {

		if (bcrypt.compareSync(String(token), data['res'][i]['SESS_TOKEN'])) {
			ret = await MEMORY.dml(sqlDelete, [data['res'][i]['SESS_TOKEN']]);
			break;
		}
	}

	console.log(ret);

	return ret;
}

module.exports = {
	initSession: initSession,
	createSessionLog: createSessionLog,
	createSession: createSession,
	deleteExpiredSession: deleteExpiredSession,
	deleteSessionLog: deleteSessionLog,
	verifyAuth: verifyAuth,
	revokeAuth: revokeAuth
}