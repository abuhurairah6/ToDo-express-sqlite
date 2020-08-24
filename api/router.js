const express = require('express');
const router = express.Router();
const db = require('./Database');
const dbPath = './api/db/ToDo.db';

router.use(function(req, res, next) {
	// res.setHeader('Access-Control-Allow-Origin', '3000');
	next();
});

router.get('/', function(req, res){
	let userid = req.body['sess_userid'];
	
	let Conn = new db.Database(dbPath);
	let sqlNote = 'SELECT NOTE_ID, NOTE_MSG, NOTE_WGT, NOTE_ACTV FROM USER_NOTE WHERE NOTE_USER_ID = ?';
	let sqlUser = 'SELECT USER_USERID FROM SYS_USER WHERE USER_ID = ?';

	Conn.read(sqlNote, function(data) {
		Conn.read(sqlUser, function(data2) {
			Conn.close();
			res.json({notes: data['res'], user: data2['res'][0]['USER_USERID']});
		}, [userid]);
	}, [userid]);
});

router.post('/insert', function(req, res){
	let note_msg = req.body['form_msg'];
	let note_wgt = req.body['form_weight'] === '' ? 0 : req.body['form_weight'];
	let note_user = req.body['sess_userid'];

	let Conn = new db.Database(dbPath);
	let sql = 'INSERT INTO USER_NOTE (NOTE_MSG, NOTE_WGT, NOTE_USER_ID) VALUES (?, ?, ?)';
	let sql2 = 'SELECT * FROM USER_NOTE WHERE NOTE_USER_ID = ? ORDER BY NOTE_ID DESC LIMIT 1';

	Conn.dml(sql, function(data) {
		Conn.read(sql2, function(data2) {
			Conn.close();
			res.json(data2['res']);
		}, [note_user]);
	}, [note_msg, note_wgt, note_user])
});

router.post('/update', function(req, res){
	let note_id = req.body['form_id'];
	let note_msg = req.body['form_msg'];
	let note_wgt = req.body['form_weight'] === '' ? 0 : req.body['form_weight'];
	let note_actv = req.body['form_actv'] === '' ? 'Y' : req.body['form_actv'];

	let Conn = new db.Database(dbPath);
	let sql = 'UPDATE USER_NOTE SET NOTE_MSG = ?, NOTE_WGT = ?, NOTE_ACTV = ? WHERE NOTE_ID = ?';
	let sql2 = 'SELECT * FROM USER_NOTE WHERE NOTE_ID = ?';

	Conn.dml(sql, function(data) {
		Conn.read(sql2, function(data2) {
			Conn.close();
			res.json(data2['res']);
		}, [note_id]);
	}, [note_msg, note_wgt, note_actv, note_id]);
});

router.post('/delete', function(req, res){
	let note_id = req.body['form_id'];

	let Conn = new db.Database(dbPath);
	let sql = 'DELETE FROM USER_NOTE WHERE NOTE_ID = ?';

	Conn.dml(sql, function(data) {
		Conn.close();
		res.json(data['res']);
	}, [note_id]);
});

module.exports = router;