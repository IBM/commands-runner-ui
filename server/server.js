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
var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');

const usage = () => {
  console.log("node server.js [key cert]")
}

if (process.argv.length < 2 || (process.argv.length > 2 && process.argv.length < 4 )) {
  console.log(process.argv.length)
  usage()
  process.exit(1)
}



var buildPath = path.join(__dirname,'../build')
// Create a service (the app object is just a callback).
var app = express();

// Create an HTTP service.
console.log("Create http server port 30100")
http.createServer(app).listen(30100);
// Create an HTTPS service identical to the HTTP service.
if (process.argv.length > 2) {
  console.log("Create https server port 30102")
  // This line is from the Node.js HTTPS documentation.
  var options = {
    key: fs.readFileSync(process.argv[2]),
    cert: fs.readFileSync(process.argv[3])
  };
  https.createServer(options, app).listen(30102);
}
console.log("app use path "+buildPath)
app.use(express.static(buildPath))

console.log("app use path "+buildPath)
app.use(express.static(buildPath))

// Handles any requests that don't match the ones above
console.log("Redirect all request to "+path.join(buildPath,'index.html'))
app.get('*', (req,res) =>{
    res.sendFile(path.join(buildPath,'index.html'));
});