var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  host: '192.168.1.89',
  port: 3000,
  stats: {
    colors: true
  }
}).listen(3000, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});
