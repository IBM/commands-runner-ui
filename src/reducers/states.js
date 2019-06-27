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

export function states(state = {}, action) {
    // console.log(action.type)
    switch (action.type) {
        case Actions.STATES_FETCH:
            return Object.assign({}, state, {
                status: Actions.STATES_FETCH_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.STATES_FETCH_SUCCESS:
            var states = JSON.parse(getResponseBody(action.response))
            return Object.assign({}, state, {
                status: Actions.STATES_FETCH_REQUEST_STATUS.DONE,
                states: states.states,
                executionID: states["executed_by_extension_name"] + ":" + states["execution_id"]
            })
        case Actions.STATES_FETCH_FAILURE:
            return Object.assign({}, state, {
                status: Actions.STATES_FETCH_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.STATES_FETCH_EXTENSIONS:
            return Object.assign({}, state, {
                status: Actions.STATES_FETCH_EXTENSIONS_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.STATES_FETCH_EXTENSIONS_SUCCESS:
            var extensionsStates = JSON.parse(getResponseBody(action.response)).states
            return Object.assign({}, state, {
                status: Actions.STATES_FETCH_EXTENSIONS_REQUEST_STATUS.DONE,
                extensionsStates: extensionsStates
            })
        case Actions.STATES_FETCH_EXTENSIONS_FAILURE:
            return Object.assign({}, state, {
                status: Actions.STATES_FETCH_EXTENSIONS_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.STATES_INSERT:
            return Object.assign({}, state, {
                status: Actions.STATES_INSERT_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.STATES_INSERT_SUCCESS:
            return Object.assign({}, state, {
                status: Actions.STATES_INSERT_REQUEST_STATUS.DONE,
                response: action.response
            })
        case Actions.STATES_INSERT_FAILURE:
            return Object.assign({}, state, {
                status: Actions.STATES_INSERT_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.STATES_DELETE:
            return Object.assign({}, state, {
                status: Actions.STATES_DELETE_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.STATES_DELETE_SUCCESS:
            return Object.assign({}, state, {
                status: Actions.STATES_DELETE_REQUEST_STATUS.DONE,
                response: action.response
            })
        case Actions.STATES_DELETE_FAILURE:
            return Object.assign({}, state, {
                status: Actions.STATES_DELETE_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.ENGINE_RESET:
            return Object.assign({}, state, {
                status: Actions.ENGINE_RESET_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.ENGINE_RESET_SUCCESS:
            return Object.assign({}, state, {
                status: Actions.ENGINE_RESET_REQUEST_STATUS.DONE,
                resetEngineResponse: action.response // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.ENGINE_RESET_FAILURE:
            return Object.assign({}, state, {
                status: Actions.ENGINE_RESET_REQUEST_STATUS.ERROR,
                resetEngineError: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.STATES_REFRESH_DATE:
            return Object.assign({}, state, {
                refreshedDate: action.refreshedDate // may neeed to tweak this, not actually sure what you want to send back
            })
        default:
            return state
    }
}

