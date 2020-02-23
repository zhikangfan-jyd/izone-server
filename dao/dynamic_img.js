var dbutils = require('./dbutil.js');

/**
 * 插入图片相关信息
 * @param {*} dynamicId 说说的id
 * @param {*} path 图片所存储的路径
 * @param {*} size 图片的大小
 * @param {*} filename 图片上传之后的名字
 * @param {*} originalname 图片上传之前的原名字
 * @param {*} success 插入成功回调
 * @param {*} fail 插入失败回调
 */
function insertIntoDynamicImg(dynamicId,path,size,filename,originalname,success,fail) {
    var  params = [dynamicId,path,size,filename,originalname]
    var sql = 'insert into dynamic_img (dynamic_id,path,size,filename,originalname) values (?,?,?,?,?)'
    var createConnect = dbutils.createConnect();
    createConnect.connect();
    createConnect.query(sql,params,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error);
        }
    })
    createConnect.end();
}
/**
 * 根据说说id去查询当前说说内有没有图片
 * @param {*} dynamicId 
 * @param {*} success 
 * @param {*} fail 
 */
function selectOneDynamicImgByDynamicId(dynamicId,success,fail) {
    var sql = 'select path from dynamic_img where dynamic_id=' + dynamicId;
    var createConnect = dbutils.createConnect();
    createConnect.connect();
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error);
        }
    })
    createConnect.end();
}
/**
 * 根据某个说说id删除某个说说内容
 * @param {*} dynamicId 
 * @param {*} success 
 * @param {*} fail 
 */
function deleteDynamicImgByDynamicId(dynamicId,success,fail) {
    var sql = 'delete from dynamic_img where dynamic_id=' + dynamicId;
    var createConnect = dbutils.createConnect();
    createConnect.connect();
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error);
        }
    })
    createConnect.end();
}
module.exports = {
    insertIntoDynamicImg,
    selectOneDynamicImgByDynamicId,
    deleteDynamicImgByDynamicId
}