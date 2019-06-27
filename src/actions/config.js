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

export function uploadConfig() {
    return {type: Actions.UPLOAD_CONFIG}
}

export function receiveConfigSuccess(response) {
    return {type: Actions.UPLOAD_CONFIG_SUCCESS, response}
}

export function receiveConfigFailure(error) {
    return {type: Actions.UPLOAD_CONFIG_FAILURE, error}
}

export function fetchConfiguration() {
    return {type: Actions.FETCH_CONFIG}
}

export function fetchConfigurationSuccess(response) {
    return {type: Actions.FETCH_CONFIG_SUCCESS, response}
}

export function fetchConfigurationFailure(error) {
    return {type: Actions.FETCH_CONFIG_FAILURE, error}
}

export function fetchConfigurationConfigName() {
    return {type: Actions.FETCH_CONFIG_CONFIG_NAME}
}

export function fetchConfigurationConfigNameSuccess(response) {
    return {type: Actions.FETCH_CONFIG_CONFIG_NAME_SUCCESS, response}
}

export function fetchConfigurationConfigNameFailure(error) {
    return {type: Actions.FETCH_CONFIG_CONFIG_NAME_FAILURE, error}
}

export function fetchConfigurationAbout() {
    return {type: Actions.FETCH_CONFIG_ABOUT}
}

export function fetchConfigurationAboutSuccess(response) {
    return {type: Actions.FETCH_CONFIG_ABOUT_SUCCESS, response}
}

export function fetchConfigurationAboutFailure(error) {
    return {type: Actions.FETCH_CONFIG_ABOUT_FAILURE, error}
}

export function validateConfig() {
    return {type: Actions.VALIDATE_CONFIG}
}

export function validateConfigSuccess(response) {
    return {type: Actions.VALIDATE_CONFIG_SUCCESS, response}
}

export function validateConfigFailure(error) {
    return {type: Actions.VALIDATE_CONFIG_FAILURE, error}
}

export function generateConfig() {
    return {type: Actions.GENERATE_CONFIG}
}

export function generateConfigSuccess(response) {
    return {type: Actions.GENERATE_CONFIG_SUCCESS, response}
}

export function generateConfigFailure(error) {
    return {type: Actions.GENERATE_CONFIG_FAILURE, error}
}

export function deploymentAuthorized(isAuthorized) {
    return {type: Actions.DEPLOYMENT_AUTHORIZED, isAuthorized}
}

export function deploymentStart() {
    return {type: Actions.DEPLOYMENT_START}
}

export function deploymentSuccess(response) {
    return {type: Actions.DEPLOYMENT_SUCCESS, response}
}

export function deploymentFailure(error) {
    return {type: Actions.DEPLOYMENT_FAILURE, error}
}

export function deploymentIsRunning(isRunning) {
    return {type: Actions.DEPLOYMENT_IS_RUNNING, isRunning}
}

export function deploymentRunning() {
    return {type: Actions.DEPLOYMENT_RUNNING}
}

export function deploymentRunningSuccess(response) {
    return {type: Actions.DEPLOYMENT_RUNNING_SUCCESS, response}
}

export function deploymentRunningFailure(error) {
    return {type: Actions.DEPLOYMENT_RUNNING_FAILURE, error}
}

export function updateConfiguration(config) {
    // // console.log(Actions.UPDATE_CONFIG+":"+JSON.stringify(config))
    return {type: Actions.UPDATE_CONFIG, config}
}
