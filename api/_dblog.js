const db = require('./Database');
const dbPath = './api/db/ToDo.db';

async function insertLog(cat, proc, desc) {
	let Conn = new db.Database(dbPath);
	await Conn.open();

	let sqlInsert = 'INSERT INTO SYS_LOG (LOG_CAT, LOG_PROC, LOG_DESC) VALUES (?, ?, ?)';
	await Conn.dml(sqlInsert, [cat, proc, desc]);
	
	Conn.close();
}

async function deleteLog() {
	let Conn = new db.Database(dbPath);
	await Conn.open();

	let sqlInsert = 'DELETE FROM SYS_LOG WHERE LOG_DATETIME < DATETIME("NOW", "localtime", "-7 days")';

	insertLog('SYS', 'PURGE', '<>');
	await Conn.dml(sqlInsert);
	
	Conn.close();
}

module.exports = {
	insertLog: insertLog,
	deleteLog: deleteLog
}