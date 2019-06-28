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
import { getSettings } from '../../utils/configUtils'

const settings = getSettings()

class AddExtensionModal extends React.PureComponent {

    selectedState = undefined
    beforeAfter = undefined

    componentDidMount() {
        this.props.saveBeforeAfter(undefined)
        this.props.saveState(undefined)
        if (this.props.extensionName !== undefined) {
            this.props.saveExtension(this.props.extensionName)
            this.props.isAutoPlacement(this.isAutoPlacement(this.props.extensionName))
        } else {
            this.props.isAutoPlacement(true)
        }
        this.props.isSubmitDisabled(true)
    }

    componentDidUpdate() {
        this.isSubmitDisabled()
    }

    onSelectExtension(e) {
        this.props.saveExtension(e.selectedItem.id)
        this.props.isAutoPlacement(this.isAutoPlacement(e.selectedItem.id))
    }

    onSelectState(e) {
        this.props.saveState(e.selectedItem.id)
        this.selectedState = e.selectedItem.id
    }

    onSelectBeforeAfter(e) {
        this.props.saveBeforeAfter(e.selectedItem.id)
        this.beforeAfter = e.selectedItem.id
    }

    getStatesDropdown() {
        var results = []
        var states = this.props.states
        for (var i = 0; i < states.length; i++) {
            results.push({ id: states[i].name, value: states[i].label })
        }
        return results
    }

    getRegisteredExtensionsDropdown() {
        var results = []
        var registeredExtensions = this.props.registeredExtensions
        if (this.props.registeredExtensions !== undefined) {
            for (var key in registeredExtensions) {
                if (registeredExtensions.hasOwnProperty(key)) {
                    if (key != settings.default_extension_name) {
                        results.push({ id: key, value: key })
                    }
                }
            }
        }
        return results
    }

    isAutoPlacement(extenisonId) {
        if (extenisonId !== undefined) {
            var extension = this.props.registeredExtensions[extenisonId]
            var isAutoPlacement = extension.call_state !== null &&
                extension.call_state.previous_states !== null &&
                extension.call_state.next_states !== null
            if (isAutoPlacement) {
                this.props.saveState(undefined)
                this.props.saveBeforeAfter(undefined)
            } else {
                this.props.saveState(this.selectedState)
                this.props.saveBeforeAfter(this.beforeAfter)
            }
            return isAutoPlacement
        }
        return true
    }

    isSubmitDisabled() {
        // console.log("this.props.autoPlacement:" + this.props.autoPlacement)
        // console.log("this.props.selectedExtension:" + this.props.selectedExtension)
        // console.log("this.props.selectedState:" + this.props.selectedState)
        // console.log("this.props.selectedBeforeAfter:" + this.props.selectedBeforeAfter)
        if ((this.props.autoPlacement &&
            this.props.selectedExtension === undefined) ||
            (!this.props.autoPlacement &&
                (this.props.selectedExtension === undefined ||
                    this.props.selectedState === undefined ||
                    this.props.selectedBeforeAfter === undefined))) {
            // console.log("this.props.isSubmitDisabled:true")
            this.props.isSubmitDisabled(true)
        } else {
            // console.log("this.props.isSubmitDisabled:false")
            this.props.isSubmitDisabled(false)
        }
    }

    render() {
        // console.log("SUBMIT DISABLED" + this.props.submitDisabled)
        const { t } = this.props;
        return (
            <div >
                <Modal
                    onRequestSubmit={this.props.addExtensionSubmit}
                    onRequestClose={this.props.handleClose}
                    open
                    modalHeading={t("modal.extension.title") + (this.props.extensionName ? ": " + this.props.extensionName : "")}
                    primaryButtonText={t("button.submit")}
                    primaryButtonDisabled={this.props.submitDisabled}
                    secondaryButtonText={t("button.cancel")}
                >
                    <div style={{ 'height': '300px' }}>
                        {(this.props.extensionName === undefined) &&
                            <div>
                                {/* <p className="bx--modal-content__text">
                        {t("modal.extension.select_extension")}</p> */}
                                <DropdownV2
                                    label={t("modal.extension.select_extension")}
                                    onChange={this.onSelectExtension.bind(this)}
                                    defaultText={t("modal.extension.select_extension")}
                                    items={this.getRegisteredExtensionsDropdown()}
                                    itemToString={item => (item ? item.value : '')}
                                >
                                </DropdownV2>
                            </div>}
                        <div>
                            {/* <p className="bx--modal-content__text">
                                Please set the reference state for placement.</p> */}
                            <DropdownV2
                                label={t("modal.extension.select_position")}
                                onChange={this.onSelectState.bind(this)}
                                defaultText={t("modal.extension.select_position")}
                                disabled={this.props.autoPlacement}
                                items={this.getStatesDropdown()}
                                itemToString={item => (item ? item.value : '')}
                            />
                        </div>
                        <div>
                            {/* <p className="bx--modal-content__text">
                                Please select if the placement must be done before or after the state.</p> */}
                            <DropdownV2
                                label={t("modal.extension.insert_before_after")}
                                onChange={this.onSelectBeforeAfter.bind(this)}
                                defaultText={t("modal.extension.insert_before_after")}
                                disabled={this.props.autoPlacement}
                                items={[{ id: "BEFORE", value: t("modal.extension.insert_before") },
                                { id: "AFTER", value: t("modal.extension.insert_after") }]}
                                itemToString={item => (item ? item.value : '')}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    open: state.modal.open,
    states: state.states.states,
    registeredExtensions: state.extensions.registeredExtensions,
    autoPlacement: state.modal.autoPlacement,
    selectedExtension: state.modal.selectedExtension,
    selectedState: state.modal.selectedState,
    selectedBeforeAfter: state.modal.selectedBeforeAfter,
    submitDisabled: state.modal.submitDisabled
})

const mapDispatchToProps = dispatch => {
    return {
        saveExtension: (selectedExtension) => dispatch(updateModal({
            selectedExtension: selectedExtension,
        })),
        saveState: (selectedState) => dispatch(updateModal({
            selectedState: selectedState,
        })),
        saveBeforeAfter: (selectedBeforeAfter) => dispatch(updateModal({
            selectedBeforeAfter: selectedBeforeAfter
        })),
        isAutoPlacement: (autoPlacement) => dispatch(updateModal({ autoPlacement: autoPlacement })),
        isSubmitDisabled: (submitDisabled) => dispatch(updateModal({ submitDisabled: submitDisabled })),
        handleClose: () => dispatch(updateModal({ open: false, type: '', selectedExtension: undefined })),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(AddExtensionModal))
