var React=require('react'); 
var {Text,View, Platform,StyleSheet,AppState, Animated, PixelRatio, AppState , PermissionsAndroid, Alert}=require('react-native'); 

import { SGHelperAnimation, SGHelperAPICall,  SGHelperDB, SGHelperErrorHandling, SGHelperFileMgr, SGHelperGlobalVar, SGHelperMsgBox, SGHelperNavigation,  SGHelperSoundPlayer, 
    SGHelperStyle, SGHelperType, SGHelperStringValidator, SGHelperRangeValidator, SGHelperArrayValidator, SGHelperFieldValidator, SGHelperWindow,
          
} from "./helper";
import {    SGActivityIndicator, SGBaseControl, SGButton, SGCheckBox, SGCheckBoxList, SGDatePicker, SGDialogBox,SGDragView, SGDrumRoll, 
    SGFilePicker,SGFlatList, SGIcon, SGIconButton, SGIconText, SGImage, SGImageButton,SGImagePicker, SGMapPicker, SGMapStatic, SGOTPInput,
    SGPanZoomView, SGPicker, SGPopView, SGQRImage, SGQRScanner, SGRootScrollView, SGRootView,  SGScrollView, SGSmartText, SGSwitch,  SGTabView,
    SGText, SGTextInput, SGTimePicker, SGTimerMessage,
    SGTouchableHighlight, SGTouchableNativeFeedback, SGTouchableOpacity, SGTouchableWithoutFeedback, SGView, SGViewPager, SGViewShot, SGWebView
} from './control';
import {SGBaseModel} from './model/SGBaseModel';
import { SGBaseScreen } from "./screen/SGBaseScreen";
import {
    SGFormBaseContainer, SGFormButton, SGFormDatePicker, SGFormErrorMessage,  SGFormFilePicker, SGFormImagePicker, SGFormMapPicker, SGFormPicker, 
    SGFormSearchFilterSort, SGFormSwitch, SGFormTextInput, SGFormTimePicker, 
} from './form';
import { SGBaseContainer} from './container/SGBaseContainer';
import { SGBaseForm} from './container/SGBaseForm';
// import SpriteSheet from 'rn-sprite-sheet';
import Video from 'react-native-video';
import { FullSearchBar } from '../visitor/component_V2/FullSearchBar';
import { SearchBarNoBack } from "../visitor/component_V2/SearchBarNoBack";
import { tbLookupDAO } from "../visitor/db/tbLookupDAO"; 
import { VisitorHelper } from "../visitor/helper/VisitorHelper";
import { FilterScreen } from "../visitor/screen/Filter/FilterScreen";
import { CustomMenuBar } from "../visitor/component_V2/CustomMenuBar";
import { BottomNavigationContainer } from "../visitor/component_V2/BottomNavigationContainer";
import { SGLocalize } from "../visitor/locales/SGLocalize";
import ViewShot from "react-native-view-shot";
import RNFetchBlob  from 'react-native-blob-util';
import CameraRoll from '@react-native-camera-roll/camera-roll';
import { RibbonHeader } from "../visitor/component_V2/RibbonHeader";
import { FABMenuList } from "../visitor/component_V2/FABMenuList";
import { CommentPopup } from "../visitor/container_V2/CommentPopup";
import { InputOrderDataForm } from "../visitor/form_V2/InputOrderDataForm";
import { FAB } from "../visitor/component_V2/FAB";

import WaiterHeader from "../visitor/container_V2/WaiterHeader";
import ProductOrderListCard from "../visitor/container_V2/ProductOrderListCard";
import SmallProductOrderMenuCard from "../visitor/container_V2/SmallProductOrderMenuCard";
import MenuCategoryList from "../visitor/container_V2/MenuCategoryList";



export default class Core {
    static React = React;
    static Text = Text;
    static View = View;
    static StyleSheet = StyleSheet;
    static AppState = AppState;
    static ViewShot = ViewShot;
    static RNFetchBlob = RNFetchBlob;
    static PermissionsAndroid = PermissionsAndroid;
    static Alert = Alert;
    static CameraRoll = CameraRoll;
    static runSafe = (...args) =>{
        try{
            var f = args[0].bind(args[1]);
            var ar = [];
            for (var i=2;i<args.length;i++){ar.push(args[i])}
            return f(...ar);    
        } catch(e){
            console.log(e);
            return null;
        }
    }
    static _logs = {timeStamp:Date.now(), data:[]};
    static log(str){
        if(Core._logs.data.length>100){
            Core._logs.data.splice(0,1);
        }
        Core._logs.data.push('> '+str);
        Core._logs.timeStamp = Date.now();
    }

