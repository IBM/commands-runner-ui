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
import {
  settingsSave
} from '../actions/settings'
import cookie from 'react-cookies'
import { updateModal } from '../actions/modal';

import Modal from './common/Modal'

import {
  Link,
} from 'react-router-dom'

import {
  urlCookieKey,
  tokenCookieKey
} from '../utils/configUtils'

require('../scss/header.scss')

const tryRequire = (path) => {
  try {
   return require(`${path}`);
  } catch (err) {
   return null;
  }
};

const logo = tryRequire('../graphics/MyCompany_Logo.svg')

class Header extends React.Component {

  componentWillMount() {
    var token = cookie.load(tokenCookieKey)
    var url = cookie.load(urlCookieKey)
    this.props.settingsSave(url, token)
  }

  openAboutModal = () => {
    this.props.updateModal({ type: 'about', open: true })
  }

  render() {
    const { leftNavOpen, t } = this.props
    const homepage = ''
    return (
      <div className='app-header-wrapper'>
        <header className='app-header' aria-label={t('header.label')}>
          <div className='app-header__container secondary'>
            <div className={'app-menu-btn-container' + (leftNavOpen ? 'is-open' : '')}>
              <button className={'hamburger hamburger--slider ' + (leftNavOpen ? 'is-active' : '')} id='hamburger' aria-label={t('header.menu.label')} onClick={this.props.handleMenuClick}>
                <span className="hamburger-box">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              {/* <div className='tooltip'>{t('tooltip.menu')}</div> */}
            </div>

            <div className='logo-container'>
              <a href={homepage}><img className='logo' src={logo} alt={t('logo.alt')} /></a>
            </div>
            <div className='navigation-container'>
              <nav aria-label={t('nav.label')}>
                <div className='left-nav-item'>
                  <ul>
                    <li>
                      <Link to="/uisettings">{t('header.nav.settings')}</Link>
                    </li>
                    <li>
                      <a onClick={this.props.inceptionSetupCompleted && this.openAboutModal}>{t('header.nav.about')}</a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </header>
        <Modal aboutURL={this.props.aboutURL} />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    serverUrl: state.settings.serverUrl,
    token: state.settings.token,
    status: state.cr.status,
    inceptionSetupCompleted: state.cr.inceptionSetupCompleted,
  }
}

const mapDispatchToProps = dispatch => ({
  updateModal: (data) => dispatch(updateModal(data)),
  settingsSave: (serverUrl, token) => dispatch(settingsSave(serverUrl, token)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("translations")(Header));
