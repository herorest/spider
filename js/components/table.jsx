'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Table } from 'antd';

class TableDom extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data:[],
            page:{
                current:1,
                pageSize:5,
                total:1,
                size:"small",
                onChange:this.onChangePage
            }
        };
    }
    shouldComponentUpdate(nextProps,nextState){
        if(
            JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) ||
            nextProps.loading !== this.props.loading
        ){
            return true;
        }
        return false;
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            this.setState({
                data:nextProps.data.page || [],
                page:{
                    ...this.state.page,
                    total:nextProps.data.totalCount || 1
                }
            });
        }
    }
    onChangePage = (num) => {
        console.log('change',num,this.props.conf.name,this.props.tablekey);
        this.setState({
            page:{
                ...this.state.page,
                current:num
            }
        });
        setTimeout(() => {
            this.props.fetch({
                conf:this.props.conf,
                name:this.props.conf.name,
                num,
                key:this.props.tablekey
            });
        },0);
    }
    render(){
        let self = this;
        let {columns,loading} = this.props;
        return (
            <Table
                columns={columns}
                dataSource={this.state.data}
                loading={loading}
                rowKey="id"
                className="m-table"
                pagination={this.state.page}
                size="small"
                scroll={{ y: 190 }}
            />
        )
    }
};
module.exports = TableDom;
