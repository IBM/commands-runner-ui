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
import { getAPIUrl, getToken, getTimeout } from './configUtils'
import 'whatwg-fetch'
export const httpGet = "GET"
export const httpPost = "POST"
export const httpPut = "PUT"
export const httpDelete = "DELETE"
export const httpRequest = (url, method, headers, data, startDispatcher, successDispatcher, hookOnSuccess, failedDispatcher, hookOnFailure) => {
    const apiUrl = getAPIUrl()
    var requestUrl = apiUrl + url
    const token = getToken()
    var timeout = parseInt(getTimeout()) * 1000 // convert from seconds to ms
    if (isNaN(timeout) || timeout <= 0) { // invalid number
        timeout = 30000 // set default to 30 seconds
    }

    var request = require('superagent')
    var language = window.navigator.userLanguage || window.navigator.language;

    // console.log(requestUrl)
    startDispatcher()
    switch (method) {

        case httpGet:
            request.get(requestUrl)
                .set('Authorization', `Token:${token}`)
                .set('Accept-Language', language)
                .set(headers)
                .then(response => {
                    // console.log("successDispatcher"+successDispatcher)
                    successDispatcher(response)
                    // console.log(response)
                    if (hookOnSuccess) {
                        hookOnSuccess()
                    }
                })
                .catch(error => {
                    failedDispatcher(error)
                    if (hookOnFailure) {
                        hookOnFailure()
                    }
                });
            break

        case httpPost:
            request.post(requestUrl)
                .set('Authorization', `Token:${token}`)
                .set('Accept-Language', language)
                .set(headers)
                .send(data)
                .timeout({
                    response: 0,
                    deadline: timeout,
                })
                .then(response => {
                    successDispatcher(response)
                    if (hookOnSuccess) {
                        hookOnSuccess()
                    }
                })
                .catch(error => {
                    failedDispatcher(error)
                    if (hookOnFailure) {
                        hookOnFailure()
                    }
                });
            break

        case httpPut:
            request.put(requestUrl)
                .set('Authorization', `Token:${token}`)
                .set('Accept-Language', language)
                .set(headers)
                .send(data)
                .then(response => {
                    successDispatcher(response)
                    if (hookOnSuccess) {
                        hookOnSuccess()
                    }
                })
                .catch(error => {
                    failedDispatcher(error)
                    if (hookOnFailure) {
                        hookOnFailure()
                    }
                });
            break

        case httpDelete:
            request.delete(requestUrl)
                .set('Authorization', `Token:${token}`)
                .set('Accept-Language', language)
                .set(headers)
                .send(data)
                .then(response => {
                    successDispatcher(response)
                    if (hookOnSuccess) {
                        hookOnSuccess()
                    }
                })
                .catch(error => {
                    failedDispatcher(error)
                    if (hookOnFailure) {
                        hookOnFailure()
                    }
                });
            break

        default:
    }
}

export const errorAlert = (message, error) => {
    var errorMsg = ""
    if (error !== undefined) {
        errorMsg = (error.response ? (error.response.text ? error.response.text : error) : error)
    }
    alert(message + errorMsg)
}
export const getResponseBody = (response) => {
    return response.text
}
