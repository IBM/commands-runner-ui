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
import qs from 'query-string'

import * as Actions from '../actions/actionTypes'
import {
    fetchStates,
    fetchStatesSuccess,
    fetchStatesFailure,
    insertStates,
    insertStatesSuccess,
    insertStatesFailure,
    deleteStates,
    deleteStatesSuccess,
    deleteStatesFailure,
    resetEngine,
    resetEngineSuccess,
    resetEngineFailure,
    refreshDate,
    fetchStatesExtensions,
    fetchStatesExtensionsSuccess,
    fetchStatesExtensionsFailure,
} from '../actions/states'
import {
    setState,
    setStateSuccess,
    setStateFailure,
} from '../actions/state'
import {
    fetchRegisteredExtensions,
    fetchRegisteredExtensionsSuccess,
    fetchAllExtensionsFailure
} from '../actions/extensions'

import {
    validateConfig,
    validateConfigSuccess,
    validateConfigFailure,
    generateConfig,
    generateConfigSuccess,
    generateConfigFailure,
    deploymentAuthorized,
    deploymentStart,
    deploymentSuccess,
    deploymentFailure,
    deploymentIsRunning,
    deploymentRunning,
    deploymentRunningSuccess,
    deploymentRunningFailure,
} from '../actions/config'

import StatesComponent from '../components/States'
import { httpRequest, httpGet, httpPut, errorAlert } from '../utils/httpUtils'

import { Icon, DropdownV2 } from 'carbon-components-react';
import { updateModal } from '../actions/modal';
import { getSettings } from '../utils/configUtils';

require('../scss/table.scss')

const settings = getSettings()
var refreshedDate = require('moment')
refreshedDate.locale(window.navigator.language)
var stateDatesMoment = require('moment')
stateDatesMoment.locale(window.navigator.language)

