var dbutils = require('./dbutil.js');

/**
 * 向说说表插入内容
 * @param {*} account 用户账号
 * @param {*} content 说说内容
 * @param {*} ctime 创建时间
 * @param {*} region 当前所在位置省份
 * @param {*} city 当前所在位置城市
 * @param {*} success 成功回调
 * @param {*} fail 失败回调
 */
function insertIntoDynamic(account,content,ctime,region,city,success,fail) {
    var params = [account,content,ctime,region,city]
    var sql = 'insert into dynamic (account,content,ctime,region,city) values (?,?,?,?,?)'
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
 * 根据id进行查询某一条说说
 * @param {*} id dynamic_id
 * @param {*} success 成功回调
 * @param {*} fail 错误回调
 */
function getOneDynamicInfoById(id,success,fail) {
    var sql = 'select * from dynamic where id=' + id;
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
 * 分页查询说说
 * @param {*} start 起始位
 * @param {*} dataNum 要查询的个数
 * @param {*} success 成功回调
 * @param {*} fail 错误回调
 */
function getDynamicInfo(start,dataNum,success,fail) {
    var params = [start,dataNum]
    var sql = 'select * from dynamic order by ctime desc limit ?,?'
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
 * 根据账号进行查询所有数据
 * @param {*} account 
 *  @param {*} start 
 *  @param {*} limit 
 * @param {*} success 
 * @param {*} fail 
 */
function getAllDynamicInfoByAccount(account,start,limit,success,fail) {
    var sql = 'select * from dynamic where account=' + account + ' order by ctime desc limit ' + start+ ',' + limit;
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
 * 根据账号进行查询说说数量
 * @param {*} account 
 * @param {*} success 
 * @param {*} fail 
 */
function getDynamicNumByAccount(account,success,fail) {
    var sql = 'select count(*) as count from dynamic where account=' + account;
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
 * 根据id单独删除某一条说说
 * @param {*} id 
 * @param {*} success 
 * @param {*} fail 
 */
function deleteOneDynamicInfoById(id,success,fail) {
    var sql = 'delete from dynamic where id=' + id;
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
 * 根据账号进行删除该账号下所有说说
 * @param {*} account 
 * @param {*} success 
 * @param {*} fail 
 */
function deleteAllDynamicInfoByAccount(account,success,fail) {
    var sql = 'delete from dynamic where account=' + account;
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
 * 根据说说id，去更新当前的点赞量
 * @param {Number} id 说说id
 * @param {Number} praise 要更新的值
 * @param {Function} success 成功回调
 * @param {Function} fail 失败回调
 */
function updatePraise(id,praise,success,fail) {
    var sql = 'UPDATE dynamic SET praise=' + praise + ' WHERE id=' + id;
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
 * 根据说说id，去更新当前的浏览量
 * @param {Number} id 说说id
 * @param {Number} views 要更新的值
 * @param {Function} success 成功回调
 * @param {Function} fail 失败回调
 */
function updateViews(id,views,success,fail) {
    var sql = 'UPDATE dynamic SET views=' + views + ' WHERE id=' + id;
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
 * 根据说说id，去更新当前的评论量
 * @param {Number} id 说说id
 * @param {Number} talks 要更新的值
 * @param {Function} success 成功回调
 * @param {Function} fail 失败回调
 */
function updateTalks(id,talks,success,fail) {
    var sql = 'UPDATE dynamic SET talks=' + talks + ' WHERE id=' + id;
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
    insertIntoDynamic,
    getOneDynamicInfoById,
    getAllDynamicInfoByAccount,
    getDynamicNumByAccount,
    getDynamicInfo,
    deleteOneDynamicInfoById,
    deleteAllDynamicInfoByAccount,
    updatePraise,
    updateViews,
    updateTalks
}