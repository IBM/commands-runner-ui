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
import cookie from 'react-cookies'

const baseUrl = "/cr/v1"

export const urlCookieKey = 'commands-runner-server-url-port-' + window.location.port
export const tokenCookieKey = 'commands-runner-token-port-' + window.location.port
export const timeoutCookieKey = 'commands-runner-timeout-port-' + window.location.port
export const settingsCookieKey = 'commands-runner-settings-' + window.location.port

// const configFile = "/data/config-manager.json"
export const getAPIUrl = () => {
    // nconf.argv().env().file({file: {configFile}})
    // var crUrl = nconf.get('crurl')
    var crUrl = cookie.load(urlCookieKey)
    return crUrl + baseUrl
}

export const getToken = () => {
    // nconf.argv().env().file({file: {configFile}})
    // return nconf.get('token')
    return cookie.load(tokenCookieKey)
}

export const getTimeout = () => {
    return cookie.load(timeoutCookieKey)
}

export const getSettings = () => {
    return cookie.load(settingsCookieKey)
}

//This search a property at pathArray location and if not found it creates it.
export const searchAndCreateProperty = (uimetadata, pathArray, config) => {
    var configString = JSON.stringify(config)
    // console.log("configString:"+configString)
    var auxConfig = JSON.parse(configString)
    var parentConfig = auxConfig
    var n = pathArray.length - 1
    for (var i = 0; i < n; i++) {
        var element = pathArray[i]
        if (isNaN(element)) {
            if (auxConfig[element] === undefined) {
                var nextElement = pathArray[i + 1]
                if (!isNaN(nextElement)) {
                    auxConfig[element] = []
                } else {
                    auxConfig[element] = {}
                }
            }
            auxConfig = auxConfig[element]
        } else {
            var index = parseInt(element)
            if (index > (auxConfig.length - 1)) {
                var nextElement = pathArray[i + 1]
                if (!isNaN(nextElement)) {
                    auxConfig.push([])
                } else {
                    auxConfig.push({})
                }
            }
            auxConfig = auxConfig[index]
        }
    };
    var lastPathArray = pathArray[n]
    if (auxConfig[lastPathArray] === undefined &&
        uimetadata.default !== undefined) {
        auxConfig[lastPathArray] = uimetadata.default
    }
    if (auxConfig[lastPathArray] === undefined) {
        // console.log("uimetadata.type:"+uimetadata.type)
        switch (uimetadata.type) {
            case 'checkbox':
                auxConfig[lastPathArray] = false
                break;
            case 'dropdown':
                auxConfig[lastPathArray] = uimetadata.items[0].id
                break;
            case 'array':
                if (lastPathArray === uimetadata.name) {
                    auxConfig[lastPathArray] = []
                }
                break;
            default:
                if (uimetadata.properties !== undefined) {
                    auxConfig[lastPathArray] = {}
                } else {
                    auxConfig[lastPathArray] = ''
                }
        }
    }
    return { newElem: auxConfig[lastPathArray], newConfig: parentConfig }
}

// export const searchPropertyUIMetadata = (uimetadata, pathArray) => {
//     var auxUIMetadata = uimetadata
//     var n = pathArray.length
//     for (var i = 0; i < n; i++) {
//         var element = pathArray[i]
//         if (isNaN(element)) {
//             auxUIMetadata = auxUIMetadata[element]
//         } else {
//             var index = parseInt(element)
//             auxUIMetadata = auxUIMetadata[index]
//         }
//     }
//     return auxUIMetadata
// }

//This method update the property located at pathArray with the provided value.
//It returns a copy of the config.
export const updateConfig = (pathArray, value, config) => {
    var auxConfig = JSON.parse(JSON.stringify(config))
    var parentConfig = auxConfig
    var n = pathArray.length - 1
    for (var i = 0; i < n; i++) {
        var element = pathArray[i]
        if (!isNaN(pathArray[i])) {
            element = parseInt(pathArray[i])
        }
        auxConfig = auxConfig[element]
    };
    var element = pathArray[n]
    if (!isNaN(pathArray[n])) {
        element = parseInt(pathArray[n])
    }
    auxConfig[element] = value
    return parentConfig
}

//This method return the value of the property located at pathArray.
export const getConfigValue = (pathArray, config) => {
    console.log(JSON.stringify(config))
    var auxConfig = JSON.parse(JSON.stringify(config))
    console.log(JSON.stringify(pathArray))
    var n = pathArray.length - 1
    for (var i = 0; i < n; i++) {
        var element = pathArray[i]
        if (!isNaN(pathArray[i])) {
            element = parseInt(pathArray[i])
        }
        console.log(JSON.stringify(auxConfig))
        console.log(element)
        auxConfig = auxConfig[element]
    };
    var element = pathArray[n]
    if (!isNaN(pathArray[n])) {
        element = parseInt(pathArray[n])
    }
    return  auxConfig[element]
}

export const isArrayFirstElemPath = (path) => {
    var regex = RegExp(".*\.(0$|0\..*)")
    return regex.test(path)
}

const equalEval = (v1,v2) => {
    console.log(v1 == v2)
    return v1 == v2
} 

const inEval = (v1,ar) => {
    return ar.includes(v1)
}

export const evalBool = (exp, config) => {
    console.log("expression", exp)
    if (exp == undefined) {
        return false
    }
    var expression = String(exp)
    if (expression.startsWith("$")) {
        var ar = expression.split(",") 
        var configValue = getConfigValue(ar[1].split("."),config)
        console.log(ar[0])
        switch(ar[0]) {
            case '$equal': 
                console.log(configValue,String(ar[2]))
                return equalEval(String(configValue),String(ar[2]))
            case '$in': 
                console.log(String(ar.slice(2)))
                console.log(configValue,ar.slice(2))
                console.log(inEval(String(configValue),ar.slice(2)))
                return inEval(String(configValue),ar.slice(2))
        }
    } else {
        return exp
    }
}