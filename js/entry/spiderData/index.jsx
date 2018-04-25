'use strict';
import React from 'react';
import reqwest from 'reqwest';
import Interface from '../../common/interface';
import utilDom from '../../utils/util-dom';
import util from '../../utils/util';
import Animate from 'rc-animate';
import Notification from '../../common/notify';
import { Spin, Table } from 'antd';
import TableDom from '../../components/table';
import { exeColumns,alarmColumns } from './config';


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
                url:Interface.apiUrl.totalTrend,
                title:'入库趋势',
                option:Interface.chartConf.line,
                optionInit:'loadTotalTrendCallBack',
                type:'chart'
            },{
                name:'chart2',
                url:Interface.apiUrl.businessTrend,
                title:'各数据源入库趋势',
                option:Interface.chartConf.line,
                optionInit:'loadBusinessTrendCallBack',
                type:'chart'
            },{
                name:'alarm',
                url:Interface.apiUrl.alarm,
                title:'最新报警',
                type:'table',
                tableInit:'loadTableCallBack',
                tableColumns:alarmColumns
            },{
                name:'chart3',
                url:Interface.apiUrl.status,
                title:'成功率指标',
                option:Interface.chartConf.pie,
                optionInit:'loadPieCallBack',
                type:'chart'
            },{
                name:'execute',
                url:Interface.apiUrl.execute,
                title:'最新任务',
                type:'table',
                tableInit:'loadTableCallBack',
                tableColumns:exeColumns
            }
            // },{
            //     name:'keyword',
            //     url:Interface.apiUrl.businessTrend,
            //     title:'热门关键词',
            //     optionInit:'loadTotalTrendCallBack',
            //     type:'chart'
            // }
        ];
        this.chartConf = [], this.tableConf = [], this.alarmType = ['处理','未处理'];
        this.conf.forEach((v,k) => {
            if(v.type == 'table'){
                this.tableConf.push(v);
            }else{
                this.chartConf.push(v);
            }
        });
        this.state = {
            overall:0,
            tableData:this.tableConf.map((v,k) => {
                return {
                    data:[],
                    load:false
                }
            }),
            chartLoad:this.chartConf.map((v,k) => {
                return {
                    load:false,
                    filter:0
                }
            })
        };
        this.myRef = React.createRef();
    }
    componentDidMount() {
        //初始化图表列表
        this.chartList = this.chartConf.map((v,k) => {
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
        this.loadAllChartByData();
        this.loadAllTable();
        this.getOverAll();
    }
    //获取当日总入库
    getOverAll() {
        let self = this;
        util.ajax({
            url:Interface.apiUrl.overall,
            data:{
                date: utilDom.formatDate(new Date())
            },
            success:function(result){
                self.setState({
                    overall:result.currentNums
                });
            }
        },reqwest,Notification);
    }
    loadAllChartByData(filter){
        this.chartConf.forEach((v,k) => {
            this.timeFilter(v,1,k);
        });
    }
    loadChartSingle({conf,filter,key = 0}){
        let self = this, promise;
        this.setChartLoad(true,key);
        promise = util.loadDataPromise(conf.url,filter);
        promise.then((result) => {
            if(this.chartConf[key].optionInit){
                let opt = this[this.chartConf[key].optionInit](result,filter);
                this.chartList[key].setOption(opt);
            }
            this.setChartLoad(false,key);
        });
    }
    loadAllTable(){
        this.tableConf.forEach((v,k) => {
            this.loadTableSingle({
                conf:v,
                name:v.name,
                num:1,
                key:k
            });
        });
    }

    loadTableSingle = ({conf, name, num, key = 0}) => {
        let self = this, url = conf.url, initCallback = conf.tableInit, promise, opt = {};
        this.setTableLoad(true,key);
        promise = util.loadDataPromise(url,this.getFilter(num));
        promise.then((result) => {
            this[initCallback](result,key);
            this.setTableLoad(false,key);
        });
    }


    loadTotalTrendCallBack = (result) => {
        let option = JSON.parse(JSON.stringify(Interface.chartConf.line));
        option.legend.data = ['入库'];
        option.legend.show = false;
        option.series = option.legend.data.map((v,k) => {
            return { name:v, type:'bar', stack: '趋势', label: { normal: { show: true, position: 'insideRight',formatter:'{c}'} }, data:[], barMaxWidth:'60%' }
        });
        option.grid.left = 'center';
        option.grid.width = '92%';
        option.xAxis.boundaryGap = true;
        option.yAxis.axisLabel.formatter = '{value} ';

        for(let key in result){
            if(result.hasOwnProperty(key)){
                let i = parseInt(key);
                option.xAxis.data.push(result[key].date);
                option.series[0].data.push(result[key].result);
            }
        }
        return option;
    }

    loadBusinessTrendCallBack = (result) => {
        let option = JSON.parse(JSON.stringify(Interface.chartConf.line));
        option.legend.data = [];
        option.series = [];
        let xAxisData = [] , getXData = false;
        result.forEach((v,k) => {
            let seriesData = [];
            v.details.forEach((value,key) => {
                if(!getXData){
                    xAxisData.push(value.date);
                }
                seriesData.push(value.result);
            });
            getXData = true;
            option.legend.data.push(v.business);
            option.series[k] =  { name:v.business, type:'line', label: { normal: { show: false } }, data:seriesData };
        });
        option.grid.left = 'center';
        option.grid.width = '92%';
        option.xAxis.boundaryGap = true;
        option.xAxis.data = xAxisData;
        option.yAxis.axisLabel.formatter = '{value} ';
        return option;
    }

    loadPieCallBack = (result) => {
        let option = JSON.parse(JSON.stringify(Interface.chartConf.pie));
        result.forEach((v,k) => {
            let desc = v.desc == 'success' ? '成功数':'失败数';
            option.legend.data.push(desc);
            option.series[0].data.push({
                value:v.countNums,
                name:desc
            });
        });
        option.legend.formatter = function (name) {
            let value = 0;
            result.forEach((v,k) => {
                if((v.desc == 'success' && name == '成功数') || (v.desc == 'failed' && name == '失败数')){
                    name = name + ' ' + v.countNums;
                }
            });
            return name ;
        };
        option.legend.align = 'left';
        option.legend.itemWidth = 6;
        option.legend.itemHeight = 6;
        option.tooltip.formatter = "{a0}<br/>{b}: {c0}";
        return option;
    }

    getFilter = (num) => {
        return {
            "beginDate":utilDom.formatDate(new Date(new Date().getTime() - 7 * 24 * 3600 * 1000)),
            "endDate":utilDom.formatDate(new Date()),
            "pageNumber":num || 1,
            "pageSize":5
        };
    }

    loadTableCallBack = (result,key) => {
        let tableData = [...this.state.tableData];
        tableData[key].load = false;
        tableData[key].data = result;
        this.setState({
            tableData:tableData
        });
    }

    //按时间筛选
    //type 1="7天" 2="30天" 0="全部"
    timeFilter = (conf,type,key) => {
        let date = new Date();
        let endDate = utilDom.formatDate(date),beginDate;
        let filter = {};
        if((type == 1 || type == 2) && this.state.chartLoad[key].filter !== type){
            this.setChartFilter(type,key);
            beginDate = utilDom.formatDate(new Date(date.getTime() - (type == 1 ? 7 : 30) * 24 * 3600 * 1000));
            filter = {beginDate,endDate};
            setTimeout(() => {
                this.loadChartSingle({conf,filter,key});
            },0)
        }
    }

    setTableLoad = (type,key) => {
        let tableData = [...this.state.tableData];
        tableData[key].load = type;

        this.setState({
            tableData:tableData
        })
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
        let self = this, viewboxClass = "view_box", tableKey = -1, chartKey = -1;
        let list = this.conf.map((v,k) => {
            if(v.type == 'table'){
                tableKey ++ ;
                viewboxClass = 'view_box view_box_table';
            }else{
                chartKey ++ ;
                viewboxClass = 'view_box';
            }
            let body = (
                <div className="view_chart clearfix" ref={v.name}>
                    {
                        v.type == 'table' ?
                        (
                            <TableDom
                                tablekey={tableKey}
                                columns={v.tableColumns}
                                data={this.state.tableData[tableKey].data}
                                loading={this.state.tableData[tableKey].load}
                                conf={v}
                                fetch={this.loadTableSingle}

                            />
                        ) : null
                    }
                </div>
            );

            if(v.type == 'chart'){
                body = (
                    <Spin spinning={this.state.chartLoad[chartKey].load}>
                        {body}
                    </Spin>
                );
            }
            return (
                <div key={k} className={viewboxClass}>
                    <div className="view_title">
                        <div className="view_chart_title">
                            {v.title}
                        </div>
                        {
                            k < 2 ?
                            <div className="view_chart_time">
                                <a href="javascript:void(0);" style={this.state.chartLoad[chartKey].filter == 1 ? {color:'#1890ff'} : {}} onClick={this.timeFilter.bind(null,v,1,chartKey)}>最近7天</a>
                                <a href="javascript:void(0);" style={this.state.chartLoad[chartKey].filter == 2 ? {color:'#1890ff'} : {}} onClick={this.timeFilter.bind(null,v,2,chartKey)}>最近30天</a>
                            </div> :
                            null
                        }
                    </div>
                    {
                        k == 0 ? <div className="view_chart_total">
                            <span>今日总入库</span>{this.state.overall}
                        </div> : null
                    }
                    {body}
                </div>
            );
        });

        return (
            <div className="main" ref={this.myRef}>
                <div className="view">
                    <Animate transitionAppear transitionName="fade">
                        {list}
                    </Animate>
                </div>
            </div>
        );
    }
};

module.exports = Entry;
