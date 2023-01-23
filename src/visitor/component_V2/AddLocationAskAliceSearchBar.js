/**
 * Version 1.3.0
 * 1. Yohanes 03 May 2021
 * -add ErrorHandling
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGTextInput as TextInput, SGPopView as PopView,SGIcon as Icon  } from '../../core/control';
import image from '../asset/image';
import { SGHelperNavigation, SGHelperWindow, SGHelperGlobalVar } from '../../core/helper';

import { BackButton } from './BackButton';
import { SortPopUp } from './SortPopUp';
import { SGLocalize } from '../locales/SGLocalize';

export class AddLocationAskAliceSearchBar extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#191919', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: p, paddingLeft: p * 5, paddingRight: p * 1.5, borderBottomLeftRadius: p * 3.5, borderBottomRightRadius: p * 3.5 },
            iconBack: {width: w * 0.072, height: w * 0.072,  backgroundColor: 'transparent', resizeMode: 'contain' },
            icon: { width: w * 0.1, height: w * 0.1, backgroundColor: 'transparent', resizeMode: 'contain' },
            leftContainer: { flexDirection: 'row', justifyContent: 'flex-start' },
            rightContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
            searchBar: { backgroundColor: '#FFFFFF', width: (w - (p * 2)) * 0.100 * 5, height: (w - (p * 2)) * 0.080, resizeMode: 'contain', alignItems: 'center', borderRadius: p * 2 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.buildingKey = this.props.buildingKey ? this.props.buildingKey : '';
        this.storeKey = this.props.storeKey ? this.props.storeKey : '';
        this.style = this.createStyleSheet(this.whp);
        this.showSearchBarInput = false;
        this.pvID1 = PopView.getPopViewID();
        this.searchKeyword = this.props.searchKeyword ? this.props.searchKeyword : {searchKeyword:''};
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    _setSearchKeyword(value) {
        this.searchKeyword.searchKeyword = value;
    }

    _setShowSearchBarInput() {
        this.showSearchBarInput = !this.showSearchBarInput;
        this.forceUpdate();
    }

    async _onSubmitSearch() {
        var blankWhiteString = false;
        var copyString = this.searchKeyword.searchKeyword;
        if (!copyString.replace(/\s/g, '').length) {
            blankWhiteString = true;
        }
        
        console.log(this.searchKeyword);
        console.log(blankWhiteString);
        if (this.searchKeyword.searchKeyword !== '' && blankWhiteString !== true) {
            this.props.onRefreshAllItem();
        }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        console.log(this.props.sortData);
        return (
            <View hidden={this.props.hidden} accessible={true} accessibilityLabel={'AddLocationAskAliceSearchBarRootView'} style={style.mainContainer}>
                <View accessible={true} style={style.leftContainer}>
                    <BackButton hidden={!SGHelperNavigation.canGoBack(this.props.navigator)} imageSetting={this.props.imageSetting ? this.props.imageSetting : SGHelperGlobalVar.getVar('GlobalImageSetting')} navigator={this.props.navigator} style={style.iconBack}></BackButton>
                </View>
                <View accessible={true} style={style.rightContainer}>
                    {
                        this.showSearchBarInput === true ?
                            (<TextInput accessible={true} accessibilityLabel={'AddLocationAskAliceSearchBarInput'} style={style.searchBar} onBlur={() => this._onSubmitSearch()} placeholder={SGLocalize.translate('searchPlaceholder.default')} value={this.props.searchKeyword.searchKeyword} onValueChange={(v) => { this._setSearchKeyword(v) }}></TextInput>)
                            :
                            (null)
                    }
                    <TouchableOpacity onPress={() => { this._setShowSearchBarInput() }}>
                        <Image accessible={true} accessibilityLabel={''} source={{ uri: image.searchIcon[this.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => PopView.showPopView(this.pvID1)}>
                        <Icon name={Icon.Icon.sortFontAwesome} preset={Icon.preset.h2} style={{color:'white'}}></Icon>
                        {/* <Image accessible={true} accessibilityLabel={'AddLocationAskAliceSearchBarIconSort'} source={{ uri: image.sortIcon[this.imageSetting].url }} style={style.icon}></Image> */}
                    </TouchableOpacity>
                    <TouchableOpacity hidden={this.props.hideFilter} onPress={this.props.onPressFilter}>
                        <Icon name={Icon.Icon.filter} preset={Icon.preset.h2} style={{color:'white'}}></Icon>
                        {/* <Image accessible={true} accessibilityLabel={'AddLocationAskAliceSearchBarIconFilter'} source={{ uri: image.filterIcon[this.imageSetting].url }} style={style.icon}></Image> */}
                    </TouchableOpacity>
                </View>
                <PopView accessible={true} shadow animationType={'slide'} popViewID={this.pvID1} vPos='bottom'>
                    <SortPopUp popViewID={this.pvID1} navigator={this.props.navigation} style={style.throwWHP} forceUpdate={this.props.forceUpdate} sortOptions={this.props.sortData} onApplySort={this.props.onApplySort}></SortPopUp>
                </PopView>
            </View>
        );
    }
}
