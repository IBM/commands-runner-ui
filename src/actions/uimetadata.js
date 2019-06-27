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

export function fetchUIMetadata() {
    return {type: Actions.UIMETADATA_FETCH}
}

export function fetchUIMetadataSuccess(response) {
    return {type: Actions.UIMETADATA_FETCH_SUCCESS, response}
}

export function fetchUIMetadataFailure(error) {
    return {type: Actions.UIMETADATA_FETCH_REQUEST_STATUS, error}
}

export function fetchUIMetadataPrevious() {
    return {type: Actions.UIMETADATA_FETCH_PREVIOUS}
}

export function fetchUIMetadataPreviousSuccess(response) {
    return {type: Actions.UIMETADATA_FETCH_PREVIOUS_SUCCESS, response}
}

export function fetchUIMetadataPreviousFailure(error) {
    return {type: Actions.UIMETADATA_FETCH_PREVIOUS_REQUEST_STATUS, error}
}

export function updateUIMetadata(uimetadata) {
    return {type: Actions.UIMETADATA_UPDATE, uimetadata}
}

export function updateUIMetadtaSelectedConfigName(data) {
    return {type: Actions.UIMETADATA_UPDATE_SELECTED_CONFIG, data}
}

export function fetchUIMetadataConfigs() {
    return {type: Actions.UIMETADATA_CONFIGS_FETCH}
}

export function fetchUIMetadataConfigsSuccess(response) {
    return {type: Actions.UIMETADATA_CONFIGS_FETCH_SUCCESS, response}
}

export function fetchUIMetadataConfigsFailure(error) {
    return {type: Actions.UIMETADATA_CONFIGS_FETCH_REQUEST_STATUS, error}
}

export function fetchUIMetadataAllConfigsNames() {
    return {type: Actions.UIMETADATA_ALL_CONFIGS_NAMES_FETCH}
}

export function fetchUIMetadataAllConfigsNamesSuccess(response) {
    return {type: Actions.UIMETADATA_ALL_CONFIGS_NAMES_FETCH_SUCCESS, response}
}

export function fetchUIMetadataAllConfigsNamesFailure(error) {
    return {type: Actions.UIMETADATA_ALL_CONFIGS_NAMES_FETCH_REQUEST_STATUS, error}
}
