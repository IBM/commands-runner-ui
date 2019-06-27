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

export function cr(state = {}, action) {
    switch (action.type) {
        case Actions.CR_CHECK_STATUS:
            return Object.assign({}, state, {
                statusCheckStatus: Actions.CR_CHECK_STATUS_REQUEST_STATUS.IN_PROGRESS
            })
        case Actions.CR_CHECK_STATUS_SUCCESS:
            var status = JSON.parse(getResponseBody(action.response))
            var inceptionSetupCompleted = (status['cr_post_install_status'] !== undefined && status['cr_post_install_status'].value === "COMPLETED")
            var inceptionUp = (status['cr_status'] !== undefined && status['cr_status'].value === "Up")
            return Object.assign({}, state, {
                statusCheckStatus: Actions.CR_CHECK_STATUS_REQUEST_STATUS.DONE,
                status: status,
                inceptionSetupCompleted: inceptionSetupCompleted,
                inceptionUp: inceptionUp
            })
        case Actions.CR_CHECK_STATUS_FAILURE:
            return Object.assign({}, state, {
                statusCheckStatus: Actions.CR_CHECK_STATUS_REQUEST_STATUS.ERROR,
                status: undefined,
                inceptionSetupCompleted: false
            })
        case Actions.CR_FETCH_SETTINGS:
            return Object.assign({}, state, {
                statusGetSettings: Actions.CR_FETCH_SETTINGS_REQUEST_STATUS.IN_PROGRESS
            })
        case Actions.CR_FETCH_SETTINGS_SUCCESS:
            var settings = JSON.parse(getResponseBody(action.response))
            return Object.assign({}, state, {
                statusGetSettings: Actions.CR_FETCH_SETTINGS_REQUEST_STATUS.DONE,
                settings: settings
            })
        case Actions.CR_FETCH_SETTINGS_FAILURE:
            return Object.assign({}, state, {
                statusGetSettings: Actions.CR_FETCH_SETTINGS_REQUEST_STATUS.ERROR,
            })
        default:
            return state
    }
}

