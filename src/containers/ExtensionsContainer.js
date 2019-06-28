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

import React from 'react'
import { translate } from "react-i18next";

import { connect } from 'react-redux'

import {
    extensionLoading,
    fetchRegisteredExtensions,
    fetchRegisteredExtensionsSuccess,
    fetchRegisteredExtensionsFailure,
    registerExtension,
    registerExtensionSuccess,
    registerExtensionFailure,
    unregisterExtension,
    unregisterExtensionSuccess,
    unregisterExtensionFailure,

} from '../actions/extensions'
import {
    fetchStates,
    fetchStatesSuccess,
    fetchStatesFailure,
    fetchStatesExtensions,
    fetchStatesExtensionsSuccess,
    fetchStatesExtensionsFailure,
    insertStates,
    insertStatesSuccess,
    insertStatesFailure,
    deleteStates,
    deleteStatesSuccess,
    deleteStatesFailure,

} from '../actions/states'
import ExtensionsComponent from '../components/Extensions'
import { httpRequest, httpGet, httpPut, httpPost, httpDelete, errorAlert } from '../utils/httpUtils'
import { Icon } from 'carbon-components-react';
import { getSettings } from '../utils/configUtils';
import { updateModal } from '../actions/modal';

require('../scss/table.scss')

const settings = getSettings()

class Extensions extends React.Component {

    componentDidMount() {
        this.fetchExtensions()
    }

    render() {
        return <ExtensionsComponent
            getExtensions={this.getExtensions}
            registerExtensionAction={this.registerExtensionAction}
            addExtensionSubmit={this.addExtensionSubmit}
            isLoading={this.props.isLoading}
        />
    }

    fetchExtensions = () => {
        this.props.extensionLoading(false)
        httpRequest('/extensions', httpGet, {}, undefined, this.props.fetchRegisteredExtensions, this.props.fetchRegisteredExtensionsSuccess, this.fetchStatesExtensions, this.props.fetchRegisteredExtensionsFailure, undefined)
    }

    fetchStatesExtensions = () => {
        var url = "/states?extension-name=" + settings.default_extension_name + "&extensions-only=true&recursive=false"
        // console.log(url)
        httpRequest(url, httpGet, {}, undefined, this.props.fetchStatesExtensions, this.props.fetchStatesExtensionsSuccess, this.fetchStates, this.props.fetchStatesExtensionsFailure, this.fetchStatesExtensionsFailed)
    }

    fetchStatesExtensionsFailed = () => {
        const { t } = this.props
        errorAlert(t("extension.fetch.failed"), this.props.error)
    }

    fetchStates = () => {
        httpRequest('/states?extension-name=' + settings.default_extension_name, httpGet, {}, undefined, this.props.fetchStates, this.props.fetchStatesSuccess, undefined, this.props.fetchStatesFailure, this.fetchStatesFailed)
    }

    fetchStatesFailed = () => {
        const { t } = this.props
        errorAlert(t("states.fetch.failed") + this.props.error)
    }

    getExtensions = () => {
        var results = []
        var registeredExtensions = this.props.registeredExtensions
        var statesExtensions = this.props.extensionsStates
        if (this.props.registeredExtensions !== undefined && this.props.extensionsStates !== undefined) {
            for (var key in registeredExtensions) {
                var deleteAction = ''
                var insertRemoveAction = ''
                if (registeredExtensions.hasOwnProperty(key)) {
                    if (registeredExtensions[key].type === "custom") {
                        deleteAction = <Icon
                            name="icon--delete"
                            description="Unregister the extension"
                            onClick={this.unregisterExtensionAction.bind(this, key)}
                        />
                    }
                    var extension = statesExtensions.find(item => item.name === key)
                    if (extension === undefined) {
                        insertRemoveAction = <Icon
                            name="icon--add--outline"
                            description="Add extension to the main deployment process"
                            onClick={this.addExtensionAction.bind(this, key)}
                        />
                    } else {
                        insertRemoveAction = <Icon
                            name="icon--subtract--outline"
                            description="Remove extension from the main deployment process"
                            onClick={this.removeExtensionAction.bind(this, key)}
                        />
                    }
                    if (key != settings.default_extension_name) {
                        results.push({
                            id: key,
                            type: registeredExtensions[key].type,
                            insertRemove: insertRemoveAction,
                            deleteAction: deleteAction
                        })
                    }
                }
            }

        }
        return results

    }

