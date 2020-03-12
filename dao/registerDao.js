var dbutil = require('./dbutil');

/**
 * 插入用户注册信息
 * @param {*} account 账户
 * @param {*} sex 性别
 * @param {*} nickname 昵称 
 * @param {*} birthday 出生日期
 * @param {*} password 密码
 * @param {*} ctime 创建时间
 * @param {*} imgpath 头像图片路径
 * @param {function} success 成功回调
 * @param {function} fail 插入失败回调
 */
function insertIntoRegister (account,sex,nickname,birthday,password,ctime,imgpath,region,city,success,fail) {
    var params = [account,sex,nickname,birthday,password,ctime,imgpath,region,city];
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    var sql = 'insert into register (account,sex,nickname,birthday,password,ctime,imgpath,region,city) values (?,?,?,?,?,?,?,?,?)'
    createConnect.query(sql,params,function (error,result) {
        if (!error) {
            success(result);
        } else {
           if (fail) fail(error)
        }
    })
    createConnect.end();
}

/**
 * 根据账号进行查询全部信息
 * @param {string} account 用户账户
 * @param {function} success 成功回调
 * @param {function} fail 错误回调
 */
function queryRegisterByAccount (account,success,fail) {
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    var sql = 'select * from register where account=' + account;
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}
/**
 * 根据账号进行查询除密码外的信息
 * @param {String} account 用户账户
 * @param {Function} success 成功回调
 * @param {Function} fail 错误回调
 */
function getUserInfoByAccount(account,success,fail) {
    var sql = 'select account, sex, nickname, birthday, ctime, imgpath, fans, region, city from register where account=' + account;
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}
/**
 * 根据粉丝量排序查询
 * @param {*} start 
 * @param {*} limit 
 * @param {*} success 
 * @param {*} fail 
 */
function getRankingList(start,limit,success,fail) {
    var sql = 'select * from register order by fans DESC limit ' + start + ',' + limit;
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}



/**
 * 根据账号进行更新当前账号的粉丝量
 * @param {*} account 
 * @param {*} fans 
 * @param {*} success 
 * @param {*} fail 
 */
function updateFansByAccount(account,fans,success,fail) {
    var sql = 'UPDATE register SET fans=' + fans + ' WHERE account=' + account;
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
} 
/**
 * 根据账号更新昵称
 * @param {*} account 
 * @param {*} nickname 
 * @param {*} success 
 * @param {*} fail 
 */
function updateNicknameByAccount(account,nickname,success,fail) {
    var params = [nickname,account]
    var sql = 'UPDATE register SET nickname = ? WHERE account = ?';
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    createConnect.query(sql,params,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}
/**
 * 根据账号更新性别
 * @param {*} account 
 * @param {*} sex 
 * @param {*} success 
 * @param {*} fail 
 */
function updateSexByAccount(account,sex,success,fail) {
    var sql = 'UPDATE register SET sex=' + sex + ' WHERE account=' + account;
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end();
}
/**
 * 根据账号更新生日
 * @param {*} account 
 * @param {*} birthday 
 * @param {*} success 
 * @param {*} fail 
 */
function updateBirthdayByAccount(account,birthday,success,fail) {
    var sql = 'UPDATE register SET birthday=' + birthday + ' WHERE account=' + account;
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end()
}
/**
 * 根据账号跟新头像图片路径
 * @param {*} account 
 * @param {*} imgpath 
 * @param {*} success 
 * @param {*} fail 
 */
function updateImgpathByAccount(account,imgpath,success,fail) {
    var params = [imgpath,account]
    var sql = 'UPDATE register SET imgpath = ? WHERE account = ?';
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    createConnect.query(sql,params,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end()
}
/**
 * 根据账号更新地址
 * @param {*} account 账号
 * @param {*} region 省份
 * @param {*} city 城市
 * @param {*} success 
 * @param {*} fail 
 */
function updateLocationByAccount(account,region,city,success,fail) {
    var sql = 'UPDATE register SET region=' + region + ',city=' + city + ' WHERE account=' + account;
    var createConnect = dbutil.createConnect();
    createConnect.connect();
    createConnect.query(sql,function (error,result) {
        if (!error) {
            success(result);
        } else {
            if (fail) fail(error)
        }
    })
    createConnect.end()
}

module.exports = {
    insertIntoRegister,
    queryRegisterByAccount,
    getUserInfoByAccount,
    getRankingList,
    updateFansByAccount,
    updateSexByAccount,
    updateNicknameByAccount,
    updateBirthdayByAccount,
    updateImgpathByAccount,
    updateLocationByAccount
}