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
import { StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { SGBaseScreen } from './SGBaseScreen';
import { SGView, SGIconButton, SGText, SGTextInput, SGButton, SGTouchableOpacity, SGIcon, SGPopView, SGCheckBoxList, SGPicker, SGDatePicker, SGScrollView } from '../../core/control';
import { SGHelperType, SGHelperStyle, SGHelperNavigation } from '../helper';

export class SGSortScreen extends SGBaseScreen {
    labels = {
        EN: {
            sort: 'Sort',
            clear: 'Clear',
            apply: 'Apply'
        },
        ID: {
            sort: 'Urutkan',
            clear: 'Hapus',
            apply: 'Terapkan'
        },
        CN: {
            sort: '分类',
            clear: '肃清',
            apply: '应用'
        }
    }

    initStyleSheet() {
        if (!this._isStyleInit || this._strStyle !== JSON.stringify(this.props.style)) {
            this._isStyleInit = true;
            this._strStyle = JSON.stringify(this.props.style);
            var { w, h, p } = this._screenWHPNoHeader;
            this._style = StyleSheet.create({
                pv1: { flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: SGHelperStyle.color.popUpBackgroundColor, borderColor: SGHelperStyle.color.borderColor, padding: p, backgroundColor: 'white',},
                pv1_v1: { width: '100%', borderBottomWidth: 1, borderBottomColor: SGHelperStyle.color.borderColor, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' },
                pv1_v2: { marginTop: 2 * p, alignSelf: 'stretch', backgroundColor: 'white', borderRadius: p, padding: p, flexDirection: 'row', justifyContent: 'space-between' },
                pv1_v2b: { alignSelf: 'stretch', marginHorizontal: p, padding: p, justifyContent: 'flex-start', alignItems: 'flex-start' },
                pv1_sv1: { marginTop: 2 * p, },
                pv1_t1: { flex: 1 },
                pv1_ib1: { backgroundColor: 'red', color: 'white', borderRadius: p, marginHorizontal: p },
                pv1_b1: { padding: 0 },
                pv1_ti1: { flex: 1 },
                pv1_f1: { marginBottom: 3 * p, width: '95%', backgroundColor: 'white', borderRadius: p, marginHorizontal: 0 }
            });
        }
    }

    initSortData() {
        this._originalSortData = JSON.stringify(this.props.route.params.sortData);
        this._sortData = SGHelperType.isDefined(this.props.route.params.sortData) ? SGHelperType.copyJSON(this.props.route.params.sortData) : [];
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


    initData() {
        if (!this._isDataInit || this._originalSortData !== JSON.stringify(this.props.route.params.sortData)) {
            this.initSortData();
            if (!this._isDataInit) {
                this.state = { sortData: this._sortData };
            } else {
                this.setState({ sortData: this._sortData });
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
        this.setState({ sortData: this._sortData })
    }
    onClearSortHandler() {
        for (var i = 0; i < this._sortData.length; i++) {
            if (this._sortData[i].visible) {
                this._sortData[i].selected = false;
            }
        }
        this._displaySortValue = [];
        this.setState({ sortData: this._sortData })
    }
    onApplySortHandler() {
        for (var i = 0; i < this._sortData.length; i++) {
            if (this.props.route.params.sortData[i].visible) {
                this.props.route.params.sortData[i].selected = this._sortData[i].selected;
            }
        }
        if (this.props.route.params.onApplySort) {
            this.props.route.params.onApplySort(this.props.route.params.sortData);
        }
        SGHelperNavigation.goBack(this.props.navigation);
    }
    onCloseSortHandler() {
        if (this.props.route.params.onCloseSort) {
            this.props.route.params.onCloseSort(this.props.route.params.sortData)
        }
        SGHelperNavigation.goBack(this.props.navigation);
    }

    render() {
        var isDef = SGHelperType.isDefined;
        this.initData();
        this.initStyleSheet();
        var style = this._style;
        var lang = this.props.language ? this.props.language : 'ID';
        return (
            <SGView shadow style={style.pv1} >
                <SGView style={style.pv1_v1}>
                    <SGText style={style.pv1_t1} preset={SGText.preset.h5B} >{this.labels[lang].sort}</SGText>
                    <SGButton preset={SGButton.preset.noBorder} label={this.labels[lang].clear} style={style.pv1_b1} textPreset={SGText.preset.h6} onPress={this.onClearSortHandler.bind(this)} />
                    <SGButton preset={SGButton.preset.noBorder} label={this.labels[lang].apply} style={style.pv1_b1} textPreset={SGText.preset.h6} onPress={this.onApplySortHandler.bind(this)} />
                    <SGIconButton style={style.pv1_ib1} name={SGIcon.Icon.close} onPress={this.onCloseSortHandler.bind(this)} />
                </SGView>
                <SGScrollView style={style.pv1_sv1}>
                    <SGCheckBoxList single onValueChange={this.onSortValueChange.bind(this)} optionList={this._displaySortData} value={this._displaySortValue} />
                </SGScrollView>
            </SGView>
        );
    }
}