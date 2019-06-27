
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
module.exports = {
  // Provides process.env.NODE_ENV with value production.
  // Enables FlagDependencyUsagePlugin, FlagIncludedChunksPlugin,
  // ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin,
  // SideEffectsFlagPlugin and UglifyJsPlugin.
  mode: "production",
//  devtool: "source-map",
  // see https://webpack.js.org/configuration/optimization/
  // configure `webpack-serve` options here
  serve: {
    port: 30100,
    // The path, or array of paths, from which static content will be served.
    // Default: process.cwd()
    // see https://github.com/webpack-contrib/webpack-serve#options
    content: path.resolve(__dirname, "build"),
    add: (app, middleware, options) => {
      // SPA are usually served through index.html so when the user refresh from another
      // location say /about, the server will fail to GET anything from /about. We use
      // HTML5 History API to change the requested location to the index we specified
      app.use(historyApiFallback());
      app.use(
        convert(
          // Although we are using HTML History API to redirect any sub-directory requests to index.html,
          // the server is still requesting resources like JavaScript in relative paths,
          // for example http://localhost:8080/users/main.js, therefore we need proxy to
          // redirect all non-html sub-directory requests back to base path too
          proxy(
            // if pathname matches RegEx and is GET
            (pathname, req) => pathname.match("/.*/") && req.method === "GET",
            {
              // options.target, required
              target: "http://localhost:30100",
              pathRewrite: {
                "^/.*/": "/" // rewrite back to base path
              }
            }
          )
        )
      );
    }
  }
};
