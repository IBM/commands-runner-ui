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
    FileUploaderButton,
    Loading
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
    TableCell,
    TableToolbar,
    TableToolbarContent,
} = DataTable;

const headers = [
    {
        // `key` is the name of the field on the row object itself for the header
        key: 'id',
        // `header` will be the name you want rendered in the Table Header
        header: 'extensions.name',
    },
    {
        // `key` is the name of the field on the row object itself for the header
        key: 'type',
        // `header` will be the name you want rendered in the Table Header
        header: 'extensions.type',
    },
    {
        key: 'deleteAction',
        header: '',
    },
    {
        key: 'insertRemove',
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

const Extensions = ({ getExtensions, registerExtensionAction, addExtensionSubmit, isLoading, t }) => (
    <div className='page-content-container'>
        <div>
            <DataTable
                rows={getExtensions()}
                headers={headersTranslated(t)}
                render={({
                    rows,
                    headers,
                    getHeaderProps }) => (
                        <TableContainer title={t("extensions.extensions")}>
                            <TableToolbar>
                                <TableToolbarContent>
                                    <Loading active={isLoading} />
                                    <FileUploaderButton
                                        labelText={t("extensions.register_extension")}
                                        accept={[".zip"]}
                                        name="file"
                                        onChange={registerExtensionAction}
                                        disableLabelChanges={true}
                                    />
                                </TableToolbarContent>
                            </TableToolbar>
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
        <Modal addExtensionSubmit={addExtensionSubmit} />
    </div>
)

export default translate("translations")(Extensions)

