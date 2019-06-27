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

import {
    DataTable,
    ToolbarItem,
    OverflowMenu,
    ToolbarTitle,
    OverflowMenuItem,
    Button
} from 'carbon-components-react';
import Modal from './common/Modal'

require('../scss/table.scss')

const {
    TableContainer,
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableSelectRow,
    TableSelectAll,
    TableCell,
    TableToolbar,
    TableToolbarAction,
    TableToolbarContent,
} = DataTable;

const headers = [
    {
        // `key` is the name of the field on the row object itself for the header
        key: 'id',
        // `header` will be the name you want rendered in the Table Header
        header: 'states.run_order',
    },
    {
        // `key` is the name of the field on the row object itself for the header
        key: 'labelLink',
        // `header` will be the name you want rendered in the Table Header
        header: 'states.label',
    },
    {
        key: 'status',
        header: 'states.status',
    },
    {
        key: 'next_run',
        header: 'states.next_run',
    },
    {
        key: 'start_time',
        header: 'states.start_time',
    },
    {
        key: 'end_time',
        header: 'states.end_time',
    },
    {
        key: 'reason',
        header: 'states.reason',
    },
    {
        key: 'logs',
        header: 'states.logs',
    },
    {
        key: 'previous_logs',
        header: 'states.previous_logs',
    },
    {
        key: 'delete',
        header: '',
    },
];

const headersTranslated = t => headers.map(item => {
    const ret = {
        ...item,
        key: item.key,
        header: t(item.header)
    }
    return ret
})

const States = ({ getStates,
    extensionName,
    resetEngine,
    startDeployment,
    isAuthorized,
    isRunning,
    refreshedDate,
    editAction,
    changeStatesStatus,
    addExtensionAction,
    addExtensionSubmit,
    defaultExtensionName,
    t }) => (

        <div className='page-content-container'>
            <div>
                <DataTable
                    rows={getStates(t)}
                    headers={headersTranslated(t)}
                    render={({
                        rows,
                        headers,
                        getHeaderProps,
                        getSelectionProps,
                        selectedRows, }) => (
                            <TableContainer title={t("states.title")}>
                                <TableToolbar>
                                    <ToolbarItem>
                                        <OverflowMenu floatingMenu>
                                            <ToolbarTitle title={t("states.menu")} />
                                            <OverflowMenuItem disabled={(extensionName !== defaultExtensionName)} itemText={t("states.reset_statuses")} onClick={resetEngine} />
                                        </OverflowMenu>
                                    </ToolbarItem>
                                    {(extensionName === defaultExtensionName) &&
                                        <Button
                                            onClick={startDeployment.bind(this, defaultExtensionName)}
                                            disabled={(!isAuthorized || isRunning)}
                                        >
                                            {t("states.start_deployment")}
                                        </Button>
                                    }
                                    {(extensionName !== defaultExtensionName) &&
                                        <div>
                                            <Button
                                                onClick={startDeployment.bind(this, defaultExtensionName)}
                                                disabled={(!isAuthorized || isRunning)}
                                            >
                                                {t("states.start_main_extension")}
                                            </Button>
                                            &nbsp;
                                            <Button
                                                onClick={startDeployment.bind(this, extensionName)}
                                                disabled={(!isAuthorized || isRunning)}
                                            >
                                                {t("states.start_this_extension")}
                                            </Button>
                                        </div>}

                                    <TableToolbarContent>
                                        <TableToolbarAction
                                            iconName="edit"
                                            iconDescription={t("states.edit")}
                                            onClick={editAction(selectedRows)}
                                        />
                                        <Button onClick={addExtensionAction()} small kind="primary">
                                            {t("states.add_extension")}
                                        </Button>
                                    </TableToolbarContent>
                                </TableToolbar>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableSelectAll {...getSelectionProps()} />
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
                                                <TableSelectRow {...getSelectionProps({ row })} />
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
            <div className="bx--form-item">
                <label htmlFor="refrehdate" className="bx--label">{t("last_refresh_on")}</label>
                <input id="refrehdate" type="text" className="bx--text-input" readOnly value={refreshedDate ? refreshedDate.format('l LTS') : ""} />
            </div>
            <Modal addExtensionSubmit={addExtensionSubmit} changeStatesStatus={changeStatesStatus} />
        </div>
    )

export default translate("translations")(States)
