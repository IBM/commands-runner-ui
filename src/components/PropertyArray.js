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
import { updateConfiguration } from '../actions/config'
import Property from './Property'
import PropertyTree from './PropertyTree'
import {
    Accordeon,
    AccordeonItem,
    Icon,
} from 'carbon-components-react';
import { getSettings, searchAndCreateProperty, updateConfig } from '../utils/configUtils';

const settings = getSettings()

class PropertyArray extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: []
        }
    }

    componentWillMount() {
        var propertyPath = this.props.propertyPath
        var pathArray = propertyPath.split(".")
        var elements = searchAndCreateProperty(this.props.uimetadata, pathArray, this.props.config)
        this.setState({
            elements: elements.newElem,
        });

    }

    addRow() {
        var newPathArray = this.props.propertyPath.split(".")
        //Check size of current elements
        var currentSize = this.state.elements.length
        //if empty then add index otherwize calculate new index
        // if (currentSize === 0) {
            newPathArray.push(currentSize)
        // } else {
            // var index = newPathArray[newPathArray.length-1]
            // console.log("Index:"+index)
            // index = parseInt(index) + 1
            // newPathArray[newPathArray.length-1] = index
        // }
        // console.log("newPathArray:"+newPathArray)
 //       var newElements = searchAndCreateProperty(this.props.uimetadata, newPathArray, this.props.config)
        //array with no property then add in the array a text object other an object defined by the properties
        // var newElement = ""
        // if (this.props.uimetadata.properties === undefined) {
           //Create child
            var newElement = searchAndCreateProperty(this.props.uimetadata,newPathArray,this.props.config)
            this.props.updateConfiguration(newElement.newConfig)
        // }
        var newElements = [...this.state.elements]
        newElements.push(newElement.mewElem)
        //Search 
        // var pathArray = this.props.propertyPath.split(".")
        // var elements = searchAndCreateProperty(this.props.uimetadata, pathArray, this.props.config)
        this.setState({
            elements: newElements
        })
        // var newConfig = updateConfig(pathArray, elements.newConfig , this.props.config)
        // this.props.updateConfiguration(newConfig)
    }

    removeRow(index) {
        // console.log(JSON.stringify(this.props.config))
        var pathArray = this.props.propertyPath.split(".")
        var elements = searchAndCreateProperty(this.props.uimetadata, pathArray, this.props.config)
        var newElements = [...elements.newElem]
        newElements.splice(index, 1)
        var newConfig = updateConfig(pathArray, newElements, this.props.config)
        this.props.updateConfiguration(newConfig)
        this.setState({
            elements: newElements
        })
    }

    moveRow(fromIndex, toIndex) {
        var pathArray = this.props.propertyPath.split(".")
        var elements = searchAndCreateProperty(this.props.uimetadata, pathArray, this.props.config)
        var newElements = [...elements.newElem]
        var element = newElements[fromIndex];
        newElements.splice(fromIndex, 1);
        newElements.splice(toIndex, 0, element);
        var newConfig = updateConfig(pathArray, newElements, this.props.config)
        this.props.updateConfiguration(newConfig)
        this.setState({
            elements: newElements
        })
    }

    render() {
//        console.log(JSON.stringify(this.state.elements))
        // console.log(this.props.uimetadata.properties)
        var propertyPath = this.props.propertyPath
        var hidden = this.props.hidden === undefined ? false : this.props.hidden

        return <div>
            {this.props.uimetadata !== undefined &&
                <div>
                    {!hidden &&
                        <div>
                            <table style={{ "border-collapse": "separate", "border-spacing": "5px" }}>
                                <tr>
                                    <td>
                                        <label htmlFor={this.props.uimetadata.name} className="bx--label">{this.props.uimetadata.label}</label>
                                    </td>
                                    <td>
                                        <Icon
                                            name="add--outline"
                                            description="Add row"
                                            onClick={() => this.addRow()}
                                        />
                                    </td>
                                </tr>
                            </table>
                            <div className="bx--form__helper-text">{this.props.uimetadata.description}</div>
                        </div>
                    }
                    {this.state.elements !== undefined && this.state.elements.map((elem, index) => (
                        <div>
                            <table style={{ "border-collapse": "separate", "border-spacing": "5px" }}>
                                <tr>
                                    {!hidden &&
                                        <div>
                                            <td>
                                                <Icon
                                                    name="subtract--outline"
                                                    description="Remove row"
                                                    onClick={() => this.removeRow(index)}
                                                />
                                            </td>
                                            <td width="15">
                                                {index !== 0 && <Icon
                                                    name="arrow--up"
                                                    description="Move up"
                                                    onClick={() => this.moveRow(index, index - 1)}
                                                />
                                                }
                                            </td>
                                            <td width="15">
                                                {index !== this.state.elements.length - 1 && <Icon
                                                    name="arrow--down"
                                                    description="Move down"
                                                    onClick={() => this.moveRow(index, index + 1)}
                                                />
                                                }
                                            </td>
                                        </div>
                                    }
                                    <td>
                                        {this.props.uimetadata.properties === undefined &&
                                            <Property
                                                uimetadata={this.props.uimetadata}
                                                hidden={hidden === true ? true : this.props.uimetadata.hidden}
                                                propertyPath={(propertyPath === "") ? this.props.uimetadata.name : propertyPath + "." + index}
                                            />
                                        }
                                        {this.props.uimetadata.properties !== undefined &&
                                            <PropertyTree
                                                uimetadata={this.props.uimetadata}
                                                hidden={hidden === true ? true : this.props.uimetadata.hidden}
                                                propertyPath={(propertyPath === "") ? this.props.uimetadata.name : propertyPath + "." + index}
                                            />
                                        }
                                    </td>
                                </tr>
                            </table>
                        </div>
                    ))}
                </div>
            }
        </div>

    }
}

const mapStateToProps = state => {
    return {
        config: state.config.config[settings.config_root_key],
    }
}

const mapDispatchToProps = dispatch => ({
    updateConfiguration: (config) => dispatch(updateConfiguration(config)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertyArray)
