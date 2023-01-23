/**
* Spotgue Core Helper for showing Message Dialog Box
* wrap react native alert implementation and hide from Spotgue UI App
* utilize SGHelperPopUp as base element to display dialog box
* @format 
* @flow 
* 1. Show modal (disable back button) Message Box with title, body, button, and event handler
*    a. OK Only
*    b. OK & Cancel
* 2. Trigger event onOK and onCancel
*/

import { Alert } from 'react-native';
import {SGHelperType}from './SGHelperType';
import {SGHelperGlobalVar} from './SGHelperGlobalVar';

export class SGHelperMsgBox {


    static labels={
        EN:{
            yes:'Yes',
            no:'No',
            ok:'OK',
        },
        ID:{
            yes:'Yes',
            no:'No',
            ok:'OK',
        },
        CN:{
            yes:'是',
            no:'不',
            ok:'好',
        }
    };

    static showOK(title, msg, onPress, language='ID', type) {
        Alert.alert(title, msg, [{ text: SGHelperMsgBox.labels[language].ok, onPress: onPress }], { cancelable: false });
    }
    static showYesNo(title, msg, onYes, onNo, language='ID') {
        Alert.alert(title, msg, [{ text: SGHelperMsgBox.labels[language].no, onPress: onNo },{ text: SGHelperMsgBox.labels[language].yes, onPress: onYes }], { cancelable: false });
    }
}