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
import { getResponseBody } from '../utils/httpUtils';
import jsYaml from 'js-yaml'
import { getSettings } from '../utils/configUtils'

const settings = getSettings()

export function config(state = {}, action) {
    // console.log(action.type)
    switch (action.type) {
        case Actions.UPLOAD_CONFIG:
            return Object.assign({}, state, {
                statusUploadConfig: Actions.UPLOAD_REQUEST_STATUS.IN_PROGRESS
            })
        case Actions.UPLOAD_CONFIG_SUCCESS:
            return Object.assign({}, state, {
                statusUploadConfig: Actions.UPLOAD_REQUEST_STATUS.DONE,
                responseUploadConfig: action.response // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.UPLOAD_CONFIG_FAILURE:
            return Object.assign({}, state, {
                statusUploadConfig: Actions.UPLOAD_REQUEST_STATUS.ERROR,
                errorUploadConfig: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.UPDATE_CONFIG:
            // console.log("UPDATE_CONFIG:"+JSON.stringify(action.config))
            return Object.assign({}, state, {
                config: { [settings.config_root_key]: action.config }
            })
        case Actions.FETCH_CONFIG:
            return Object.assign({}, state, {
                statusFetchConfig: Actions.FETCH_CONFIG_REQUEST_STATUS.IN_PROGRESS
            })
        case Actions.FETCH_CONFIG_SUCCESS:
            var configJSON = JSON.parse(getResponseBody(action.response))
            var config = jsYaml.safeDump(configJSON)
            return Object.assign({}, state, {
                statusFetchConfig: Actions.FETCH_CONFIG_REQUEST_STATUS.DONE,
                responseFetchConfig: config, // may neeed to tweak this, not actually sure what you want to send back
                config: configJSON
            })
        case Actions.FETCH_CONFIG_FAILURE:

            return Object.assign({}, state, {
                statusFetchConfig: Actions.FETCH_CONFIG_REQUEST_STATUS.ERROR,
                errorFetchConfig: action.error, // may neeed to tweak this, not actually sure what you want to send back
                config: { [settings.config_root_key]: {} }
            })
        case Actions.FETCH_CONFIG_CONFIG_NAME:
            return Object.assign({}, state, {
                statusFetchConfigConfigName: Actions.FETCH_CONFIG_CONFIG_NAME_REQUEST_STATUS.IN_PROGRESS
            })
        case Actions.FETCH_CONFIG_CONFIG_NAME_SUCCESS:
            var configNameJSON = JSON.parse(getResponseBody(action.response))
            // console.log(JSON.stringify(configNameJSON))
            return Object.assign({}, state, {
                statusFetchConfigConfigName: Actions.FETCH_CONFIG_CONFIG_NAME_REQUEST_STATUS.DONE,
                configName: configNameJSON
            })
        case Actions.FETCH_CONFIG_CONFIG_NAME_FAILURE:
            return Object.assign({}, state, {
                statusFetchConfigName: Actions.FETCH_CONFIG_CONFIG_NAME_REQUEST_STATUS.ERROR,
                errorFetchConfigName: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.FETCH_CONFIG_ABOUT:
            return Object.assign({}, state, {
                statusFetchConfigAbout: Actions.FETCH_CONFIG_ABOUT_REQUEST_STATUS.IN_PROGRESS
            })
        case Actions.FETCH_CONFIG_ABOUT_SUCCESS:
            var configAboutJson = JSON.parse(getResponseBody(action.response))
            return Object.assign({}, state, {
                statusFetchConfigAbout: Actions.FETCH_CONFIG_ABOUT_REQUEST_STATUS.DONE,
                responseFetchConfigAbout: configAboutJson.about // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.FETCH_CONFIG_ABOUT_FAILURE:
            return Object.assign({}, state, {
                statusFetchConfigAbout: Actions.FETCH_CONFIG_ABOUT_REQUEST_STATUS.ERROR,
                errorFetchConfigAbout: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.VALIDATE_CONFIG:
            return Object.assign({}, state, {
                statusValidateConfig: Actions.VALIDATE_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.VALIDATE_CONFIG_SUCCESS:
            var statusValidateConfig = Actions.VALIDATE_REQUEST_STATUS.DONE
            if (action.response.statusCode === 299) {
                statusValidateConfig = Actions.VALIDATE_REQUEST_STATUS.DONE_WITH_WARNING
            }
            return Object.assign({}, state, {
                statusValidateConfig: statusValidateConfig,
                responseValidateConfig: action.response, // may neeed to tweak this, not actually sure what you want to send back
                errorValidateConfig: action
            })
        case Actions.VALIDATE_CONFIG_FAILURE:
            return Object.assign({}, state, {
                statusValidateConfig: Actions.VALIDATE_REQUEST_STATUS.ERROR,
                errorValidateConfig: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.GENERATE_CONFIG:
            return Object.assign({}, state, {
                statusGenerateConfig: Actions.GENERATE_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.GENERATE_CONFIG_SUCCESS:
            return Object.assign({}, state, {
                statusGenerateConfig: Actions.GENERATE_REQUEST_STATUS.DONE,
                responseGenerateConfig: action.response // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.GENERATE_CONFIG_FAILURE:
            return Object.assign({}, state, {
                statusGenerateConfig: Actions.GENERATE_REQUEST_STATUS.ERROR,
                errorGenerateConfig: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.DEPLOYMENT_AUTHORIZED:
            return Object.assign({}, state, {
                isAuthorized: action.isAuthorized // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.DEPLOYMENT_START:
            return Object.assign({}, state, {
                statusDeploymentStart: Actions.DEPLOYMENT_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.DEPLOYMENT_SUCCESS:
            return Object.assign({}, state, {
                statusDeploymentStart: Actions.DEPLOYMENT_REQUEST_STATUS.DONE,
                responseDeploymentStart: action.response // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.DEPLOYMENT_FAILURE:
            return Object.assign({}, state, {
                statusDeploymentStart: Actions.DEPLOYMENT_REQUEST_STATUS.ERROR,
                errorDeploymentStart: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.DEPLOYMENT_IS_RUNNING:
            return Object.assign({}, state, {
                isRunning: action.isRunning // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.DEPLOYMENT_RUNNING:
            return Object.assign({}, state, {
                statusDeploymentRunning: Actions.DEPLOYMENT_RUNNING_REQUEST_STATUS.IN_PROGRESS,
            })
        case Actions.DEPLOYMENT_RUNNING_SUCCESS:
            return Object.assign({}, state, {
                statusDeploymentRunning: Actions.DEPLOYMENT_RUNNING_REQUEST_STATUS.DONE,
                responseDeploymentRunning: action.response // may neeed to tweak this, not actually sure what you want to send back
            })
        case Actions.DEPLOYMENT_RUNNING_FAILURE:
            return Object.assign({}, state, {
                statusDeploymentRunning: Actions.DEPLOYMENT_RUNNING_REQUEST_STATUS.ERROR,
                errorDeploymentRunning: action.error // may neeed to tweak this, not actually sure what you want to send back
            })
        default:
            return state
    }
}

