import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import placements from 'rc-tooltip/lib/placements';
import './index.css';

class Tip extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            destroyTooltipOnHide: false,
            placement: 'right',
            trigger: {
                hover: 1
            },
            offsetX: 4,
            offsetY: 0
        };
    }
    onVisibleChange = (visible) => {
        // console.log('tooltip', visible);
    }
    render() {
        let props = this.props;
        let state = this.state;
        let trigger = state.trigger;
        return (
            <Tooltip
                placement={props.placement}
                mouseEnterDelay={0}
                mouseLeaveDelay={0.1}
                destroyTooltipOnHide={this.state.destroyTooltipOnHide}
                trigger={Object.keys(this.state.trigger)}
                onVisibleChange={this.onVisibleChange}
                overlay={<div style={{ height: props.height, width: props.width}}>{props.content}</div>}
                align={{
                    offset: [this.state.offsetX, this.state.offsetY],
                }}
                transitionName={props.transName || 'tooltip-zoom'}
                prefixCls={props.prefixCls || 'tooltip'}
            >
                {props.children}
            </Tooltip>
        );
    }
}
export default Tip;
