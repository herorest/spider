var config = require('./config');
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var http = require('http');

var opn = require('opn');
var proxyMiddleware = require('http-proxy-middleware');
var webpackConfig = require('./webpack.dev.config.js');
var main = 0;

var port = process.env.PORT || config.dev.port;
var proxyTable = config.dev.proxyTable;

var app = express();
var mock = require('./mock.js');

mock(app);

var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
});
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({
            action: 'reload'
        })
        cb()
    });
});

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(express.static('./'));
var uri = 'http://127.0.0.1:' + port;

devMiddleware.waitUntilValid(function() {
    console.log('> Listening at ' + uri + '\n');
});

module.exports = app.listen(port, function(err) {
    if (err) {
        console.log(err);
        return;
    }

    // when env is testing, don't need open it
    // if (process.env.NODE_ENV !== 'testing') {
    //     opn(uri);
    // }
});
