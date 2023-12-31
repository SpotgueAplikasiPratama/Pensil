/**
 * @format
 */

/*
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
*/

import {AppRegistry} from 'react-native';
import App from './src/visitor/app';
//import App from './App';
import {name as appName} from './app.json';
import {useAPIMgmt} from './app.json';
import {SGHelperAPICall, SGHelperGlobalVar} from './src/core/helper';


import 'react-native-get-random-values'
import {mode} from './app.json';
if(mode==='live'){
    console.log2=console.log;
    console.log=()=>{};
    SGHelperGlobalVar.addVar('GlobalAppMode',mode);
}
if(useAPIMgmt==='false'){
    SGHelperAPICall.setUseAPIMgmt(false);
} else {
    SGHelperAPICall.setUseAPIMgmt(true);
}
AppRegistry.registerComponent(appName, () => App);
