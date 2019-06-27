/*
################################################################################
# Copyright 2019 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
################################################################################
*/
const path = require("path");
const merge = require("webpack-merge");
const convert = require("koa-connect");
const proxy = require("http-proxy-middleware");
const historyApiFallback = require("koa2-connect-history-api-fallback");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  // Provides process.env.NODE_ENV with value development.
  // Enables NamedChunksPlugin and NamedModulesPlugin.
  mode: "development",
  devtool: "inline-source-map",
 
  // configure `webpack-serve` options here
  devServer: {
    port: 5000,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  }
});
