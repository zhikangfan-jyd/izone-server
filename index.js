var express = require('express'); //开启服务
var multer =  require('multer'); //处理上传的文件
var url = require('url'); //处理请求的url
var upload = multer({dest: './uploadfile'}); //默认上传的东西存储到的文件夹

var cookie = require('cookie-parser');  //处理cookie
var fs = require('fs');
var app = express();
app.use(cookie()); //使用cookie


var registerDao = require('./dao/registerDao');
var dynamic = require('./dao/dynamic.js');
var dynamic_img = require('./dao/dynamic_img.js');
var attentionDao = require('./dao/attentionDao.js');
var praiseDao = require('./dao/praiseDao.js');


//处理用户的注册
app.post('/api/register',function (request,response) {
    var returnData;
    request.on('data',function (data) {
       var params = JSON.parse(data.toString());
    // {"nickname":"aaa","account":"12345657898","password":"123456","confirmPassword":"123456","validateCode":"1234","birthday":1580572800000,"sex":1}
        params.ctime = new Date().getTime();
        params.imgpath = 'uploadfile/defaultHeadimg.jpg';
        registerDao.queryRegisterByAccount(params.account,function (res) {
            //判断账号有没有已经注册过
            if (res.length == 0) {
                //没有被注册过,添加进数据库
                registerDao.insertIntoRegister(params.account,params.sex,params.nickname,params.birthday,params.password,params.ctime,params.imgpath,function (res) {
                    response.writeHead(200);
                    returnData = {
                        isRegister: true
                    }
                    response.write(JSON.stringify(returnData));
                    response.end();
                })

            } else{
                //已被注册
                response.writeHead(200);
                returnData = {
                    isRegister: false
                }
                response.write(JSON.stringify(returnData));
                response.end();
            }
    });
})
})

//返回验证码
app.get('/api/getcode',function (req,resp) {
    var data = Math.floor(Math.random() * 10) * 1000 + Math.floor(Math.random() * 10) * 100 + Math.floor(Math.random() * 10) * 10 + Math.floor(Math.random() * 10);
    var returnData = {
        code: data
    }
    resp.writeHead(200);
    resp.write(JSON.stringify(returnData));
    resp.end();
});

//处理登录请求
app.post('/api/getlogin',function (request,response) {
    var data = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        registerDao.queryRegisterByAccount(params.account,function (res) {
                if (res.length == 0) {
                    //没有账号信息
                    data = {
                        isLogin: false
                    }
                    response.writeHead(200);
                    response.write(JSON.stringify(data));
                    response.end();
                } else {
                    // 有账号信息，进行比对输入的密码
                    if (res[0].password === params.password) {
                        data = {
                            isLogin: true
                        }
                        response.writeHead(200);
                        response.write(JSON.stringify(data));
                        response.end();
                    } else {
                        //密码输入错误
                        data = {
                            isLogin: false
                        }
                        response.writeHead(200);
                        response.write(JSON.stringify(data));
                        response.end();
                    }
                }
        })
    })
})

//处理客户端插入说说当中的图片
app.post('/api/dynamicImg',upload.array('file'),function (request,response) {
    var resultData = {};
    var dynamic_id = request.body.dynamic_id;
    var originalname = '',
        filename = '',
        path = '',
        size = '';
    //判断用户有没有上传过来图片
   if (request.files == undefined) {
    //没有上传图片
   } else {
       for (var i = 0; i < request.files.length; i++) {
        originalname = request.files[i].originalname;
        filename = request.files[i].filename;
        path = request.files[i].path;
        size = request.files[i].size;
        dynamic_img.insertIntoDynamicImg(dynamic_id,path,size,filename,originalname,success,fail);
       }
   }
   function success(res) {
        resultData = {
            type: 'success'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail(err) {
        resultData = {
            type: 'fail'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }

})

// 处理要写入客户端说说的详细信息
app.post('/api/dynamicInfo',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var data = JSON.parse(data.toString());
        data.ctime = new Date().getTime();
        dynamic.insertIntoDynamic(data.account,data.content,data.ctime,data.region,data.city,success,fail)
    })
    //写入成功执行
    function success(res) {
        response.writeHead(200);
        resultData.dynamic_id = res.insertId;
        resultData.type = 'success';
        response.write(JSON.stringify(resultData));
        response.end();
    }
    //写入失败
    function fail(err) {
        response.writeHead(200);
        resultData.type = 'fail';
        response.write(JSON.stringify(resultData));
        response.end();
    }
})

//处理根据说说id去删除内容的请求
app.post('/api/deleteDynamicInfo',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var data = JSON.parse(data.toString())
        var dynamic_id = parseInt(data.dynamic_id);
        dynamic.deleteOneDynamicInfoById(dynamic_id,success,fail)
    })
    function success() {
        response.writeHead(200);
        var resultData = {
            type: 'success'
        }
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail() {
        response.writeHead(200);
        var resultData = {
            type: 'fail'
        }
        response.write(JSON.stringify(resultData));
        response.end();
    }
})

