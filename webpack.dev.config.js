var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ExtractCSS = new ExtractTextPlugin('css/[name].css?[chunkhash]');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrors = require('friendly-errors-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var publicPath = '/'; // 发布路径，这里不用绝对路径的话css引用的图片最终路径会不对，生成的是url(css/imm/xx.png)

var plugins = [
    ExtractCSS,
    new HtmlWebpackPlugin({
        filename:path.resolve(__dirname,"assets") + '/index.html',    //生成的html存放路径，相对于 path
        template:'./index.html',    //html模板路径
        inject:true,
        showError:true,
        hash:true    //为静态资源生成hash值
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name:'common', filename:'js/common.js'
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new FriendlyErrors(),
];

var config = {
    //入口
    entry: {
        'index': ['./client.js','./js/app/app.jsx'],
        'common': ['react', 'react-dom', 'react-router','reqwest']
    },
    //格式
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss', '.png', '.jpg', '.gif', '.woff', 'eot', 'ttf']
    },
    //出口
    output: {
        path: path.resolve(__dirname, "assets"),
        publicPath: publicPath,
        filename: 'js/index.js'
      },
    //处理
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(woff|eot|ttf)$/,
            loader: 'file?name=font/[name].[ext]'
        }, {
            test: /\.css$/,
            loader: ExtractCSS.extract({
                fallback: 'style-loader',
                use: ['css-loader']
            })
        }, {
            test: /\.(svg|jpe?g|png|gif|ico)$/,
            use: [
                {
                    loader: 'file-loader',
                    query : {
                        name : 'images/[name].[ext]'
                    }
                }
            ]
        }]
    },
    plugins: plugins
};
module.exports = config;
