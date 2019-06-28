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
import * as Actions from './actionTypes'

export function fetchLogs() {
    return { type: Actions.LOGS_FETCH }
}

export function fetchLogsSuccess(response) {
    return { type: Actions.LOGS_FETCH_SUCCESS, response }
}

export function fetchLogsFailure(error) {
    return { type: Actions.LOGS_FETCH_FAILURE, error }
}

// export function updateLogs(logsPart) {
//     return { type: Actions.LOGS_UPDATE, logsPart }
// }

export function saveLogsParameters(extensionName, stateName, stateLabel) {
    return { type: Actions.LOGS_SAVE_PARAMETERS, extensionName, stateName, stateLabel }
}

export function refreshDate(refreshedDate) {
    return { type: Actions.LOGS_REFRESH_DATE, refreshedDate }
}


