const SQLITE3 = require('sqlite3').verbose();

class Database {
	constructor() {
		// Init database
		this.db = new SQLITE3.Database('./api/db/ToDo.db', SQLITE3.OPEN_READWRITE, function(err) {
			if (err) {
				console.log(err.message);
			}else{
				console.log('Connected to ToDo database.');
			}
		});
	}

	close() {
		this.db.close(function(err) {
			if (err) {
				console.log(err.message);
			}else{
				console.log('Closed ToDo database.');
			}
		});
	}

	read(sql, callback, params = []) {
		// Query data using each(), first callback (third argument) appends all rows into variable,
		// second callback (fourth argument) returns and calls initial callback function after all rows queried.

		var data = [];
		this.db.each(sql, params, function(err, rows) {
			if (err) {
				data.push(err);
			}else {
				data.push(rows);
			}
		}, function() {
			callback(data);
		});

		/*
		// Alternative method to query data using all()
		
		this.db.all(sql, [], function(err, rows) {
			if (err) {
				data.push(err);
			}else {
				data.push(rows);
			}
			callback(data);
		});
		*/
	}

	dml(sql, callback, params = []) {
		var data = [];
		this.db.run(sql, params, function(err) {
			if (err) {
				data.push(err);
			}else {
				data.push(200);
			}
			callback(data);
		});
	}
}

module.exports = {
	Database: Database
}