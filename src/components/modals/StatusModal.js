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

import { Modal, DropdownV2 } from 'carbon-components-react'
import { connect } from 'react-redux'
import { updateModal } from '../../actions/modal';

class StatusModal extends React.PureComponent {

    onSelectItem(e) {
        var selectedStatus = e.selectedItem.id
        this.props.handleSelectedStatus(selectedStatus)
    }

    render() {
        return (
            <div >
                <Modal
                    // onBlur={onBlur()}
                    onRequestSubmit={this.props.changeStatesStatus}
                    // onFocus={onFocus()}
                    onRequestClose={this.props.handleClose}
                    open
                    modalHeading={this.props.modalHeading}
                    primaryButtonText={this.props.primaryButtonText}
                    primaryButtonDisabled={this.props.selectedStatus === undefined}
                    secondaryButtonText={this.props.secondaryButtonText}
                >
                    <p className="bx--modal-content__text">{this.props.statusSelectText}</p>
                    <div style={{ 'height': '150px' }}>
                        <DropdownV2
                            label={this.props.statusChooseText}
                            onChange={this.onSelectItem.bind(this)}
                            defaultText="Dropdown label"
                            items={[{ id: "READY", value: "READY" },
                            { id: "SKIP", value: "SKIP" }]}
                            itemToString={item => (item ? item.value : '')}
                        >
                        </DropdownV2>
                    </div>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({ open: state.modal.open, selectedStatus: state.modal.selectedStatus })

const mapDispatchToProps = dispatch => {
    return {
        handleSelectedStatus: (selectedStatus) => dispatch(updateModal({ selectedStatus: selectedStatus })),
        handleClose: () => dispatch(updateModal({ open: false, type: '', selectedStatus: undefined }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(StatusModal))
