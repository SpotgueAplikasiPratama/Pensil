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
import { SGView, SGIconButton, SGText, SGTextInput, SGButton, SGTouchableOpacity, SGIcon, SGPopView, SGCheckBoxList, SGPicker, SGDatePicker, SGScrollView } from '../control';
import { SGHelperType, SGHelperStyle, SGHelperNavigation } from '../helper';

export class SGFilterScreen extends SGBaseScreen {
    initCountry() {
        var tempList = [];
        this._countryList = [];
        for (var i = 0; i < this._buildingMatrix.length; i++) {
            var countryKey = this._buildingMatrix[i].country;
            if (tempList.indexOf(countryKey) === -1) {
                tempList.push(countryKey);
                this._countryList.push({ key: countryKey, title: countryKey }); //replace title with translated value
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._countryIndex].value)?this._filterData[this._countryIndex].value:[];
        var arr = [];
        for (var i = 0; i < valueList.length; i++) {
            if (tempList.includes(valueList[i])) {
                arr.push(valueList[i])
            }
        }
        this._filterData[this._countryIndex].value = arr;
    }

    initProvince() {
        if (this._countryIndex !== -1) {
            this._countryFilter = SGHelperType.isDefined(this._filterData[this._countryIndex].value)?this._filterData[this._countryIndex].value:[];
        }
        var tempList = [];
        this._provinceList = [];
        for (var i = 0; i < this._buildingMatrix.length; i++) {
            var provKey = this._buildingMatrix[i].province;
            if (tempList.indexOf(provKey) === -1) {
                if (this._countryFilter.length === 0 || this._countryFilter.includes(this._buildingMatrix[i].country)) {
                    tempList.push(provKey);
                    this._provinceList.push({ key: provKey, title: provKey }); //replace title with translated value
                }
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._provinceIndex].value)?this._filterData[this._provinceIndex].value:[];
        var arr = [];
        for (var i = 0; i < valueList.length; i++) {
            if (tempList.includes(valueList[i])) {
                arr.push(valueList[i])
            }
        }
        this._filterData[this._provinceIndex].value = arr;
    }

    initCity() {
        if (this._countryIndex !== -1) {
            this._countryFilter = SGHelperType.isDefined(this._filterData[this._countryIndex].value)?this._filterData[this._countryIndex].value:[];
        }
        if (this._provinceIndex !== -1) {
            this._provinceFilter = SGHelperType.isDefined(this._filterData[this._provinceIndex].value)?this._filterData[this._provinceIndex].value:[];
        }
        var tempList = [];
        this._cityList = [];
        for (var i = 0; i < this._buildingMatrix.length; i++) {
            var cityKey = this._buildingMatrix[i].city;
            if (tempList.indexOf(cityKey) === -1) {
                if ((this._countryFilter.length === 0 || this._countryFilter.includes(this._buildingMatrix[i].country)) && (this._provinceFilter.length === 0 || this._provinceFilter.includes(this._buildingMatrix[i].province))) {
                    tempList.push(cityKey);
                    this._cityList.push({ key: cityKey, title: cityKey }); //replace title with translated value
                }
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._cityIndex].value)?this._filterData[this._cityIndex].value:[];
        var arr = [];
        for (var i = 0; i < valueList.length; i++) {
            if (tempList.includes(valueList[i])) {
                arr.push(valueList[i])
            }
        }
        this._filterData[this._cityIndex].value = arr;
    }

    initBuildingType() {
        var tempList = [];
        this._buildingTypeList = [];
        for (var i = 0; i < this._buildingMatrix.length; i++) {
            var buildingTypeKey = this._buildingMatrix[i].buildingType;
            if (tempList.indexOf(buildingTypeKey) === -1) {
                tempList.push(buildingTypeKey);
                this._buildingTypeList.push({ key: buildingTypeKey, title: buildingTypeKey }); //replace title with translated value
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._buildingTypeIndex].value)?this._filterData[this._buildingTypeIndex].value:[];
        var arr = [];
        for (var i = 0; i < valueList.length; i++) {
            if (tempList.includes(valueList[i])) {
                arr.push(valueList[i])
            }
        }
        this._filterData[this._buildingTypeIndex].value = arr;
    }

