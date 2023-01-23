 import React from 'react';
 import { StyleSheet } from 'react-native';
 import { SGBaseContainer } from '../../core/container/SGBaseContainer';
 import { SGView as View, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGTextInput as TextInput, SGPopView as PopView,SGIcon as Icon } from '../../core/control';
 import image from '../asset/image';
 import { SGHelperNavigation, SGHelperWindow, SGHelperGlobalVar,SGHelperType, SGHelperErrorHandling} from '../../core/helper';
 import { SortPopUp } from './SortPopUp';
 import { FilterPopUp } from './FilterPopUp';
 import { SGLocalize } from '../locales/SGLocalize';
 
 export class SearchBarNoBack extends SGBaseContainer {
 
     createStyleSheet = (whp) => {
         var { w, h, p } = whp;
         return StyleSheet.create({
             mainContainer: { width: w, height: SGHelperWindow.getHeaderHeight(), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: p, paddingLeft: p * 5, paddingRight: p * 1.5, borderRadius: p * 3.5},
             iconBack: {width: w * 0.072, height: w * 0.072, backgroundColor: 'transparent', resizeMode: 'contain' },
             icon: { width: w * 0.095, height: w * 0.095,backgroundColor: 'transparent', resizeMode: 'contain' },
             leftContainer: { flexDirection: 'row', justifyContent: 'flex-start' },
             rightContainer: { flexDirection: 'row', justifyContent: 'flex-end', paddingRight: p*2 },
             searchBar: { width: w*0.7, height: w*0.085, resizeMode: 'contain', alignItems: 'center', borderRadius: p * 2, borderColor: 'black' }
         });
     }
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
         this.searchKeyword = this.props.searchKeyword ? this.props.searchKeyword : '';
         this.buildingKey = this.props.buildingKey ? this.props.buildingKey : '';
         this.storeKey = this.props.storeKey ? this.props.storeKey : '';
         this.restoKey = this.props.restoKey ? this.props.restoKey : '';
         this.categoryKey = this.props.categoryKey ? this.props.categoryKey : '';
         this.style = this.createStyleSheet(this.whp);
         this.noSearchBar = SGHelperType.isDefined(this.props.noSearchBar) ? this.props.noSearchBar : false;
         this.noIconSearchBar = SGHelperType.isDefined(this.props.noIconSearchBar)? this.props.noIconSearchBar : false;
         this.pvID1 = PopView.getPopViewID();
         this.pvID2 = PopView.getPopViewID();
         this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
     }
 
     _setSearchKeyword(value) {
         this.searchKeyword.keyword = value;
     }
 

    async _onSubmitSearch() {
        var blankWhiteString = false;
        var copyString = this.searchKeyword.keyword;
        if (!copyString.replace(/\s/g, '').length) {
            blankWhiteString = true;
        }
        var refresh = this.props.refresh;
        console.log(this.searchKeyword)
        console.log('lihat sinii')
        await refresh(true)

     }
 
     render() {
         var { w, h, p } = this.whp;
         var style = this.style;
         return (
             <View hidden={this.props.hidden} accessible={true} accessibilityLabel={'FullSearchBarRootView'} style={style.mainContainer}>
                 {/* <View accessible={true} style={style.leftContainer}>
                     <BackButton hidden={!SGHelperNavigation.canGoBack(this.props.navigator)} imageSetting={this.props.imageSetting ? this.props.imageSetting : SGHelperGlobalVar.getVar('GlobalImageSetting')} navigator={this.props.navigator} style={style.iconBack}></BackButton>
                 </View> */}
                 <View accessible={true} style={style.leftContainer}>
                     {
                         this.noSearchBar === false ?
                             (<TextInput textStyle={{fontSize:w*0.025}} accessible={true} accessibilityLabel={'FullSearchBarInput'} style={style.searchBar} onBlur={() => this._onSubmitSearch()} placeholder={SGLocalize.translate('searchPlaceholder.default')} value={this.searchKeyword.keyword} onValueChange={(v) => { this._setSearchKeyword(v) }}></TextInput>)
                             :
                             (null)
                     }
                 </View>
                 <View accessible={true} style={style.rightContainer}>
                     <TouchableOpacity onPress={() => PopView.showPopView(this.pvID1)}>
                         <Icon name={Icon.Icon.sortFontAwesome} preset={Icon.preset.h2}></Icon>
                         {/* <Image accessible={true} accessibilityLabel={''} source={{ uri: image.sortIcon[this.imageSetting].url }} style={style.icon}></Image> */}
                     </TouchableOpacity>
                     <TouchableOpacity hidden={this.props.hideFilter} onPress={this.props.onPressFilter}>
                         <Icon name={Icon.Icon.filter} preset={Icon.preset.h2}></Icon>
                         {/* <Image accessible={true} accessibilityLabel={'FullSearchBarIconFilter'} source={{ uri: image.filterIcon[this.imageSetting].url }} style={style.icon}></Image> */}
                     </TouchableOpacity>
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
 