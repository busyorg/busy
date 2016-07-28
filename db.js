var mysql = require('mysql');
var con = mysql.createConnection(process.env.JAWSDB_URL);
con.connect();

module.exports = con;