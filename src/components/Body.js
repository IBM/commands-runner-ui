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
import UploadConfig from '../containers/UploadConfig'
import EditConfig from '../containers/EditConfig'
import UISettings from '../containers/UISettings'
import StatesContainer from '../containers/StatesContainer'
import LogsContainer from '../containers/LogsContainer'
import ExtensionsContainer from '../containers/ExtensionsContainer'
import {
  Route,
  Switch,
} from 'react-router-dom'
import CRStatusContainer from '../containers/CRStatusContainer';

class Body extends React.Component {

  render() {
    return (
      <div>
        <CRStatusContainer settings={this.props.settings}/>
        <Switch>
          <Route path="/uisettings" component={UISettings} />
          {this.props.settings && <Route path="/uploadConfig" component={UploadConfig} />}
          {this.props.settings && <Route path="/editConfig" component={EditConfig} />}
          {this.props.settings && <Route path="/states" component={StatesContainer} />}
          {this.props.settings && <Route path="/logs" component={LogsContainer} />}
          {this.props.settings && <Route path="/extensions" component={ExtensionsContainer} />}
          <Route path="/" component={UISettings} />
        </Switch>
      </div>
    )
  }
}


export default Body;
