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
import { getResponseBody} from '../utils/httpUtils'

export function logs(state = {}, action) {
    switch (action.type) {
        case Actions.LOGS_FETCH:
            return Object.assign({}, state, {
                status: Actions.LOGS_FETCH_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.LOGS_FETCH_SUCCESS:
            return Object.assign({}, state, {
                status: Actions.LOGS_FETCH_REQUEST_STATUS.DONE,
                logs: (state.logs ? state.logs : '' ) + getResponseBody(action.response)
 //               response: action.response // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.LOGS_FETCH_FAILURE:
            return Object.assign({}, state, {
                status: Actions.LOGS_FETCH_REQUEST_STATUS.ERROR,
                logs: (state.logs ? state.logs : '' ),
                error: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.LOGS_SAVE_PARAMETERS:
            return Object.assign({}, state, {
                extensionName: action.extensionName,
                stateName: action.stateName,
                stateLabel: action.stateLabel
            })
        // case Actions.LOGS_UPDATE:
        //     return Object.assign({}, state, {
        //         logs: (state.logs ? state.logs : '' ) + action.logsPart // may neeed to tweak this, not actually sure what you want to send back
        //     })
        case Actions.LOGS_REFRESH_DATE:
            return Object.assign({}, state, {
                refreshedDate: action.refreshedDate // may neeed to tweak this, not actually sure what you want to send back
            })
        default:
            return state
    }
}

