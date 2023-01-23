/**
 * Version 1.3.0
 * 1. Yohanes 03 May 2021
 * -add ErrorHandling
 */
import React from 'react';
import { StyleSheet,Platform } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGTextInput as TextInput, SGPopView as PopView,SGIcon as Icon, SGQRScannerIcon, SGIcon } from '../../core/control';
import image from '../asset/image';
import { SGHelperNavigation, SGHelperWindow, SGHelperGlobalVar, SGHelperErrorHandling } from '../../core/helper';
import { tbVUserSearchHistoryAPI } from '../api/tbVUserSearchHistoryAPI';
import { tbUserSearchHistoryData } from '../db/tbVUserSearchHistoryDAO';
import { BackButton } from './BackButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SortPopUp } from './SortPopUp';
import { FilterPopUp } from './FilterPopUp';

export class GroupSearchBar extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#191919', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: p, paddingLeft: p * 5, paddingRight: p * 1.5, borderBottomLeftRadius: p * 3.5, borderBottomRightRadius: p * 3.5 },
            iconBack: {width: w * 0.072, height: w * 0.072, backgroundColor: 'transparent', resizeMode: 'contain' },
            icon: { width: w * 0.095, height: w * 0.095,backgroundColor: 'transparent', resizeMode: 'contain' },
            leftContainer: { flexDirection: 'row', justifyContent: 'flex-start' },
            rightContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
            searchBar: { backgroundColor: '#FFFFFF', width: (w - (p * 2)) * 0.100 * 5,  height: w*0.085, resizeMode: 'contain', alignItems: 'center', borderRadius: p * 2 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.groupTenantKey = this.props.groupTenantKey ? this.props.groupTenantKey : '';
        this.style = this.createStyleSheet(this.whp);
        this.showSearchBarInput = false;
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.pvID1 = PopView.getPopViewID();
        this.pvID2 = PopView.getPopViewID();
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    }

    _setShowSearchBarInput() {
        this.showSearchBarInput = !this.showSearchBarInput;
        this.forceUpdate();
    }
    async _addUserSearchHistory(blankJSONModel){
        try {
            await tbVUserSearchHistoryAPI.addUserSearchHistory(blankJSONModel);
            this.props.onRefreshStore();
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addUserSearchHistory.bind(this,blankJSONModel))
        }
    }

    async _onSubmitSearch() {
         var blankWhiteString = false;
        var copyString = this.props.searchKeyword;
        if (!copyString.replace(/\s/g, '').length) {
            blankWhiteString = true;
          }
        if (this.props.searchKeyword !== '' && blankWhiteString !== true) {
            var dataModel = new tbUserSearchHistoryData();
            var blankJSONModel = dataModel.getCurrentJSON();
            blankJSONModel.fKeyword = this.props.searchKeyword;
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
            <View hidden={this.props.hidden} accessible={true} accessibilityLabel={'AddFavoritesSearchBarRootView'} style={style.mainContainer}>
                <View accessible={true} style={style.leftContainer}>
                    <BackButton hidden={!SGHelperNavigation.canGoBack(this.props.navigator)} imageSetting={this.props.imageSetting ? this.props.imageSetting : SGHelperGlobalVar.getVar('GlobalImageSetting')} navigator={this.props.navigator} style={style.iconBack}></BackButton>
                </View>
                <View accessible={true} style={style.rightContainer}>
                    {
                        this.showSearchBarInput === false ?
                            (<TextInput textStyle={{fontSize:w*0.025}} accessible={true} accessibilityLabel={'AddFavoritesSearchBarInput'} style={style.searchBar} onBlur={() => this._onSubmitSearch()} placeholder={SGLocalize.translate('searchPlaceholder.searchGroupTenant')} value={this.props.searchKeyword} onValueChange={(v) => { this.props.setSearchKeyword(v); }}></TextInput>)
                            :
                            (null)
                    }
                   
                    <TouchableOpacity onPress={() => { this._setShowSearchBarInput() }}>
                        <Image accessible={true} accessibilityLabel={''} source={{ uri: image.searchIcon[this.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => PopView.showPopView(this.pvID1)}>
                    <Icon name={Icon.Icon.sortFontAwesome} preset={Icon.preset.h2} style={{color:'white'}}></Icon>
                        {/* <Image accessible={true} accessibilityLabel={'AddFavoritesSearchBarIconSort'} source={{ uri: image.sortIcon[this.imageSetting].url }} style={style.icon}></Image> */}
                    </TouchableOpacity>
                    <TouchableOpacity hidden={this.props.hideFilter} onPress={this.props.onPressFilter}>
                        <Icon name={Icon.Icon.filter} preset={Icon.preset.h2} style={{color:'white'}}></Icon>
                        {/* <Image accessible={true} accessibilityLabel={'AddFavoritesSearchBarIconFilter'} source={{ uri: image.filterIcon[this.imageSetting].url }} style={style.icon}></Image> */}
                    </TouchableOpacity>
                    {this.anonymousMode !== true &&
                        <SGQRScannerIcon iconPreset={SGIcon.preset.w16} onScanSuccess={(v) => { this._checkDeepLinkingHandlerShareMessage(v) }}></SGQRScannerIcon>
                    }
                </View>
                <PopView accessible={true} shadow animationType={'slide'} popViewID={this.pvID1} vPos='bottom'>
                    <SortPopUp popViewID={this.pvID1} navigator={this.props.navigation} style={style.throwWHP} forceUpdate={this.props.forceUpdate} sortOptions={this.props.sortData} onApplySort={this.props.onApplySort}></SortPopUp>
                </PopView>
                <PopView accessible={true} shadow animationType={'slide'} popViewID={this.pvID2} vPos='bottom'>
                    <FilterPopUp popViewID={this.pvID2} navigator={this.props.navigation} style={style.throwWHP} forceUpdate={this.props.forceUpdate} filterData={this.props.filterData} buildingMatrix={this.props.buildingMatrix} onApplyFilter={this.props.onApplyFilter}></FilterPopUp>
                </PopView>
            </View>
        );
    }
}
