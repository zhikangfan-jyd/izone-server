var dbutils = require('./dbutil.js');

/**
 * 插入点赞表单
 * @param {*} account 账号
 * @param {*} dynamic_id 说说id
 * @param {*} success 
 * @param {*} fail 
 */
function insertIntoPraise(account,dynamic_id,success,fail) {
    var params = [account,dynamic_id];
    var sql = 'INSERT INTO praise_table (account,dynamic_id) VALUES (?,?)';
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
 * 查询当前帐户有没有点赞
 * @param {*} account 
 * @param {*} dynamic_id 
 * @param {*} success 
 * @param {*} fail 
 */
function getPraise(account,dynamic_id,success,fail) {
    var sql = 'SELECT * FROM praise_table WHERE account=' + account + ' AND dynamic_id=' + dynamic_id;
    var createConnect = dbutils.createConnect();
    createConnect.query(sql,function (error,res) {
        if (!error) {
            success(res)
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}

/**
 * 取消点赞
 * @param {*} account 
 * @param {*} dynamic_id 
 * @param {*} success 
 * @param {*} fail 
 */
function deletePraise(account,dynamic_id,success,fail) {
    var sql = 'DELETE FROM praise_table WHERE account=' + account + ' AND dynamic_id=' + dynamic_id;
    var createConnect = dbutils.createConnect();
    createConnect.query(sql,function (error,res) {
        if (!error) {
            success(res)
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}
module.exports = {
    insertIntoPraise,
    getPraise,
    deletePraise
}

