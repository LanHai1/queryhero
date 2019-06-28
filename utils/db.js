const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'herodb'
});

connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

// 将数据库操作暴露出去
module.exports = {
    connection
}