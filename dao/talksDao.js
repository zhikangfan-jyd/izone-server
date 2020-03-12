var dbutils = require('./dbutil.js');
/**
 * 插入评论
 * @param {*} dynamic_id 说说id
 * @param {*} parentAccount 评论账号
 * @param {*} parentNickname 该评论账号昵称
 * @param {*} content 内容
 * @param {*} ctime 发表时间
 * @param {*} imgpath 评论账号头像信息
 * @param {*} success 成功回调
 * @param {*} fail 错误回调
 */
function insertTalks(dynamic_id,parentAccount,parentNickname,content,ctime,imgpath,success,fail) {
    var params = [dynamic_id,parentAccount,parentNickname,content,ctime,imgpath];
    var sql = 'INSERT INTO talks_table (dynamic_id,parentAccount,parentNickname,content,ctime,imgpath) VALUES (?,?,?,?,?,?)'
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
 * 查询说说全部评论
 * @param {*} dynamic_id 
 * @param {*} success 
 * @param {*} fail 
 */
function selectTalks(start,limit,dynamic_id,success,fail) {
    var sql = 'SELECT * FROM talks_table WHERE dynamic_id=' + dynamic_id +  ' limit ' + start + ',' + limit;
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
 * 根据talks_id去查询某一条评论
 * @param {*} talks_id 
 * @param {*} success 
 * @param {*} fail 
 */
function selectOneTalks(talks_id,success,fail) {
    var sql = 'SELECT * FROM talks_table WHERE id=' + talks_id;
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
 * 删除某一条评论
 * @param {*} talk_id 评论id
 * @param {*} success 成功回调
 * @param {*} fail 错误回调
 */
function deleteOneTalk(talk_id,success,fail) {
    var sql = 'DELETE FROM talks_table WHERE id=' + talk_id;
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
 * 删除说说下的全部评论
 * @param {*} dynamic_id 说说id
 * @param {*} success 成功回调
 * @param {*} fail 错误回调
 */
function deleteAllTalk(dynamic_id,success,fail) {
    var sql = 'DELETE FROM talks_table WHERE dynamic_id=' + dynamic_id;
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
    insertTalks,
    selectTalks,
    selectOneTalks,
    deleteOneTalk,
    deleteAllTalk
}

