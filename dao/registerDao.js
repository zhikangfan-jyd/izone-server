var dbutil = require('./dbutil');

//用于插入用户注册信息
function insertIntoRegister (account,sex,nickname,birthday,password,ctime,imgpath,success) {
    var params = [account,sex,nickname,birthday,password,ctime,imgpath];
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    var sql = 'insert into register (account,sex,nickname,birthday,password,ctime,imgpath) values (?,?,?,?,?,?,?)'
    createConnect.query(sql,params,function (error,result) {
        if (!error) {
            success(result);
        } else {
            console.log(error);
        }
    })
    createConnect.end();
}

// 查询账号注册信息

function queryRegisterByAccount (account,success) {
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    var sql = 'select * from register where account=' + account;
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            console.log(error);
        }
    })
    createConnect.end();
}

module.exports = {
    insertIntoRegister,
    queryRegisterByAccount
}