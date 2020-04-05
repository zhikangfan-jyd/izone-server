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
var replyDao = require('./dao/replyDao.js');
var talksDao = require('./dao/talksDao.js');
var productionDao = require('./dao/productionDao.js');
var diaryDao = require('./dao/diaryDao.js');
var adminDao = require('./dao/adminDao.js');



//处理用户的注册
app.post('/api/register',function (request,response) {
    var returnData;
    request.on('data',function (data) {
       var params = JSON.parse(data.toString());
        params.ctime = new Date().getTime();
        if (parseInt(params.sex) == 1) {
            params.imgpath = 'uploadfile/defaultMan.jpg';
        } else {
            params.imgpath = 'uploadfile/defaultGirl.jpg'
        }
        
        registerDao.queryRegisterByAccount(params.account,function (res) {
            //判断账号有没有已经注册过
            if (res.length == 0) {
                //没有被注册过,添加进数据库
                registerDao.insertIntoRegister(params.account,params.sex,params.nickname,params.birthday,params.password,params.ctime,params.imgpath,params.region,params.city,function (res) {
                    response.writeHead(200);
                    returnData = {
                        isRegister: true
                    }
                    response.write(JSON.stringify(returnData));
                    response.end();
                },function (err) {
                    console.log(err);
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
    },function (err) {
        console.log(err);
    });
})
})
//查询用户
app.get('/api/getUserByAccount',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var account = params.account;
    registerDao.queryRegisterByAccount(account,success,fail);
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
        console.log('根据账号查询号主信息',err);
        resultData = {
            type: 'fail'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
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
        // console.log(data);
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
        console.log(err);
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
        var data = JSON.parse(data.toString());
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
    function fail(err) {
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
// 处理查询某一篇说说
app.get('/api/getOneDynamicInfo',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var dynamic_id = params.dynamic_id;
    dynamic.getOneDynamicInfoById(dynamic_id,success,fail);
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
            type: 'fail',
            text: '服务端错误'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
})
//处理根据用户去查询说说
app.get('/api/getDynamicInfoByAccount',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var account = params.account;
    var start = params.start;
    var limit = params.nums;
    dynamic.getAllDynamicInfoByAccount(account,start,limit,success,fail)
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
        console.log('根据账号查内容',err);
        resultData = {
            type: 'fail'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
})
//根据用户账号去查询说说数量
app.get('/api/getDynamicNumByAccount',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var account = params.account;
    dynamic.getDynamicNumByAccount(account,success,fail);
    function success(res) {
        resultData = {
            type: 'success',
            data: res[0].count
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail(err) {
        console.log('查询说说数量',err);
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
//根据说说id去删除图片信息
app.post('/api/deleteDynamicImg',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var data = JSON.parse(data.toString())
        var dynamic_id = parseInt(data.dynamic_id);
        dynamic_img.selectOneDynamicImgByDynamicId(dynamic_id,deleteSuccess);
        dynamic_img.deleteDynamicImgByDynamicId(dynamic_id,success,fail)
    })
    
    function deleteSuccess(res) {
        for (let i = 0; i < res.length; i++) {
            fs.unlink(res[i].path,function (err) {
                if (err) {
                    console.log(err);
                }
            })
        }
       
    }
    function success(res) {
        response.writeHead(200);
        var resultData = {
            type: 'success'
        }
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail(err) {
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
//更新用户昵称
app.post('/api/updateUserNickname',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString())
        var account = params.account;
        var nickname = params.nickname;
        registerDao.updateNicknameByAccount(account,nickname,success,fail)
        function success(res) {
            resultData = {
                type: 'success'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log('更新用户昵称',err);
            resultData = {
                type: 'fail'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})
//更新用户性别
app.post('/api/updateUserSex',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString())
        var account = params.account;
        var sex = params.sex;
        registerDao.updateSexByAccount(account,sex,success,fail)
        function success(res) {
            resultData = {
                type: 'success'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log('更新用户性别',err);
            resultData = {
                type: 'fail'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})

//更新用户生日
app.post('/api/updateUserBirthday',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString())
        var account = params.account;
        var birthday = params.birthday;
        registerDao.updateBirthdayByAccount(account,birthday,success,fail)
        function success(res) {
            resultData = {
                type: 'success'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log('更新用户生日',err);
            resultData = {
                type: 'fail'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})
//更新用户头像地址
app.post('/api/updateHeadImg',upload.single('avatar'),function (request,response) {
    var resultData = {}
    var imgpath = request.file.path;
    var account = request.query.account;
    registerDao.updateImgpathByAccount(account,imgpath,success,fail);
    function success(res) {
        resultData = {
            type: 'success'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    };
    function fail(err) {
        resultData = {
            type: 'fail'
        }
        console.log('更新头像',err);
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
//更新评论量
app.post('/api/updateTalks',function (request,response) {
    var resultData;
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var dynamic_id = params.dynamic_id;
        var talks = params.talks;
        dynamic.updateTalks(dynamic_id,talks,success,fail)
        function success(res) {
            resultData = {
                type: 'success'

            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData))
        }
        function fail(res) {
            console.log('更新评论量',err);
            resultData = {
                type: 'fail'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData))
            response.end();
        }
    })
});

//查询说说评论
app.get('/api/getTalks',function (request,response) {
    var resultData;
    var params = url.parse(request.url,true).query;
    var dynamic_id = parseInt(params.dynamic_id);
    var start = parseInt(params.start);
    var limit = parseInt(params.limit)
    talksDao.selectTalks(start,limit,dynamic_id,success,fail)
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
        console.log('查询',err);
        resultData = {
            type: 'fail',
            text: '服务器错误'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
})

// 插入说说评论
app.post('/api/insertTalk',function (request,response) {
    var resultData ;
    request.on('data',function (data) {
        var params = JSON.parse(data.toString())
        var dynamic_id = params.dynamic_id;
        var parentAccount = params.parentAccount;
        var parentNickname = params.parentNickname;
        var imgpath = params.parentImgpath;
        var content = params.content;
        var ctime = new Date().getTime();
        talksDao.insertTalks(dynamic_id,parentAccount,parentNickname,content,ctime,imgpath,success,fail)
        function success(res) {
            talksDao.selectOneTalks(res.insertId,function (res) {
                var resultData = {
                    type: 'success',
                    data: res
                }
                response.writeHead(200);
                response.write(JSON.stringify(resultData));
                response.end();
            },fail)
            
        }
        function fail(err) {
            console.log(err);
            var resultData = {
                type: 'fail',
                text: '服务端错误'
            }
        }
    })
})
//删除说说单个评论评论
app.post('/api/deleteOneTalks',function (request,response) {
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        console.log('删除说说单个评论',params);
    })
})
//删除说说所有的评论，包括回复评论
app.post('/api/deleteAllTalks',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var dynamic_id = parseInt(params.dynamic_id);
        talksDao.deleteAllTalk(dynamic_id,success,fail)
        function success(res) {
            replyDao.deleteAllReplyByDynamic_id(dynamic_id,function () {
                resultData = {
                    type: 'success'
                }
                response.writeHead(200);
                response.write(JSON.stringify(resultData));
                response.end();
            })
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
}) 

// 插入回复
app.post('/api/insertReply',function (request,response) {
    var resultData;
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var ctime = new Date().getTime();
        var dynamic_id = parseInt(params.dynamic_id);
        var talk_id = parseInt(params.talk_id);
        var parentAccount = params.parentAccount;
        var parentNickname = params.parentNickname;
        var parentImgpath = params.imgpath;
        var childAccount = params.childAccount;
        var childNickname = params.childNickname;
        var replyContent = params.replyContent;
        replyDao.insertReply(dynamic_id,talk_id,parentAccount,parentNickname,parentImgpath,childAccount,childNickname,replyContent,ctime,success,fail)
        function success(res) {
            
            replyDao.selectOneReply(res.insertId,function (res) {
                resultData = {
                    type: 'success',
                    data: res
                }
                response.writeHead(200);
                response.write(JSON.stringify(resultData));
                response.end();
            },fail)
            
        }
        function fail(err) {
            console.log('插入回复',err);
            resultData = {
                type: 'fail',
                text: '服务器错误'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})
//查询所有回复
app.post('/api/selectReply',function (request,response) {
    var resultData;
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var talks_id = params.talks_id;
        replyDao.selectReply(talks_id,success,fail)
        function success(res) {
            resultData = {
                type:'success',
                data: res
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log(err);
            resultData = {
                type: 'fail',
                text: '服务器错误'

            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})

//删除回复
app.post('/api/deleteOneReply',function (request,response) {
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        console.log('删除单个回复',params);
    })
});

//删除所有回复
app.post('/api/deleteAllReply',function (request,response) {
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        console.log('删除所以回复',params);
    })
})

//查询当前注册用户粉丝量排行
app.get('/api/getRankingList',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var limit = params.limit;
    var start = params.start;
    registerDao.getRankingList(start,limit,success,fail);
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
        console.log('粉丝量排序',err);
        resultData = {
            type: 'fail'
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
})


//根据id进行修改分数
app.post('/api/updateScore',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var id = params.id;
        var score;
        productionDao.selectProductionById(id,function (res) {
            score = res[0].score + params.score;
            productionDao.updateScoreById(id,score,success,fail)

            productionDao.updateEqaluateById(id,res[0].evaluate + 1,function () {},function (err) { console.log('更新评价人数',err);})
        },function (err) {
            console.log('查询项目byid',err);
        })

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
})



//处理管理员登录后台
app.post('/api/adminLogin',function (request,response) {
    var resultData = {};
    var isLogin = '';
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var account = params.account;
        var password = params.password;
        adminDao.selectAdmin(account,success,fail);
        function success(res) {
            if (res.length == 0) {
                isLogin = false;
            } else {
                isLogin = res[0].admin_password == password ? true : false
            }
            resultData = {
                type: 'success',
                data: isLogin
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log('管理员登陆',err);
            resultData = {
                type: 'fail'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})

//处理插入其它案例的图片
app.post('/api/insertOtherImg',upload.single('img'),function (request,response) {
    var resultData = {}
    var params = request.file;
    resultData = {
        type: 'success',
        data: params.path
    }
    response.writeHead(200);
    response.write(JSON.stringify(resultData));
    response.end();
})
//处理插入其他案例的压缩包
app.post('/api/insertOtherZip',upload.single('otherZip'),function (request,response) {
    var resultData = {};
    var params = request.file;
    resultData = {
        type: 'success',
        data: params.path
    }
    response.writeHead(200);
    response.write(JSON.stringify(resultData));
    response.end();
})
//处理插入其他案例的内容
app.post('/api/insertOtherContent',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var name = params.name;
        var author = params.author;
        var url = params.url;
        var desc = params.desc
        var ctime = new Date().getTime();
        var imgpath = params.imgpath;
        var zipPath = params.zipPath;
        productionDao.insertProduction(name,author,desc,ctime,imgpath,zipPath,url,success,fail)
        function success(res) {
            resultData = {
                type: 'success'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log('插入其他案例',err);
            resultData = {
                type: 'fail'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})

// 查询上传的其它案例
app.get('/api/getOtherData',function (request,response) {
    var resultData = {};
    var params = url.parse(request.url,true).query;
    var count;
    var start = parseInt(params.start);
    var limit = parseInt(params.limit);
    productionDao.selectProductionNum(function (res) {
       count = res[0].count;
       productionDao.selectProduction(start,limit,success,fail)
    
    },function (err) {
        console.log('查询案例总数',err);
    })
    function success(res) {
        resultData = {
            type: 'success',
            data: res,
            count: count
        }
        
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();
    }
    function fail(err) {
        console.log('查询案例',err);
        resultData = {
            type:'fail',
            text: '服务端错误'
        }
        response.writeHead(200),
        response.write(JSON.stringify(resultData));
        response.end();
    }

})
//下载其他案例
app.get('/api/downLoadOtherData',function (request,response) {
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
//删除其他案例
app.post('/api/deleteCase',function (request,response) {
    var resultData = {}
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var id = params.id;
        var imgpath = params.imgpath;
        var packagePath = params.packagePath;
       
        productionDao.deleteCaseById(id,success,fail);
        function success () {
            try {
                fs.unlink(imgpath,function(err) {
                    if (!err) {
                        console.log('删除图片错误');
                    }
                })
                fs.unlink(packagePath,function(err) {
                    if (!err) {
                        if (!err) {
                            console.log('删除压缩包错误');
                        }
                    }
                })
            } catch(e) {
                console.log("删除图片或者压缩包失败",e);
            }
            resultData = {
                type: 'success'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData))
            response.end();
        }
        function fail(err) {
            resultData = {
                type: 'fail'
            }
            console.log('删除案例',err);
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})



//查找成长日记
app.get('/api/getDiary',function (request,response) {
    var resultData = {};
    diaryDao.selectDiary(success,fail)
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
        console.log('查询成长日记',err);
        resultData = {
            type: 'fail',
        }
        response.writeHead(200);
        response.write(JSON.stringify(resultData));
        response.end();

    }
})
//插入成长日记内容
app.post('/api/insertDiary',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var content = params.content;
        var ctime = new Date().getTime();
        diaryDao.insertIntoDiary(content,ctime,success,fail);
        function success(res) {
            resultData = {
                type: 'success'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log('插入成长日记',err);
            resultData = {
                type: 'fail'
            }
            response.writeHead();
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})
//根据id删除成长日记内容
app.post('/api/deleteDiary',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var id = params.id;
        diaryDao.deleteDiaryById(id,success,fail)
        function success() {
            resultData = {
                type: 'success'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log('删除日记',err);
            resultData = {
                type: 'fail'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
    })
})
//根据id更改成长日记的内容
app.post('/api/updateDiary',function (request,response) {
    var resultData = {};
    request.on('data',function (data) {
        var params = JSON.parse(data.toString());
        var id = params.id;
        var content = params.content;
        diaryDao.updateDiary(id,content,success,fail)
        function success() {
            resultData = {
                type: 'success'
            }
            response.writeHead(200);
            response.write(JSON.stringify(resultData));
            response.end();
        }
        function fail(err) {
            console.log('更改日记',err);
            resultData = {
                type: 'fail'
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