const mysql = require('mysql');

// Make MySQL database connection
const connection = mysql.createConnection({
    //host : '127.0.0.1:3306',
    host : 'local host',
    database : 'sys',
    user : 'root',
    password : 'sqlsql'
});

//create MySQL connection
connection.connect(function(error){
    if (error)
    {
        throw error;
    }
    else {
        console.log('MySQL is connected successfully')
    }
});

// publish MySQL database connection
module.exports = connection;
