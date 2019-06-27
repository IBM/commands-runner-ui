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
import { config } from './config'
import { states } from './states'
import { state } from './state'
import { settings } from './settings'
import { logs } from './logs'
import { cr } from './cr'
import { modal } from './modal'
import { extensions } from './extensions'
import { uimetadata } from './uimetadata'

import { combineReducers } from 'redux'

const configManagerApp = combineReducers({
    config: config,
    states: states,
    state: state,
    settings: settings,
    logs: logs,
    cr: cr,
    modal: modal,
    extensions: extensions,
    uimetadata: uimetadata,
})

export default configManagerApp