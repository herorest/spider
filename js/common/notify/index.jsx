import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const prefixCls = 'notification';

class Notification extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {closed: false};
    }

    componentDidMount() {
        if (this.props.duration) {
            this.closeTimer = setTimeout(() => {
                this.close();
            }, this.props.duration * 1000);
        }
    }

    componentWillUnmount() {
        this.clearCloseTimer();
    }

    clearCloseTimer() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    }

    close() {
        this.clearCloseTimer();
        this.setState({closed: true});
        this.refs.notification.addEventListener("webkitAnimationEnd", () => {
            let node = this.refs.notification;
            node.parentNode.style.zIndex = 1;
        });
    }

    getTransitionName(transitionName) {
        const props = this.props;
        if (!transitionName && props.animation) {
            transitionName = `${props.prefixCls}-${props.animation}`;
        }
        transitionName += ` ${props.prefixCls}-${props.animation}`;
        transitionName += this.state.closed
            ? '-leave'
            : '-enter';
        return transitionName;
    }

    getSrc() {
        let type = this.props.type;
        switch (type) {
            case 'alert':
            case 'error':
            case 'success':
            case 'message':
                break;
            default:
                type = 'message';
                break;
        }
        return `${type}`;
    }

    render() {
        const props = this.props;
        let componentClass = `${props.prefixCls}-notice`;
        let classname = this.getTransitionName(componentClass);
        let src = this.getSrc();
        let style = {
            ...props.style
        };
        if (props.center) {
            style.top = 0;
        }
        return (
            <div className={classname} style={style} ref="notification">
                <div className={`${componentClass}-img ${componentClass}-img-` + this.getSrc()}></div>
                <div className={`${componentClass}-content`}>{props.content}</div>
            </div>
        );
    }
};

Notification.defaultProps = {
    prefixCls: prefixCls,
    animation: 'fade',
    duration: 1.5,
    style: {
        top: 65
    },
    content: '',
    type: 'alert'
};

Notification.remove = function(obj){
    if (obj && obj.length > 0) {
        for (var i = 0; i < obj.length; i++) {
            var node = obj[i];
            node.parentNode.removeChild(node);
        }
    }
}
Notification.build = function(properties) {
    let nodes = document.getElementsByClassName(prefixCls);
    let div = document.createElement('div');
    let id = properties.id;
    let divClass = prefixCls;

    //是否为16
    if(ReactDOM.createPortal){

    }

    if (document.getElementById(id)) {
        return;
    }
    this.remove(nodes);
    if (properties.id) {
        div.setAttribute('id', properties.id);
    }
    if (properties.center || !(properties.style && properties.style.top)) {
        properties.center = true;
        divClass += ' notification-center';
    }
    div.setAttribute('class', divClass);
    document.body.appendChild(div);
    ReactDOM.render(
        <Notification {...properties}/>, div);
};

Notification.alert = function(content, duration, center, style) {
    return Notification.build({
        content, duration, type: 'alert', center, style
    });
};
Notification.success = function(content, duration, center, style) {
    return Notification.build({
        content, duration, type: 'success', center, style
    });
};
Notification.error = function(content, duration, center, style) {
    return Notification.build({
        content, duration, type: 'error', center, style
    });
};
Notification.message = function(content, duration, center, style) {
    return Notification.build({
        content, duration, type: 'message', center, style
    });
}

export default Notification;
