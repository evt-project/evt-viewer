const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
   devtool: 'source-map',
   context: path.resolve(__dirname, 'app'),
   entry: [
      './src/evtviewer.js',
   ],
   output: {
      path: path.resolve('dist'),
      filename: 'evtviewer.bundle.js'
   },
   plugins: [
      new HtmlWebpackPlugin({ template: './index.html' }),
   ],
   module: {
      rules: [
         { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
         { test: /\.css$/, loader: 'style-loader!css-loader' },
         { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
         { test: /\.html$/, loader: 'html-loader' },
         // inline base64 URLs for <=8k images, direct URLs for the rest
         { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
         // helps to load bootstrap's css.
         {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?limit=10000&minetype=application/font-woff'
         },
         {
            test: /\.woff2$/,
            loader: 'url-loader?limit=10000&minetype=application/font-woff'
         },
         {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?limit=10000&minetype=application/octet-stream'
         },
         {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader'
         },
         {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader?limit=10000&minetype=image/svg+xml'
         }
      ]
   },
};
