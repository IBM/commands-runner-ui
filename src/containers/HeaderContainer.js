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
import Header from '../components/Header'
import LeftNav from '../components/LeftNav'
import Body from '../components/Body'

import { translate } from "react-i18next";
import { getSettings } from '../utils/configUtils'
require('../scss/common.scss')
const settings = getSettings()
class HeaderContainer extends React.Component {

  constructor(props) {
    super(props)

    this.handleMenuClick = this.handleMenuClick.bind(this)
    this.handleMouseClick = this.handleMouseClick.bind(this)

    this.state = {
      leftNavOpen: false,
    }
  }

  render() {
    return (
      <div>
        <div ref={ref => this.headerWrapper = ref} id='header-container' tabIndex='-1'>
          <Header handleMenuClick={this.handleMenuClick}
            leftNavOpen={this.state.leftNavOpen}
            aboutURL={settings?settings.aboutURL:undefined} />
          <LeftNav
            open={this.state.leftNavOpen}
            headerWrapper={this.headerWrapper}
            handleMenuClick={this.handleMenuClick}
            defaultExtensionName={(settings?settings.default_extension_name:undefined)}
          />
        </div>
        <Body settings={settings}/>
      </div>
    )
  }

  handleMenuClick() {
    this.setState({
      leftNavOpen: !this.state.leftNavOpen
    }, () => {
      if (this.state.leftNavOpen) {
        document.addEventListener('click', this.handleMouseClick)
      } else {
        document.removeEventListener('click', this.handleMouseClick)
      }
    })
  }

  handleMouseClick(event) {
    if (this.headerWrapper) {
      this.setState({
        leftNavOpen: false,
      })
      document.removeEventListener('click', this.handleMouseClick)
    }
  }

  
}



export default translate("translations")(HeaderContainer)
