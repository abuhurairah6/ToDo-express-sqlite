const express = require('express');
const router = express.Router();
const db = require('./Database');

router.get('/', function(req, res){
	console.log(req.query);
	
	let Conn = new db.Database();
	let sql = 'SELECT * FROM USER_NOTE';

	Conn.read(sql, function(data) {
		Conn.close();
		res.json(data);
	});
});

router.post('/insert', function(req, res){
	console.log(req.body);
	let note_msg = req.body['form_notes'];
	let note_wgt = req.body['form_weight'] === '' ? 0 : req.body['form_weight'];

	let Conn = new db.Database();
	let sql = 'INSERT INTO USER_NOTE (NOTE_MSG, NOTE_WGT) VALUES (?, ?)';

	Conn.dml(sql, function(data) {
		Conn.close();
		res.json(data);
	}, [note_msg, note_wgt]);
});

router.post('/update', function(req, res){
	console.log(req.body);
	let note_id = req.body['form_id'];
	let note_msg = req.body['form_notes'];
	let note_wgt = req.body['form_weight'] === '' ? 0 : req.body['form_weight'];
	let note_actv = req.body['form_actv'] === '' ? 'Y' : req.body['form_actv'];

	let Conn = new db.Database();
	let sql = 'UPDATE USER_NOTE SET NOTE_MSG = ?, NOTE_WGT = ?, NOTE_ACTV = ? WHERE NOTE_ID = ?';

	Conn.dml(sql, function(data) {
		Conn.close();
		res.json(data);
	}, [note_msg, note_wgt, note_actv, note_id]);
});

router.post('/delete', function(req, res){
	console.log(req.body);
	let note_id = req.body['form_id'];

	let Conn = new db.Database();
	let sql = 'DELETE FROM USER_NOTE WHERE NOTE_ID = ?';

	Conn.dml(sql, function(data) {
		Conn.close();
		res.json(data);
	}, [note_id]);
});

module.exports = router;