    static _errorLogs = {timeStamp:Date.now(), data:[]};
    static logError(name,e){
        if(Core._errorLogs.data.length>100){
            Core._errorLogs.data.splice(0,1);
        }
        Core._errorLogs.data.push('['+name+'] > '+e);
        Core._errorLogs.timeStamp = Date.now();
        SGDialogBox.showToast('Error calling '+name);
    }
    static Model = {
        SGBaseModel : SGBaseModel
    };
    static Screen = {
        SGBaseScreen : SGBaseScreen,
        FilterScreen : FilterScreen
    };
    static Helper = {
        Platform: Platform,
        SGHelperAnimation: SGHelperAnimation,
        SGHelperGlobalVar: SGHelperGlobalVar,
        SGHelperMsgBox: SGHelperMsgBox, 
        SGHelperStyle: SGHelperStyle, 
        SGHelperType: SGHelperType, 
        SGHelperStringValidator: SGHelperStringValidator, 
        SGHelperRangeValidator: SGHelperRangeValidator, 
        SGHelperArrayValidator: SGHelperArrayValidator,
        SGHelperFieldValidator: SGHelperFieldValidator,
        SGHelperNavigation: SGHelperNavigation,
        SGHelperDB: SGHelperDB,
        SGHelperWindow: SGHelperWindow,
        SGHelperFileMgr: SGHelperFileMgr,
        SGHelperErrorHandling: SGHelperErrorHandling,
        SGHelperAPICall: SGHelperAPICall,
        SGHelperSoundPlayer: SGHelperSoundPlayer,
        SGHelperPixelRatio: PixelRatio,
        FullSearchBar: FullSearchBar,
        SearchBarNoBack: SearchBarNoBack,
        CustomMenuBar : CustomMenuBar,
        tbLookupDAO: tbLookupDAO,
        VisitorHelper: VisitorHelper,
        BottomNavigationContainer: BottomNavigationContainer,
        RibbonHeader: RibbonHeader,
        FABMenuList: FABMenuList,
        CommentPopup: CommentPopup,
        InputOrderDataForm: InputOrderDataForm,
        FAB:FAB,
        WaiterHeader: WaiterHeader,
        ProductOrderListCard: ProductOrderListCard,
        SmallProductOrderMenuCard: SmallProductOrderMenuCard,
        MenuCategoryList: MenuCategoryList
    }; 
    static Control = {
        SGActivityIndicator: SGActivityIndicator,
        SGBaseControl: SGBaseControl,
        SGButton: SGButton,
        SGCheckBox: SGCheckBox, 
        SGCheckBoxList: SGCheckBoxList,
        SGDatePicker: SGDatePicker,
        SGDialogBox: SGDialogBox,
        SGDrumRoll: SGDrumRoll,
        SGDragView: SGDragView,
        SGFlatList: SGFlatList,
        SGFilePicker: SGFilePicker,
        SGImage: SGImage,
        SGImageButton: SGImageButton,
        SGImagePicker: SGImagePicker,
        SGIcon: SGIcon, 
        SGIconButton: SGIconButton, 
        SGIconText: SGIconText,
        SGMapPicker: SGMapPicker,
        SGMapStatic: SGMapStatic,
        SGOTPInput: SGOTPInput,
        SGQRImage:SGQRImage, 
        SGQRScanner: SGQRScanner,
        SGPicker: SGPicker,
        SGPanZoomView: SGPanZoomView, 
        SGPopView: SGPopView, 
        SGRootView: SGRootView, 
        SGRootScrollView: SGRootScrollView, 
        SGScrollView: SGScrollView, 
        SGTabView: SGTabView,
        SGSwitch: SGSwitch,
        SGSmartText: SGSmartText, 
        SGText: SGText,
        SGTextInput: SGTextInput, 
        SGTimerMessage: SGTimerMessage, 
        SGTimePicker: SGTimePicker,
        SGTouchableHighlight: SGTouchableHighlight, 
        SGTouchableNativeFeedback: SGTouchableNativeFeedback, 
        SGTouchableOpacity: SGTouchableOpacity, 
        SGTouchableWithoutFeedback: SGTouchableWithoutFeedback,
        SGView: SGView,
        SGViewPager: SGViewPager,
        SGWebView: SGWebView,
        SGVideoPlayer:Video,
        Animated:Animated,
        SGBaseContainer:SGBaseContainer,
        SGViewShot:SGViewShot,
        SGLocalize: SGLocalize
        // SGSpriteSheet:SpriteSheet
    };
    static Form = {
        SGFormBaseContainer:SGFormBaseContainer,
        SGFormSearchFilterSort:SGFormSearchFilterSort,
        SGFormTextInput:SGFormTextInput,
        SGFormPicker:SGFormPicker,
        SGFormDatePicker:SGFormDatePicker,
        SGFormTimePicker:SGFormTimePicker,
        SGFormErrorMessage:SGFormErrorMessage,
        SGFormButton:SGFormButton,
        SGFormSwitch:SGFormSwitch,
        SGFormMapPicker:SGFormMapPicker,
        SGFormFilePicker:SGFormFilePicker,
        SGFormImagePicker:SGFormImagePicker,
        SGBaseForm:SGBaseForm
    }
}