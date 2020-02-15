var express = require('express'); //开启服务
var multer =  require('multer'); //处理上传的文件
var url = require('url'); //处理请求的url
var cookie = require('cookie-parser');  //处理cookie
var fs = require('fs');
var app = express();
app.use(cookie()); //使用cookie
var registerDao = require('./dao/registerDao');


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


app.listen(8081,function () {
    console.log('服务已启动');
})