    registerExtensionAction = evt => {
        this.props.extensionLoading(true)
        var form = new FormData()
        form.append('extension', evt.target.files[0])
        httpRequest('/extension', httpPost, {}, form, this.props.registerExtension, this.props.registerExtensionSuccess, this.fetchExtensions, this.props.registerExtensionFailure, this.registerExtensionFailed.bind(this, form))
    }

    registerExtensionFailed = form => {
        this.props.extensionLoading(false)
        var errorMsg = JSON.stringify(this.props.extensionError).toLowerCase()

        if (errorMsg.includes("already registered")) {
            var extensionName = errorMsg.split(" ")[1]
            this.openConfirmModal(extensionName, form)
        } else if (errorMsg.includes("timeout")) {
            this.openFailureModal()
        }

    }

    openConfirmModal(extensionName, form) {
        const { t } = this.props
        this.props.updateModal({
            type: 'confirm',
            open: true,
            modalHeading: t("modal.extension.overwrite.header"),
            onRequestCancel: this.overwriteExtensionClosed,
            onRequestConfirm: this.registerExtensionActionForce.bind(this, form),
            onRequestClose: this.overwriteExtensionClosed,
            primaryButtonText: 'Yes',
            secondaryButtonText: 'No',
            contentText: (extensionName + ": " + t("modal.extension.overwrite.content"))
        })
    }

    openFailureModal() {
        const { t } = this.props
        this.props.updateModal({
            type: 'add-extension-failed',
            open: true,
            modalHeading: t("modal.extension.failed.header"),
            onRequestClose: this.overwriteExtensionClosed,
            contentText: (t("modal.extension.failed.content"))
        })
    }

    registerExtensionActionForce = form => {
        var headers = { 'Force': 'true' }
        httpRequest('/extension', httpPost, headers, form, this.props.registerExtension, this.props.registerExtensionSuccess, this.fetchExtensions, this.props.registerExtensionFailure, this.registerExtensionFailedForce)
        this.props.handleClose()
    }

    registerExtensionFailedForce = () => {
        var errorMsg = this.props.extensionError.response.text
        errorAlert("Error: " + errorMsg)
    }


    overwriteExtensionClosed = () => {
        this.props.handleClose()
    }


    unregisterExtensionAction = (name) => {
        httpRequest('/extension?extension-name=' + name, httpDelete, {}, undefined, this.props.unregisterExtension, this.props.unregisterExtensionSuccess, this.fetchExtensions, this.props.unregisterExtensionFailure, this.unregisterExtensionError)
    }

    unregisterExtensionError = () => {
        const { t } = this.props
        errorAlert(t("extension.unregister.failed") + this.props.extensionError.response.text)
    }

    addExtensionAction = (name) => {
        var extension = this.props.registeredExtensions[name]
        var isAutoPlacement = extension.call_state !== null &&
            extension.call_state.previous_states !== null &&
            extension.call_state.next_states !== null
        if (isAutoPlacement) {
            this.addExtensionSubmitWithName(name, undefined, undefined)
        } else {
            this.props.updateModal({
                type: 'add-extension',
                open: true,
                extensionName: name,
            })
        }
    }


    addExtensionSubmit = () => {
        this.props.handleClose()
        this.addExtensionSubmitWithName(this.props.selectedExtension, this.props.selectedState, this.props.selectedBeforeAfter)
    }

