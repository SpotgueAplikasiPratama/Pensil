import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGCheckBoxList, SGPopView as PopView } from '../../core/control';
import { SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';

export class SortPopUp extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = this._screenWHP;
        return StyleSheet.create({
            // mainContainer: {width: w, height: w * 1.115, backgroundColor: '#262626', justifyContent: 'flex-start', alignItems: 'flex-start', paddingVertical: p * 3, paddingHorizontal: p * 4, borderRadius: 0, borderTopLeftRadius: p * 5, borderTopRightRadius: p * 5},
            mainContainer: { width: w, height: w * 1.115, backgroundColor: '#262626', justifyContent: 'flex-start', alignItems: 'flex-start', paddingVertical: p * 3, paddingHorizontal: p * 4, borderRadius: 0, borderTopLeftRadius: p * 5, borderTopRightRadius: p * 5 },
            topContainer: { alignSelf: 'center', marginBottom: p * 3.5 },
            borderLine: { borderWidth: p * 0.45, width: w * 0.135, borderRadius: p, borderColor: '#FFFFFF', backgroundColor: '#FFFFFF', alignSelf: 'flex-end' },
            bottomContainer: { width: w - p * 8, justifyContent: 'flex-start', alignItems: 'flex-start' },
            firstLine: { width: w - p * 8, flexDirection: 'row', justifyContent: 'space-between' },
            actionContainer: { flexDirection: 'row' },
            text: { color: '#FFFFFF' },
            actionText: { marginHorizontal: p * 3, color: '#FFFFFF' },
            checkBoxContainer: { marginVertical: p * 3 },
            blankContainer: { height: w * 0.3 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this._isStyleInit = false;
        this._isDataInit = false;
        this.initData();
    }

    initSortData() {
        this._originalSortData = JSON.stringify(this.props.sortOptions);
        this._sortData = SGHelperType.isDefined(this.props.sortOptions) ? SGHelperType.copyJSON(this.props.sortOptions) : [];
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
        if (!this._isDataInit || this._originalSortData !== JSON.stringify(this.props.sortOptions)) {
            this.initSortData();
            if (!this._isDataInit) {
                this.state = { sortData: this._sortData };
            } else {
                this.setState({ sortData: this._sortData });
            }
            this._isDataInit = true;
        }
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
            if (this.props.sortOptions[i].visible) {
                this.props.sortOptions[i].selected = this._sortData[i].selected;
            }
        }
        if (this.props.onApplySort) {
            this.props.onApplySort(this.props.sortOptions);
        }
        if (this.props.forceUpdate) {
            this.props.forceUpdate();
        }
        PopView.hidePopView(this.props.popViewID);
    }

    render() {
        this.initData();
        var style = this.style;
        console.log(this.props.sortOptions);
        return (
            <View accessible={true} style={style.mainContainer}>
                <View style={style.topContainer}>
                    <View style={style.borderLine}></View>
                </View>
                <View style={style.bottomContainer}>
                    <View style={style.firstLine}>
                        <Text preset={Text.preset.titleH2B} style={style.text}>{SGLocalize.translate("SortScreen.screenTitle")}</Text>
                        <View style={style.actionContainer}>
                            <TouchableOpacity onPress={this.onClearSortHandler.bind(this)}>
                                <Text accessibilityLabel={'SortScreenClearButton'} preset={Text.preset.titleH2} style={style.actionText}>{SGLocalize.translate("SortScreen.clearText")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.onApplySortHandler.bind(this)}>
                                <Text accessibilityLabel={'SortScreenApplyButton'} preset={Text.preset.titleH2} style={style.actionText}>{SGLocalize.translate("SortScreen.applyText")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <SGCheckBoxList darkMode={true} single optionList={this._displaySortData} value={this._displaySortValue} onValueChange={this.onSortValueChange.bind(this)} style={style.checkBoxContainer} />
                </View>
                {/* <View style={style.blankContainer}></View> */}
            </View>
        );
    }
}