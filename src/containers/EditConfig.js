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
import qs from 'query-string'
import {
    Button,
} from 'carbon-components-react';

import { updateModal } from '../actions/modal';

import Properties from '../components/Properties'
import {
    fetchUIMetadata,
    fetchUIMetadataSuccess,
    fetchUIMetadataFailure,
    fetchUIMetadataPrevious,
    fetchUIMetadataPreviousSuccess,
    fetchUIMetadataPreviousFailure,
    updateUIMetadata,
} from '../actions/uimetadata'

import {
    uploadConfig,
    receiveConfigSuccess,
    receiveConfigFailure,
    fetchConfiguration,
    fetchConfigurationSuccess,
    fetchConfigurationFailure,
    updateConfiguration,
} from '../actions/config'

import { httpRequest, httpGet, httpPost } from '../utils/httpUtils'
import { getSettings } from '../utils/configUtils'

const settings = getSettings()

class EditConfig extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        // console.log("this.props.location.search:" + this.props.location.search)
        const query = qs.parse(this.props.location.search)
        // console.log("query['extension-name']:" + query['extension-name'])
        var extensionName = query['extension-name']
        if (extensionName === undefined) {
            extensionName = settings.default_extension_name
        }
        // console.log("query['ui-metadata-name']:" + query['ui-metadata-name'])
        var uiConfigName = query['ui-metadata-name']
        if (uiConfigName === undefined) {
            uiConfigName = "vmware"
        }
        // console.log("query['ui-metadata-label']:" + query['ui-metadata-label'])
        var uiConfigLabel = query['ui-metadata-label']
        if (uiConfigLabel === undefined) {
            uiConfigLabel = "VMware"
        }
        this.setState({ extensionName: extensionName, uiConfigName: uiConfigName, uiConfigLabel: uiConfigLabel })
    }

    componentDidMount() {
        // console.log("extension-name:" + this.state.extensionName)
        // console.log("ui-metadata-name:" + this.state.uiConfigName)
        this.fetchUIMetadata()
    }

    fetchUIMetadata = () => {
        httpRequest('/uimetadata?extension-name=' + this.state.extensionName + '&ui-metadata-name=' + this.state.uiConfigName, httpGet, {}, undefined, this.props.fetchUIMetadata, this.props.fetchUIMetadataSuccess, this.fetchConfiguration, this.props.fetchUIMetadataFailure, undefined)
    }

    fetchConfiguration = () => {
        var url = "/config?extension-name=" + this.state.extensionName
        // console.log("url:" + url)
        httpRequest(url, httpGet, {}, undefined, this.props.fetchConfiguration, this.props.fetchConfigurationSuccess, this.loadPreviousUIMetadata, this.props.fetchConfigurationFailure, this.loadPreviousUIMetadata)
    }

    loadPreviousUIMetadata = () => {
        // console.log("loadUIMetadataPropertiesPath.loadPreviousUIMetadata")
        if (this.props.config[settings.config_root_key]["configuration_name"] !== undefined &&
            this.props.config[settings.config_root_key]["configuration_name"] !== this.state.uiConfigName) {
            httpRequest('/uimetadata?extension-name=' + this.state.extensionName + '&ui-metadata-name=' + this.props.config[settings.config_root_key]["configuration_name"], httpGet, {}, undefined, this.props.fetchUIMetadataPrevious, this.props.fetchUIMetadataPreviousSuccess, this.createExtrasAndSetConfigurationName, this.props.fetchUIMetadataPreviousFailure, undefined)
        } else {
            this.createExtrasAndSetConfigurationName()
        }
    }

    createExtrasAndSetConfigurationName = () => {
        var newGroup = this.createExtras()
        if (newGroup) {
            this.props.uimetadata.groups.push(newGroup)
            // console.log("loadUIMetadataPropertiesPath.newGroup:" + JSON.stringify(newGroup))
            // console.log("loadUIMetadataPropertiesPath.uimetadata:" + this.props.uimetadata)
            this.props.updateUIMetadata(JSON.parse(JSON.stringify(this.props.uimetadata)))
        }
        // console.log("setConfigurationName.configuration_name:" + this.props.config[settings.config_root_key]["configuration_name"])
        // console.log("setConfigurationName.uiConfigName:" + this.state.uiConfigName)
    }

    createExtras = () => {
        const { t } = this.props
        var uimetadata = this.props.uimetadata
        var uimetadataPrevious = this.props.uimetadataPrevious
        // console.log("loadUIMetadataPropertiesPath.uimetadata.name:" + JSON.stringify(uimetadata))
        // console.log("loadUIMetadataPropertiesPath.uimetadataPrevious.name:" + JSON.stringify(uimetadataPrevious))
        var uimetadataPropertiesPath = this.loadUIMetadataPropertiesPath(this.props.uimetadata, false)
        var uimetadataPreviousPropertiesPath = this.loadUIMetadataPropertiesPath(this.props.uimetadataPrevious, false)
        var configPropertiesPath = this.loadConfigPropertiesPath()
        var newGroup = { name: "extra", label: t("editconfig.extras") }
        var missingProperties = newGroup
        //For all properties in the config file
        for (var i in configPropertiesPath) {
            var pathArray = configPropertiesPath[i].split(".")
            var n = pathArray.length - 1
            var configPath = configPropertiesPath[i]
            if (!isNaN(pathArray[n])) {
                configPath = pathArray.slice(0, n).join('.')
            }
            //if the property is defined in the uimetadata 
            configPath = configPath.replace(".0", "")
            if (!uimetadataPropertiesPath.includes(configPath) &&
                !uimetadataPreviousPropertiesPath.includes(configPath)) {
                if (configPropertiesPath[i] === "configuration_name") {
                    continue
                }
                var currentProperties = missingProperties
                //for all path segments of the config property except the last segement
                for (var i = 0; i < n; i++) {
                    var foundProperty = this.searchAndCreatePropertyByName(currentProperties, pathArray[i])
                    //if segment [i] not found then add it in currentProperties
                    if (foundProperty === undefined) {
                        //properties tag already exists then just push otherwise create it.
                        if (currentProperties.properties) {
                            currentProperties.properties.push({ name: pathArray[i], label: pathArray[i] })
                        } else {
                            currentProperties.properties = [{ name: pathArray[i], label: pathArray[i] }]
                        }
                        currentProperties = this.searchAndCreatePropertyByName(currentProperties, pathArray[i])
                    } else {
                        currentProperties = this.searchAndCreatePropertyByName(currentProperties, pathArray[i])
                    }
                }
                //Manage the last segment (the property itself)
                //if the path was or wasn't a multi segement path
                //hmmm seems to be the same code... have to check later
                if (n == 0) {
                    //Single segment path
                    if (currentProperties.properties) {
                        currentProperties.properties.push({ name: pathArray[n], label: pathArray[n], type: "text" })
                    } else {
                        currentProperties.properties = [{ name: pathArray[n], label: pathArray[n], type: "text" }]
                    }
                } else {
                    //Last segement.
                    if (currentProperties.properties) {
                        currentProperties.properties.push({ name: pathArray[n], label: pathArray[n], type: "text" })
                    } else {
                        currentProperties.properties = [{ name: pathArray[n], label: pathArray[n], type: "text" }]
                    }
                }
            }
        }
        return missingProperties.properties && missingProperties.properties.length > 0 ? newGroup : undefined
    }

    searchAndCreatePropertyByName(property, name) {
        // console.log("createExtras.properties: " + JSON.stringify(property.properties))
        if (property.properties === undefined) {
            return undefined
        }
        var properties = property.properties
        for (var i in properties) {
            // console.log("createExtras.properties[i]: " + JSON.stringify(properties[i]))
            if (properties[i].name === name) {
                return properties[i]
            }
        }
        return undefined
    }

    addProperty(missingProperties, uimetadataPropertiesPath, configPropertyPath) {
        // if (configPropertyPath === "configuration_name") {
        //     return missingProperties
        // }
        // console.log("loadUIMetadataPropertiesPath.uimetadataPropertiesPath:" + uimetadataPropertiesPath)
        var pathArray = configPropertyPath.split(".")
        var n = pathArray.length - 1
        var currentPath = ""
        var currentProperties = missingProperties
        for (var i = 0; i < n; i++) {
            currentPath = currentPath === "" ? pathArray[i] : currentPath + "." + pathArray[i]
            // console.log("loadUIMetadataPropertiesPath.currentPath:" + currentPath)
            if (!uimetadataPropertiesPath.includes(currentPath)) {
                currentProperties = { name: pathArray[i], properties: [] }
                currentProperties = currentProperties.properties
            }
        }
        currentProperties.push({ name: pathArray[n], label: pathArray[n], type: "text" })
        // console.log("loadUIMetadataPropertiesPath.missingProperties:" + JSON.stringify(missingProperties))
        return missingProperties
    }

    //Navigate through each group to list all attibutes path. 
    //if includeSubpath is true then intermediate path are inserted.
    loadUIMetadataPropertiesPath = (uimetadata, includeSubpath) => {
        var propertiesPath = []
        if (uimetadata !== undefined) {
            var groups = uimetadata.groups
            // console.log("loadUIMetadataPropertiesPath.groups:" + JSON.stringify(groups))
            for (var i in groups) {
                // console.log("loadUIMetadataPropertiesPath.groupName:" + JSON.stringify(groups[i].name))
                propertiesPath = propertiesPath.concat(this.getUIMetadataPropertiesPath(groups[i].properties, "", includeSubpath))
            }
        }
        // console.log("loadUIMetadataPropertiesPath.properties_path_uimetadata:" + JSON.stringify(propertiesPath))
        return propertiesPath
    }

    //Recursively search the path of each properties in the uimetadata
    getUIMetadataPropertiesPath = (properties, path, includeSubpath) => {
        var propertiesPath = []
        // console.log("loadUIMetadataPropertiesPath.properties:" + JSON.stringify(properties))
        for (var i in properties) {
            // console.log("loadUIMetadataPropertiesPath.properties[i]:" + JSON.stringify(properties[i]))
            var currentPath = path === "" ? properties[i].name : path + "." + properties[i].name
            // console.log("loadUIMetadataPropertiesPath.currentPath:" + JSON.stringify(currentPath))
            if (properties[i].properties) {
                // console.log("loadUIMetadataPropertiesPath.properties[i].properties:" + JSON.stringify(properties[i].properties))
                if (includeSubpath) {
                    var p = this.getUIMetadataPropertiesPath(properties[i].properties, currentPath, includeSubpath)
                    p.push(currentPath)
                    propertiesPath = propertiesPath.concat(p)
                }
                var p = this.getUIMetadataPropertiesPath(properties[i].properties, currentPath, includeSubpath)
                propertiesPath = propertiesPath.concat(p)
            } else {
                propertiesPath.push(currentPath)
            }
        }
        return propertiesPath
    }


    loadConfigPropertiesPath() {
        var config = this.props.config
        // console.log(JSON.stringify(config))
        // console.log(JSON.stringify(config[settings.config_root_key]))
        var propertiesPath = this.getConfigPropertiesPath(config[settings.config_root_key], "")
        // var l = propertiesPath.length
        // for (var i = 0; i < l; i++) {
        //     if (isArrayFirstElemPath(propertiesPath[i])) {
        //         propertiesPath.push(propertiesPath[i].replace(".0", ""))
        //     }
        // }
        // console.log("loadUIMetadataPropertiesPath.properties_path_config:" + JSON.stringify(propertiesPath))
        return propertiesPath
    }

    getConfigPropertiesPath(config, path) {
        var stringConstructor = "test".constructor;
        var numberConstructor = new Number(1).constructor;
        var arrayConstructor = [].constructor;
        var objectConstructor = {}.constructor;
        var booleanConstructor = true.constructor;
        var propertiesPath = []
        for (var key in config) {
            // console.log(JSON.stringify(config[key]))
            var currentPath = path === "" ? key : path + "." + key
            if (config[key] === undefined || config[key] === null) {
                propertiesPath.push(currentPath)
                continue
            }
            switch (config[key].constructor) {
                case stringConstructor:
                    // console.log("stringConstructor")
                    propertiesPath.push(currentPath)
                    break
                case numberConstructor:
                    // console.log("numberConstructor")
                    propertiesPath.push(currentPath)
                    break
                case booleanConstructor:
                    // console.log("booleanConstructor")
                    propertiesPath.push(currentPath)
                    break
                case arrayConstructor:
                    // console.log("arrayConstructor")
                    propertiesPath = propertiesPath.concat(this.getConfigPropertiesPath(config[key], currentPath))
                    break
                case objectConstructor:
                    propertiesPath = propertiesPath.concat(this.getConfigPropertiesPath(config[key], currentPath))
                    // console.log("objectConstructor")
                    break
                default:
                // console.log("Unknown")
            }
        };
        return propertiesPath
    }


    render() {
        const { t } = this.props
        // console.log("uimetadata.error: " + this.props.error)
        // console.log("uimetadata: " + JSON.stringify(this.props.uimetadata))
        // console.log("responseFetchConfig: " + JSON.stringify(this.props.config))
        return <div>
            <table style={{ "border-collapse": "separate", "border-spacing": "5px" }}>
                <tr><td colSpan="3">{t("config.edit_configuration.label")}: {this.state.uiConfigLabel}</td></tr>
                <tr>
                    <td>
                        <Button onClick={this.saveConfiguration}>{t("button.save")}
                        </Button>
                    </td>
                    <td>
                        <Button onClick={this.saveAndExitConfiguration}>{t("button.save-exit")}
                        </Button>
                    </td>
                    <td>
                        <Button onClick={this.navigateToConfigurationPage}>{t("button.exit")}
                        </Button>
                    </td>
                </tr>
            </table>
            <Properties
                uimetadata={this.props.uimetadata}
                config={this.props.config}
            />
        </div>
    }

    saveConfiguration = (e) => {
        e.preventDefault() // Stop form submit
        // console.log(JSON.stringify(this.props.config))
        this.cleanConfig(this.props.config)
        // console.log(JSON.stringify(this.props.config))
        httpRequest('/config?extension-name=' + this.state.extensionName, httpPost, {}, this.props.config, this.props.uploadConfig, this.props.receiveConfigSuccess, undefined, this.props.receiveConfigFailure, undefined)
    }

    saveAndExitConfiguration = (e) => {
        e.preventDefault() // Stop form submit
        // console.log(JSON.stringify(this.props.config))
        this.cleanConfig(this.props.config)
        // console.log(JSON.stringify(this.props.config))
        httpRequest('/config?extension-name=' + this.state.extensionName, httpPost, {}, this.props.config, this.props.uploadConfig, this.props.receiveConfigSuccess, this.navigateToConfigurationPage, this.props.receiveConfigFailure, undefined)
    }

    navigateToConfigurationPage() {
        var link = "/uploadConfig"
        // console.log("link:" + link)
        window.location.href = link
    }

    cleanConfig(config) {
        var uimetadataPropertiesPath = this.loadUIMetadataPropertiesPath(this.props.uimetadata, true)
        uimetadataPropertiesPath.push("configuration_name")
        this.cleanConfigRecursive(config[settings.config_root_key], uimetadataPropertiesPath, "")
    }

    cleanConfigRecursive(config, uimetadataPropertiesPath, currentPath) {
        var stringConstructor = "test".constructor;
        var arrayConstructor = [].constructor;
        var objectConstructor = {}.constructor;
        // console.log(JSON.stringify(config))
        // console.log(JSON.stringify(config[settings.config_root_key]))
        for (var key in config) {
            // console.log(JSON.stringify(config[key]))
            key = (isNaN(key) ? key : parseInt(key))
            if (config[key] !== undefined) {
                var propertyPath = (currentPath === "" ? key : (currentPath + "." + key))
                var propertyPathNonArray = (currentPath === "" ? key : (currentPath + "." + key).replace(".0", ""))
                if (!uimetadataPropertiesPath.includes(propertyPath) && !uimetadataPropertiesPath.includes(propertyPathNonArray)) {
                    delete config[key]
                } else {
                    switch (config[key].constructor) {
                        case stringConstructor:
                            // console.log("stringConstructor")
                            if (config[key] === "") {
                                // config[key] = undefined
                                delete config[key]
                            } else {
                                if ((config[key].charAt(0) === '"' && config[key].charAt(config[key].length - 1) === '"') ||
                                    (config[key].charAt(0) === '\'' && config[key].charAt(config[key].length - 1) === '\'')) {
                                    config[key] = config[key].substring(1, config[key].length - 1)
                                } else {
                                    config[key] = (isNaN(config[key]) ? config[key] : parseFloat(config[key]))
                                }
                            }
                            break
                        case arrayConstructor:
                            // console.log("arrayConstructor")
                            this.cleanConfigRecursive(config[key], uimetadataPropertiesPath, (currentPath === "" ? key : currentPath + "." + key))
                            if (config[key].length === 0) {
                                // config[key] = undefined
                                delete config[key]
                            }
                            break
                        case objectConstructor:
                            this.cleanConfigRecursive(config[key], uimetadataPropertiesPath, (currentPath === "" ? key : currentPath + "." + key))
                            // console.log("object config[key]: key="+key+" value="+JSON.stringify(config[key])+"size:"+Object.keys(config[key]).length)
                            if (Object.keys(config[key]).length === 0) {
                                // console.log("object config[key]: Object empty")
                                delete config[key]
                            }
                            // console.log("objectConstructor")
                            break
                        default:
                        // console.log("Unknown")
                    }
                }
            }
        };
    }

}



