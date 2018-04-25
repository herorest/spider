'use strict';
import React from 'react';
import reqwest from 'reqwest';
import Interface from '../../common/interface';
import utilDom from '../../utils/util-dom';
import util from '../../utils/util';
import Animate from 'rc-animate';
import Notification from '../../common/notify';
import { Spin, DatePicker  } from 'antd';
import TableDom from '../../components/table';
const { RangePicker } = DatePicker;
// import MyComponent from './test';

import Echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legendScroll';

class Entry extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.conf = [
            {
                name:'chart1',
                url:Interface.apiUrl.proxyExecute,
                title:'代理执行情况',
                option:Interface.chartConf.line,
                optionInit:'loadProxyExecuteCallBack',
                type:'chart'
            },{
                name:'chart2',
                url:Interface.apiUrl.proxyPool,
                title:'代理池',
                option:Interface.chartConf.pie,
                optionInit:'loadPieCallBack',
                type:'chart'
            }
        ];
        this.state = {
            chartLoad:this.conf.map((v,k) => {
                return {
                    load:false,
                    filter:0
                }
            })
        };
    }
    componentDidMount() {
        //初始化图表列表
        this.chartList = this.conf.map((v,k) => {
            if(v.type == 'chart' && this.refs[v.name]){
                return Echarts.init(this.refs[v.name]);
            }
        });
        window.onresize = () => {
            this.chartList.resize();
        }

        //请求图表数据
        this.getDefaultData();
    }
    getDefaultData = () => {
        this.loadAllChartByData({});
    }
    loadAllChartByData(filter){
        this.conf.forEach((v,k) => {
            if(k == 0){
                let date = parseInt(new Date().getTime() / 1000);
                filter = {
                    timeUnit : 'H',
                    start : date - 24 * 3600,
                    end: date
                }
            }
            this.loadChartSingle({
                conf:v,
                filter,
                key:k
            });
        });
    }
    loadChartSingle({conf,filter,key = 0}){
        let self = this, promise;
        this.setChartLoad(true,key);
        promise = util.loadDataPromise(conf.url,filter);
        promise.then((result) => {
            if(this.conf[key].optionInit){
                let opt = this[this.conf[key].optionInit](result,filter,conf);
                this.chartList[key].setOption(opt);
            }
            this.setChartLoad(false,key);
        });
    }

    loadProxyExecuteCallBack = (result,filter,conf) => {
        let type = filter.timeUnit;
        let provider = [{
            name:'快代理',
            data:[],
            formatData:[]
        },{
            name:'芝麻代理',
            data:[],
            formatData:[]
        },{
            name:'汇总',
            data:[],
            formatData:[]
        }];
        let timeArr = [];
        let currtime = filter.start;

        do{
            var time;
            if(filter.timeUnit == 'M'){
                time = utilDom.formatFullTime(new Date(currtime * 1000));
                currtime += 60;
            }else if(filter.timeUnit == 'D'){
                time = utilDom.formatDate(new Date(currtime * 1000));
                currtime += 24 * 60 * 60;
            }else if(filter.timeUnit == 'H'){
                time = utilDom.formatHour(new Date(currtime * 1000));
                currtime += 60 * 60;
            }
            timeArr.push(time);

        }while(currtime <= filter.end);
        let option = JSON.parse(JSON.stringify(Interface.chartConf.line));
        let xAxisData = [] , getXData = false;
        option.legend.data = [];
        option.series = [];

        provider.forEach((vp,kp) => {
            option.legend.data.push(vp.name);
            if(kp !== provider.length - 1){
                result.forEach((v,k) => {
                    if(v.provider == vp.name){
                        vp.data.push(v);
                    }
                });
                vp.formatData = timeArr.map((value,key) => {
                    let targetV = {};
                    vp.data.some((v,k) => {
                        if(v.date == value){
                            targetV = v;
                            return true;
                        }
                    });
                    return targetV.failed == 0 ? 0 : (targetV.success / (targetV.success + targetV.failed)).toFixed(2);
                });
            }else{
                vp.formatData = timeArr.map((value,key) => {
                    let total = 0;
                    option.series.forEach((v,k) => {
                        total += parseFloat(v.data[key]);
                    });
                    return (total / 2).toFixed(2);
                });
            }
            option.series[kp] =  { name: vp.name, type:'line', label: { normal: { show: false } }, data:vp.formatData };
        });

        xAxisData = timeArr;
        getXData = true;
        option.grid.left = 'center';
        option.grid.width = '92%';
        option.xAxis.data = xAxisData;
        option.yAxis.axisLabel.formatter = '{value} ';
        option.legend.selected = {
            '汇总': true,
            '快代理': false,
            '芝麻代理': false
        }
        return option;
    }

    loadPieCallBack = (result) => {
        let option = JSON.parse(JSON.stringify(Interface.chartConf.pie));
        result.forEach((v,k) => {
            option.legend.data.push(v.provider);
            option.series[0].data.push({
                value:v.available,
                name:v.provider
            });
        });
        option.legend.formatter = function (name) {
            let value = 0;
            result.forEach((v,k) => {
                if(name == v.provider)
                    name = name + ' ' + v.available;
            });
            return name ;
        };
        option.legend.align = 'left';
        option.legend.itemWidth = 6;
        option.legend.itemHeight = 6;
        option.tooltip.formatter = "{a0}<br/>{b}: {c0}";
        option.series[0].name = option.title.text = "代理池";

        return option;
    }

    onOk = (momentArr) =>{
        //类型
        let type = 'M';
        let between = momentArr[1].valueOf() - momentArr[0].valueOf();
        if(between >= 48 * 3600 * 1000){
            type = 'D';
        }else if(between >= 2 * 3600 * 1000){
            type = 'H'
        }
        this.setChartFilter(2,0);
        this.loadChartSingle({
            conf:this.conf[0],
            filter:{
                timeUnit:type,
                start:parseInt(momentArr[0].valueOf() / 1000),
                end:parseInt(momentArr[1].valueOf() / 1000)
            }
        });
    }

    //按时间筛选
    timeFilter = (name,type) => {
        let start,end = parseInt(new Date().getTime() / 1000);
        if(type == 'H'){
            this.setChartFilter(0,0);
            start = end - 24 * 3600;
        }else if(type == 'M'){
            this.setChartFilter(1,0);
            start = end - 30 * 60;
        }
        this.loadChartSingle({
            conf:this.conf[0],
            filter:{
                timeUnit:type,
                start,
                end
            }
        });
    }

    setChartLoad = (type,key) => {
        if( typeof(type) != 'boolean' ){
            return false;
        }
        let chartLoad = [...this.state.chartLoad];
        chartLoad[key].load = type;
        this.setState({
            chartLoad:chartLoad
        })
    }

    setChartFilter = (num,key) => {
        if( typeof(num) != 'number' ){
            return false;
        }
        let chartLoad = [...this.state.chartLoad];
        chartLoad[key].filter = num;
        this.setState({
            chartLoad:chartLoad
        });
    }

    render() {
        let self = this, viewboxClass = "view_box", chartKey = -1;
        let chartList = this.conf.map((v,k) => {
            chartKey ++ ;
            if(k == 0){
                viewboxClass = 'view_box view_box_proxy';
            }else{
                viewboxClass = "view_box";
            }
            return (
                <div key={k} className={viewboxClass}>
                    <div className="view_title">
                        <div className="view_chart_title">
                            {v.title}
                        </div>
                        {
                            k < 1 ?
                            <div className="view_chart_time">
                                <RangePicker onChange={this.onChangeRange} onOk={this.onOk} showTime format="YYYY-MM-DD HH:mm"  />
                                <a href="javascript:void(0);" style={this.state.chartLoad[chartKey].filter == 0 ? {color:'#1890ff'} : {}} onClick={this.timeFilter.bind(null,v.name,'H')}>最近1日</a>
                                <a href="javascript:void(0);" style={this.state.chartLoad[chartKey].filter == 1 ? {color:'#1890ff'} : {}} onClick={this.timeFilter.bind(null,v.name,'M')}>最近30分钟</a>
                            </div> :
                            null
                        }
                    </div>
                    <Spin spinning={this.state.chartLoad[chartKey].load}>
                        <div className="view_chart clearfix" ref={v.name}></div>
                    </Spin>
                </div>
            )
        });

        return (
            <div className="main">
                <div className="view">
                    <Animate transitionAppear transitionName="fade">
                        {chartList}
                    </Animate>
                </div>
            </div>
        );
    }
};

module.exports = Entry;
