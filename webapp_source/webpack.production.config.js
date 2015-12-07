var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    //'webpack-dev-server/client?http://127.0.0.1:3000',
    //'webpack/hot/only-dev-server',
    './index'
  ],
  output: {
    path: path.join(__dirname, '../src/main/webapp/app/static'),
    filename: 'bundle.js',
    publicPath: 'static/'
  },
  plugins: [
    //new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
    //new webpack.ProvidePlugin({
    //  $: "jquery",
    //  jQuery: "jquery",
    //  "window.jQuery": "jquery"
    //})
  ],
  resolve: {
    alias: {
      'redux': path.join(__dirname, 'node_modules/redux'),
      'leaflet_css': __dirname + '/node_modules/leaflet/dist/leaflet.css'
    },
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: __dirname
    }, {
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, '..', '..', 'src')
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw'],
      include: __dirname
    }, {
      test: /\.(png|jpe?g|gif|svg)$/i,
      loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?{progressive:true, optimizationLevel:7}'
      ]
    }]
  }
};
