var dbutils = require('./dbutil.js');
/**
 * 注册管理员
 * @param {*} account 
 * @param {*} password 
 * @param {*} success 
 * @param {*} fail 
 */
function insertAdmin(account,password,success,fail) {
    var params = [account,password];
    var sql = 'INSERT INTO admin_table (admin_account,admin_password) VALUES (?,?)';
    var createConnect = dbutils.createConnect();
    createConnect.query(sql,params,function (error,res) {
        if (!error) {
            success(res)
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}
/**
 * 查询管理员账号信息
 * @param {*} account 
 * @param {*} success 
 * @param {*} fail 
 */
function selectAdmin(account,success,fail) {
    var params = [account];
    var sql = 'SELECT * FROM admin_table WHERE admin_account = ?';
    var createConnect = dbutils.createConnect();
    createConnect.query(sql,params,function (error,res) {
        if (!error) {
            success(res)
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}

/**
 * 根据管理员账号去更改密码
 * @param {*} account 
 * @param {*} password 
 * @param {*} success 
 * @param {*} fail 
 */
function updatePasswordByAccount(account,password,success,fail) {
    var params = [password,account]
    var sql = 'UPDATE admin_table SET admin_password = ? WHERE admin_account = ?';
    var createConnect = dbutils.createConnect();
    createConnect.query(sql,params,function (error,res) {
        if (!error) {
            success(res)
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}
/**
 * 注销管理员账号
 * @param {*} account 
 * @param {*} success 
 * @param {*} fail 
 */
function deleteAdmin(account,success,fail) {
    var params = [account];
    var sql = 'DELETE FROM admin_table WHERE admin_account = ?';
    var createConnect = dbutils.createConnect();
    createConnect.query(sql,params,function (error,res) {
        if (!error) {
            success(res)
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}

module.exports = {
    insertAdmin,
    selectAdmin,
    updatePasswordByAccount,
    deleteAdmin
}