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
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

import { createStore } from 'redux';
import configManagerApp from './reducers/reducers';
import { Provider } from 'react-redux'

const store = createStore(configManagerApp)

ReactDOM.render(
    <Provider store={store}>
    <I18nextProvider i18n={i18n}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </I18nextProvider>
    </Provider>,
    document.getElementById("root")
);
registerServiceWorker();
