const devCerts = require("office-addin-dev-certs");
//const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const {port, apiPortWhenDeveloping, useTls} = require("./config");

module.exports = async (env, options)  => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      /*
      vendor: [
        'react',
        'react-dom',
        'core-js',
        'office-ui-fabric-react'
    ],*/
    taskpane: [
        'react-hot-loader/patch',
        './src/taskpane/index.tsx',
    ],
    commands: './src/commands/commands.ts'
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
              //'react-hot-loader/webpack',
              'ts-loader'
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          use: {
              loader: 'file-loader',
              query: {
                  name: 'assets/[name].[ext]'
                }
              }  
            }   
          ]
    },
    output: {
      publicPath: "/"
    },
    plugins: [
      //new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
        {
          to: "taskpane/taskpane.css",
          from: "./src/taskpane/taskpane.css"
        }
      ]),
      //new ExtractTextPlugin('[name].[hash].css'),
      new HtmlWebpackPlugin({
        filename: "taskpane/index.html",
          template: './src/taskpane/taskpane.html',
          chunks: ['taskpane', 'vendor', 'polyfills']
      }),
      new HtmlWebpackPlugin({
          filename: "commands.html",
          template: "./src/commands/commands.html",
          chunks: ["commands"],
      }),
      new CopyWebpackPlugin([
          {
              from: './assets',
              ignore: ['*.scss'],
              to: 'assets',
          }
      ]),
      new webpack.ProvidePlugin({
        Promise: ["es6-promise", "Promise"]
      })
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      contentBase: path.join(__dirname, 'dist'),
      //https: await devCerts.getHttpsServerOptions(),
      
      https: useTls ? {
        key: fs.readFileSync('local.key'),
        cert: fs.readFileSync('local.crt')
      } : undefined,

      proxy: {
        "/api": {target: (useTls ? "https" : "http") + "://localhost:" + apiPortWhenDeveloping + "/api", secure: true}
      },
      
      port: port,
      historyApiFallback: {
        index: 'taskpane/index.html'
      }
    }
  };

  return config;
};
