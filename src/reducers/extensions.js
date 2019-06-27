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
import * as Actions from '../actions/actionTypes'
import { getResponseBody } from '../utils/httpUtils'

export function extensions(state = {}, action) {
    var extensions
    switch (action.type) {
        case Actions.EXTENSIONS_LOADING:
            return Object.assign({}, state, {
                isLoading: action.isLoading
            })
        case Actions.EXTENSIONS_FETCH_REGISTERED:
            return Object.assign({}, state, {
                status: Actions.EXTENSIONS_FETCH_REGISTERED_REQUEST_STATUS.IN_PROGRESS
            })
        case Actions.EXTENSIONS_FETCH_REGISTERED_SUCCESS:
            extensions = JSON.parse(getResponseBody(action.response)).extensions
            return Object.assign({}, state, {
                status: Actions.EXTENSIONS_FETCH_REGISTERED_REQUEST_STATUS.DONE,
                registeredExtensions: extensions
            })
        case Actions.EXTENSIONS_FETCH_REGISTERED_FAILURE:
            return Object.assign({}, state, {
                status: Actions.EXTENSIONS_FETCH_REGISTERED_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.EXTENSION_REGISTER:
            return Object.assign({}, state, {
                status: Actions.EXTENSION_REGISTER_REQUEST_STATUS.IN_PROGRESS
            })
        case Actions.EXTENSION_REGISTER_SUCCESS:
            return Object.assign({}, state, {
                status: Actions.EXTENSION_REGISTER_REQUEST_STATUS.DONE,
                response: action.response
            })
        case Actions.EXTENSION_REGISTER_FAILURE:
            return Object.assign({}, state, {
                status: Actions.EXTENSION_REGISTER_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.EXTENSION_UNREGISTER:
            return Object.assign({}, state, {
                status: Actions.EXTENSION_UNREGISTER_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.EXTENSION_UNREGISTER_SUCCESS:
            return Object.assign({}, state, {
                status: Actions.EXTENSION_UNREGISTER_REQUEST_STATUS.DONE,
                response: action.response
            })
        case Actions.EXTENSION_UNREGISTER_FAILURE:
            return Object.assign({}, state, {
                status: Actions.EXTENSION_UNREGISTER_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.EXTENSIONS_FETCH_ALL:
            return Object.assign({}, state, {
                status: Actions.EXTENSIONS_FETCH_ALL_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.EXTENSIONS_FETCH_ALL_SUCCESS:
            extensions = JSON.parse(getResponseBody(action.response)).response
            return Object.assign({}, state, {
                status: Actions.EXTENSIONS_FETCH_ALL_REQUEST_STATUS.DONE,
                extensions: extensions
            })
        case Actions.EXTENSIONS_FETCH_ALL_FAILURE:
            return Object.assign({}, state, {
                status: Actions.EXTENSIONS_FETCH_ALL_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        default:
            return state
    }
}


