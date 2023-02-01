const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

const app = express();

const port = process.env.port || 5000;

//parsing middleware
//parse application /x-www-from-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());
//static files
app.use(express.static('public'));

//template engine
// Update to 6.0.X
const handlebars = exphbs.create({ extname: '.hbs' });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

//connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//connect to db
pool.getConnection((err,connection)=>{
    if(err) throw err;
    console.log('coonected as ID' + connection.threadId);
});

const routes = require('./server/routes/user');
app.use('/',routes);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
