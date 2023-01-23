/**
 * Version 1.3.0
 * 1. Yohanes 03 May 2021
 * -add ErrorHandling
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGTextInput as TextInput, SGText as Text,SGPopView as PopView,SGIcon as Icon, SGQRScannerIcon, SGIcon } from '../../core/control';
import image from '../asset/image';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperErrorHandling,SGHelperWindow } from '../../core/helper';
import { tbVUserSearchHistoryAPI } from '../api/tbVUserSearchHistoryAPI';
import { tbUserSearchHistoryData } from '../db/tbVUserSearchHistoryDAO';
import { BackButton } from '../component_V2/BackButton';
import { SGLocalize } from '../locales/SGLocalize';
import { FilterPopUp } from './FilterPopUp';

export class NoSortSearchBar extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#191919', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: p, paddingLeft: p * 5, paddingRight: p * 1.5, borderBottomLeftRadius: p * 3.5, borderBottomRightRadius: p * 3.5 },
            iconBack: {width: w * 0.072, height: w * 0.072, backgroundColor: 'transparent', resizeMode: 'contain' },
            icon: { marginLeft: -2 * p,width: w * 0.095, height: w * 0.095, backgroundColor: 'transparent', resizeMode: 'contain' },
            searchBar: { backgroundColor: '#FFFFFF', width: (w - (p * 2)) * 0.100 * 6, height: w*0.085, resizeMode: 'contain', alignItems: 'center', borderRadius: p * 2 },
            textSearch: { backgroundColor: '#E6E6E6' },
            iconBar: { flexDirection: 'row' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.searchKeyword = this.props.searchKeyword ? this.props.searchKeyword : '';
        this.buildingKey = this.props.buildingKey ? this.props.buildingKey : '';
        this.storeKey = this.props.storeKey ? this.props.storeKey : '';
        this.restoKey = this.props.restoKey ? this.props.restoKey : '';
        this.categoryKey = this.props.categoryKey ? this.props.categoryKey : '';
        this.showSearchBarInput = false;
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.pvID1 = PopView.getPopViewID();
        this.pvID2 = PopView.getPopViewID();
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    }

    _setSearchKeyword(value) {
        this.searchKeyword = value;

    }

    _setShowSearchBarInput() {
        this.showSearchBarInput = !this.showSearchBarInput;
        this.forceUpdate();
    }


    async _addUserSearchHistory(blankJSONModel){
        try {
            await tbVUserSearchHistoryAPI.addUserSearchHistory(blankJSONModel);
            if (this.props.screen) {
                SGHelperNavigation.navigatePopPush(this.props.navigator, this.props.screen, { searchKeyword: this.searchKeyword, buildingKey: this.props.buildingKey ? this.props.buildingKey : null })
            }
            else {
                SGHelperNavigation.navigatePopPush(this.props.navigator, 'SearchAll', { searchKeyword: this.searchKeyword })
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addUserSearchHistory.bind(this,blankJSONModel))
        }
        
    }
    async _onSubmitSearch() {
        var blankWhiteString = false;
        var copyString = this.searchKeyword;
        if (!copyString.replace(/\s/g, '').length) {
            blankWhiteString = true;
          }
        if (this.searchKeyword !== '' && blankWhiteString !== true) {
            var dataModel = new tbUserSearchHistoryData();
            var blankJSONModel = dataModel.getCurrentJSON();
            blankJSONModel.fKeyword = this.searchKeyword;
            blankJSONModel.fLanguage = this.props.language.toUpperCase();
            blankJSONModel.fID = null;
            blankJSONModel.fUserKey = this.props.currentUser;
            await this._addUserSearchHistory(blankJSONModel)
        }
    }
      
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;

        return (
            <View accessible={true} accessibilityLabel={'NoSortSearchBarRootView'} style={style.mainContainer}>
                <BackButton hidden={!SGHelperNavigation.canGoBack(this.props.navigator)} imageSetting={this.props.imageSetting} navigator={this.props.navigator} style={style.iconBack}></BackButton>
                {
                    this.showSearchBarInput === true ?
                        (<TextInput textStyle={{fontSize:w*0.025}} accessible={true} accessibilityLabel={'NoSortSearchBarInputText'} style={style.searchBar} onBlur={() => this._onSubmitSearch()} placeholder={SGLocalize.translate('searchPlaceholder.default')} value={this.searchKeyword} onValueChange={(v) => { this._setSearchKeyword(v) }}></TextInput>)
                        :
                        (null)
                }
                <View style={style.iconBar}>
                    {this.props.noSearch ? 
                    (null)
                :
                (
                <TouchableOpacity onPress={() => { this._setShowSearchBarInput() }}>
                    <Image accessible={true} accessibilityLabel={''} source={{ uri: image.searchIcon[this.imageSetting].url }} style={style.icon}></Image>
               </TouchableOpacity>)}
                <TouchableOpacity hidden={this.props.hideFilter} onPress={this.props.onPressFilter}>
                    <Icon name={Icon.Icon.filter} preset={Icon.preset.h2} style={{color:'white'}}></Icon>
                    {/* <Image accessible={true} accessibilityLabel={'FullSearchBarIconFilter'} source={{ uri: image.filterIcon[this.imageSetting].url }} style={style.icon}></Image> */}
                </TouchableOpacity>
                {this.anonymousMode !== true &&
                    <SGQRScannerIcon iconPreset={SGIcon.preset.w16} onScanSuccess={(v) => { this._checkDeepLinkingHandlerShareMessage(v) }}></SGQRScannerIcon>
                }
                </View>
                {/* <PopView accessible={true} shadow animationType={'slide'} popViewID={this.pvID1} vPos='bottom'>
                    <SortPopUp popViewID={this.pvID1} navigator={this.props.navigation} style={style.throwWHP} forceUpdate={this.props.forceUpdate} sortOptions={this.props.sortData} onApplySort={this.props.onApplySort}></SortPopUp>
                </PopView> */}
                <PopView accessible={true} shadow animationType={'slide'} popViewID={this.pvID2} vPos='bottom'>
                    <FilterPopUp popViewID={this.pvID2} navigator={this.props.navigation} style={style.throwWHP} forceUpdate={this.props.forceUpdate} filterData={this.props.filterData} buildingMatrix={this.props.buildingMatrix} onApplyFilter={this.props.onApplyFilter}></FilterPopUp>
                </PopView>
            </View>
        );
    }
}
