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
import {
    Tabs,
    Tab
} from 'carbon-components-react';
import PropertyTree from './PropertyTree'
import {getSettings, evalBool } from '../utils/configUtils'

const settings = getSettings()
class Properties extends React.Component {

    render() {
        var uimetadata = this.props.uimetadata
        var config = this.props.config
        return  <Tabs
            selected={0}
        >
            {uimetadata !== undefined && config !== undefined && uimetadata.groups.map((group) => (
                <Tab
                    key={group.name}
                    label={group.label === undefined ? group.name : group.label}
                    hidden={evalBool(group.hidden,this.props.config)}
                >
                    <div style={{ margin: 0 }}>
                        <div style={{ marginLeft: 10 }}>
                            <p><div className="bx--form__helper-text">{group.description ? group.description : ""}</div></p><p><br /></p>
                            <PropertyTree
                                hidden={false}
                                uimetadata={group}
                                propertyPath=""
                                config={config[settings.config_root_key]}
                            />
                        </div>
                    </div>
                </Tab>

            ))}
        </Tabs>


    }
}
const mapStateToProps = state => {
    return {
        config: state.config.config,
        uimetadata: state.uimetadata.uimetadata,
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Properties)
