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
import { connect } from 'react-redux'
import qs from 'query-string'
import {
    fetchLogs,
    fetchLogsSuccess,
    fetchLogsFailure,
    refreshDate,
    saveLogsParameters,
//    updateLogs
} from '../actions/logs'
import Logs from '../components/Logs'
import { httpRequest, httpGet } from '../utils/httpUtils'
import * as Actions from '../actions/actionTypes'
require('../scss/table.scss')

var refreshedDate = require('moment')
refreshedDate.locale(window.navigator.language)

class LogsContainer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            error: "",
        }
      
    }


    componentDidMount() {
        this.tick()
        this.timerID = setInterval(
            () => this.tick(),
            2000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.fetchLogs()
        this.props.refreshDate(refreshedDate(new Date()))
    }

    render() {
        return <Logs
            status={this.props.status}
            stateName={this.props.stateName}
            stateLabel={this.props.stateLabel}
            logs={this.props.logs}
            refreshedDate={this.props.refreshedDate}
            error={this.state.error}
        />
    }

    fetchLogs = () => {
        if (this.props.status !== Actions.LOGS_FETCH_REQUEST_STATUS.IN_PROGRESS) {
            const query = qs.parse(this.props.location.search)
            this.props.saveLogsParameters(query['extension-name'], query['state-name'],query['state-label'])
            var firstChar = (this.props.logs ? this.props.logs.length : 0)
            httpRequest('/state/' + query['state-name'] + '/log?extension-name='+query['extension-name']+'&first-char=' + firstChar + '&length=' + 500 * 1024, httpGet, {}, undefined, this.props.fetchLogs, this.props.fetchLogsSuccess, this,this.fetchLogsSucceeded, this.props.fetchLogsFailure, this.fetchLogsFailed)
        }
    }

    fetchLogsSucceeded = () => {
        this.setState({"error":""})
    }

    fetchLogsFailed = () => {
        this.setState({"error":"Unable to fetch logs: "+(this.props.error.response.text?this.props.error.response.text:this.props.error)})
    }

}

const mapStateToProps = state => {
    return {
        error: state.logs.error,
        status: state.logs.status,
        refreshedDate: state.logs.refreshedDate,
        extensionName: state.logs.extensionName,
        stateName: state.logs.stateName,
        stateLabel: state.logs.stateLabel,
        logs: state.logs.logs
    }
}

const mapDispatchToProps = dispatch => ({
    fetchLogs: () => dispatch(fetchLogs()),
    fetchLogsSuccess: (response) => dispatch(fetchLogsSuccess(response)),
    fetchLogsFailure: (error) => dispatch(fetchLogsFailure(error)),
    refreshDate: (refreshedDate) => dispatch(refreshDate(refreshedDate)),
    saveLogsParameters: (extensionName, stateName, stateLabel) => dispatch(saveLogsParameters(extensionName, stateName, stateLabel)),
//    updateLogs: (logs) => dispatch(updateLogs(logs))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsContainer)
