import React from 'react';
import { Text } from 'react-native';
import { SGHelperGlobalVar } from '../helper/SGHelperGlobalVar';
import { SGHelperStyle } from '../helper/SGHelperStyle';
import { SGHelperType } from '../helper/SGHelperType';
import { SGConfigCore } from '../config/SGConfigCore';
import {SGTimerMessage} from './SGTimerMessage';
import { SGHelperMsgBox} from '../../core/helper/SGHelperMsgBox';
/**
 * wrap react-native Text component with 2 additional behavior
 * 1. ability use multTitle property which contain JSON of multilanguage text and detect the current language to choose the correct text
 * 2. help mode which if enabled will show help when the label is pressed, use multHelp property which support multi language also
 * 3. apply default style from SGHelperStyle.style.SGText
 */
export class SGSmartText extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._defStyle = SGHelperStyle.style.SGSmartText;
    }

    render() {
        var lang = SGHelperGlobalVar.getVar('Language');
        var helpMode = false;
        var myProps =[];
        if (SGHelperType.isDefined(this.props.helpMode)) {
            if (this.props.helpMode && SGHelperType.isDefined(this.props.multiHelp)) {
                helpMode = true;
            }
        }
        if(helpMode){
            myProps = SGHelperStyle.addStyleProps(this.props, {...this._defstyle,color:SGConfigCore.config.SGSmartText.helpColor});
            myProps.onPress = ()=>{SGTimerMessage.showTimerMessage(myProps.timerMessageID, SGConfigCore.lang.Common.HelpTitle[lang], myProps.multiHelp[lang]); }    
        } else {
            myProps = SGHelperStyle.addStyleProps(this.props, this._defStyle);
        }
        if (SGHelperType.isDefined(myProps.multiTitle)) {
            myProps.children = myProps.multiTitle[lang];
        }
        return <Text  {...myProps} ></Text >;
    }
}