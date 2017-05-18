var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();
// Serve files from public folder. That's where all of our HTML, CSS and Angular JS are.
app.use(express.static('public'));
// This allows us to accept JSON bodies in POSTs and PUTs.
app.use(bodyParser.json());

// TODO Set up access to the database via a connection pool. You will then use
// the pool for the tasks below.
var pool = new pg.Pool({
	user: 'postgres',
	password: 'SQLpassword',
	host: 'localhost',
	port: 5432,
	database: 'postgres',
	ssl: false
})

// GET /api/items - responds with an array of all items in the database.
// TODO Handle this URL with appropriate Database interaction.
app.get('/api/items', function(req, res) {
	pool.query('SELECT * FROM shoppingcart').then(function(result) {
		res.send(result.rows);
	}).catch(errorCallback(res));
});

// POST /api/items - adds and item to the database. The items name and price
// are available as JSON from the request body.
// TODO Handle this URL with appropriate Database interaction.
app.post('/api/items', function(req, res) {
	var item = req.body; 
	var sql = 'INSERT INTO shoppingcart(product, price, quantity)' + 'VALUES ($1::text, $2::decimal, $3::int)';
	var values = [item.product, item.price, item.quantity];
	
	pool.query(sql, values).then(function() {
		res.status(201);
		res.send('INSERTED');
	}).catch(errorCallback(res));
});

// DELETE /api/items/{ID} - delete an item from the database. The item is
app.delete('/api/items/:id', function(req, res) {
	var id = req.params.id;
	pool.query('DELETE FROM shoppingcart WHERE id=$1::int', [id]).then(function() {
		res.send('DELETED');
	}).catch(errorCallback(res));
});


// selected via the {ID} part of the URL.
// TODO Handle this URL with appropriate Database interaction.
app.get('/api/items/:id', function(req, res) {
    var id = req.params.id; 
    pool.query("SELECT * FROM shoppingcart WHERE id = $1::int", [id]).then(function(result) {
        if (result.rowCount === 0) {
            res.status(404); 
            res.send("NOT FOUND");
        } else {
            res.send(result.rows[0]);
        }
    }).catch(errorCallback(res));
});



function errorCallback(res) {
	return function(err) {
		console.log(err);
		res.status(500);
		res.send('ERROR');
	}
}

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('JSON Server is running on ' + port);
});