const mapStateToProps = state => {
    return {
        error: state.uimetadata.error,
        status: state.uimetadata.status,
        uimetadata: state.uimetadata.uimetadata,
        uimetadataPrevious: state.uimetadata.uimetadataPrevious,
        config: state.config.config,
    }
}

const mapDispatchToProps = dispatch => ({
    uploadConfig: () => dispatch(uploadConfig()),
    receiveConfigSuccess: (response) => dispatch(receiveConfigSuccess(response)),
    receiveConfigFailure: (error) => dispatch(receiveConfigFailure(error)),
    fetchUIMetadata: () => dispatch(fetchUIMetadata()),
    fetchUIMetadataSuccess: (response) => dispatch(fetchUIMetadataSuccess(response)),
    fetchUIMetadataFailure: (error) => dispatch(fetchUIMetadataFailure(error)),
    fetchUIMetadataPrevious: () => dispatch(fetchUIMetadataPrevious()),
    fetchUIMetadataPreviousSuccess: (response) => dispatch(fetchUIMetadataPreviousSuccess(response)),
    fetchUIMetadataPreviousFailure: (error) => dispatch(fetchUIMetadataPreviousFailure(error)),
    updateUIMetadata: (uimetadata) => dispatch(updateUIMetadata(uimetadata)),
    fetchConfiguration: () => dispatch(fetchConfiguration()),
    fetchConfigurationSuccess: (response) => dispatch(fetchConfigurationSuccess(response)),
    fetchConfigurationFailure: (error) => dispatch(fetchConfigurationFailure(error)),
    updateConfiguration: (config) => dispatch(updateConfiguration(config)),
    updateModal: (data) => dispatch(updateModal(data)),
    handleClose: () => dispatch(updateModal({ open: false, type: '' })),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(EditConfig))
