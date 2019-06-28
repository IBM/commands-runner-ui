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

const CRStatus = ({ status, settings, t }) => (

    <div>
        {(status === undefined) &&
            <center><h2>{settings && settings['deployment_name']?settings['deployment_name']:t('crstatus.default_deployment_name')} / {t('crstatus.waiting')}</h2></center>}
        {(status !== undefined && status["cr_post_install_status"] === undefined) &&
            <center><h2>{settings && settings['deployment_name']?settings['deployment_name']:t('crstatus.default_deployment_name')} / {t('crstatus.not_available')}</h2></center>}
        {(status !== undefined && status["cr_post_install_status"] !== undefined && status["cr_post_install_status"].value !== 'COMPLETED') &&
            <center><h2>{settings && settings['deployment_name']?settings['deployment_name']:t('crstatus.default_deployment_name')} / Inception: {status["cr_post_install_status"].value}</h2></center>}
        {(status !== undefined && status["cr_post_install_status"] !== undefined  && status["cr_post_install_status"].value === 'COMPLETED') &&
            <center><h2>{settings && settings['deployment_name']?settings['deployment_name']:t('crstatus.default_deployment_name')}</h2></center>}
    </div>
)

export default translate("translations")(CRStatus)
