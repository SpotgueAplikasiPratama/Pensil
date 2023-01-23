/**
 * Version 1.3.0
 * 1. Yohanes 27 April 2021
 * - fix search Anonymous
 */
import React from 'react';
import { StyleSheet,Platform } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGPopView, SGDialogBox, SGText, SGQRScannerIcon, SGIcon } from '../../core/control';
import image from '../asset/image';
import { SGHelperNavigation, SGHelperWindow, SGHelperGlobalVar, SGHelperErrorHandling, SGHelperType } from '../../core/helper';
import { tbVUserSearchHistoryAPI } from '../api/tbVUserSearchHistoryAPI';
import { tbUserSearchHistoryData } from '../db/tbVUserSearchHistoryDAO';
import { SGLocalize } from "../locales/SGLocalize";

export class SimpleSearchBar extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        console.log('create stylesheet:'+this.props.luxury);
        return StyleSheet.create({
            mainContainer: { width: w, height: SGHelperWindow.getHeaderHeight(), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: p * 3, borderBottomLeftRadius: p * 3, borderBottomRightRadius: p * 3, paddingBottom: p*2 },
            leftContainer: { flexDirection: 'row' },
            rightContainer: { flexDirection: 'row', marginRight: 0 },
            backBtn: {width: w * 0.072, height: w * 0.072, marginLeft: p * 6, backgroundColor: 'transparent', resizeMode: 'contain' },
            searchKeyword: { width: w * 0.6,height:w*0.085 },
            inboxBtn: { width: w * 0.095, height: w * 0.095, marginLeft: p * 4, backgroundColor: 'transparent', resizeMode: 'contain' },
            icon: { width: w * 0.095, height: w * 0.095, backgroundColor: 'transparent', resizeMode: 'contain' },
           
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.searchKeyword = this.props.searchKeyword ? this.props.searchKeyword : '';
        this.buildingKey = this.props.buildingKey ? this.props.buildingKey : '';
        this.storeKey = this.props.storeKey ? this.props.storeKey : '';
        this.restoKey = this.props.restoKey ? this.props.restoKey : '';
        this.showSearchBarInput = true;
        this.overrideShowSearchBarInput = false;       
        this.style = this.createStyleSheet(this.whp);
        this.pvID2 = SGPopView.getPopViewID();
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    }

    _setSearchKeyword(value) {
        this.searchKeyword = value;
    }


    onBackPressed() {
        SGHelperNavigation.goBack(this.props.navigator);
    }

    onInboxPress() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
            SGHelperNavigation.navigatePush(this.props.navigator, 'InboxList')
        }
    }
    async _addUserSearchHistory(blankJSONModel){
        try {
            await tbVUserSearchHistoryAPI.addUserSearchHistory(blankJSONModel);
            this._navigateSearch()
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addUserSearchHistory.bind(blankJSONModel))
        }
    }
    
    _navigateSearch(){
        console.log('navigate search')
        console.log(this.props.pushScreen)

        if (this.buildingKey !== '') {
            if(this.props.pushScreen){
                SGHelperNavigation.navigatePush(this.props.navigator, 'SearchInThisPlace', { searchKeyword: this.searchKeyword, buildingKey: this.buildingKey })
            }else{
                SGHelperNavigation.navigatePopPush(this.props.navigator, 'SearchInThisPlace', { searchKeyword: this.searchKeyword, buildingKey: this.buildingKey })
            }
        }
        else if (this.storeKey !== '') {
            if (this.props.screen) {
                if(this.props.pushScreen){
                    SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { searchKeyword: this.searchKeyword, storeKey: this.storeKey, categoryKey: this.props.categoryKey })
                }else{
                    SGHelperNavigation.navigatePopPush(this.props.navigator, this.props.screen, { searchKeyword: this.searchKeyword, storeKey: this.storeKey, categoryKey: this.props.categoryKey })
                }
            }
            else {
                if(this.props.pushScreen){
                    SGHelperNavigation.navigatePush(this.props.navigator, 'SearchInThisStore', { searchKeyword: this.searchKeyword, storeKey: this.storeKey })
                }else{
                    SGHelperNavigation.navigatePopPush(this.props.navigator, 'SearchInThisStore', { searchKeyword: this.searchKeyword, storeKey: this.storeKey })
                }
            }
        }
        else if (this.restoKey !== '') {
            if(this.props.screen){
                if(this.props.pushScreen){
                    console.log('1')
                    SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { searchKeyword: this.searchKeyword, restoKey: this.restoKey,categoryKey : this.props.categoryKey})
                }else{
                    console.log('2')
                    SGHelperNavigation.navigatePopPush(this.props.navigator, this.props.screen, { searchKeyword: this.searchKeyword, restoKey: this.restoKey,categoryKey : this.props.categoryKey})
                }
            }
            else {
                if(this.props.pushScreen){
                    console.log('3')
                    SGHelperNavigation.navigatePush(this.props.navigator, 'SearchInThisResto', { searchKeyword: this.searchKeyword, restoKey: this.restoKey })
                }else{
                    console.log('4')
                    SGHelperNavigation.navigatePopPush(this.props.navigator, 'SearchInThisResto', { searchKeyword: this.searchKeyword, restoKey: this.restoKey })
                }
            }
        }
        else {
            SGHelperNavigation.navigatePopPush(this.props.navigator, 'SearchAll', { searchKeyword: this.searchKeyword })  
        }
    }

    async _onSubmitSearch() {
        var blankWhiteString = false;
        var copyString = this.searchKeyword;
        if (!copyString.replace(/\s/g, '').length) {
            blankWhiteString = true;
          }
        if (this.searchKeyword !== '' && blankWhiteString !== true) {
            
            if(!SGHelperGlobalVar.getVar('GlobalAnonymous')){
                var dataModel = new tbUserSearchHistoryData();
                var blankJSONModel = dataModel.getCurrentJSON();
                blankJSONModel.fKeyword = this.searchKeyword;
                blankJSONModel.fLanguage = this.props.language.toUpperCase();
                blankJSONModel.fID = null;
                blankJSONModel.fUserKey = this.props.currentUser;
                await this._addUserSearchHistory(blankJSONModel)
            }else{
                this._navigateSearch()
            }
          
            
        }
    }

    _setShowSearchBarInput() {
        if(!this.overrideShowSearchBarInput){
            this.overrideShowSearchBarInput = true;       
            this.showSearchBarInput = SGHelperType.isDefined(this.props.luxury)?this.props.luxury:!this.showSearchBarInput;
            this.forceUpdate();    
        } else {
            this.showSearchBarInput = !this.showSearchBarInput;
            this.forceUpdate();
        }
        console.log(this.overrideShowSearchBarInput);
        console.log(this.showSearchBarInput);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'SimpleSearchBarRootView'} style={[style.mainContainer,{backgroundColor: this.props.luxury?'transparent':'#191919'}]}>
                <View accessible={true} style={style.leftContainer}>
                    <TouchableOpacity onPress={this.onBackPressed.bind(this)}>
                        <Image style={style.backBtn} source={{ uri: image.backLineWhiteIcon[this.props.imageSetting].url }}></Image>
                    </TouchableOpacity>
                </View>
                <View accessible={true} style={style.rightContainer}>
                    { (this.overrideShowSearchBarInput?this.showSearchBarInput:(SGHelperType.isDefined(this.props.luxury)?!this.props.luxury:this.showSearchBarInput)) &&
                        <TextInput accessible={true} accessibilityLabel={'SimpleSearchBarTextInput'} textStyle={{fontSize:w*0.025}} style={style.searchKeyword} onBlur={() => this._onSubmitSearch()} placeholder={this.props.placeholder} value={this.searchKeyword} onValueChange={(v) => { this._setSearchKeyword(v) }}></TextInput>
                    }
                    <TouchableOpacity onPress={() => { this._setShowSearchBarInput() }}>
                        <Image accessible={true} accessibilityLabel={''} source={{ uri: image.searchIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>
                    {this.anonymousMode !== true &&
                        <SGQRScannerIcon iconPreset={SGIcon.preset.w16} onScanSuccess={(v) => { this._checkDeepLinkingHandlerShareMessage(v) }} ></SGQRScannerIcon>
                    }
                </View>
            </View>
        );
    }
}
