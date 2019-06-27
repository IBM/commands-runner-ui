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
import CRStatus from '../components/CRStatus'
import {
    checkStatus,
    receiveStatusSuccess,
    receiveStatusFailure,
} from '../actions/cr'
  
import { httpRequest, httpGet} from '../utils/httpUtils'

class CRStatusContainer extends React.Component {
    componentDidMount() {
        this.tick()
        this.timerID = setInterval(
            () => this.tick(),
            5000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.checkStatus()
    }

    checkStatus = () => {
        httpRequest('/status', httpGet, {}, undefined, this.props.checkStatus, this.props.checkStatusSuccess, undefined, this.props.checkStatusFailure, undefined)
    }

    render() {
        return <CRStatus
            status={this.props.status}
            settings={this.props.settings}
 />
    }
}

const mapStateToProps = state => {
    return {
        responseCheckStatus: state.cr.responseCheckStatus,
        errorCheckStatus: state.cr.errorCheckStatus,
        status: state.cr.status,
    }
}

const mapDispatchToProps = dispatch => ({
    checkStatus: () => dispatch(checkStatus()),
    checkStatusSuccess:  (response) => dispatch(receiveStatusSuccess(response)),
    checkStatusFailure:  (error) => dispatch(receiveStatusFailure(error)),
//    saveStatus:  (status) => dispatch(saveStatus(status)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (translate("translations")(CRStatusContainer))
