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
import PropTypes from 'prop-types'
import { translate } from "react-i18next";
class ScrollBox extends React.PureComponent {

  componentDidMount() {
    if (this.props.scrolldown === true) {
      this.scrollToBottom()
    }
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  render() {
    const textareaStyle = {
      resize: 'none',
      fontFamily: 'Courier New', 
      fontSize: 12
    }
    const { content, className } = this.props
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    return <div className={className} tabIndex='0'>
      <textarea style={textareaStyle} value={content} rows="40" cols="180" readOnly ref={div => { this.scrollBox = div }} />
    </div>
  }

  scrollToBottom() {
    this.scrollBox.scrollTop = this.scrollBox.scrollHeight
  }
}

ScrollBox.contextTypes = {
  locale: PropTypes.string
}

export default translate("translations")(ScrollBox)