class States extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRows: undefined,
            extensionName: undefined,
            error: ""
        }
    }

    componentWillMount() {
        const query = qs.parse(this.props.location.search)
        if (query['extension-name'] === undefined) {
            this.setState({ extensionName: settings.default_extension_name })
        } else {
            this.setState({ extensionName: query['extension-name'] })
        }
    }

    componentDidMount() {
        this.fetchStatesExtensions()
        this.tick()
        this.timerID = setInterval(
            () => this.tick(),
            10000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.checkDeploymentAuthorized()
        // if (this.props.extensionsStates !== undefined) {
        this.fetchStates()
        // console.log("tick.refreshDate")
        this.props.refreshDate(refreshedDate(new Date()))
        //        }

    }

    render() {
        return <StatesComponent
            getStates={this.getStates}
            extensionName={this.state.extensionName}
            resetEngine={this.resetEngine}
            isAuthorized={this.props.isAuthorized}
            isRunning={this.props.isRunning}
            startDeployment={this.validateGenerateConfigAndStartDeployment}
            refreshedDate={this.props.refreshedDate}
            editAction={this.editAction}
            changeStatesStatus={this.changeStatesStatus}
            addExtensionAction={this.addExtensionAction}
            addExtensionSubmit={this.addExtensionSubmit}
            defaultExtensionName={settings.default_extension_name}
        />
    }

    fetchStatesExtensions = () => {
        var url = "/states?extension-name=" + this.state.extensionName + "&extensions-only=true&recursive=true"
        httpRequest(url, httpGet, {}, undefined, this.props.fetchStatesExtensions, this.props.fetchStatesExtensionsSuccess, this.fetchStates, this.props.fetchStatesExtensionsFailure, this.fetchStatesExtensionsFailed)
    }

    fetchStatesExtensionsFailed = () => {
        const { t } = this.props
        errorAlert(t("extension.fetch.failed"), this.props.error)
    }

    editAction = selectedRows => () => {
        const { t } = this.props
        if (selectedRows.length !== 0) {
            this.setState({ selectedRows: selectedRows })
            this.props.updateModal({
                type: 'status-select',
                open: true,
                modalHeading: t("states.set.status"),
                primaryButtonText: t("button.submit"),
                secondaryButtonText: t("button.cancel"),
                selectedStatus: undefined,
                statusSelectText: t("status.select"),
                statusChooseText: t("status.choose")
            })
        } else {
            alert(t("states.alert.select_states"))
        }
    }

    changeStatesStatus = () => {
        var rows = this.state.selectedRows
        for (var i = 0; i < rows.length; i++) {
            var rowID = rows[i].id
            var state = this.findState(rowID)
            var stateName = state.name
            this.updateStatus(stateName, this.props.selectedStatus)
        }
        this.props.handleClose()
    }

    findState = (rowID) => {
        var states = this.props.states
        for (var i = 0; i < states.length; i++) {
            if (states[i].id === rowID) {
                return states[i]
            }
        }
    }

    updateStatus(stateName, status) {
        httpRequest('/state/' + stateName + '?extension-name=' + this.state.extensionName + '&status=' + status, httpPut, {}, undefined, this.props.setState, this.props.setStateSuccess, this.fetchStates, this.props.setStateFailure, this.updateStatusFailed)
    }

    updateStatusFailed = () => {
        errorAlert("Failed to update status: ", this.props.error)
    }

    addExtensionAction = () => () => {
        httpRequest('/extensions', httpGet, {}, undefined, this.props.fetchRegisteredExtensions, this.props.fetchRegisteredExtensionsSuccess, this.addExtensionActionOpenModal, this.props.fetchAllExtensionsFailure, this.fetchExtensionFailed)
    }

    fetchExtensionFailed = () => {
        errorAlert("Failed to fetch extensions: ", this.props.registeredExtensionsError)
    }

    addExtensionActionOpenModal = () => {
        this.props.updateModal({ type: 'add-extension', open: true, selectedStatus: undefined })
    }

    addExtensionSubmit = () => {
        this.props.handleClose()
        var url = '/states?extension-name=' + this.state.extensionName + '&action=insert&pos=0&insert-extension-name=' + this.props.selectedExtension
        if (this.props.selectedState !== undefined) {
            url += '&state-name=' + this.props.selectedState
        }
        if (this.props.selectedBeforeAfter !== undefined) {
            url += '&before=' + (this.props.selectedBeforeAfter === 'BEFORE')
        }
        httpRequest(url, httpPut, {}, undefined, this.props.insertStates, this.props.insertStatesSuccess, this.fetchStatesExtensions, this.props.insertStatesFailure, this.addExtensionFailed)
    }

    addExtensionFailed = () => {
        errorAlert("Failed to add extension: ", this.props.error)
    }

    deleteExtension = (stateName) => {
        var url = '/states?extension-name=' + this.state.extensionName + '&action=delete&pos=0&state-name=' + stateName
        httpRequest(url, httpPut, {}, undefined, this.props.deleteStates, this.props.deleteStatesSuccess, this.fetchStates, this.props.deleteStatesFailure, this.deleteExtensionFailed)
    }

    deleteExtensionFailed = () => {
        errorAlert("Failed to delete extension: ", this.props.error)
    }

    fetchStates = () => {
        httpRequest('/states?extension-name=' + this.state.extensionName, httpGet, {}, undefined, this.props.fetchStates, this.props.fetchStatesSuccess, this.fetchStatesSucceeded, this.props.fetchStatesFailure, undefined)
    }

    fetchStatesSucceeded = () => {
        this.setState({ "error": "" })
    }

    fetchStatesFailed = () => {
        this.setState({ "error": "Unable to fetch states: " + (this.props.error.response.text ? this.props.error.response.text : this.props.error) })
    }

    fetchLogs = (extensionName, stateName, stateLabel) => {
        if (extensionName === undefined) {
            extensionName = settings.default_extension_name
        }
        var link = '/logs?extension-name=' + extensionName + '&state-name=' + stateName + '&state-label=' + stateLabel
        window.location.href = link
    }

    // isRunning = () => {
    //     if (this.props.status === Actions.STATES_FETCH_REQUEST_STATUS.DONE) {
    //         return this.props.states.status == "RUNNING"
    //         // this.props.states.forEach(state => {
    //         //     if (state['status'] === 'RUNNING') {
    //         //         return true
    //         //     }
    //         // });
    //     }
    //     return false
    // }

    resetEngine = () => {
        httpRequest('/engine?extension-name=' + this.state.extensionName + '&action=reset', httpPut, {}, undefined, this.props.resetEngine, this.props.resetEngineSuccess, this.fetchStates, this.props.resetEngineFailure, this.resetEngineFailed)
    }

    resetEngineFailed = () => {
        errorAlert("Failed to reset engine: ", this.props.resetEngineError)
    }

    onSelectItem = (e, result) => {
        var selectedStatus = e.selectedItem.id
        this.updateStatus(result.name, selectedStatus)
    }

    getStates = (t) => {
        var results = []
        if (this.props.states !== undefined) {
            results = this.props.states
            var executionID = this.props.executionID
            var i = 1
            results.forEach(state => {
                var result = state
                var lastRun = state["executed_by_extension_name"] + ":" + state["execution_id"] === executionID
                result["id"] = String(i++)
                result['labelLink'] = (state['label'] ? state['label'] : state['name'])
                var extensionsStates = this.props.extensionsStates
                if (extensionsStates !== undefined) {
                    var extension = extensionsStates.find(item => item.name === state['name'])
                    if (extension !== undefined) {
                        var link = '/states?extension-name=' + state['name']
                        result['labelLink'] = <a href={link}>{state['label']}</a>
                        result['delete'] = <Icon
                            name="icon--delete"
                            description={t("states.remove_state")}
                            onClick={() => { this.deleteExtension(stateName) }}
                        />
                    }
                }
                result["status"] = this.props.isRunning ? state["status"] : <DropdownV2
                    label={state["status"]}
                    onChange={(e) => this.onSelectItem(e, result)}
                    defaultText="Dropdown label"
                    items={[{ id: "READY", value: "READY" },
                    { id: "SKIP", value: "SKIP" }]}
                    itemToString={item => (item ? item.value : '')}
                >
                </DropdownV2>

                result['next_run'] = (state["next_run"] ? <Icon
                    name="checkmark--solid"
                    description={t("states.next_run_description")}
                /> : "")
                // result["start_time"] = (state["start_time"] && lastRun) ? new Date(state["start_time"]).toLocaleString() : ''
                // result["end_time"] = (state["end_time"] && lastRun) ? new Date(state["end_time"]).toLocaleString() : ''

                result["start_time"] = (state["start_time"]) ? stateDatesMoment(new Date(state["start_time"])).format('l LTS') : ''
                result["end_time"] = (state["end_time"]) ? stateDatesMoment(new Date(state["end_time"])).format('l LTS') : ''
                var stateName = state['name']
                var stateLabel = state['label'] ? state['label'] : state['name']
                // if (state['start_time']) {
                if (state["execution_id"] !== 0) {
                    result["logs"] = (lastRun ? <Icon
                        name="icon--document"
                        description={t("states.view_logs")}
                        onClick={() => { this.fetchLogs(this.state.extensionName, stateName, stateLabel) }}
                    /> : "")
                    // }
                    // if (state["execution_id"] !== 0) {
                    result["previous_logs"] = (!lastRun ? <Icon
                        name="icon--document"
                        description={t("states.view_previous_logs")}
                        onClick={() => { this.fetchLogs(this.state.extensionName, stateName, stateLabel) }}
                    /> : "")
                }
            });
            return results
        }
        return results

    }

    validateGenerateConfigAndStartDeployment = (extensionName) => {
        this.props.deploymentAuthorized(false)
        httpRequest('/config?action=validate&extension-name=' + extensionName, httpGet, {}, undefined, this.props.validateConfig, this.props.validateConfigSuccess, this.validateSucceeded.bind(this, extensionName), this.props.validateConfigFailure, this.validateFailed.bind(this, extensionName))
    }

    validateSucceeded = (extensionName) => {
        this.generateConfigAndStartDeployment(extensionName)
    }

    validateFailed = () => {
        const { t } = this.props
        this.props.deploymentAuthorized(true)
        errorAlert(t("config.validation.failed"), undefined)
    }

    generateConfigAndStartDeployment = (extensionName) => {
        httpRequest('/config?extension-name=' + extensionName, httpPut, {}, undefined, this.props.generateConfig, this.props.generateConfigSuccess, this.startDeployment.bind(this, extensionName), this.props.generateConfigFailure, this.generateConfigFailed)
    }

    generateConfigFailed = () => {
        this.props.deploymentAuthorized(true)
        errorAlert("Failed to generate the config: ", this.props.errorGenerateConfig)
    }

    startDeployment = (extensionName) => {
        httpRequest('/engine?extension-name=' + extensionName + '&action=start', httpPut, {}, undefined, this.props.deploymentStart, this.props.deploymentSuccess, this.navigateToStatesPage, this.props.deploymentFailure, undefined)
    }

    startDeploymentFailed = () => {
        this.props.deploymentAuthorized(true)
        errorAlert("Failed to start the deployment: ", this.props.errorDeploymentStart)
    }

    checkDeploymentAuthorized = () => {
        this.props.deploymentIsRunning(true)
        httpRequest('/engine?extension-name=' + this.state.extensionName, httpGet, {}, undefined, this.props.deploymentRunning, this.props.deploymentRunningSuccess, this.checkIsRunning, this.props.deploymentRunningFailure, this.checkIsRunning)
    }

    checkIsRunning = () => {
        var running = (this.props.responseDeploymentRunning.status !== undefined && this.props.responseDeploymentRunning.status === 201)
        this.props.deploymentIsRunning(running)
        this.props.deploymentAuthorized(!running)
    }

}


