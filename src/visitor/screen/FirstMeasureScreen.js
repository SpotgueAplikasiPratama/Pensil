import { SGFirstMeasureScreen } from '../../core/screen/SGFirstMeasureScreen';
import {  Platform } from "react-native";
import { tvMode } from '../../../app.json'
export class FirstMeasureScreen extends SGFirstMeasureScreen {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        if(Platform.isTV && tvMode)this.nextScreen='SplashAndroidTV' 
        else this.nextScreen = 'Splash';
    }
}