    initBuildingName() {
        if (this._countryIndex !== -1) {
            this._countryFilter = SGHelperType.isDefined(this._filterData[this._countryIndex].value)?this._filterData[this._countryIndex].value:[];
        }
        if (this._provinceIndex !== -1) {
            this._provinceFilter = SGHelperType.isDefined(this._filterData[this._provinceIndex].value)?this._filterData[this._provinceIndex].value:[];
        }
        if (this._cityIndex !== -1) {
            this._cityFilter = SGHelperType.isDefined(this._filterData[this._cityIndex].value)?this._filterData[this._cityIndex].value:[];
        }
        if (this._buildingTypeIndex !== -1) {
            this._buildingTypeFilter = SGHelperType.isDefined(this._filterData[this._buildingTypeIndex].value)?this._filterData[this._buildingTypeIndex].value:[];
        }
        var tempList = [];
        this._buildingNameList = [];
        for (var i = 0; i < this._buildingMatrix.length; i++) {
            var buildingNameKey = this._buildingMatrix[i].buildingName;
            if (tempList.indexOf(buildingNameKey) === -1) {
                if ((this._countryFilter.length === 0 || this._countryFilter.includes(this._buildingMatrix[i].country)) && (this._provinceFilter.length === 0 || this._provinceFilter.includes(this._buildingMatrix[i].province)) && (this._cityFilter.length === 0 || this._cityFilter.includes(this._buildingMatrix[i].city)) && (this._buildingTypeFilter.length === 0 || this._buildingTypeFilter.includes(this._buildingMatrix[i].buildingType))) {
                    tempList.push(buildingNameKey);
                    this._buildingNameList.push({ key: buildingNameKey, title: buildingNameKey }); //replace title with translated value
                }
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._buildingNameIndex].value)?this._filterData[this._buildingNameIndex].value:[];
        var arr = [];
        for (var i = 0; i < valueList.length; i++) {
            if (tempList.includes(valueList[i])) {
                arr.push(valueList[i])
            }
        }
        this._filterData[this._buildingNameIndex].value = arr;
    }

