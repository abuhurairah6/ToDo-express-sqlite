const SQLITE3 = require('sqlite3').verbose();

class Database {
	constructor(path) {
		this.path = path;
		this.db = {};
	}

	open() {
		// Init database
		return new Promise ((resolve, reject) => {
			this.db = new SQLITE3.Database(this.path, SQLITE3.OPEN_READWRITE, function(err) {
				if (err) {
					console.log(err.message);
				}else{
					resolve('Connected to database.');
				}
			});
		});
	}

	close() {
		return new Promise((resolve, reject) => {
			this.db.close();
		});
	}

	read(sql, params = []) {
		// Query data using each(), first callback (third argument) appends all rows into variable,
		// second callback (fourth argument) returns and calls initial callback function after all rows queried.

		let data = {
			res: [],
			err: []
		};

		return new Promise((resolve, reject) => {
			this.db.each(sql, params, function(err, rows) {
				if (err) {
					data['err'].push(err);
				}else {
					data['res'].push(rows);
				}
			}, () => {
				resolve(data);
			});			
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

	dml(sql, params = []) {
		let data = {
			res: [],
			err: []
		};

		return new Promise ((resolve, reject) => {
			this.db.run(sql, params, function(err) {
				if (err) {
					data['err'].push(err);
				}else {
					data['res'].push(200);
				}
				resolve(data);
			});
		});
	}
}

module.exports = {
	Database: Database
}