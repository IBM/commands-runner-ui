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
import { updateConfiguration } from '../actions/config'
import { translate } from "react-i18next";

import { connect } from 'react-redux'
import {
    Checkbox,
    DropdownV2,
    TextInput,
    TextArea
} from 'carbon-components-react';
import { searchAndCreateProperty, updateConfig } from '../utils/configUtils'
import { getSettings, evalBool } from '../utils/configUtils'

const settings = getSettings()

class Property extends React.Component {
    constructor(props) {
        super(props);
    }


    initProperty = (pathArray) => {
        var result = searchAndCreateProperty(this.props.uimetadata, pathArray, this.props.config)
        this.props.updateConfiguration(result.newConfig)
        this.validateField(result.newElem)
    }

    componentWillMount() {
        var pathArray = this.props.propertyPath.split(".")
        this.initProperty(pathArray)
    }

    render() {
        // console.log("UPDATE_CONFIG_PROPERTY:"+JSON.stringify(this.props.config))
        // console.log("UPDATE_CONFIG_PROPER?Y_ORI:"+JSON.stringify(this.props.cfgori))
        var pathArray = this.props.propertyPath.split(".")
        // console.log("pathArray:" + pathArray)
        var result = searchAndCreateProperty(this.props.uimetadata, pathArray, this.props.config)
        var propertyDef = this.props.uimetadata
        var property = result.newElem
        if (propertyDef.type === "dropdown") {
            property = propertyDef.items.find(o => o.id === property);
        }
        this.validateField(property)
        var propertyDef = this.props.uimetadata
        //       var hidden = this.props.hidden === undefined ? false : this.props.hidden
        //       var hidden = this.props.hidden === undefined ? false : evalBool(this.props.hidden,this.props.config)
        var label = (propertyDef.mandatory ? propertyDef.label + " *" : propertyDef.label)
        //        return <div>{!(this.props.hidden === undefined ? false : evalBool(this.props.hidden,this.props.config)) && <div>
        return <div>{!evalBool(this.props.hidden, this.props.config) && <div>
            {(propertyDef.type === "text" ||
                propertyDef.type === "number" ||
                propertyDef.type === "password" ||
                propertyDef.type === "array") &&
                <TextInput
                    id={this.props.propertyPath}
                    labelText={propertyDef.type === "array" ? undefined : label}
                    type={propertyDef.type === "number" ? "text" : propertyDef.type}
                    defaultValue={propertyDef.default}
                    value={property}
                    placeholder={propertyDef.sample_value}
                    hideLabel={false}
                    invalidText={propertyDef.error}
                    invalid={propertyDef.error != undefined}
                    helperText={propertyDef.type === "array" ? undefined : propertyDef.description}
                    // onClick={onClick}
                    onChange={evt => this.updateInputValueText(evt)}
                />
            }
            {(propertyDef.type === "textarea") &&
                <TextArea
                    // className="bx--text-input"
                    id={this.props.propertyPath}
                    labelText={label}
                    defaultValue={propertyDef.default}
                    value={property}
                    placeholder={propertyDef.sample_value}
                    hideLabel={false}
                    cols={(propertyDef.cols !== undefined) ? propertyDef.cols : undefined}
                    rows={(propertyDef.rows !== undefined) ? propertyDef.rows : undefined}
                    invalidText={propertyDef.error}
                    invalid={propertyDef.error != undefined}
                    helperText={propertyDef.description}
                    onChange={evt => this.updateInputValueText(evt)}
                />
            }
            {(propertyDef.type === "checkbox") &&
                <div>
                    <legend className="bx--label">
                        {propertyDef.description}
                    </legend>
                    <Checkbox
                        id={this.props.propertyPath}
                        checked={property}
                        labelText={label}
                        disabled={false}
                        hideLabel={false}
                        wrapperClassName=""
                        onChange={(value, id, evt) => this.updateInputValueCheckBox(value, id, evt)}
                    />
                </div>
            }
            {(propertyDef.type === "dropdown") &&
                <div>
                    <p className="bx--label">{label}</p>
                    <p className="bx--form__helper-text">{propertyDef.description}</p>
                    <DropdownV2
                        id={this.props.propertyPath}
                        label="Select an item"
                        items={propertyDef.items}
                        selectedItem={property}
                        onChange={(selected) => this.updateInputValueDropdown(selected)}
                    />
                </div>
            }
        </div>
        }
        </div>
    }

    updateInputValueText(evt) {
        var pathArray = this.props.propertyPath.split(".")
        var value = evt.target.value
        if (this.props.uimetadata.type == "number") {
            // var numberValue = Number(value)
            // if (Number.isNaN(numberValue)) {
            value = value.replace(/[^-\\.\\+0-9]/g, "")
            // }
        }
        this.validateField(value)
        this.setValue(pathArray, value)
    }

    updateInputValueCheckBox(value, id, evt) {
        var pathArray = this.props.propertyPath.split(".")
        this.setValue(pathArray, value)
    }

    updateInputValueDropdown(selected) {
        var pathArray = this.props.propertyPath.split(".")
        this.setValue(pathArray, selected.selectedItem.id)
    }

    validateField(value) {
        const { t } = this.props
        var errorMessage = undefined
        if (value === "" || value === undefined) {
            if (this.props.uimetadata.mandatory) {
                errorMessage = "* " + t("property.error.required")
            }
        } else {
            if (this.props.uimetadata.validation_regex !== undefined) {
                var regex = RegExp(this.props.uimetadata.validation_regex)
                if (!String(value).match(regex)) {
                    if (this.props.uimetadata.validation_error_message === undefined) {
                        errorMessage = t("property.error.regex") + this.props.uimetadata.validation_regex
                    } else {
                        errorMessage = this.props.uimetadata.validation_error_message
                    }
                }
            }
        }
        this.props.uimetadata.error = errorMessage
    }

    setValue(pathArray, value) {
        // console.log(pathArray)
        var newConfig = updateConfig(pathArray, value, this.props.config)
        // console.log(JSON.stringify(newConfig))
        this.props.updateConfiguration(newConfig)
    }

}

const mapStateToProps = state => {
    return {
        config: state.config.config[settings.config_root_key],
        //the cfgori is here to make sure the component rerender, this should be replacing by sending the property
        //instead of the propertyPath because when working with array the propertyPath doesn't not change (no rerender) but
        //the property does.
        cfgori: state.config.config
    }
}

const mapDispatchToProps = dispatch => ({
    updateConfiguration: (config) => dispatch(updateConfiguration(config)),
})

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(Property))