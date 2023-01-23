/**
 * Melvin 8 April 2021, Removes the filter, but the date type does not
 */

/**
 * search bar with filter-sort button
 * 1. receive prop filterData as array of JSON
 *    filter type : search | single | multi | date | number | decimal | ...
 *    when visible:false then it will not be shown in filter list but still used for filtering if value: not null
 *    when type:search then it will link to the search text input
 *    when value:null then no initial (default) filter applied
 *    a. search format : { name: 'fRewardNameID', operator: 'CONTAINS', value:null, type: 'search', title: 'Search Reward', visible:true },
 *    b. single format : { name: 'fActive', operator: '=', value:null, type: 'single', title: 'Active Status',  optionList: [{ key: 'Y', title: 'Active' }, { key: 'N', title: 'Inactive' }], visible:true },
 *    c. multi format : { name: 'fRandom', operator: 'IN', value:null, type: 'multi', title: 'Random',  optionList: [{ key: 'Y', title: 'Random' }, { key: 'N', title: 'First' }], visible:true},
 *    d. date format : { name: 'fCreateDate', operator: '>=', value:null, type: 'date', title: 'Create Date (min)',dateRange: {start:new Date(), end:new Date()}  visible:true},
 *    e. number format : { name: 'fTotal', operator: '<=', value:null, type: 'number', title: 'Total (max)',  visible:true},
 *    f. decimal format : { name: 'fPrice', operator: '>=', value:null, type: 'decimal', title: 'Price (min)',  visible:true},
 * 2. receive prop sortData as array of JSON
 *    when selected:true then the sorting criteria is enabled
 *    when visible:false then it will not be shown in the sorting list but still used for sorting if selected:true
 *    a. format : { name: 'fCreatedDate', descending:false, title: 'Oldest on top', selected:false, visible:true }
 * 3. show search textInput in new screen with recent searches (store/mall tidak perlu, visitor perlu)
 * 4. show filter and sort criteria in new screen
 * 5. show see more filter in another screen (checkboxlist)
 * 6. onValueChange event triggered when user click <terapkan> search text entered | filter value change | sort value change with parameter 
 *    passed JSON consist of {filterData: xx, sortData: yy}
 * 7. hidden true|false
 * 8. disabled true|false
 * 9. shadow true|false
 * 10. if filterData do not have type:search, then hide search text 
 * 11. if filterData do not have filter criteria that is not type:search then hide filter icon
 * 12. if sorData is empty, then hide sort icon    
 * 13. language ID|EN|CN
 * 14. pending : how to handle location filtering country->province->city->mall may need to create custom picker set
 *     type:city and type:mall 
 *     for visitor it may need to intuitively default the country | province | city based on user's profile
 * range using slider
 */
 import React from 'react';
 import { StyleSheet, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
 import { SGBaseContainer } from '../../core/container/SGBaseContainer';
 import { SGView, SGIconButton, SGText, SGTextInput, SGButton, SGTouchableOpacity, SGIcon, SGPopView, SGCheckBoxList, SGPicker, SGDatePicker, SGScrollView } from '../../core/control';
 import { SGHelperType, SGHelperStyle } from '../helper';
 export class SGFormSearchFilterSort extends SGBaseContainer {
     labels = {
         EN: {
             search: 'Search',
             searchKeyword: 'search keyword',
             recentSearches: 'Recent Searches',
             filter: 'Filter',
             sort: 'Sort',
             clear: 'Clear',
             apply: 'Apply',
             searchResult: 'Search Result'
         },
         ID: {
             search: 'Pencarian',
             searchKeyword: 'kata kunci',
             recentSearches: 'Pencarian Sebelumnya',
             filter: 'Saring',
             sort: 'Urutkan',
             clear: 'Hapus',
             apply: 'Terapkan',
             searchResult: 'Hasil Pencarian'
         },
         CN: {
             search: '搜索',
             searchKeyword: '关键词',
             recentSearches: '最近搜寻',
             filter: '过滤',
             sort: '分类',
             clear: '肃清',
             apply: '应用',
             searchResult: '搜索结果'
         }
     }
     initStyleSheet() {
         if (!this._isStyleInit || this._strStyle !== JSON.stringify(this.props.style)) {
             this._isStyleInit = true;
             this._strStyle = JSON.stringify(this.props.style);
             var { w, h, p } = this._screenWHPNoHeader;
             this._style = StyleSheet.create({
                 v1: { backgroundColor: 'white', },
                 v2: { backgroundColor: 'white', width: w, paddingHorizontal: 2 * p, paddingVertical: 2 * p, borderBottomWidth: 1, borderBottomColor: SGHelperStyle.color.borderColor, flexDirection: 'row', justifyContent: 'flex-end' },
                 v3: { flex: 1, borderRadius: 2 * p, borderWidth: 1, borderColor: SGHelperStyle.color.borderColor, backgroundColor: SGHelperStyle.color.pickerSearchBarColor, paddingVertical: 0, paddingHorizontal: p / 2, flexDirection: 'row', justifyContent: 'space-between' },
                 to1: { flex: 1, },
                 t1: {},
                 icon1: { marginLeft: 2 * p },
                 pv1: { justifyContent: 'flex-start', alignItems: 'flex-start', borderWidth: 1, backgroundColor: SGHelperStyle.color.popUpBackgroundColor, borderColor: SGHelperStyle.color.borderColor, width: w - 8 * p, height: this._screenWHP.h - 2 * p, borderRadius: 2 * p, padding: p, backgroundColor: 'white', borderWidth: 1 },
                 pv1_v1: { width: '100%', borderBottomWidth: 1, borderBottomColor: SGHelperStyle.color.borderColor, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' },
                 pv1_v2: { marginTop: 2 * p, alignSelf: 'stretch', backgroundColor: 'white', borderRadius: p, padding: p, flexDirection: 'row', justifyContent: 'space-between' },
                 pv1_v2b: { alignSelf: 'stretch', marginHorizontal: p, padding: p, justifyContent: 'flex-start', alignItems: 'flex-start' },
                 pv1_sv1: { marginTop: 2 * p, },
                 pv1_t1: { flex:1 },
                 pv1_ib1: { alignSelf: 'flex-end', backgroundColor: 'red', color: 'white', borderRadius: p, marginHorizontal: p },
                 pv1_b1: { padding: 0 },
                 pv1_ti1: {  width:w*0.8 },
                 pv1_f1: { marginBottom: 3 * p, width: '95%', backgroundColor: 'white', borderRadius: p, marginHorizontal: 0 },
 
             });
         }
     }
     initSortData() {
         this._originalSortData = JSON.stringify(this.props.sortData);
         this._sortData = SGHelperType.isDefined(this.props.sortData) ? SGHelperType.copyJSON(this.props.sortData) : [];
         this._sortCount = 0;
         this._displaySortData = [];
         this._displaySortValue = [];
         for (var i = 0; i < this._sortData.length; i++) {
             if (this._sortData[i].visible) {
                 this._displaySortData.push({ key: i, title: this._sortData[i].title })
                 if (this._sortData[i].selected) {
                     this._displaySortValue.push(i);
                 }
                 this._sortCount++;
             }
         }
     }
     initFilterData() {
         this._recentSearchData = (SGHelperType.isDefined(this.props.recentSearchData) ? this.props.recentSearchData : []);
         this._searchListData = (SGHelperType.isDefined(this.props.searchListData) ? this.props.searchListData : []);
         this._arrFieldName = (SGHelperType.isDefined(this.props.arrFieldName) ? this.props.arrFieldName : []);
         this._originalFilterData = JSON.stringify(this.props.filterData);
         this._filterData = SGHelperType.isDefined(this.props.filterData) ? SGHelperType.copyJSON(this.props.filterData) : [];
         this._filterSearchIndex = -1;
         this._filterCount = 0;
         for (var i = 0; i < this._filterData.length; i++) {
             this._filterData[i].index = i;
             if (this._filterData[i].type === 'search') {
                 this._filterSearchIndex = i;
             } else {
                 
                 if (this._filterData[i].visible) {
                     this._filterCount++;
                 }
             }
         }
     }
     initData() {
         if (!this._isDataInit || this._originalFilterData !== JSON.stringify(this.props.filterData) || this._originalSortData !== JSON.stringify(this.props.sortData)) {
             this.initFilterData();
             this.initSortData();
             if (!this._isDataInit) {
                 this.state = { filterData: this._filterData, sortData: this._sortData };
             } else {
                 this.setState({ filterData: this._filterData, sortData: this._sortData });
             }
             this._isDataInit = true;
         }
     }
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this._isStyleInit = false;
         this._isDataInit = false;
         this.initStyleSheet();
         this.initData();
         this.pvID1 = SGPopView.getPopViewID();
         this.pvID2 = SGPopView.getPopViewID();
         this.pvID3 = SGPopView.getPopViewID();
         this.pvID4 = SGPopView.getPopViewID();
     }
     //search event handler
     onSearchChangeTextHandler(v) {
         this._filterData[this._filterSearchIndex].value = v
         this.setState({ filterData: this._filterData, sortData: this._sortData })
     }
     onSearchRecentPress(v) {
         this._filterData[this._filterSearchIndex].value = v;
         this.setState({ filterData: this._filterData, sortData: this._sortData })
     }
     onClearSearchHandlerInside() {
         this._filterData[this._filterSearchIndex].value = null;
         this.setState({ filterData: this._filterData, sortData: this._sortData })
     }
     onClearSearchHandler() {
         this._filterData[this._filterSearchIndex].value = null;
         this.onValueChangeHandler();
     }
     onShowSearchHandler() {
         this._selectedKeyWord = null;
         SGPopView.showPopView(this.pvID1);
     }
     onApplySearchHandler() {
         this.onValueChangeHandler();
         SGPopView.hidePopView(this.pvID1);
     }
     onCloseSearchHandler() {
         this.initFilterData();
         this.initSortData();
         this.setState({ filterData: this._filterData, sortData: this._sortData })
         SGPopView.hidePopView(this.pvID1);
     }
     //search list handler
     onShowSearchListHandler() {
         SGPopView.showPopView(this.pvID4);
     }
     onClearSearchHandlerListInside() {
         this._filterData[this._filterSearchIndex].value = null;
         this.setState({ filterData: this._filterData, sortData: this._sortData })
     }
     onApplySearchListHandler() {
         this.onValueChangeHandler();
     }
     onCloseSearchListHandler() {
         this.initFilterData();
         this.initSortData();
         this._filterData[this._filterSearchIndex].value = null;
         this.setState({ filterData: this._filterData, sortData: this._sortData })
         SGPopView.hidePopView(this.pvID4);
     }
     _onClickValue(v) {
         this._selectedKeyWord = v;
         SGPopView.hidePopView(this.pvID4);
     }
     //filter event handler
     onFilterValueChange(d, v) {
         this._filterData[d.index].value = v;
         this.setState({ filterData: this._filterData, sortData: this._sortData })
     }
     onClearFilterHandler() {
         for (var i = 0; i < this._filterData.length; i++) {
             if (this._filterData[i].type !== 'search' && this._filterData[i].type !== 'date' && this._filterData[i].visible) {
                 this._filterData[i].value = null;
             }
         }
         this.setState({ filterData: this._filterData, sortData: this._sortData })
     }
 
     onShowFilterHandler() {
         SGPopView.showPopView(this.pvID2);
     }
     onApplyFilterHandler() {
         this.onValueChangeHandler();
         SGPopView.hidePopView(this.pvID2);
     }
     onCloseFilterHandler() {
         this.initFilterData();
         this.initSortData();
         this.setState({ filterData: this._filterData, sortData: this._sortData })
         SGPopView.hidePopView(this.pvID2);
     }
     //sort event handler
     onSortValueChange(v) {
         for (var i = 0; i < this._sortData.length; i++) {
             if (this._sortData[i].visible) {
                 this._sortData[i].selected = false;
             }
         }
         for (var i = 0; i < v.length; i++) {
             this._sortData[v[i]].selected = true;
         }
         this.setState({ filterData: this._filterData, sortData: this._sortData })
     }
     onClearSortHandler() {
         for (var i = 0; i < this._sortData.length; i++) {
             if (this._sortData[i].visible) {
                 this._sortData[i].selected = false;
             }
         }
         this._displaySortValue = [];
         this.setState({ filterData: this._filterData, sortData: this._sortData })
     }
     onShowSortHandler() {
         SGPopView.showPopView(this.pvID3);
     }
     onApplySortHandler() {
         this.onValueChangeHandler();
         SGPopView.hidePopView(this.pvID3);
     }
     onCloseSortHandler() {
         this.initFilterData();
         this.initSortData();
         this.setState({ filterData: this._filterData, sortData: this._sortData })
         SGPopView.hidePopView(this.pvID3);
     }
     //trigger props onValueChange and state update
     onValueChangeHandler() {
      
         for (var i = 0; i < this._filterData.length; i++) {
             if (this.props.filterData[i].visible) {
             
                 this.props.filterData[i].value = this._filterData[i].value;
             }
         }
         for (var i = 0; i < this._sortData.length; i++) {
             if (this.props.sortData[i].visible) {
                 this.props.sortData[i].selected = this._sortData[i].selected;
             }
         }
         console.log('1');
         console.log(this._filterData);
         this._filterData[this._filterSearchIndex].value = this._filterData[this._filterSearchIndex].value
       
         this._filterData = SGHelperType.copyJSON(this.props.filterData);
         this._sortData = SGHelperType.copyJSON(this.props.sortData);
         if (this.props.onValueChange) {
             this.props.onValueChange({ filterData: this._filterData, sortData: this._sortData })
             if (this._searchListData.length !== 0) this._searchListData = this.props.searchListData
             else this._searchListData = []
         }
         this.setState({ filterData: this._filterData, sortData: this._sortData })
     }
 
     _onDismissPV4Handler() {
 
         if (this._selectedKeyWord !== null) {
             this.props.onShowLayoutParkir(this._selectedKeyWord);
         }
     }
 
     render() {
         var isDef = SGHelperType.isDefined;
         this.initData();
         this.initStyleSheet();
         var style = this._style;
         var lang = this.props.language ? this.props.language : 'ID';
         var searchTextColor = this._filterSearchIndex === -1 ? null : (SGHelperType.isDefined(this._filterData[this._filterSearchIndex].value) ? SGHelperStyle.color.textColor : SGHelperStyle.color.placeHolderTextColor);
         return (
             <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortRootView'} disabled={this.props.disabled} hidden={this.props.hidden} shadow={this.props.shadow} shadowIntensity={this.props.shadowIntensity} style={style.v1}>
                 <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortTopView'} style={style.v2} >
                     {
                         this._filterSearchIndex !== -1 &&
                         <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortTopSearchView'} hidden={this._filterSearchIndex === -1} style={style.v3} >
                             <SGIcon accessible={true} accessibilityLabel={'SGFormSearchFilterSortTopSearchIcon'} disabled={this.props.disabled} name={SGIcon.Icon.search} />
                             <SGTouchableOpacity disabled={this.props.disabled} style={style.to1} onPress={this.props.showSearchList ? this.onShowSearchListHandler.bind(this) : this.onShowSearchHandler.bind(this)}>
                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortKeywordText'} style={[style.t1, { color: searchTextColor }]}>{this._filterSearchIndex === -1 ? this.labels[lang].searchKeyword : (SGHelperType.isDefined(this._filterData[this._filterSearchIndex].value) ? this._filterData[this._filterSearchIndex].value : this.labels[lang].search)}</SGText>
                             </SGTouchableOpacity>
                             <SGIconButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortCloseIconButton'} disabled={this.props.disabled} name={SGIcon.Icon.close} onPress={this.onClearSearchHandler.bind(this)} />
                         </SGView>
                     }
                     {
                         this._filterCount !== 0 &&
                         <SGIconButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortFilterIconButton'} disabled={this.props.disabled} hidden={this._filterCount === 0} name={SGIcon.Icon.filter} style={style.icon1} onPress={this.onShowFilterHandler.bind(this)} />
                     }
                     {
                         this._sortCount !== 0 &&
                         <SGIconButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortSortIconButton'} disabled={this.props.disabled} hidden={this._sortCount === 0} name={SGIcon.Icon.sort} style={style.icon1} onPress={this.onShowSortHandler.bind(this)} />
                     }
                 </SGView>
 
                 {
                     this._filterSearchIndex !== -1 &&
                     <SGPopView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopView1'} shadow animationType={'slide'} popViewID={this.pvID1} vPos='center'>
                         <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopContainerView1'} shadow style={style.pv1} >
                             <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortTopPopView1'} style={style.pv1_v1}>
                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchText1'} style={style.pv1_t1} preset={SGText.preset.titleH2B}>{this.labels[lang].search}</SGText>
                                 <SGButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopClearButton1'} preset={SGButton.preset.noBorder} label={this.labels[lang].clear} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onClearSearchHandlerInside.bind(this)} />
                                 <SGButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopApplyButton1'} preset={SGButton.preset.noBorder} label={this.labels[lang].apply} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onApplySearchHandler.bind(this)} />
                                 <SGIconButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopCloseIconButton1'} style={style.pv1_ib1} name={SGIcon.Icon.close} onPress={this.onCloseSearchHandler.bind(this)} />
                             </SGView>
                             <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchView1'} style={style.pv1_v2}>
                                 <SGIcon accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchIcon1'} name={SGIcon.Icon.search} preset={SGIcon.preset.h3} />
                                 <SGTextInput accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchInput1'} autoFocus disabled={this.props.disabled} textStyle={{ padding: 0, }} placeholder={this.labels[lang].searchKeyword} style={style.pv1_ti1} onChangeText={this.onSearchChangeTextHandler.bind(this)} value={this._filterSearchIndex !== -1 ? this._filterData[this._filterSearchIndex].value : null} />
                             </SGView>
                             <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortRecentSeaerchText1'} preset={SGText.preset.titleH3B}>{this.labels[lang].recentSearches}</SGText>
                             {
                                 this._recentSearchData.map((d) => {
                                     return (
                                         <SGTouchableOpacity key={SGHelperType.getGUID()} onPress={this.onSearchRecentPress.bind(this, d)}>
                                             <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortRecentItemText1'} >{'"'}{d}{'"'}</SGText>
                                         </SGTouchableOpacity>
                                     )
                                 })
                             }
                         </SGView>
                     </SGPopView>
                 }
 
                 {
                     this.props.showSearchList &&
                     <SGPopView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopView2'} shadow animationType={'slide'} popViewID={this.pvID4} vPos='center' onDismiss={this._onDismissPV4Handler.bind(this)}>
                         <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopContainerView2'} shadow style={style.pv1} >
                             <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortTopPopView2'} style={style.pv1_v1}>
                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchText2'} style={style.pv1_t1} preset={SGText.preset.titleH2B}>{this.labels[lang].search}</SGText>
                                 <SGButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopClearButton2'} preset={SGButton.preset.noBorder} label={this.labels[lang].clear} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onClearSearchHandlerListInside.bind(this)} />
                                 <SGButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopApplyButton2'} preset={SGButton.preset.noBorder} label={this.labels[lang].apply} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onApplySearchListHandler.bind(this)} />
                                 <SGIconButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopCloseIconButton2'} style={style.pv1_ib1} name={SGIcon.Icon.close} onPress={this.onCloseSearchListHandler.bind(this)} />
                             </SGView>
                             <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchView2'} style={style.pv1_v2}>
                                 <SGIcon accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchIcon2'} name={SGIcon.Icon.search} />
                                 <SGTextInput accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchInput2'} autoFocus disabled={this.props.disabled} textStyle={{ padding: 0, }} placeholder={this.labels[lang].searchKeyword} style={style.pv1_ti1} onChangeText={this.onSearchChangeTextHandler.bind(this)} value={this._filterSearchIndex !== -1 ? this._filterData[this._filterSearchIndex].value : null} />
                             </SGView>
                             <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortSearchResultText2'} preset={SGText.preset.titleH3B}>{this.labels[lang].searchResult}</SGText>
                             {
                                 <FlatList accessible={true} accessibilityLabel={'SGFormSearchFilterSortSearchResultList2'} data={this._searchListData} renderItem={({ item }) => {
                                     return (
                                         <SGTouchableOpacity key={SGHelperType.getGUID()} style={{ flexDirection: 'row', justifyContent: 'flex-start' }} onPress={() => { this._onClickValue(item); }}>
                                             <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortSearchResultItem1Text2'} >{item[this._arrFieldName[0]]}</SGText>
                                             <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortSearchResultItem2Text2'} >{item[this._arrFieldName[1]]}</SGText>
                                         </SGTouchableOpacity>
                                     );
                                 }} keyExtractor={item => item.fID}>
                                 </FlatList>
                             }
                         </SGView>
                     </SGPopView>
                 }
 
                 {
                     this._filterCount !== 0 &&
                     <SGPopView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopView3'} shadow animationType={'slide'} popViewID={this.pvID2} vPos='center'>
                         <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopContainerView3'} shadow style={style.pv1} >
                             <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortTopPopView3'} style={style.pv1_v1}>
                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchText3'} style={style.pv1_t1} preset={SGText.preset.titleH2B} >{this.labels[lang].filter}</SGText>
                                 <SGButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopClearButton3'} preset={SGButton.preset.noBorder} label={this.labels[lang].clear} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onClearFilterHandler.bind(this)} />
                                 <SGButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopApplyButton3'} preset={SGButton.preset.noBorder} label={this.labels[lang].apply} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onApplyFilterHandler.bind(this)} />
                                 <SGIconButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopCloseIconButton3'} style={style.pv1_ib1} name={SGIcon.Icon.close} onPress={this.onCloseFilterHandler.bind(this)} />
                             </SGView>
                             <SGScrollView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopScrollView3'} style={style.pv1_sv1}>
                                 <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortCPopScrollView3'} style={style.pv1_v2b}>
                                     {
                                         this._filterData.map((d) => {
                                             if (d.type !== 'search' && d.visible) {
                                                 switch (d.type) {
                                                     case 'single':
                                                         return (
                                                             <React.Fragment accessible={true} accessibilityLabel={'SGFormSearchFilterSortSingleReact'} key={d.index}>
                                                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortSingleText'} >{d.title}</SGText>
                                                                 <SGPicker accessible={true} accessibilityLabel={'SGFormSearchFilterSortSinglePicker'} style={style.pv1_f1} single optionList={d.optionList} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                                                             </React.Fragment>
                                                         );
                                                         break;
                                                     case 'multi':
                                                         return (
                                                             <React.Fragment accessible={true} accessibilityLabel={'SGFormSearchFilterSortMultiReact'} key={d.index}>
                                                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortMultiText'} >{d.title}</SGText>
                                                                 <SGPicker accessible={true} accessibilityLabel={'SGFormSearchFilterSortMultiPicker'} style={style.pv1_f1} optionList={d.optionList} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                                                             </React.Fragment>
                                                         );
                                                         break;
                                                     case 'date':
                                                         return (
                                                             <React.Fragment accessible={true} accessibilityLabel={'SGFormSearchFilterSortDateReact'} key={d.index}>
                                                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortDateText'} >{d.title}</SGText>
                                                                 <SGDatePicker accessible={true} accessibilityLabel={'SGFormSearchFilterSortDatePicker'} style={style.pv1_f1} dateRange={d.dateRange} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                                                             </React.Fragment>
                                                         );
                                                         break;
                                                     case 'number':
                                                         return (
                                                             <React.Fragment accessible={true} accessibilityLabel={'SGFormSearchFilterSortNumberReact'} key={d.index}>
                                                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortNumberText'} >{d.title}</SGText>
                                                                 <SGTextInput accessible={true} accessibilityLabel={'SGFormSearchFilterSortNumberInput'} preset={SGTextInput.preset.default} style={style.pv1_f1} dataType={SGTextInput.dataType.number} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                                                             </React.Fragment>
                                                         );
                                                         break;
                                                     case 'decimal':
                                                         return (
                                                             <React.Fragment accessible={true} accessibilityLabel={'SGFormSearchFilterSortDecimalReact'} key={d.index}>
                                                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortDecimalText'} >{d.title}</SGText>
                                                                 <SGTextInput accessible={true} accessibilityLabel={'SGFormSearchFilterSortDecimalInput'} preset={SGTextInput.preset.default} style={style.pv1_f1} dataType={SGTextInput.dataType.decimal} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                                                             </React.Fragment>
                                                         );
                                                         break;
                                                 }
                                             } else {
                                                 return null;
                                             }
                                         })
                                     }
                                 </SGView>
                             </SGScrollView>
                         </SGView>
                     </SGPopView>
                 }
 
                 {
                     this._sortCount !== 0 &&
                     <SGPopView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopView4'} shadow animationType={'slide'} popViewID={this.pvID3} vPos='center'>
                         <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopContainerView4'} shadow style={style.pv1} >
                             <SGView accessible={true} accessibilityLabel={'SGFormSearchFilterSortTopPopView4'} style={style.pv1_v1}>
                                 <SGText accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopSearchText4'} style={style.pv1_t1} preset={SGText.preset.titleH2B} >{this.labels[lang].sort}</SGText>
                                 <SGButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopClearButton4'} preset={SGButton.preset.noBorder} label={this.labels[lang].clear} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onClearSortHandler.bind(this)} />
                                 <SGButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopApplyButton4'} preset={SGButton.preset.noBorder} label={this.labels[lang].apply} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onApplySortHandler.bind(this)} />
                                 <SGIconButton accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopCloseIconButton4'} style={style.pv1_ib1} name={SGIcon.Icon.close} onPress={this.onCloseSortHandler.bind(this)} />
                             </SGView>
                             <SGScrollView accessible={true} accessibilityLabel={'SGFormSearchFilterSortPopScrollView4'} style={style.pv1_sv1}>
                                 <SGCheckBoxList accessible={true} accessibilityLabel={'SGFormSearchFilterSortCheckboxList'} single onValueChange={this.onSortValueChange.bind(this)} optionList={this._displaySortData} value={this._displaySortValue} />
                             </SGScrollView>
                         </SGView>
                     </SGPopView>
                 }
             </SGView>
         );
     }
 }