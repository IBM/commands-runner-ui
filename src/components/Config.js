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

import * as Actions from '../actions/actionTypes'
import { DataTable, DropdownV2, Button, FileUploaderButton, Icon, TextInput } from 'carbon-components-react';
import Modal from './common/Modal';


require('../scss/table.scss')

const {
    TableContainer,
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} = DataTable;

const validationHeaders = [
    {
        // `key` is the name of the field on the row object itself for the header
        key: 'id',
        // `header` will be the name you want rendered in the Table Header
        header: 'validation.name',
    },
    {
        key: 'message_type',
        header: 'validation.message_type',
    },
    {
        key: 'message',
        header: 'validation.message',
    },
];

const validationHeadersTranslated = t => validationHeaders.map(item => {
    const ret = {
        ...item,
        key: item.key,
        header: t(item.header)
    }
    return ret
})

const extensionHeaders = [
    {
        // `key` is the name of the field on the row object itself for the header
        key: 'id',
        // `header` will be the name you want rendered in the Table Header
        header: 'extension.name',
    },
    {
        key: 'upload',
        header: '',
    },
    {
        key: 'default',
        header: '',
    },
    {
        key: 'configuration_type',
        header: '',
    },
    {
        key: 'edit',
        header: '',
    },
    {
        key: 'config',
        header: '',
    },
];

const extensionHeadersTranslated = t => extensionHeaders.map(item => {
    const ret = {
        ...item,
        key: item.key,
        header: t(item.header)
    }
    return ret
})


