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

const Settings = ({ handleSubmit, handleSubmitOnReturn, handleServerUrlChange, handleTokenChange, handleTimeoutChange, serverUrl, token, timeout, error, t }) => (

    <div className='page-content-container'>
        <h1>{t('uisettings.title')}</h1>
        <div className="bx--form-item">
            <label htmlFor="server-url" className="bx--label">{t("settings.url")}</label>
            <input id="server-url" type="text" className="bx--text-input"
                placeholder={window.location.protocol == "http:" ? window.location.protocol + "//" + window.location.hostname + ":30101" : window.location.protocol + "//" + window.location.hostname + ":30103"}
                value={serverUrl}
                onChange={handleServerUrlChange}
                onBlur={handleSubmit}
                onKeyUp={handleSubmitOnReturn} />
        </div>
        <div className="bx--form-item">
            <label htmlFor="token" className="bx--label">{t("settings.token")}</label>
            <input id="token" type="text" className="bx--text-input"
                placeholder={t("settings.token")}
                value={token}
                onChange={handleTokenChange}
                onBlur={handleSubmit}
                onKeyUp={handleSubmitOnReturn} />
        </div>
        <div className="bx--form-item">
            <label htmlFor="timeout" className="bx--label">{t("settings.timeout")}</label>
            <input id="timeout" type="number" className="bx--text-input"
                placeholder={t("settings.timeout")}
                value={timeout}
                onChange={handleTimeoutChange}
                onBlur={handleSubmit}
                onKeyUp={handleSubmitOnReturn} />
        </div>
        <div className="bx--form-item">
            <button className="bx--btn bx--btn--primary" type="button" onClick={handleSubmit}>{t("button.submit")}</button>
        </div>
        {error &&
            <p style={{ color: 'red' }}>{error}</p>}
    </div>
)

export default translate("translations")(Settings)
