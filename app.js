const express = require('express');
const router = require('./api/router');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/api', router);

app.get('/*', function(req,res){
	res.sendStatus(404);
});

app.listen(port, function() {
	console.log(`Listening in port ${port}`);
});
