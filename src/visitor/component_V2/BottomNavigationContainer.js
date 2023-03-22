/**
 * version 1.1.0
 *  1. Yohanes , 10 March 2021
 * - hide Map API if mode = live
 */
import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import {SGTouchableOpacity as TouchableOpacity, SGView as View, SGImage as Image, SGPopView, SGDialogBox,SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperType, SGHelperStyle,SGHelperErrorHandling } from '../../core/helper';
import { PleaseRegisterPopup } from '../container_V2/PleaseRegisterPopup';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';

export class BottomNavigationContainer extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        var barHeight =Math.max((SGHelperWindow.getHeaderHeight() + SGHelperWindow.getFooterHeight() - 2*p), w*0.1525*0.75 );
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { alignItems:'flex-start', width: w, height: barHeight, backgroundColor: '#171717', flexDirection: 'row', shadowRadius: p * 0.1, shadowOpacity: 0.065, shadowOffset: { height: -p }, overflow: 'visible', borderTopLeftRadius: w * 0.035, borderTopRightRadius: w * 0.035 },
            items: { width: w / 5 - p, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', paddingLeft: p, paddingRight: p },
            icon: { backgroundColor:'transparent', width: Math.min(barHeight*0.9,w*0.09), height: Math.min(barHeight*0.9,w*0.09), borderRadius: 0, resizeMode: 'contain' },
            iconHome: { backgroundColor: 'transparent', width: w * 0.1525, height: w * 0.1525, borderRadius: 0, resizeMode: 'contain', marginBottom: Math.max(SGHelperWindow.getFooterHeight(),3.5*p)},
            textView: { width: w / 5 - p, paddingBottom: p },
            text: { textAlign: 'center', color: '#FFDF00' },
            mainView: { position: 'absolute', bottom: 0, width: w, backgroundColor: 'transparent', overflow: 'visible' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.pvAPILog = SGPopView.getPopViewID()
        this.APILog = []
        this.askAliceIcon =  SGHelperType.getSystemParamsValue('askAliceIcon'+this.imageSetting.charAt(0).toUpperCase()+this.imageSetting.slice(1));
        this.myParkingIcon =  SGHelperType.getSystemParamsValue('myParkingIcon'+this.imageSetting.charAt(0).toUpperCase()+this.imageSetting.slice(1));
        this.homeIcon =  SGHelperType.getSystemParamsValue('homeIcon'+this.imageSetting.charAt(0).toUpperCase()+this.imageSetting.slice(1));
        this.myBookingIcon =  SGHelperType.getSystemParamsValue('myBookingIcon'+this.imageSetting.charAt(0).toUpperCase()+this.imageSetting.slice(1));
        this.myRewardIcon =  SGHelperType.getSystemParamsValue('myRewardIcon'+this.imageSetting.charAt(0).toUpperCase()+this.imageSetting.slice(1));
    }

    setActive1() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
            // if(this.props.screen !== 'AskAlice'){
                var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerAlice')
                var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
                if(circuitBreaker.fActive==="Y"){
                    console.log('ask alice screen !!!!!')
                    SGHelperNavigation.navigatePush(this.props.navigator, 'AskAlice', { selectedPlace: this.props.selectedPlace });
                }else{
                    SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
                }
            // }
        }
    }

    setActive2() {

        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
             if(this.props.screen !== 'MyParkingSpotWithLayout') {
                var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerMyParking')
                var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
                if(circuitBreaker.fActive==="Y"){
                    this._onIconParkirClick();
                    console.log('Parkir Screen !!!!!')
                    SGHelperNavigation.navigatePush(this.props.navigator, 'MyParkingSpotWithLayout');
                }else{
                    SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
                }
             }
               
             
        }
    }

    setActive3() {
        console.log('home')
        if(this.props.screen !== 'Home') SGHelperNavigation.navigateReset(this.props.navigator, 'Home',{})
        
    }

    _onLongHomePress(){
        if(this.props.screen == 'Home')
            SGHelperNavigation.navigateReset(this.props.navigator, 'Home',{})
        }
    
    setActive4() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
            if(this.props.screen !== 'MyRestoBooking') {
                var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerMyBooking')
                var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
                if(circuitBreaker.fActive==="Y"){
                    this._onMyBookingClick();
                    console.log('my resto booking')
                    SGHelperNavigation.navigatePush(this.props.navigator, 'MyRestoBooking');
                }else{
                    SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
                }
            }
            
        }
    }

    setActive5() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
            if(this.props.screen !== 'MyRewards'){
                var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerMyReward')
                var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
                if(circuitBreaker.fActive==="Y"){
                    this._onIconMyRewardClick();
                    console.log('my reward')
                    SGHelperNavigation.navigatePush(this.props.navigator, 'MyRewards');
                }   
                else{
                    SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
                }
            }
        }

    }

    navigationRender(onPress, name, icon, iconType, no) {
        var style = this.style;
        var { w, h, p } = this.whp;
        return (
            <TouchableOpacity delayLongPressButton={1000} style={style.items} onPress={onPress} onLongPress={()=>{this._onLongHomePress()}}>
                {no == 1 &&
                    <Image accessible={true} accessibilityLabel={icon} source={{ uri: icon }} style={iconType === 'home' ? (style.iconHome) : (style.icon)}></Image>
                }
                {/* {no == 2 &&
                     <Icon name={Icon.Icon.robot} preset={Icon.preset.h2} style={{ color: 'white',marginTop:2.1*p }}></Icon>
                } */}
            </TouchableOpacity>
        );
    }

    _onMyBookingClick(){
        console.log('My Booking Click')
        var jsonInput = { fID: '', fContentType: 'MyBookingIcon',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
        this._addUserClick(jsonInput)
    }


    _onIconParkirClick(){
        console.log('IconParkirClick click')
        var jsonInput = { fID: '', fContentType: 'MyParkirIcon',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
        this._addUserClick(jsonInput)
    }

    _onIconMyRewardClick(){
        console.log('IconMyReward click')
        var jsonInput = { fID: '', fContentType: 'MyRewardIcon',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
        this._addUserClick(jsonInput)
    }


    _addUserClick(jsonInput){
        console.log('user click');
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View style={style.mainView}>
                <View accessible={true} accessibilityLabel={'BottomNavigationContainerRootView'} style={style.mainContainer}>
                    <SGPopView accessible={true} accessibilityLabel={'BottomNavigationContainerPopView'} vPos={'Top'} modal popViewID={this.pvID2}>
                        <PleaseRegisterPopup accessible={true} accessibilityLabel={'BottomNavigationContainerPleaseRegisterPopup'} navigator={this.props.navigator} popViewID={this.pvID2} style={style.throwWHP}></PleaseRegisterPopup>
                    </SGPopView>
                 
                    {this.navigationRender(this.setActive1.bind(this), SGLocalize.translate("bottomNavigationContainer.askAlice"), this.askAliceIcon,'',1)}
                    {this.navigationRender(this.setActive2.bind(this), SGLocalize.translate("bottomNavigationContainer.myParking"), this.myParkingIcon,'',1)}
                    {this.navigationRender(this.setActive3.bind(this), SGLocalize.translate("bottomNavigationContainer.home"), this.homeIcon, 'home',1)}
                    {this.navigationRender(this.setActive4.bind(this), SGLocalize.translate("bottomNavigationContainer.myBooking"), this.myBookingIcon,'',1)}
                    {this.navigationRender(this.setActive5.bind(this), SGLocalize.translate("bottomNavigationContainer.myRewards"), this.myRewardIcon,'',1)}
                </View >
            </View >
        );
    }
}