//处理查询说说，并返回
app.get('/api/getDynamicInfo',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var start = parseInt(params.start);
    var dataNum = parseInt(params.nums);
    dynamic.getDynamicInfo(start,dataNum,success,fail);
    var dynamicInfoArray = [];
    function success(res) {
        dynamicInfoArray = res;
        resultData = {
            type: 'success',
            dynamicInfoArray: dynamicInfoArray
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail(error) {
        resultData = {
            type: 'fail'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
})

//处理查询用户除密码外的信息
app.get('/api/getUserInfo',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var account = params.account;
    registerDao.getUserInfoByAccount(account,success,fail);
    function success(res) {
        resultData = {
            type: 'success',
            userInfoData: res
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail(err) {
        resultData = {
            type: 'fail'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
})
//处理查询路径,读取相应图片
app.get('/api/getImgData',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    try {
        var data = fs.readFileSync(params.path);
        response.writeHead(200);
        response.write(data);
        response.end();
    } catch(err) {
        response.writeHead(200);
        response.write('fail');
        response.end();
    }
   

})
//根据说说id去查找有没有图片
app.get('/api/getDynamicImg',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var dynamic_id = parseInt(params.dynamic_id);
    dynamic_img.selectOneDynamicImgByDynamicId(dynamic_id,success,fail);
    function success(res) {
        resultData = {
            type: 'success',
            imgList: res
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail(err) {
       console.log(err);
       resultData = {
           type: 'fail'
       }
       response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
    
})
//根据说说id去删除图片
app.post('/api/deleteDynamicImg',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var data = JSON.parse(data.toString())
        var dynamic_id = parseInt(data.dynamic_id);
        dynamic_img.deleteDynamicImgByDynamicId(dynamic_id,success,fail)
    })
    function success() {
        response.writeHead(200);
        var resultData = {
            type: 'success'
        }
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail() {
        response.writeHead(200);
        var resultData = {
            type: 'fail'
        }
        response.write(JSON.stringify(resultData));
        response.end();
    }
})

//根据账号去查询关注的人
app.get('/api/getAttention',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var account = params.account;
    attentionDao.getAttentionByAccount(account,success,fail);
    function success(res) {
        resultData = {
            type: 'success',
            data: res
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail(err) {
        resultData = {
            type: 'fail'
        };
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }

})

//判断是否点赞
app.get('/api/getPraise',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var account = params.account;
    var dynamic_id = parseInt(params.dynamic_id);
    praiseDao.getPraise(account,dynamic_id,success,fail);

    function success(res) {
        resultData = {
            type: 'success',
            data: res
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail(err) {
        console.log(err);
        resultData = {
            type: 'fail'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
})
//点赞
app.post('/api/addPraise',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var account = params.account;
        var dynamic_id = params.dynamic_id;
        praiseDao.insertIntoPraise(account,dynamic_id,success,fail);
        function success(res) {
            resultData = {
                type: 'success',
                data: res
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log(err)
            resultData  = {
                type: 'fail',
                data: '服务器错误'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})
// 取消点赞
app.post('/api/cancelPraise',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var account = params.account;
        var dynamic_id = params.dynamic_id;
        praiseDao.deletePraise(account,dynamic_id,success,fail)
        function success(res) {
            resultData = {
                type: 'success',
                data: res
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log(err)
            resultData  = {
                type: 'fail',
                data: '服务器错误'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})

// 更新点赞量
app.post('/api/updatePraise',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var dynamic_id = params.dynamic_id;
        var praise = params.praise;
        dynamic.updatePraise(dynamic_id,praise,success,fail)
        function success(res) {
            resultData ={
                type: 'success',
                data: res
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log(err);
            resultData ={
                type: 'fail',
                data: '服务端错误'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    }) 
})
//添加关注
app.post('/api/addAttention',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var originAccount = params.originAccount;
        var targetAccount = params.targetAccount;
        var ctime = new Date().getTime();
        attentionDao.insertIntoAttentionTable(originAccount,targetAccount,ctime,success,fail);
        function success(res) {
            resultData = {
                type: 'success',
                data: res
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            resultData = {
                type: 'fail',
                data: '服务器错误'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})
//更新粉丝量
app.post('/api/updateFans',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var account = params.account;
        var fans = params.fans;
        registerDao.updateFansByAccount(account,fans,success,fail);
        function success(res) {
            resultData ={
                type: 'success',
                data: res
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            resultData ={
                type: 'fail',
                data: '服务端错误'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})
//删除关注
app.post('/api/deleteAttention',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var originAccount = params.originAccount;
        var targetAccount = params.targetAccount;
        attentionDao.deleteAttentionByAccount(originAccount,targetAccount,success,fail);
        function success(res) {
            resultData = {
                type: 'success',
                data: res
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            resultData = {
                type: 'fail',
                data: '服务器错误'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})





app.listen(8081,function () {
    console.log('服务已启动');
})