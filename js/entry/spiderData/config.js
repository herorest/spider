import React from 'react';
import utilDom from '../../utils/util-dom';

module.exports = {
    exeColumns: [{
        title: 'id',
        dataIndex: 'id',
        width:'8%',
        align:'center'
    }, {
        title: '任务名称',
        dataIndex: 'taskName'
    }, {
        title: '开始时间',
        dataIndex: 'start',
        width:'20%',
        render: function(text,record){
            return utilDom.formatFullTime(new Date(text));
        }
    }, {
        title: '结束时间',
        dataIndex: 'end',
        width:'20%',
        render: function(text,record){
            return utilDom.formatFullTime(new Date(text));
        }
    }, {
        title: '状态',
        dataIndex: 'executeStatus',
        width:'10%',
        render: function(text,record){
            let classn = 'normal';
            text = '成功';
            if(parseInt(text) == 3){
                classn = 'error';
                text = '失败';
            }
            return (
                <span className={classn} key={record.id}>{text}</span>
            );
        }
    }, {
        title: '数据量',
        dataIndex: 'resultSize',
        width:'12%'
    }, {
        title: '示例',
        dataIndex: 'remark',
        width:'10%'
    }],
    alarmColumns:[{
        title: 'id',
        dataIndex: 'id',
        width:'8%',
        align:'center'
    }, {
        title: '任务名称',
        dataIndex: 'subject'
    }, {
        title: '报警时间',
        dataIndex: 'createTime',
        width:'20%',
        render: function(text,record){
            return utilDom.formatFullTime(new Date(text));
        }
    }, {
        title: '状态',
        dataIndex: 'status',
        width:'10%',
        render: function(text,record){
            let classn = 'normal';
            text = '成功';
            if(parseInt(text) == 3){
                classn = 'error';
                text = '失败';
            }
            return (
                <span className={classn} key={record.id}>{text}</span>
            );
        }
    }, {
        title: '信息',
        dataIndex: 'message',
        width:'40%'
    }]
};
