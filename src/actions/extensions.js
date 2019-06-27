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

export function extensionLoading(isLoading) {
    return { type: Actions.EXTENSIONS_LOADING, isLoading }
}

export function fetchRegisteredExtensions() {
    return { type: Actions.EXTENSIONS_FETCH_REGISTERED }
}

export function fetchRegisteredExtensionsSuccess(response) {
    return { type: Actions.EXTENSIONS_FETCH_REGISTERED_SUCCESS, response }
}

export function fetchRegisteredExtensionsFailure(error) {
    return { type: Actions.EXTENSIONS_FETCH_REGISTERED_FAILURE, error }
}

export function registerExtension() {
    return { type: Actions.EXTENSION_REGISTER }
}

export function registerExtensionSuccess(response) {
    return { type: Actions.EXTENSION_REGISTER_SUCCESS, response }
}

export function registerExtensionFailure(error) {
    return { type: Actions.EXTENSION_REGISTER_FAILURE, error }
}

export function unregisterExtension() {
    return { type: Actions.EXTENSION_UNREGISTER }
}

export function unregisterExtensionSuccess(response) {
    return { type: Actions.EXTENSION_UNREGISTER_SUCCESS, response }
}

export function unregisterExtensionFailure(error) {
    return { type: Actions.EXTENSION_UNREGISTER_FAILURE, error }
}

export function fetchAllExtensions() {
    return { type: Actions.EXTENSIONS_FETCH_ALL }
}

export function fetchAllExtensionsSuccess(response) {
    return { type: Actions.EXTENSIONS_FETCH_ALL_SUCCESS, response }
}

export function fetchAllExtensionsFailure(error) {
    return { type: Actions.EXTENSIONS_FETCH_ALL_FAILURE, error }
}


