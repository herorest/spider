var Interface = require('./js/common/interface');

var modifyZero = function(num){
    return num > 9 ? num : '0' + num;
}

var formatFullTime = function(i){
    let year = (i.getFullYear() + '');
    let month = modifyZero(i.getMonth() + 1);
    let day = modifyZero(i.getDate());
    let hour = modifyZero(i.getHours());
    let minutes = modifyZero(i.getMinutes());
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;
}
var formatDate = function(i){
    let year = (i.getFullYear() + '');
    let month = modifyZero(i.getMonth() + 1);
    let day = modifyZero(i.getDate());
    return year + '-' + month + '-' + day;
}

var formatHour = function(i,multiDay){
    let year = (i.getFullYear() + '');
    let month = modifyZero(i.getMonth() + 1);
    let day = modifyZero(i.getDate());
    let hour = modifyZero(i.getHours());
    let minutes = '00';
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;
}

var getexecuteList = function(page,pagesize) {
    var result = [];
    for (var i = 0; i < pagesize; i++) {
        result.push({
            "id": page + i,
            "createTime": 1522202286000,
            "updateTime": null,
            "business": "proxy",
            "taskName": "proxy_forward",
            "executeIp": "127.0.0.1",
            "url": "http://www.baidu.com",
            "start": 1522137329,
            "end": 1522137329,
            "resultSize": 1,
            "executeStatus": 2,
            "executeLog": null,
            "httpCode": 200,
            "httpResponse": null,
            "remark": "快代理"
        })
    }
    return result;
}

var getMinuteslist = function(start,type){
    var result = [];
    for(var i = 0; i < 40; i++){
        var date ;
        console.log(start);
        if(type == 'M'){
            date = formatFullTime(new Date(parseInt(start) * 1000 + i * (60 * 1000)));
        }else if(type == 'D'){
            date = formatDate(new Date(parseInt(start) * 1000 + i * (24 * 60 * 60 * 1000)));
        }else if(type == 'H'){
            date = formatHour(new Date(parseInt(start) * 1000 + i * (60 * 60 * 1000)));
        }
        result.push({
            "date":date,
            "provider":"快代理" ,
            "success":parseInt(Math.random() * 10),
            "failed":parseInt(Math.random() * 10)
        });
        result.push({
            "date":date,
            "provider":"芝麻代理",
            "success":parseInt(Math.random() * 10),
            "failed":parseInt(Math.random() * 10)
        });
    }
    return result;
}


module.exports = function(app){
    app.get(Interface.apiUrl.overall, function (req, res) {
        res.json({
            "code": 200,
            "msg": "",
            "value": {
                "date":"2018-03-26",
                "currentNums": "1000",
                "totalNums": "8000",
            }
        });
    });

    app.get(Interface.apiUrl.totalTrend, function (req, res) {
        res.json({
            "code": 200,
            "msg": "",
            "value": [{
                "date":"2018-03-25",
                "result": "5000"
            },
            {
                "date":"2018-03-26",
                "result": "8000"
            },{
                "date":"2018-03-27",
                "result": "3600"
            },{
                "date":"2018-03-28",
                "result": "4700"
            },{
                "date":"2018-03-29",
                "result": "8900"
            },{
                "date":"2018-03-30",
                "result": "5800"
            },{
                "date":"2018-03-31",
                "result": "7600"
            }]
        })
    });

    app.get(Interface.apiUrl.businessTrend, function (req, res) {
        res.json({
            "code": 200,
            "msg": "",
            "value": [{
                "business":"baidu",
                "details":[{
                    "date":"2018-03-25",
                    "result": "3600",
                },
                {
                    "date":"2018-03-26",
                    "result": "4800",
                }]
            },
            {
                "business":"jd",
                "details":[{
                    "date":"2018-03-25",
                    "result": "2100",
                },
                {
                    "date":"2018-03-26",
                    "result": "3900",
                }]
            }]
        })
    });

    app.get(Interface.apiUrl.execute, function (req, res) {
        res.json({
            "code": 200,
            "msg": "",
            "value": {
                page:getexecuteList(req.query.pageNumber,5),
                pageNumber:req.query.pageNumber,
                pageSize:5,
                pageCount:6,
                totalCount:30
            }
        })
    });

    app.get(Interface.apiUrl.alarm, function (req, res) {
        res.json({
            "code": 200,
            "msg": "",
            "value": {
                "page":[{
                    "id":1,
                    "subject":"[告警平台]规则1",
                    "status":2,
                    "message":"Proxy_Forward成功率已经低于80%了，当前成功率0，需要抢救一下。",
                    "completeTime":1522212073343,
                    "createTime":1522212073343
                },{
                    "id":2,
                    "subject":"[告警平台]规则2",
                    "status":0,
                    "message":"Proxy_Forward成功率已经低于80%了，当前成功率0，需要抢救一下。",
                    "completeTime":0,
                    "createTime":1522212073343
                },{
                    "id":3,
                    "subject":"[告警平台]规则2",
                    "status":0,
                    "message":"Proxy_Forward成功率已经低于80%了，当前成功率0，需要抢救一下。",
                    "completeTime":0,
                    "createTime":1522212073343
                },{
                    "id":4,
                    "subject":"[告警平台]规则2",
                    "status":0,
                    "message":"Proxy_Forward成功率已经低于80%了，当前成功率0，需要抢救一下。",
                    "completeTime":0,
                    "createTime":1522212073343
                },{
                    "id":5,
                    "subject":"[告警平台]规则2",
                    "status":0,
                    "message":"Proxy_Forward成功率已经低于80%了，当前成功率0，需要抢救一下。",
                    "completeTime":0,
                    "createTime":1522212073343
                }],
                pageNumber:1,
                totalCount:5
            }
        })
    });

    app.get(Interface.apiUrl.status, function (req, res) {
        res.json({
            "code": 200,
            "msg": "",
            "value": [
                {
                  "status": 2,
                  "desc": "success",
                  "countNums": 14
                },
                {
                  "status": 2,
                  "desc": "failed",
                  "countNums": 6
                }
            ]
        })
    });

    app.get(Interface.apiUrl.proxyPool,function(req,res){
        res.json({
            "code":200,
            "msg":"",
            "value":[{
                "reportTime":1522212073343,
                "provider":"芝麻代理",
                "available":12
            },{
                "reportTime":1522212073343,
                "provider":"快代理",
                "available":21
            }]
        })
    });

    app.get(Interface.apiUrl.proxyExecute,function(req,res){
        console.log(req.query.timeUnit);
        var result = {
            "code":200,
            "msg":"",
            "value":getMinuteslist(req.query.start,req.query.timeUnit)
        };
        res.json(result);
    });
}
