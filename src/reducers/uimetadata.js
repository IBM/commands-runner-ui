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

export function uimetadata(state = {}, action) {
    // console.log(action.type)
    switch (action.type) {
        case Actions.UIMETADATA_FETCH:
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_FETCH_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.UIMETADATA_FETCH_SUCCESS:
            var uimetadata = JSON.parse(getResponseBody(action.response)).ui_metadata
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_FETCH_REQUEST_STATUS.DONE,
                uimetadata: uimetadata
            })
        case Actions.UIMETADATA_FETCH_FAILURE:
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_FETCH_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.UIMETADATA_PREVIOUS_FETCH:
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_FETCH_PREVIOUS_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.UIMETADATA_FETCH_PREVIOUS_SUCCESS:
            var uimetadata = JSON.parse(getResponseBody(action.response)).ui_metadata
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_FETCH_PREVIOUS_REQUEST_STATUS.DONE,
                uimetadataPrevious: uimetadata
            })
        case Actions.UIMETADATA_FETCH_PREVIOUS_FAILURE:
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_FETCH_PREVIOUS_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.UIMETADATA_UPDATE:
            // console.log("action.uimetadata:"+JSON.stringify(action.uimetadata))
            return Object.assign({}, state, {
                uimetadata: action.uimetadata // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.UIMETADATA_UPDATE_SELECTED_CONFIG:
            // console.log("UPdate " + JSON.stringify(action.data))
            return Object.assign({}, state, {
                uimetadataSelectedConfig: { ...action.data }
            })
        case Actions.UIMETADATA_CONFIGS_FETCH:
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_CONFIGS_FETCH_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.UIMETADATA_CONFIGS_FETCH_SUCCESS:
            var uimetadataConfigs = JSON.parse(getResponseBody(action.response)).ui_metadata
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_CONFIGS_FETCH_REQUEST_STATUS.DONE,
                uimetadataConfigs: uimetadataConfigs
            })
        case Actions.UIMETADATA_CONFIGS_FETCH_FAILURE:
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_CONFIGS_FETCH_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.UIMETADATA_ALL_CONFIGS_NAMES_FETCH:
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_ALL_CONFIGS_NAMES_FETCH_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.UIMETADATA_ALL_CONFIGS_NAMES_FETCH_SUCCESS:
            // console.log(getResponseBody(action.response))
            var uimetadataConfigs = JSON.parse(getResponseBody(action.response)).ui_metadata
            // console.log(uimetadataConfigs)
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_ALL_CONFIGS_NAMES_FETCH_REQUEST_STATUS.DONE,
                uimetadataAllConfigsNames: uimetadataConfigs
            })
        case Actions.UIMETADATA_ALL_CONFIGS_NAMES_FETCH_FAILURE:
            return Object.assign({}, state, {
                status: Actions.UIMETADATA_ALL_CONFIGS_NAMES_FETCH_REQUEST_STATUS.ERROR,
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        default:
            return state
    }
}

