const express = require('express');
const router = express.Router();
const { insertLog } = require('./_dblog.js');
const db = require('./Database');
const dbPath = './api/db/ToDo.db';

router.use(async(req, res, next) => {
	// res.setHeader('Access-Control-Allow-Origin', '3000');
	let proc = req.url.replace('/', '').toUpperCase();
	if (proc == '') {
		proc = 'QUERY';
	}
	
	await insertLog('API', proc, JSON.stringify(req.body));
	next();
});

router.get('/', async(req, res) => {
	let userid = req.body['sess_userid'];
	
	let Conn = new db.Database(dbPath);
	await Conn.open();

	let sqlRead = 'SELECT NOTE_ID, NOTE_MSG, NOTE_WGT, NOTE_ACTV, USER_USERID FROM SYS_USER LEFT JOIN USER_NOTE ON USER_ID = NOTE_USER_ID WHERE USER_ID = ?';
	let data = await Conn.read(sqlRead, [userid]);

	Conn.close();

	let notes = [];
	let user = data['res'][0]['USER_USERID'];

	for (let i = 0; i < data['res'].length; i++) {
		if (data['res'][i]['NOTE_ID'] != null) {
			notes.push(data['res'][i]);
		}
	}
	
	res.json({notes: notes, user: user});
});

router.post('/insert', async(req, res) => {
	let note_msg = req.body['form_msg'];
	let note_wgt = req.body['form_weight'] === '' ? 0 : req.body['form_weight'];
	let note_user = req.body['sess_userid'];

	let Conn = new db.Database(dbPath);
	await Conn.open();

	let sqlInsert = 'INSERT INTO USER_NOTE (NOTE_MSG, NOTE_WGT, NOTE_USER_ID) VALUES (?, ?, ?)';
	let data = await Conn.dml(sqlInsert, [note_msg, note_wgt, note_user])
	
	let sqlRead = 'SELECT * FROM USER_NOTE WHERE NOTE_USER_ID = ? ORDER BY NOTE_ID DESC LIMIT 1';
	let ret = await Conn.read(sqlRead, [note_user]);
	
	Conn.close();
	res.json(ret['res']);

});

router.post('/update', async(req, res) => {
	let note_id = req.body['form_id'];
	let note_msg = req.body['form_msg'];
	let note_wgt = req.body['form_weight'] === '' ? 0 : req.body['form_weight'];
	let note_actv = req.body['form_actv'] === '' ? 'Y' : req.body['form_actv'];

	let Conn = new db.Database(dbPath);
	await Conn.open();

	let sqlUpdate = 'UPDATE USER_NOTE SET NOTE_MSG = ?, NOTE_WGT = ?, NOTE_ACTV = ? WHERE NOTE_ID = ?';
	let data = await Conn.dml(sqlUpdate, [note_msg, note_wgt, note_actv, note_id])
	
	let sqlRead = 'SELECT * FROM USER_NOTE WHERE NOTE_ID = ?';
	let ret = await Conn.read(sqlRead, [note_id]);
	
	Conn.close();
	res.json(ret['res']);
});

router.post('/delete', async(req, res) => {
	let note_id = req.body['form_id'];

	let Conn = new db.Database(dbPath);
	await Conn.open();

	let sqlDelete = 'DELETE FROM USER_NOTE WHERE NOTE_ID = ?';
	let ret = await Conn.read(sqlDelete, [note_id]);

	Conn.close();
	res.json(ret['res']);
});

module.exports = router;