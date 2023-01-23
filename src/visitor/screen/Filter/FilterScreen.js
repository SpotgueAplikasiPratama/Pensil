import React from 'react';
import { StyleSheet, TextInput, KeyboardAvoidingView, Animated } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView, SGIconButton, SGText, SGTextInput, SGButton, SGTouchableOpacity, SGIcon, SGPopView, SGCheckBoxList, SGPicker, SGDatePicker, SGScrollView, SGRootView } from '../../../core/control';
import { SGHelperType, SGHelperStyle, SGHelperNavigation, SGHelperWindow, SGHelperGlobalVar } from '../../../core/helper';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class FilterScreen extends SGBaseScreen {
    initCountry() {
        var tempList = [];
        this._countryList = [];
        for (var i = 0; i < this._buildingMatrix.length; i++) {
            var countryKey = this._buildingMatrix[i].country;
            if (tempList.indexOf(countryKey) === -1) {
                tempList.push(countryKey);
                this._countryList.push({ key: countryKey, title: this._buildingMatrix[i].countryTitle }); //replace title with translated value
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._countryIndex].value) ? this._filterData[this._countryIndex].value : [];
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
            this._countryFilter = SGHelperType.isDefined(this._filterData[this._countryIndex].value) ? this._filterData[this._countryIndex].value : [];
        }
        var tempList = [];
        this._provinceList = [];
        for (var i = 0; i < this._buildingMatrix.length; i++) {
            var provKey = this._buildingMatrix[i].province;
            if (tempList.indexOf(provKey) === -1) {
                if (this._countryFilter.length === 0 || this._countryFilter.includes(this._buildingMatrix[i].country)) {
                    tempList.push(provKey);
                    this._provinceList.push({ key: provKey, title: this._buildingMatrix[i].provinceTitle }); //replace title with translated value
                }
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._provinceIndex].value) ? this._filterData[this._provinceIndex].value : [];
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
            this._countryFilter = SGHelperType.isDefined(this._filterData[this._countryIndex].value) ? this._filterData[this._countryIndex].value : [];
        }
        if (this._provinceIndex !== -1) {
            this._provinceFilter = SGHelperType.isDefined(this._filterData[this._provinceIndex].value) ? this._filterData[this._provinceIndex].value : [];
        }
        var tempList = [];
        this._cityList = [];
        for (var i = 0; i < this._buildingMatrix.length; i++) {
            var cityKey = this._buildingMatrix[i].city;
            if (tempList.indexOf(cityKey) === -1) {
                if ((this._countryFilter.length === 0 || this._countryFilter.includes(this._buildingMatrix[i].country)) && (this._provinceFilter.length === 0 || this._provinceFilter.includes(this._buildingMatrix[i].province))) {
                    tempList.push(cityKey);
                    this._cityList.push({ key: cityKey, title: this._buildingMatrix[i].cityTitle }); //replace title with translated value
                }
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._cityIndex].value) ? this._filterData[this._cityIndex].value : [];
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
                this._buildingTypeList.push({ key: buildingTypeKey, title: this._buildingMatrix[i].buildingTypeTitle }); //replace title with translated value
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._buildingTypeIndex].value) ? this._filterData[this._buildingTypeIndex].value : [];
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
            this._countryFilter = SGHelperType.isDefined(this._filterData[this._countryIndex].value) ? this._filterData[this._countryIndex].value : [];
        }
        if (this._provinceIndex !== -1) {
            this._provinceFilter = SGHelperType.isDefined(this._filterData[this._provinceIndex].value) ? this._filterData[this._provinceIndex].value : [];
        }
        if (this._cityIndex !== -1) {
            this._cityFilter = SGHelperType.isDefined(this._filterData[this._cityIndex].value) ? this._filterData[this._cityIndex].value : [];
        }
        if (this._buildingTypeIndex !== -1) {
            this._buildingTypeFilter = SGHelperType.isDefined(this._filterData[this._buildingTypeIndex].value) ? this._filterData[this._buildingTypeIndex].value : [];
        }
        var tempList = [];
        this._buildingNameList = [];
        for (var i = 0; i < this._buildingMatrix.length; i++) {
            var buildingNameKey = this._buildingMatrix[i].buildingName;
            if (tempList.indexOf(buildingNameKey) === -1) {
                if ((this._countryFilter.length === 0 || this._countryFilter.includes(this._buildingMatrix[i].country)) && (this._provinceFilter.length === 0 || this._provinceFilter.includes(this._buildingMatrix[i].province)) && (this._cityFilter.length === 0 || this._cityFilter.includes(this._buildingMatrix[i].city)) && (this._buildingTypeFilter.length === 0 || this._buildingTypeFilter.includes(this._buildingMatrix[i].buildingType))) {
                    tempList.push(buildingNameKey);
                    this._buildingNameList.push({ key: buildingNameKey, title: this._buildingMatrix[i].buildingNameTitle }); //replace title with translated value
                }
            }
        }
        //ensure value consist of valid selection
        var valueList = SGHelperType.isDefined(this._filterData[this._buildingNameIndex].value) ? this._filterData[this._buildingNameIndex].value : [];
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
                pv1: { width: w, height: h, backgroundColor: 'white' },
                pv1_v1: {width: '100%', borderBottomWidth: 1, borderBottomColor: SGHelperStyle.color.borderColor, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', marginVertical: 2 * p, paddingHorizontal: 2 * p },
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
        console.log(this._buildingMatrix);
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
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this._isStyleInit = false;
        this._isDataInit = false;
        this.initStyleSheet();
        this.initData();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
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
        console.log('onApplyFilterHandler')
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
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenSingleRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenSingleText'}>{d.title}</SGText>
                        <SGPicker accessible={true} accessibilityLabel={'FilterScreenSinglePicker'} language={(this.Language).toUpperCase()} style={style} single optionList={d.optionList} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'multi':
                return (
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenMultiRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenMultiText'}>{d.title}</SGText>
                        <SGPicker accessible={true} accessibilityLabel={'FilterScreenMultiPicker'} language={(this.Language).toUpperCase()} filterMode style={style} optionList={d.optionList} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'country':
                return (
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenCountryRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenCountryText'}>{d.title}</SGText>
                        <SGPicker accessible={true} accessibilityLabel={'FilterScreenCountryPicker'} language={(this.Language).toUpperCase()} filterMode style={style} optionList={this._countryList} value={d.value} onValueChange={this.onCountryChange.bind(this, d)} />
                    </React.Fragment> 
                );
            case 'province':
                return (
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenProvinceRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenProvinceText'}>{d.title}</SGText>
                        <SGPicker accessible={true} accessibilityLabel={'FilterScreenProvincePicker'} language={(this.Language).toUpperCase()} filterMode style={style} optionList={this._provinceList} value={d.value} onValueChange={this.onProvinceChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'city':
                return (
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenCityRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenCityText'}>{d.title}</SGText>
                        <SGPicker accessible={true} accessibilityLabel={'FilterScreenCityPicker'} language={(this.Language).toUpperCase()} filterMode style={style} optionList={this._cityList} value={d.value} onValueChange={this.onCityChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'buildingType':
                return (
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenBuildingTypeRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenBuildingTypeText'}>{d.title}</SGText>
                        <SGPicker accessible={true} accessibilityLabel={'FilterScreenBuildingTypePicker'} language={(this.Language).toUpperCase()} filterMode style={style} optionList={this._buildingTypeList} value={d.value} onValueChange={this.onBuildingTypeChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'buildingName':
                return (
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenBuildingNameRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenBuildingNameText'}>{d.title}</SGText>
                        <SGPicker accessible={true} accessibilityLabel={'FilterScreenBuildingNamePicker'} language={(this.Language).toUpperCase()} filterMode style={style} optionList={this._buildingNameList} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'date':
                return (
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenDateRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenDateText'}>{d.title}</SGText>
                        <SGDatePicker accessible={true} accessibilityLabel={'FilterScreenDateDatePicker'} language={(this.Language).toUpperCase()} style={style} dateRange={d.dateRange} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'number':
                return (
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenNumberRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenNumberText'}>{d.title}</SGText>
                        <SGTextInput accessible={true} accessibilityLabel={'FilterScreenNumberTextInput'} preset={SGTextInput.preset.default} style={style} dataType={SGTextInput.dataType.number} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
            case 'decimal':
                return (
                    <React.Fragment accessible={true} accessibilityLabel={'FilterScreenDecimalRoot'} key={d.index}>
                        <SGText accessible={true} accessibilityLabel={'FilterScreenDecimalText'}>{d.title}</SGText>
                        <SGTextInput accessible={true} accessibilityLabel={'FilterScreenDecimalTextInput'} preset={SGTextInput.preset.default} style={style} dataType={SGTextInput.dataType.decimal} value={d.value} onValueChange={this.onFilterValueChange.bind(this, d)} />
                    </React.Fragment>
                );
        }
    }

    render() {
        var isDef = SGHelperType.isDefined;
        this.initData();
        this.initStyleSheet();
        var style = this._style;
        var lang = this.Language ? (this.Language).toUpperCase() : 'ID';

        return (
            <SGRootView accessible={true} dummyStatusBar dummyHeaderBar accessibilityLabel={'FilterScreenRootView'} shadow style={style.pv1}>
                <SGView accessible={true} accessibilityLabel={'FilterScreenContainerView1'} style={style.pv1_v1}>
                    <SGText accessible={true} accessibilityLabel={'FilterScreenLabel'} style={style.pv1_t1} preset={SGText.preset.titleH2B} >{this.labels[lang].filter}</SGText>
                    <SGButton accessible={true} accessibilityLabel={'FilterScreenClearButton'} preset={SGButton.preset.noBorder} label={this.labels[lang].clear} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onClearFilterHandler.bind(this)} />
                    <SGButton accessible={true} accessibilityLabel={'FilterScreenApplyButton'} preset={SGButton.preset.noBorder} label={this.labels[lang].apply} style={style.pv1_b1} textPreset={SGText.preset.titleH3} onPress={this.onApplyFilterHandler.bind(this)} />
                    <SGIconButton accessible={true} accessibilityLabel={'FilterScreenIconButtonClose'} style={style.pv1_ib1} name={SGIcon.Icon.close} onPress={this.onCloseFilterHandler.bind(this)} />
                </SGView>
                <SGScrollView accessible={true} accessibilityLabel={'FilterScreenScrollView'} style={style.pv1_sv1}>
                    <SGView accessible={true} accessibilityLabel={'FilterScreenContainerView2'} style={style.pv1_v2b}>
                        {
                            this._groupedFilterData.map((d, index) => {
                                if (Array.isArray(d)) {
                                    return (
                                        <SGView accessible={true} accessibilityLabel={'FilterScreenContainerView2_1'} key={d.index} style={style.pv1_v3}>
                                            <SGTouchableOpacity style={style.pv1_v4} onPress={this.onToggleHandler.bind(this, index)}>
                                                <SGText accessible={true} accessibilityLabel={'FilterScreenTextGroup'} style={style.pv1_t2} preset={SGText.preset.titleH2}>{d[0].group}</SGText>
                                                <SGIcon accessible={true} accessibilityLabel={'FilterScreenIconArrowDown'} name={this._groupHidden[index] ? SGIcon.Icon.arrowDown : SGIcon.Icon.arrowUp} style={style.icon1} />
                                            </SGTouchableOpacity>
                                            {
                                                (this._groupHidden[index]) ? null : d.map((x) => {
                                                    return this.renderComponent(x, style.pv1_fg1);
                                                })
                                            }
                                        </SGView>
                                    );
                                } else {
                                    if (d.type !== 'search' && d.visible === true) {
                                        return this.renderComponent(d, style.pv1_f1);
                                    } else {
                                        return null;
                                    }
                                }
                            })
                        }
                    </SGView>
                </SGScrollView>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                </Animated.View>
            </SGRootView>
        );
    }
}

