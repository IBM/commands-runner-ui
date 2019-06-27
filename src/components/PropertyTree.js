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

import Property from './Property'
import PropertyArray from './PropertyArray'

class PropertyTree extends React.Component {

    render() {
        var uimetadata = this.props.uimetadata
        var propertyPath = this.props.propertyPath
        var hidden = this.props.hidden === undefined ? false : this.props.hidden
        return <div>
            {uimetadata !== undefined && uimetadata.properties.map((propertyDefElem) => (
                <div key={propertyDefElem.name} className="bx--fieldset">
                    {propertyDefElem.type !== "array" &&
                        <div>
                            {(propertyDefElem.properties === undefined) && <Property
                                uimetadata={propertyDefElem}
                                hidden={hidden === true ? true : propertyDefElem.hidden}
                                propertyPath={(propertyPath === "") ? propertyDefElem.name : propertyPath + "." + propertyDefElem.name}
                            />
                            }
                            {(propertyDefElem.properties !== undefined) &&
                                <div>
                                    {!(hidden === true ? true : propertyDefElem.hidden) ? <h4>{propertyDefElem.label}</h4> : <div></div>}
                                    <div style={{ marginLeft: 30 }}>
                                        <PropertyTree
                                            hidden={hidden === true ? true : propertyDefElem.hidden}
                                            uimetadata={propertyDefElem}
                                            propertyPath={(propertyPath === "") ? propertyDefElem.name : propertyPath + "." + propertyDefElem.name}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    }
                    {propertyDefElem.type === "array" &&
                        <PropertyArray
                            uimetadata={propertyDefElem}
                            hidden={hidden === true ? true : propertyDefElem.hidden}
                            propertyPath={(propertyPath === "") ? propertyDefElem.name : propertyPath + "." + propertyDefElem.name}
                        />
                    }
                </div>
            ))}
        </div>

    }
}

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertyTree)
