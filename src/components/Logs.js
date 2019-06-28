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

import ScrollBox from './common/ScrollBox';


const Logs = ({ status, stateName, stateLabel, logs, refreshedDate, error, t }) => (
    <div className='page-content-container'>
        <h2>{t("logs.logs")}: {stateLabel} </h2>
        {logs && <div >
            <ScrollBox content={logs} scrolldown={true} />
        </div>
        }
        {error &&
        <p style={{color:'red'}}>{error}</p>}
        {refreshedDate && <div className="bx--form-item">
            <label for="refrehdate" className="bx--label">{t("last_refresh_on")}</label>
            <input id="refrehdate" type="text" className="bx--text-input" readOnly value={refreshedDate.format('l LTS')} />
        </div>}
    </div>
)

export default translate("translations")(Logs)
