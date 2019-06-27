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
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

var resources = {}
const tryRequire = (path) => {
    try {
     return require(`${path}`);
    } catch (err) {
     return null;
    }
  };

var ln = tryRequire('./i18n/common_de.json')
resources['de'] = { translations: ln }
ln = tryRequire('./i18n/common_en.json')
resources['en'] = { translations: ln }
ln = tryRequire('./i18n/common_fr.json')
resources['fr'] = { translations: ln }
ln = tryRequire('./i18n/common_it.json')
resources['it'] = { translations: ln }
ln = tryRequire('./i18n/common_ja.json')
resources['ja'] = { translations: ln }
ln = tryRequire('./i18n/common_ko.json')
resources['ko'] = { translations: ln }
ln = tryRequire('./i18n/common_pt_BR.json')
resources['pt-BR'] = { translations: ln }
ln = tryRequire('./i18n/common_zh_CN.json')
resources['zh-CN'] = { translations: ln }
ln = tryRequire('./i18n/common_zh_TW.json')
resources['zh-TW'] = { translations: ln }

i18n.use(LanguageDetector).init({
    detection: {
        order: ["localStorage", "navigator"],
    },
    // we init with resources
    resources: resources,
    fallbackLng: "en",
    debug: false,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
        escapeValue: false, // not needed for react!!
        formatSeparator: ","
    },

    react: {
        wait: true,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'

    }
});

export default i18n;
