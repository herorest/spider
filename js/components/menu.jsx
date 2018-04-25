'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

class Menu extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.list = this.props.list || [
            {
                title:'test',
                href:'404'
            }
        ];
        let hash = location.hash;
        let subkey = [0,0,0];
        let key = 0;
        this.list.forEach(function(v,k){
            if(v.subhref){
                v.subhref.forEach(function(r,i){
                    if(hash.indexOf(r) >= 0){
                        subkey[k] = i;
                        key = k;
                        return false;
                    }
                });
            }else if(v.href){
                if(hash.indexOf(v.href) >= 0){
                    key = k;
                }
            }
        });

        this.state = {
            current:key,
            subCurrent:subkey
        };
    }

    componentDidMount = () => {
        let _self = this;
        window.onhashchange = (e) => {
            var url = e.newURL.split('#');
            var hash = url[1].split('/')[1];
            let subkey = [0,0,0];
            let key = 0;
            this.list.forEach(function(v,k){
                if(v.subhref){
                    v.subhref.forEach(function(r,i){
                        if(hash.indexOf(r) >= 0){
                            subkey[k] = i;
                            key = k;
                            return false;
                        }
                    });
                }else if(v.href){
                    if(hash.indexOf(v.href) >= 0){
                        key = k;
                    }
                }
            });
            this.setState({
                current:key,
                subCurrent:subkey,
            });
        }
	}

    menuClickHandle = (index,e) => {
        let env = process.env.NODE_ENV, href = '/#/';
        window.location.href = href + this.list[index].href;
    }
    subMenuClickHandle = (index,subindex,e) => {
        let env = process.env.NODE_ENV, href = '/#/';
        window.location.href = href + this.list[index].subhref[subindex];
        e.stopPropagation();
    }
    render(){
        let ac = 'active';
        let self = this;
        let menuli = [];
        let currentMenu = [...this.list];

        currentMenu.forEach(function(v,k){
            let li ;
            let height = 0;
            let liClass = 'trans ';
            liClass += k == self.state.current ? ac:'';
            if(v.sub && v.sub.length > 0){
                let submenuli = [];
                v.sub.forEach(function(r,i){
                    submenuli.push(<li key={k + i} className={i == self.state.subCurrent[k] ? ac:''} onClick={self.subMenuClickHandle.bind(null,k,i)}>{r}</li>);
                });
                if(k == self.state.current){
                    height = 40 * v.sub.length;
                }
                li = <li key={k} className={liClass} onClick={self.menuClickHandle.bind(null,k)}><span>{v.title}</span><i className="trans"></i><ul className="menu_p_l trans" style={{height:height}}>{submenuli}</ul></li>;
            }else{
                li = <li key={k} className={liClass} onClick={self.menuClickHandle.bind(null,k)}><span>{v.title}</span></li>;
            }
            menuli.push(li);
        });
        return (
            <div className="menu">
                <ul className="menu_p">
                    {menuli}
                </ul>
            </div>
        )
    }
};
module.exports = Menu;
