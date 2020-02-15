var mysql = require('mysql');

function createConnect () {
    var connect = mysql.createConnection({
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '990320',
        database: 'zone'
    })
    return connect;
}

module.exports = {
    createConnect
}



