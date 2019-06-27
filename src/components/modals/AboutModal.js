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

import { Modal } from 'carbon-components-react'
import { connect } from 'react-redux'
import { updateModal } from '../../actions/modal';
import { 
    fetchConfigurationAbout,
    fetchConfigurationAboutSuccess,
    fetchConfigurationAboutFailure,
 } from '../../actions/config'
 import { httpRequest, httpGet } from '../../utils/httpUtils'


class AboutModal extends React.PureComponent {

    componentWillMount() {
            httpRequest((this.props.aboutURL?this.props.aboutURL:"/cr/about"), httpGet, {}, undefined, this.props.fetchConfigurationAbout, this.props.fetchConfigurationAboutSuccess, undefined, this.props.fetchConfigurationAboutFailure, undefined)
    }

    render() {
        const { t } = this.props;
        return (
            <div >
                <Modal
                    onRequestClose={this.props.handleClose}
                    open
                    modalHeading={t("about.about")}
                    passiveModal
                >
                    <p style={{'whiteSpace': 'pre-wrap'}} >{this.props.about}</p>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    open: state.modal.open,
    about: state.config.responseFetchConfigAbout
})

const mapDispatchToProps = dispatch => {
    return {
        fetchConfigurationAbout: () => dispatch(fetchConfigurationAbout()),
        fetchConfigurationAboutSuccess: (response) => dispatch(fetchConfigurationAboutSuccess(response)),
        fetchConfigurationAboutFailure: (error) => dispatch(fetchConfigurationAboutFailure(error)),
        updateModal: (data) => dispatch(updateModal(data)),
        handleClose: () => dispatch(updateModal({ open: false, type: '' }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(AboutModal))
