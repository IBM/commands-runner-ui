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
import cookie from 'react-cookies'
import Settings from '../components/Settings'
import {
    settingsSave
} from '../actions/settings'
import {
    checkStatus,
    receiveStatusSuccess,
    receiveStatusFailure,
    getSettings,
    getSettingsSuccess,
    getSettingsFailure,
} from '../actions/cr'

import {
    urlCookieKey,
    tokenCookieKey,
    timeoutCookieKey,
    settingsCookieKey
} from '../utils/configUtils'

import { httpRequest, httpGet } from '../utils/httpUtils'

class UISettings extends React.Component {

    constructor(props) {
        super(props)
        this.state = { error: undefined }
    }

    componentWillMount() {
        var serverUrl = cookie.load(urlCookieKey)
        // console.log(window.location.protocol)
        var port = (window.location.protocol == "http:" ? 30101 : 30103)
        serverUrl = (serverUrl !== undefined && serverUrl !== "" ? serverUrl : window.location.protocol + "//" + window.location.hostname + ":" + port)
        cookie.save(urlCookieKey, serverUrl.replace(/\/$/, ""))

        var token = cookie.load(tokenCookieKey)
        token = (token !== undefined && token !== "" ? token : "")
        cookie.save(tokenCookieKey, token)

        var timeout = cookie.load(timeoutCookieKey)
        timeout = (!isNaN(timeout) && timeout > 0 ? parseInt(timeout) : 30)
        cookie.save(timeoutCookieKey, timeout)

        this.props.settingsSave(serverUrl, token, timeout)
    }

    componentDidMount() {
        httpRequest('/status', httpGet, {}, undefined, this.props.checkStatus, this.props.checkStatusSuccess, undefined, this.props.checkStatusFailure, this.connectionError)
    }

    render() {
        return <Settings
            handleSubmit={this.handleSubmit}
            handleSubmitOnReturn={this.handleSubmitOnReturn}
            handleServerUrlChange={this.handleServerUrlChange}
            handleTokenChange={this.handleTokenChange}
            handleTimeoutChange={this.handleTimeoutChange}
            settingsSave={this.props.settingsSave}
            serverUrl={this.props.serverUrl}
            token={this.props.token}
            timeout={this.props.timeout}
            error={this.state.error} />
    }

    handleSubmitOnReturn = (e) => {
        if (e.keyCode === 13) {
            this.handleSubmit(e)
        }
    }

    handleSubmit = (e) => {
        e.preventDefault() // Stop form submit
        cookie.save(tokenCookieKey, this.props.token)
        cookie.save(urlCookieKey, this.props.serverUrl.replace(/\/$/, ""))
        cookie.save(timeoutCookieKey, this.props.timeout)
        httpRequest('/status', httpGet, {}, undefined, this.props.checkStatus, this.props.checkStatusSuccess, this.getSettings, this.props.checkStatusFailure, this.connectionError)
    }

    getSettings = () => {
        httpRequest('/cr/settings', httpGet, {}, undefined, this.props.getSettings, this.props.getSettingsSuccess, this.navigateToConfiguration, this.props.getSettingsFailure, this.getSettingsError)
    }

    navigateToConfiguration = () => {
        this.setState({ error: undefined })
        cookie.save(settingsCookieKey, this.props.settings)
        window.location.href = "/uploadConfig"
    }

    connectionError = () => {
        const { t } = this.props
        this.setState({ error: t("settings.connection.error") })
    }

    getSettingsError = () => {
        const { t } = this.props
        this.setState({ error: t("settings.get.error") })
    }

    handleServerUrlChange = (e) => {
        this.props.settingsSave(e.target.value, this.props.token, this.props.timeout)
    }
    handleTokenChange = (e) => {
        this.props.settingsSave(this.props.serverUrl, e.target.value, this.props.timeout)
    }
    handleTimeoutChange = (e) => {
        this.props.settingsSave(this.props.serverUrl, this.props.token, e.target.value)
    }

}

const mapStateToProps = state => {
    return {
        serverUrl: state.settings.serverUrl,
        token: state.settings.token,
        timeout: state.settings.timeout,
        settings: state.cr.settings
    }
}

const mapDispatchToProps = dispatch => ({
    settingsSave: (serverUrl, token, timeout) => dispatch(settingsSave(serverUrl, token, timeout)),
    checkStatus: () => dispatch(checkStatus()),
    checkStatusSuccess: (response) => dispatch(receiveStatusSuccess(response)),
    checkStatusFailure: (error) => dispatch(receiveStatusFailure(error)),
    getSettings: () => dispatch(getSettings()),
    getSettingsSuccess: (response) => dispatch(getSettingsSuccess(response)),
    getSettingsFailure: (error) => dispatch(getSettingsFailure(error)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(UISettings))
