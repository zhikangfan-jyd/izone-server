var dbutils = require('./dbutil.js');

/**
 * 插入某篇说说当中的某个评论的回复
 * @param {*} dynamic_id 
 * @param {*} talk_id 
 * @param {*} parentAccount 
 * @param {*} parentNickname 
 * @param {*} parentImgpath 
 * @param {*} childAccount 
 * @param {*} childNickname 
 * @param {*} replyContent 
 * @param {*} ctime 
 */
function insertReply(dynamic_id,talk_id,parentAccount,parentNickname,parentImgpath,childAccount,childNickname,replyContent,ctime,success,fail) {
    var params = [dynamic_id,talk_id,parentAccount,parentNickname,parentImgpath,childAccount,childNickname,replyContent,ctime];
    var sql = 'INSERT INTO reply_table (dynamic_id,talks_id,parentAccount,parentNickname,parentImgpath,childAccount,childNickname,content,ctime) VALUES (?,?,?,?,?,?,?,?,?)'
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
 * 查询某条评论下的所有回复评论
 * @param {*} talks_id 评论id
 * @param {*} success 
 * @param {*} fail 
 */
function selectReply(talks_id,success,fail) {
    var sql = 'SELECT * FROM reply_table WHERE talks_id=' + talks_id;
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
 * 根据id去查询某条回复评论
 * @param {*} reply_id 
 * @param {*} success 
 * @param {*} fail 
 */
function selectOneReply(reply_id,success,fail) {
    var sql = 'SELECT * FROM reply_table WHERE id=' + reply_id;
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
 * 删除某篇说说下的某条评论的回复
 * @param {*} reply_id 回复评论id
 * @param {*} success 
 * @param {*} fail 
 */
function deleteOneReply(reply_id,success,fail) {
    var sql = 'DELETE FROM reply_table WHERE id=' + reply_id;
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
 * 删除某条评论下的所有评论
 * @param {*} talks_id 评论id
 * @param {*} success 
 * @param {*} fail 
 */
function deleteAllReplyByTalks_id(talks_id,success,fail) {
    var sql = 'DELETE FROM reply_table WHERE talks_id=' + talks_id;
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
 * 根据说说id去删除所有的回复评论
 * @param {*} dynamic_id 
 * @param {*} success 
 * @param {*} fail 
 */
function deleteAllReplyByDynamic_id(dynamic_id,success,fail) {
    var sql = 'DELETE FROM reply_table WHERE dynamic_id=' + dynamic_id;
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
    insertReply,
    selectReply,
    selectOneReply,
    deleteOneReply,
    deleteAllReplyByTalks_id,
    deleteAllReplyByDynamic_id
}

