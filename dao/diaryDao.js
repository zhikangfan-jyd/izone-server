var dbutils = require('./dbutil.js');
/**
 * 插入成长日记
 * @param {*} content 
 * @param {*} ctime 
 * @param {*} success 
 * @param {*} fail 
 */
function insertIntoDiary(content,ctime,success,fail) {
    var params = [content,ctime];
    var sql = 'INSERT INTO diary_table (content,ctime) VALUES (?,?)';
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
 * 查询成长日记
 * @param {*} success 
 * @param {*} fail 
 */
function selectDiary(success,fail) {
    var sql = 'SELECT * FROM diary_table';
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
 * 根据id进行更改日记内容
 * @param {*} id 
 * @param {*} content 
 * @param {*} success 
 * @param {*} fail 
 */
function updateDiary(id,content,success,fail) {
    var params = [content,id];
    var sql = 'UPDATE diary_table SET content = ? WHERE id = ?';
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
 * 根据id进行删除
 * @param {*} id 
 * @param {*} success 
 * @param {*} fail 
 */
function deleteDiaryById(id,success,fail) {
    var params = [id];
    var sql = 'DELETE FROM diary_table WHERE id = ?';
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
    insertIntoDiary,
    selectDiary,
    updateDiary,
    deleteDiaryById
}