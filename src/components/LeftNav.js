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

import React from "react";
import { CSSTransition } from 'react-transition-group';
import { translate } from "react-i18next";
import { connect } from 'react-redux';

require('../scss/left-nav.scss')
require('../scss/common.scss')

class LeftNav extends React.Component {
    render() {
        const { open, t } = this.props
        return (
            <CSSTransition classNames='transition' in={open} timeout={300} mountOnEnter={true} unmountOnExit={true} onEntered={() => this.leftNav.focus()} onExited={() => this.props.headerWrapper.focus()}>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <nav ref={nav => this.leftNav = nav} id='left-nav' className='left-nav' aria-label={t('header.menu.bar.label')} tabIndex='-1' onKeyDown={this.handleKeyDown}>
                    <ul role='menubar'>
                        <li className='left-nav-item'>
                            <a href="/extensions" className="bx--link" tabIndex="-1" aria-disabled={!this.props.inceptionSetupCompleted || this.props.defaultExtensionName == undefined}>{t('leftnav.register_extension')}</a>>
                        </li>
                        <li className='left-nav-item'>
                            <a href="/uploadConfig" className="bx--link" tabIndex="-1" aria-disabled={!this.props.inceptionSetupCompleted || this.props.defaultExtensionName == undefined}>{t('leftnav.configuration')}</a>>
                        </li>
                        <li className='left-nav-item'>
                            <a href={'/states?extension-name=' + this.props.defaultExtensionName} className="bx--link" tabIndex="-1" aria-disabled={!this.props.inceptionSetupCompleted || this.props.defaultExtensionName == undefined}>{t('leftnav.states')}</a>>
                        </li>
                        <li className='left-nav-item'>
                            <hr />
                        </li>
                        <li className='left-nav-item'>
                            <a href={'/logs?extension-name=cr&state-label=' + t('logs.title')} className="bx--link" tabIndex="-1" aria-disabled={!this.props.inceptionUp}>{t('leftnav.server_logs')}</a>>
                      </li>
                    </ul>
                </nav>
            </CSSTransition>
        );
    }
}

const mapStateToProps = state => {
    return {
        inceptionSetupCompleted: state.cr.inceptionSetupCompleted,
        inceptionUp: state.cr.inceptionUp,
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(LeftNav));