    addExtensionSubmitWithName = (name, stateRef, beforeAfter) => {
        var url = '/states?extension-name=' + settings.default_extension_name + '&action=insert&pos=0&insert-extension-name=' + name
        if (stateRef !== undefined) {
            url += '&state-name=' + stateRef
        }
        if (beforeAfter !== undefined) {
            url += '&before=' + (beforeAfter === 'BEFORE')
        }
        httpRequest(url, httpPut, {}, undefined, this.props.insertStates, this.props.insertStatesSuccess, this.fetchStatesExtensions, this.props.insertStatesFailure, this.addExtensionFailed)
    }

    addExtensionFailed = () => {
        const { t } = this.props
        errorAlert(t("extension.add.failed"), this.props.error)
    }

    removeExtensionAction = (name) => {
        var url = '/states?extension-name=' + settings.default_extension_name + '&action=delete&pos=0&state-name=' + name
        httpRequest(url, httpPut, {}, undefined, this.props.deleteStates, this.props.deleteStatesSuccess, this.fetchStatesExtensions, this.props.deleteStatesFailure, this.deleteExtensionFailed)
    }

    deleteExtensionFailed = () => {
        const { t } = this.props
        errorAlert(t("extension.delete.failed"), this.props.error)
    }

}

const mapStateToProps = state => {
    return {
        error: state.states.error,
        states: state.states.states,
        status: state.extensions.status,
        isLoading: state.extensions.isLoading,
        registeredExtensions: state.extensions.registeredExtensions,
        extensionError: state.extensions.error,
        extensionsStates: state.states.extensionsStates,
        selectedExtension: state.modal.selectedExtension,
        selectedState: state.modal.selectedState,
        selectedBeforeAfter: state.modal.selectedBeforeAfter,
    }
}

const mapDispatchToProps = dispatch => ({
    extensionLoading: (isLoading) => dispatch(extensionLoading(isLoading)),
    fetchStates: () => dispatch(fetchStates()),
    fetchStatesSuccess: (response) => dispatch(fetchStatesSuccess(response)),
    fetchStatesFailure: (error) => dispatch(fetchStatesFailure(error)),
    fetchRegisteredExtensions: () => dispatch(fetchRegisteredExtensions()),
    fetchRegisteredExtensionsSuccess: (response) => dispatch(fetchRegisteredExtensionsSuccess(response)),
    fetchRegisteredExtensionsFailure: (error) => dispatch(fetchRegisteredExtensionsFailure(error)),
    fetchExtensions: () => dispatch(fetchExtensions()),
    fetchExtensionsSuccess: (response) => dispatch(fetchExtensionsSuccess(response)),
    fetchExtensionsFailure: (error) => dispatch(fetchExtensionsFailure(error)),
    fetchStatesExtensions: () => dispatch(fetchStatesExtensions()),
    fetchStatesExtensionsSuccess: (response) => dispatch(fetchStatesExtensionsSuccess(response)),
    fetchStatesExtensionsFailure: (error) => dispatch(fetchStatesExtensionsFailure(error)),
    registerExtension: () => dispatch(registerExtension()),
    registerExtensionSuccess: (response) => dispatch(registerExtensionSuccess(response)),
    registerExtensionFailure: (error) => dispatch(registerExtensionFailure(error)),
    unregisterExtension: () => dispatch(unregisterExtension()),
    unregisterExtensionSuccess: (response) => dispatch(unregisterExtensionSuccess(response)),
    unregisterExtensionFailure: (error) => dispatch(unregisterExtensionFailure(error)),
    insertStates: () => dispatch(insertStates()),
    insertStatesSuccess: (response) => dispatch(insertStatesSuccess(response)),
    insertStatesFailure: (error) => dispatch(insertStatesFailure(error)),
    deleteStates: () => dispatch(deleteStates()),
    deleteStatesSuccess: (response) => dispatch(deleteStatesSuccess(response)),
    deleteStatesFailure: (error) => dispatch(deleteStatesFailure(error)),
    updateModal: (data) => dispatch(updateModal(data)),
    handleClose: () => dispatch(updateModal({ open: false, type: '', selectedStatus: undefined })),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(Extensions))

