import React from 'react';
import { StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView,SGRootView, SGIconButton, SGText, SGTextInput, SGButton, SGTouchableOpacity, SGIcon, SGPopView, SGCheckBoxList, SGPicker, SGDatePicker, SGScrollView } from '../../../core/control';
import { SGHelperType, SGHelperStyle, SGHelperNavigation } from '../../../core/helper';

export class SortScreen extends SGBaseScreen {
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
                pv1: { flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: SGHelperStyle.color.popUpBackgroundColor, borderColor: SGHelperStyle.color.borderColor, padding: p, backgroundColor: 'white', },
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
        var lang = (this.Language).toUpperCase();
        return (
            <SGRootView accessible={true} accessibilityLabel={'SortScreenRootView'} shadow style={style.pv1} >
                <SGView accessible={true} accessibilityLabel={'SortScreenContainerView'} style={style.pv1_v1}>
                    <SGText accessible={true} accessibilityLabel={'SortScreenText'} style={style.pv1_t1} preset={SGText.preset.h5B} >{this.labels[lang].sort}</SGText>
                    <SGButton accessible={true} accessibilityLabel={'SortScreenClearButton'} preset={SGButton.preset.noBorder} label={this.labels[lang].clear} style={style.pv1_b1} textPreset={SGText.preset.h6} onPress={this.onClearSortHandler.bind(this)} />
                    <SGButton accessible={true} accessibilityLabel={'SortScreenApplyButton'} preset={SGButton.preset.noBorder} label={this.labels[lang].apply} style={style.pv1_b1} textPreset={SGText.preset.h6} onPress={this.onApplySortHandler.bind(this)} />
                    <SGIconButton accessible={true} accessibilityLabel={'SortScreenCloseIconButton'} style={style.pv1_ib1} name={SGIcon.Icon.close} onPress={this.onCloseSortHandler.bind(this)} />
                </SGView>
                <SGScrollView accessible={true} accessibilityLabel={'SortScreenScrollView'} style={style.pv1_sv1}>
                    <SGCheckBoxList accessible={true} accessibilityLabel={'SortScreenCheckBoxList'} single onValueChange={this.onSortValueChange.bind(this)} optionList={this._displaySortData} value={this._displaySortValue} />
                </SGScrollView>
            </SGRootView>
        );
    }
}

