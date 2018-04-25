'use strict';
import React from 'react';

class Error extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <span>404</span>
        );
    }
};

module.exports = Error;
