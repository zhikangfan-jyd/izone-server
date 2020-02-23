var dbutils = require('./dbutil.js');

/**
 * 插入关注表
 * @param {String} originAccount 原账号
 * @param {String} targetAccount 关注的账号
 * @param {Number} ctime 关注时间
 * @param {Function} success 成功回调
 * @param {Function} fail 错误回调
 */
function insertIntoAttentionTable(originAccount,targetAccount,ctime,success,fail) {
    var params = [originAccount,targetAccount,ctime];
    var sql = 'INSERT INTO attention_table (originAccount,targetAccount,ctime) VALUES (?,?,?)';
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
 * 根据账号去查询关注的人
 * @param {String} account 查询的账号
 * @param {Function} success 成功回调
 * @param {Function} fail 错误回调
 */
function getAttentionByAccount(account,success,fail) {
    var sql = 'SELECT * FROM attention_table where originAccount=' + account;
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
 * 根据账号删除关注的那个账号
 * @param {*} originAccount 源账号
 * @param {*} targetAccount 关注的账号
 * @param {*} success 成功回调
 * @param {*} fail 错误回调
 */
function deleteAttentionByAccount(originAccount,targetAccount,success,fail) {
    var sql = 'DELETE FROM attention_table WHERE originAccount=' + originAccount + ' AND targetAccount=' + targetAccount;
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
    insertIntoAttentionTable,
    getAttentionByAccount,
    deleteAttentionByAccount
}

