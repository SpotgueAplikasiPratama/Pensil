import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import _ from "lodash";
import { I18nManager } from "react-native";
import { SGHelperGlobalVar } from '../../core/helper/SGHelperGlobalVar';

export class SGLocalize {
    static _isInit = false;
    static translationGetters = {
        // lazy requires (metro bundler does not support symlinks)
        id: () => require("./id.json"),
        en: () => require("./en.json"),
        cn: () => require("./cn.json"),
    };

    static translate = _.memoize(
        (key, config) => i18n.t(key, config),
        (key, config) => (config ? key + JSON.stringify(config) : key),
    );

    static changeLanguage(lang) {
        // fallback if no available language fits

        const fallback = { languageTag: SGHelperGlobalVar.getVar('GlobalLanguage'), isRTL: false };
        // var langInput = (lang.slice(8));
        // console.log(langInput);
        SGHelperGlobalVar.setVar('GlobalLanguage', lang);
        // const { languageTag, isRTL } =
        //     RNLocalize.findBestAvailableLanguage(Object.keys(SGLocalize.translationGetters)) ||
        //     fallback;

        const { languageTag, isRTL } =
            { languageTag: SGHelperGlobalVar.getVar('GlobalLanguage'), isRTL: false } ||
            fallback;

        // clear translation cache
        SGLocalize.translate.cache.clear();
        // update layout direction
        I18nManager.forceRTL(isRTL);

        // set i18n-js config
        i18n.translations = { [languageTag]: SGLocalize.translationGetters[languageTag]() };
        i18n.locale = languageTag;
    }

    static initLanguage(lang) {
        if (!SGLocalize._isInit) {
            SGLocalize.changeLanguage(lang);
            SGLocalize._isInit = true;
        }
    };
}