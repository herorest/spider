'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import reqwest from 'reqwest';
import {BrowserRouter as Router,HashRouter,Route,Link,Switch} from 'react-router-dom'
import MenuDom from '../components/menu';

import spiderData from '../entry/spiderData';
import proxyData from '../entry/proxyData';

import Interface from '../common/interface';
import Utils from '../utils/util-dom';
import Error from '../utils/404';

import Notification from '../common/notify';
import util from '../utils/util';

import { Menu, Dropdown, Icon } from 'antd';

import '../../css/common.css';
import '../../css/animate.css';
import '../../css/main.css';
import '../../css/menu.css';
import '../../css/status.css';
import '../../css/modify.css';
import '../../css/none.css';

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

    toggleMenu = () => {
        this.setState({
            showMenu: !this.state.showMenu
        })
    }

    componentDidMount() {
        let self = this;
        util.ajax({
            url:Interface.apiUrl.login,
            success:function(result){
                if(result.userName)
                    self.setState({
                        username:result.userName
                    });
            },
            failure:function(e){
                if(e.redirect)
                    window.location.href = e.redirect;
            },
            error:function(e){
                if(e.redirect)
                    window.location.href = e.redirect;
            }
        },reqwest,Notification);
    }

    logout(){
        util.ajax({
            url:Interface.apiUrl.logout,
            data:{isFromPage:true},
            success:function(result){
                if(result)
                    window.location.href = result;
            }
        },reqwest,Notification);
    }

    render(){
        let ac = 'active';
        let self = this;
        let dropmenu = (
            <Menu>
                <Menu.Item>
                    <a href="javascript:void(0);" onClick={this.logout}>退出</a>
                </Menu.Item>
            </Menu>
            )
        let sideClass = 'side trans';
        let toggleClass = 'toggle-menu';
        if(!this.state.showMenu){
            sideClass += ' hide';
            toggleClass += ' open';
        }
        return (
            <HashRouter>
            <div className="wrap layout">
                <div className={sideClass}>
                    <div className="logo">
                        <a href="index.html"></a>
                    </div>
                    <MenuDom list={this.menu} login={this.state.login} />
                </div>
                <div className="content">
                    <div className="status">
                        <Icon type="menu-fold" onClick={this.toggleMenu} className={toggleClass} />
                        <div className="login-menu">
                            <Dropdown overlay={dropmenu}>
                                <div className="login">{this.state.username}</div>
                            </Dropdown>
                        </div>
                    </div>
                    <Route exact path="/" component={spiderData}/>
                    <Route path="/proxy" component={proxyData}/>
                    <Route path="/spider" component={spiderData}/>
                </div>
            </div>
            </HashRouter>
        )
    }
};

window.onload = function() {
    ReactDOM.render(<AppCom />, document.getElementById('container'));
}
