module.exports = {
    apifix:'',
    apiUrl:{
        login:'https://linlangmanage.meizu.com/uac/rest/check/login',
        logout:'https://linlangmanage.meizu.com/uac/rest/logout',
        overall:'/c/report/storage/overall',  //总入库情况
        totalTrend:'/c/report/storage/totalTrend',  //总入库趋势
        businessTrend:'/c/report/storage/businessTrend',  //各业务入库趋势
        execute:'/c/report/task/execute',  //任务执行情况
        alarm:'/c/report/task/alarm',  //任务执行情况
        status:'/c/report/task/status/stat',//任务执行状态统计
        proxyPool:'/c/report/proxy/pool',  // 代理池
        proxyExecute:'/c/report/proxy/execute'  //代理执行情况
    },
    chartConf:{
        level:['B','KB','MB','GB','TB'],
        byte:[1,1024,1024*1024,1024*1024*1024,1024*1024*1024*1024],
        line:{
            color:[
                '#3aa1ff','#2fc25b','#f2637b','#2b821d',
                '#005eaa','#339ca8','#cda819','#32a487'
            ],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top:'10px',
                data:[]
            },
            grid: {
                left: '2%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLabel:{
                    formatter: '{value}'
                },
                splitLine:{
                    lineStyle: {
                        color: ['#e9e9e9'],
                        type:'dashed'
                    }
                }
            },
            series: [],
        },
        pie:{
            color:[
                '#3aa1ff','#2fc25b','#0098d9','#2b821d',
                '#005eaa','#339ca8','#cda819','#32a487'
            ],
            tooltip : {
                trigger: 'item',
                formatter: "{a}",
            },
            title: {
                textStyle: {
                    fontWeight: 'normal',
                    fontSize:'16',
                    color:'#8c8c8c'
                },
                show:true,
                text:'成功率指标',
                top:'middle',
                left:'center'
            },

            legend: {
                orient: 'vertical',
                x: 'right',
                y:'center',
                data: []
            },
            series : [{
                name:'成功率指标',
                type:'pie',
                radius: ['55%', '66%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                labelLine: {
                    normal: {
                    show: false
                    }
                },
                data:[]
            }]
        }
    }
};
