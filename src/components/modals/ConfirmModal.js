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

class ConfirmModal extends React.PureComponent {

    render() {
        return (
            <div >
                <Modal
                    open
                    modalHeading={this.props.modalHeading}
                    primaryButtonText={this.props.primaryButtonText}
                    secondaryButtonText={this.props.secondaryButtonText}
                    onRequestClose={this.props.onRequestClose}
                    onRequestSubmit={this.props.onRequestConfirm}
                    onRequestSecondarySubmit={this.props.onRequestCancel}
                >
                    <p className="bx--modal-content__text">{this.props.contentText}</p>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    open: state.modal.open,
})

const mapDispatchToProps = dispatch => {
    return {
        updateModal: (data) => dispatch(updateModal(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(ConfirmModal))