const Config = ({
    inceptionSetupCompleted,
    statusUploadConfig,
    statusValidateConfig,
    statusGenerateConfig,
    statusDeploymentStart,
    uploadConfigAndValidate,
    fetchExtensions,
    fetchErrors,
    isAuthorized,
    isRunning,
    startDeployment,
    fetchConfiguration,
    uimetadataAllConfigsNames,
    uimetadataFileSelectedConfig,
    uimetadataSelectedConfig,
    onChangeUImetadataConfigDropdown,
    editConfiguration,
    defaultExtensionName,
    uploadConfigExtensions,
    extensionsConfigurationConfigNameDone,
    t

}) => (

        <div className='page-content-container'>
            {inceptionSetupCompleted &&
                uimetadataAllConfigsNames &&
                ((uimetadataFileSelectedConfig && uimetadataSelectedConfig) || extensionsConfigurationConfigNameDone === true) &&
                <div>
                    <h1>{t("config.title")}</h1>
                    <br />
                    <div className="bx--file__container">
                        <table style={{ "border-collapse": "separate", "border-spacing": "5px" }}>
                            <tr>
                                <td>
                                    {!isRunning && <FileUploaderButton
                                        labelText={t("config.upload_configuration_file")}
                                        accept={[".yml", ".yaml"]}
                                        name="file"
                                        onChange={uploadConfigAndValidate}
                                    />}
                                </td>
                                <td>
                                    {uimetadataAllConfigsNames[defaultExtensionName] && !isRunning && <DropdownV2
                                        id="configuration_name"
                                        label={t("config.select_configuration_type")}
                                        items={uimetadataAllConfigsNames[defaultExtensionName]}
                                        initialSelectedItem={uimetadataFileSelectedConfig ? uimetadataFileSelectedConfig[defaultExtensionName] : undefined}
                                        selectedItem={uimetadataSelectedConfig ? uimetadataSelectedConfig[defaultExtensionName] : undefined}
                                        onChange={(selected) => onChangeUImetadataConfigDropdown(defaultExtensionName, selected)}
                                    />}
                                </td>
                                <td>
                                    {uimetadataAllConfigsNames[defaultExtensionName] && !isRunning && <Icon
                                        name="edit"
                                        description={t("config.edit_configuration")}
                                        onClick={() => editConfiguration(defaultExtensionName)}
                                    >Edit configuration file
                    </Icon>}
                                </td>
                                <td>
                                    <Icon
                                        name="document"
                                        description={t("config.view_configuration")}
                                        onClick={() => fetchConfiguration(defaultExtensionName)}
                                    >View configuration file
                                </Icon>
                                </td>
                            </tr>
                        </table>
                    </div>
                    {statusUploadConfig === Actions.UPLOAD_REQUEST_STATUS.IN_PROGRESS && <div><br />{t("config.upload_in_progress")}</div>}
                    {statusValidateConfig === Actions.VALIDATE_REQUEST_STATUS.IN_PROGRESS && <div><br />{t("config.validation_in_progress")}</div>}
                    <div className='page-content-container'>
                        <br />
                        <DataTable
                            rows={fetchExtensions()}
                            headers={extensionHeadersTranslated(t)}
                            render={({ rows, headers, getHeaderProps }) => (
                                <TableContainer title={t("extension.configurations")} d>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {headers.map(header => (
                                                    <TableHeader {...getHeaderProps({ header })}>
                                                        {header.header}
                                                    </TableHeader>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map(row => (
                                                <TableRow key={row.id}>
                                                    {row.cells.map(cell => {
                                                        switch (cell.id) {
                                                            case row.id + ":upload":
                                                                return <TableCell key={cell.id}>
                                                                    {!isRunning && <FileUploaderButton
                                                                        labelText={t("extension.upload_configuration_file")}
                                                                        disabled={(!isAuthorized || isRunning)}
                                                                        accept={[".yml", ".yaml"]}
                                                                        name='file'
                                                                        onChange={uploadConfigExtensions(row.id)} />}
                                                                </TableCell>
                                                            case row.id + ":configuration_type":
                                                                return <TableCell key={cell.id}>
                                                                    {uimetadataAllConfigsNames[row.id] && !isRunning && <DropdownV2
                                                                        id="configuration_name"
                                                                        label={t("extension.select_configuration_type")}
                                                                        disabled={isRunning}
                                                                        items={uimetadataAllConfigsNames[row.id]}
                                                                        initialSelectedItem={uimetadataFileSelectedConfig ? uimetadataFileSelectedConfig[row.id] : undefined}
                                                                        selectedItem={uimetadataSelectedConfig ? uimetadataSelectedConfig[row.id] : undefined}
                                                                        onChange={(selected) => onChangeUImetadataConfigDropdown(row.id, selected)}
                                                                    />}
                                                                </TableCell>
                                                            case row.id + ":edit":
                                                                return <TableCell key={cell.id}>
                                                                    {uimetadataAllConfigsNames[row.id] && !isRunning && <Icon
                                                                        name="edit"
                                                                        description={t("extension.edit_configuration")}
                                                                        onClick={() => { editConfiguration(row.id) }}
                                                                    >Edit configuration</Icon>}
                                                                </TableCell>
                                                            case row.id + ":config":
                                                                return <TableCell key={cell.id}>
                                                                    <Icon
                                                                        name="icon--document"
                                                                        description={t("extension.view_configuration")}
                                                                        onClick={() => { fetchConfiguration(row.id) }}
                                                                    />
                                                                </TableCell>
                                                            default:
                                                                return <TableCell key={cell.id}>{cell.value} </TableCell>
                                                        }
                                                    }
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        />
                    </div>
                    <div>
                        <Button
                            onClick={startDeployment}
                            disabled={(!isAuthorized || isRunning || statusDeploymentStart === Actions.DEPLOYMENT_REQUEST_STATUS.IN_PROGRESS)}>
                            {t("config.start_deployment")}
                        </Button>
                    </div>
                    <br />
                    {isRunning && <div>Deployment running</div>}
                    {statusGenerateConfig === Actions.GENERATE_REQUEST_STATUS.IN_PROGRESS && <div>{t("config.generate_configuration")}</div>}
                    {statusDeploymentStart === Actions.DEPLOYMENT_REQUEST_STATUS.IN_PROGRESS && <div>{t("config.deployment_in_progress")}</div>}
                    {(statusValidateConfig === Actions.VALIDATE_REQUEST_STATUS.ERROR ||
                        statusValidateConfig === Actions.VALIDATE_REQUEST_STATUS.DONE_WITH_WARNING ||
                        statusUploadConfig === Actions.UPLOAD_REQUEST_STATUS.ERROR ||
                        statusDeploymentStart === Actions.DEPLOYMENT_REQUEST_STATUS.ERROR) && <div>
                            <div className='page-content-container'>
                                <DataTable
                                    rows={fetchErrors()}
                                    headers={validationHeadersTranslated(t)}
                                    render={({ rows, headers, getHeaderProps }) => (
                                        <TableContainer title={t("config.configuration_warnings_errors")}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        {headers.map(header => (
                                                            <TableHeader {...getHeaderProps({ header })}>
                                                                {header.header}
                                                            </TableHeader>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rows.map(row => (
                                                        <TableRow key={row.id}>
                                                            {row.cells.map(cell => (
                                                                <TableCell key={cell.id}>{cell.value}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                />
                            </div>
                        </div>}
                </div>}
            <Modal />
        </div>
    )

export default translate("translations")(Config)
