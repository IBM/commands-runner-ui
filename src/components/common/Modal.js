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
import StatusModal from '../modals/StatusModal'
import AddExtensionModal from '../modals/AddExtensionModal'
import AddExtensionFailedModal from '../modals/AddExtensionFailedModal'
import ScrollBoxModal from '../modals/ScrollBoxModal'
import AboutModal from '../modals/AboutModal'
import ConfirmModal from '../modals/ConfirmModal'

class Modal extends React.PureComponent {

  render() {
    const { type, open } = this.props
    switch (type) {
      case 'status-select':
        return open && getStatusModal(this.props)
      case 'add-extension':
        return open && getAddExtensionModal(this.props)
      case 'add-extension-failed':
        return open && getAddExtensionFailedModal(this.props)
      case 'scroll-box':
        return open && getScrollBoxModal(this.props)
      case 'about':
        return open && getAboutModal(this.props)
      case 'confirm':
        return open && getConfirmModal(this.props)
      default:
        return null
    }
  }
}

const getStatusModal = props => {
  var c = getModal(StatusModal, props)
  return c
}

const getAddExtensionModal = props => {
  var c = getModal(AddExtensionModal, props)
  return c
}

const getAddExtensionFailedModal = props => {
  var c = getModal(AddExtensionFailedModal, props)
  return c
}

const getScrollBoxModal = props => {
  var c = getModal(ScrollBoxModal, props)
  return c
}

const getAboutModal = props => {
  var c = getModal(AboutModal, props)
  return c
}

const getConfirmModal = props => {
  var c = getModal(ConfirmModal, props)
  return c
}


const getModal = (Component, props) => <Component {...props} />

const mapStateToProps = state => state.modal

export default connect(mapStateToProps)(Modal)
