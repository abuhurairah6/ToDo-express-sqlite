const db = require('./Database');
const dbPath = './api/db/ToDo.db';

function insertLog(cat, proc, desc) {
	let Conn = new db.Database(dbPath);
	let sqlInsert = 'INSERT INTO SYS_LOG (LOG_CAT, LOG_PROC, LOG_DESC) VALUES (?, ?, ?)';

	Conn.dml(sqlInsert, function(data) {
		Conn.close();
	}, [cat, proc, desc]);
}

function deleteLog() {
	let Conn = new db.Database(dbPath);
	let sqlInsert = 'DELETE FROM SYS_LOG WHERE LOG_DATETIME < DATETIME("NOW", "localtime", "-7 days")';

	insertLog('SYS', 'PURGE', '<>');

	Conn.dml(sqlInsert, function(data) {
		Conn.close();
	});	
}

module.exports = {
	insertLog: insertLog,
	deleteLog: deleteLog
}