const mapStateToProps = state => {
    return {
        error: state.states.error,
        status: state.states.status,
        states: state.states.states,
        executionID: state.states.executionID,
        refreshedDate: state.states.refreshedDate,
        resetEngineResponse: state.states.resetEngineResponse,
        resetEngineError: state.states.resetEngineError,
        isAuthorized: state.config.isAuthorized,
        isRunning: state.config.isRunning,
        responseDeploymentRunning: state.config.responseDeploymentRunning,
        errorValidateConfig: state.config.errorValidateConfig,
        errorGenerateConfig: state.config.errorGenerateConfig,
        errorDeploymentStart: state.config.errorDeploymentStart,
        selectedStatus: state.modal.selectedStatus,
        selectedExtension: state.modal.selectedExtension,
        selectedState: state.modal.selectedState,
        selectedBeforeAfter: state.modal.selectedBeforeAfter,
        registeredExtensions: state.extensions.registeredExtensions,
        registeredExtensionsError: state.extensions.error,
        extensionsStates: state.states.extensionsStates,
    }
}

const mapDispatchToProps = dispatch => ({
    fetchStates: () => dispatch(fetchStates()),
    fetchStatesSuccess: (response) => dispatch(fetchStatesSuccess(response)),
    fetchStatesFailure: (error) => dispatch(fetchStatesFailure(error)),
    insertStates: () => dispatch(insertStates()),
    insertStatesSuccess: (response) => dispatch(insertStatesSuccess(response)),
    insertStatesFailure: (error) => dispatch(insertStatesFailure(error)),
    deleteStates: () => dispatch(deleteStates()),
    deleteStatesSuccess: (response) => dispatch(deleteStatesSuccess(response)),
    deleteStatesFailure: (error) => dispatch(deleteStatesFailure(error)),
    setState: () => dispatch(setState()),
    setStateSuccess: (response) => dispatch(setStateSuccess(response)),
    setStateFailure: (error) => dispatch(setStateFailure(error)),
    resetEngine: () => dispatch(resetEngine()),
    resetEngineSuccess: (response) => dispatch(resetEngineSuccess(response)),
    resetEngineFailure: (error) => dispatch(resetEngineFailure(error)),
    refreshDate: (refreshedDate) => dispatch(refreshDate(refreshedDate)),
    updateModal: (data) => dispatch(updateModal(data)),
    handleClose: () => dispatch(updateModal({ open: false, type: '', selectedStatus: undefined })),
    fetchRegisteredExtensions: () => dispatch(fetchRegisteredExtensions()),
    fetchRegisteredExtensionsSuccess: (response) => dispatch(fetchRegisteredExtensionsSuccess(response)),
    fetchAllExtensionsFailure: (error) => dispatch(fetchAllExtensionsFailure(error)),
    fetchStatesExtensions: () => dispatch(fetchStatesExtensions()),
    fetchStatesExtensionsSuccess: (response) => dispatch(fetchStatesExtensionsSuccess(response)),
    fetchStatesExtensionsFailure: (error) => dispatch(fetchStatesExtensionsFailure(error)),
    validateConfig: () => dispatch(validateConfig()),
    validateConfigSuccess: (response) => dispatch(validateConfigSuccess(response)),
    validateConfigFailure: (error) => dispatch(validateConfigFailure(error)),
    generateConfig: () => dispatch(generateConfig()),
    generateConfigSuccess: (response) => dispatch(generateConfigSuccess(response)),
    generateConfigFailure: (error) => dispatch(generateConfigFailure(error)),
    deploymentAuthorized: (authorized) => dispatch(deploymentAuthorized(authorized)),
    deploymentStart: () => dispatch(deploymentStart()),
    deploymentSuccess: (response) => dispatch(deploymentSuccess(response)),
    deploymentFailure: (error) => dispatch(deploymentFailure(error)),
    deploymentIsRunning: (running) => dispatch(deploymentIsRunning(running)),
    deploymentRunning: () => dispatch(deploymentRunning()),
    deploymentRunningSuccess: (response) => dispatch(deploymentRunningSuccess(response)),
    deploymentRunningFailure: (error) => dispatch(deploymentRunningFailure(error)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(States))