    getFilterIndex(type) {
        for (var i = 0; i < this._filterData.length; i++) {
            if (this._filterData[i].type === type) return i;
        }
        return -1;
    }
    labels = {
        EN: {
            filter: 'Filter',
            clear: 'Clear',
            apply: 'Apply'
        },
        ID: {
            filter: 'Saring',
            clear: 'Hapus',
            apply: 'Terapkan'
        },
        CN: {
            filter: '过滤',
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
                pv1: { flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', borderWidth: 1, borderColor: SGHelperStyle.color.borderColor, padding: p, backgroundColor: 'white', },
                pv1_v1: { width: '100%', borderBottomWidth: 1, borderBottomColor: SGHelperStyle.color.borderColor, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' },
                pv1_v2: { marginTop: 2 * p, alignSelf: 'stretch', backgroundColor: 'white', borderRadius: p, padding: p, flexDirection: 'row', justifyContent: 'space-between' },
                pv1_v2b: { alignSelf: 'stretch', marginHorizontal: p, padding: p, justifyContent: 'flex-start', alignItems: 'flex-start' },
                pv1_sv1: { marginTop: 2 * p, },
                pv1_v3: { width: w - 6 * p, marginBottom: 3 * p, paddingHorizontal: 2 * p, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', borderRadius: p, borderWidth: 1, borderColor: SGHelperStyle.color.borderColor },
                pv1_v4: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                pv1_t1: { flex: 1 },
                pv1_ib1: { backgroundColor: 'red', color: 'white', borderRadius: p, marginHorizontal: p },
                pv1_b1: { padding: 0 },
                pv1_ti1: { flex: 1 },
                pv1_fg1: { marginBottom: 2 * p, backgroundColor: 'white', width: w - 10 * p, borderRadius: p, marginHorizontal: 0 },
                pv1_f1: { marginBottom: 3 * p, backgroundColor: 'white', width: w - 6 * p, borderRadius: p, marginHorizontal: 0 },
                pv1_t2: { flex: 1, marginVertical: 2 * p },
                icon1: { marginVertical: 0, paddingVertical: 0 },
            });
        }
    }

    initFilterData() {
        this._originalFilterData = JSON.stringify(this.props.route.params.filterData);
        this._filterData = SGHelperType.isDefined(this.props.route.params.filterData) ? SGHelperType.copyJSON(this.props.route.params.filterData) : [];
        this._groupedFilterData = [];
        this._groupName = [];
        this._groupHidden = [];
        this._filterCount = 0;
        var arr1 = [];
        var arr2 = [];
        for (var i = 0; i < this._filterData.length; i++) {
            this._filterData[i].index = i;
            if (this._filterData[i].type !== 'search' && this._filterData[i].visible) {
                this._filterCount++;
            }
            var group = this._filterData[i].group;
            if (SGHelperType.isDefined(group)) {
                var index = this._groupName.indexOf(group);
                if (index === -1) {
                    this._groupName.push(group);
                    arr1.push([this._filterData[i]])
                } else {
                    arr1[index].push(this._filterData[i]);
                }
            } else {
                arr2.push(this._filterData[i]);
            }
        }
        for (var i = 0; i < arr1.length; i++) {
            this._groupHidden[i] = true;
            this._groupedFilterData.push(arr1[i]);
        }
        for (var i = 0; i < arr2.length; i++) {
            this._groupedFilterData.push(arr2[i]);
        }
        this._buildingMatrix = this.props.route.params.buildingMatrix;
        this._countryFilter = [];
        this._provinceFilter = [];
        this._cityFilter = [];
        this._buildingTypeFilter = [];
        this._countryIndex = this.getFilterIndex('country');
        this._provinceIndex = this.getFilterIndex('province');
        this._cityIndex = this.getFilterIndex('city');
        this._buildingTypeIndex = this.getFilterIndex('buildingType');
        this._buildingNameIndex = this.getFilterIndex('buildingName');
        if (this._countryIndex !== -1) { this.initCountry(); }
        if (this._provinceIndex !== -1) { this.initProvince(); }
        if (this._cityIndex !== -1) { this.initCity(); }
        if (this._buildingTypeIndex !== -1) { this.initBuildingType(); }
        if (this._buildingNameIndex !== -1) { this.initBuildingName(); }
    }

    initData() {
        if (!this._isDataInit || this._originalFilterData !== JSON.stringify(this.props.route.params.filterData)) {
            this.initFilterData();
            if (!this._isDataInit) {
                this.state = { filterData: this._filterData };
            } else {
                this.setState({ filterData: this._filterData });
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

    onFilterValueChange(d, v) {
        this._filterData[d.index].value = v;
        this.setState({ filterData: this._filterData })
    }

    onClearFilterHandler() {
        for (var i = 0; i < this._filterData.length; i++) {
            if (this._filterData[i].type !== 'search' && this._filterData[i].visible) {
                this._filterData[i].value = null;
            }
        }
        this.setState({ filterData: this._filterData })
    }

    onApplyFilterHandler() {
        for (var i = 0; i < this._filterData.length; i++) {
            if (this.props.route.params.filterData[i].visible) {
                this.props.route.params.filterData[i].value = this._filterData[i].value;
            }
        }
        if (this.props.route.params.onApplyFilter) {
            this.props.route.params.onApplyFilter(this.props.route.params.filterData)
        }
        SGHelperNavigation.goBack(this.props.navigation);
    }

    onCloseFilterHandler() {
        if (this.props.route.params.onCloseFilter) {
            this.props.route.params.onCloseFilter(this.props.route.params.filterData)
        }
        SGHelperNavigation.goBack(this.props.navigation);
    }

    onToggleHandler(index) {
        this._groupHidden[index] = !this._groupHidden[index];
        this.setState({ filterData: this._filterData })
    }

    onCountryChange(d, v) {
        this._filterData[d.index].value = v;
        if (this._provinceIndex !== -1) { this.initProvince(); }
        if (this._cityIndex !== -1) { this.initCity(); }
        if (this._buildingNameIndex !== -1) { this.initBuildingName(); }
        this.setState({ filterData: this._filterData })
    }

    onProvinceChange(d, v) {
        this._filterData[d.index].value = v;
        if (this._cityIndex !== -1) { this.initCity(); }
        if (this._buildingNameIndex !== -1) { this.initBuildingName(); }
        this.setState({ filterData: this._filterData })
    }

    onCityChange(d, v) {
        this._filterData[d.index].value = v;
        if (this._buildingNameIndex !== -1) { this.initBuildingName(); }
        this.setState({ filterData: this._filterData })
    }

    onBuildingTypeChange(d, v) {
        this._filterData[d.index].value = v;
        if (this._buildingNameIndex !== -1) { this.initBuildingName(); }
        this.setState({ filterData: this._filterData })
    }

    renderComponent(d, style) {
        switch (d.type) {
            case 'single':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGPicker style={style} single optionList={d.optionList} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'multi':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGPicker filterMode style={style} optionList={d.optionList} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'country':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGPicker filterMode style={style} optionList={this._countryList} value={d.value} onValueChange={this.onCountryChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'province':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGPicker filterMode style={style} optionList={this._provinceList} value={d.value} onValueChange={this.onProvinceChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'city':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGPicker filterMode style={style} optionList={this._cityList} value={d.value} onValueChange={this.onCityChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'buildingType':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGPicker filterMode style={style} optionList={this._buildingTypeList} value={d.value} onValueChange={this.onBuildingTypeChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'buildingName':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGPicker filterMode style={style} optionList={this._buildingNameList} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'date':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGDatePicker style={style} dateRange={d.dateRange} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'number':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGTextInput preset={SGTextInput.preset.default} style={style} dataType={SGTextInput.dataType.number} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'decimal':
                return (
                    <React.Fragment key={d.index}>
                        <SGText >{d.title}</SGText>
                        <SGTextInput preset={SGTextInput.preset.default} style={style} dataType={SGTextInput.dataType.decimal} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
        }
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
                    <SGText style={style.pv1_t1} preset={SGText.preset.h5B} >{this.labels[lang].filter}</SGText>
                    <SGButton preset={SGButton.preset.noBorder} label={this.labels[lang].clear} style={style.pv1_b1} textPreset={SGText.preset.h6} onPress={this.onClearFilterHandler.bind(this)} />
                    <SGButton preset={SGButton.preset.noBorder} label={this.labels[lang].apply} style={style.pv1_b1} textPreset={SGText.preset.h6} onPress={this.onApplyFilterHandler.bind(this)} />
                    <SGIconButton style={style.pv1_ib1} name={SGIcon.Icon.close} onPress={this.onCloseFilterHandler.bind(this)} />
                </SGView>
                <SGScrollView style={style.pv1_sv1}>
                    <SGView style={style.pv1_v2b}>
                        {
                            this._groupedFilterData.map((d, index) => {
                                if (Array.isArray(d)) {
                                    return (
                                        <SGView key={d.index} style={style.pv1_v3}>
                                            <SGTouchableOpacity style={style.pv1_v4} onPress={this.onToggleHandler.bind(this, index)}>
                                                <SGText style={style.pv1_t2} preset={SGText.preset.h5}>{d[0].group}</SGText>
                                                <SGIcon name={this._groupHidden[index] ? SGIcon.Icon.arrowDown : SGIcon.Icon.arrowUp} style={style.icon1} />
                                            </SGTouchableOpacity>
                                            {
                                                (this._groupHidden[index]) ? null : d.map((x) => {
                                                    return this.renderComponent(x, style.pv1_fg1);
                                                })
                                            }
                                        </SGView>
                                    );
                                } else {
                                    if (d.type !== 'search' && d.visible) {
                                        return this.renderComponent(d, style.pv1_f1);
                                    } else {
                                        return null;
                                    }
                                }
                            })
                        }
                    </SGView>
                </SGScrollView>
            </SGView>
        );
    }
}