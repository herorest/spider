'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

class AppCom extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.menu = [
            {
                title:'爬虫数据',
                href:'spider'
            },{
                title:'代理数据',
                href:'proxy'
            }
        ];

        this.state = {
            username:'',
            showMenu: true
        };
    }

    render(){
        const {chartkey,chartLoad,chartConf,onclick,name,type} = this.props;
        return (
            <a href="javascript:void(0);" style={chartLoad[chartKey].filter == 1 ? {color:'#1890ff'} : {}} onClick={onclick.bind(null,chartConf,type,chartKey)}>{name}</a>
        );
    }
};
