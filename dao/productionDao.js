var dbutils = require('./dbutil.js');


/**
 * 插入案例信息
 * @param {*} name 
 * @param {*} author 
 * @param {*} description 
 * @param {*} score 
 * @param {*} ctime 
 * @param {*} downloadNum 
 * @param {*} shareNum 
 * @param {*} views 
 * @param {*} imgpath 
 * @param {*} packagePath 
 * @param {*} url 
 * @param {*} success 
 * @param {*} fail 
 */
function insertProduction(name,author,description,ctime,imgpath,packagePath,url,success,fail) {
    var params = [name,author,description,ctime,imgpath,packagePath,url];
    var sql = 'INSERT INTO production_table (name,author,description,ctime,imgpath,packagePath,url) VALUES (?,?,?,?,?,?,?)'
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
 * 根据时间倒序分组查询
 * @param {*} start 
 * @param {*} limit 
 * @param {*} success 
 * @param {*} fail 
 */
function selectProduction(start,limit,success,fail) {
    var sql = 'SELECT * FROM production_table ORDER BY ctime DESC limit ?,?';
    var params = [start,limit];
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
 * 查询总共有多少条数据
 * @param {*} success 
 * @param {*} fail 
 */
function selectProductionNum(success,fail) {
    var sql = 'SELECT COUNT(*) AS count FROM production_table';
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
 * 根据id进行查询某个项目
 * @param {*} id 
 * @param {*} success 
 * @param {*} fail 
 */
function selectProductionById(id,success,fail) {
    var params = [id];
    var sql = 'SELECT * FROM production_table WHERE id = ?';
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
 * 据作者或者项目名查看
 * @param {*} author 
 * @param {*} productionName 
 * @param {*} start 
 * @param {*} limit 
 * @param {*} success 
 * @param {*} fail 
 */
function selectProductionByAuthorOrByName(author,productionName,start,limit,success,fail) {
    var params = [author,productionName,start,limit]
    var sql = 'SELECT * FROM production_table WHERE author = ? OR name = ? limit ?,?';
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
 * 根据作者或者项目名查看总量
 * @param {*} author 
 * @param {*} productionName 
 * @param {*} success 
 * @param {*} fail 
 */
function selectProductionNumByAuthorOrByName(author,productionName,success,fail) {
    var params = [author,productionName]
    var sql = 'SELECT COUNT(*) FROM production_table WHERE author = ? OR name = ?';
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
 * 根据id去进行更新分数
 * @param {*} id 
 * @param {*} score 
 * @param {*} success 
 * @param {*} fail 
 */
function updateScoreById(id,score,success,fail) {
    var params = [score,id]
    var sql = 'UPDATE production_table SET score = ? WHERE id = ?';
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
 * 根据id进行更新评价人数
 * @param {*} id 
 * @param {*} eqaluate 
 * @param {*} success 
 * @param {*} fail 
 */
function updateEqaluateById(id,evaluate,success,fail) {
    var params = [evaluate,id]
    var sql = 'UPDATE production_table SET evaluate = ? WHERE id = ?';
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
 * 根据id更新下载次数
 * @param {*} id 
 * @param {*} downloadNum 
 * @param {*} success 
 * @param {*} fail 
 */
function updateDownloadNumById(id,downloadNum,success,fail) {
    var params = [downloadNum,id]
    var sql = 'UPDATE production_table SET downloadNum = ? WHERE id = ?';
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
 *根据id跟新浏览次数
 * @param {*} id 
 * @param {*} views 
 * @param {*} success 
 * @param {*} fail 
 */
function updateViewsById(id,views,success,fail) {
    var params = [views,id]
    var sql = 'UPDATE production_table SET views = ? WHERE id = ?';
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
 * 根据id更新分享次数
 * @param {*} id 
 * @param {*} shareNum 
 * @param {*} success 
 * @param {*} fail 
 */
function updateShareNumById(id,shareNum,success,fail) {
    var params = [shareNum,id]
    var sql = 'UPDATE production_table SET shareNum = ? WHERE id = ?';
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
 * 根据id进行删除项目
 * @param {*} id 
 * @param {*} success 
 * @param {*} fail 
 */
function deleteCaseById(id,success,fail) {
    var params = [id]
    var sql = 'DELETE FROM production_table WHERE id = ?';
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
    insertProduction,
    selectProduction,
    selectProductionNum,
    selectProductionById,
    selectProductionByAuthorOrByName,
    selectProductionNumByAuthorOrByName,
    updateScoreById,
    updateEqaluateById,
    updateDownloadNumById,
    updateViewsById,
    updateShareNumById,
    deleteCaseById
}