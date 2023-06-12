const mysql = require('mysql');

// Make MySQL database connection
const connection = mysql.createConnection({
    host : 'localhost',
    database : 'ESC Database',
    user : 'root',
    password : ''
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
