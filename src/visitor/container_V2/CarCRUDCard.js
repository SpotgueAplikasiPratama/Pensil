import React from "react";
import { StyleSheet } from "react-native";
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGBaseContainer } from "../../core/container/SGBaseContainer";
import { SGText as Text, SGView as View, SGTouchableOpacity as TouchableOpacity, SGTextInput as TextInput, SGScrollView as ScrollView, SGImage as Image, SGSwitch as Switch, SGDialogBox as DialogBox } from "../../core/control";
import { SGBaseModel } from "../../core/model/SGBaseModel";
import { SGHelperType } from '../../core/helper/SGHelperType';
import { SGIcon } from '../../core/control/SGIcon';
import { DateTag } from "../component_V2/DateTag";
import { SGLocalize } from '../locales/SGLocalize';

export class CustomizationData extends SGBaseModel {
    static getBlankJSON() {
        return { carNumber: '' };
    }
    constructor(ori, cur, changeList) {
        super(CustomizationData, ori ? ori : CustomizationData.getBlankJSON(), cur, changeList);
    }
    set carNumber(val) { this._setValue('carNumber', val); }
    get carNumber() { return this._getValue('carNumber'); }
}

export class CustomizationCarCRUDCard extends SGBaseForm {
    createStyleSheet(propStyle) {
        if (this._strStyle !== JSON.stringify(propStyle)) {
            this._strStyle = JSON.stringify(propStyle);
            this._whp = { w: propStyle.width, h: propStyle.height, p: propStyle.padding }
            var { w, h, p } = this._whp;
            this._style = StyleSheet.create({
                v1: { width: (w - 12 * p),  borderRadius: p, borderColor: 'rgb(150,150,150)', borderWidth: 1,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' ,marginVertical:2*p},
                v2: { width: (w - 12 * p) * 0.92, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                v3: { width: ((w - 12 * p)) * 0.5,height:w*0.1, paddingHorizontal: p, padding: 0, justifyContent: 'center', alignItems: 'flex-start' },
                v4: { width: ((w - 12 * p)) * 0.1,height:w*0.1, alignItems: 'flex-start',justifyContent:'center' },
                t1: { fontSize: (w - 2 * p) * 0.035, fontWeight: 'bold' },
                t2: { fontSize: (w - 2 * p) * 0.035, },
                img1: { width: (w - 2 * p) * 0.2, },
                icon: { marginLeft: - 0.10 * p }
            });
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.createStyleSheet(this.props.style);
        this._dataModel = this.props.data
        this.initData(this._dataModel);

    }
    render() {

        this.createStyleSheet(this.props.style);
        var { w, h, p } = this._whp;
        var style = this._style;
        this._dataModel = this.props.data
        this.initData(this._dataModel);

        return (
            <View accessible={true} accessibilityLabel={'CustomizationCarCRUDCardRootView'} style={{ ...style.v1, opacity: 0.5 }}>
                <TouchableOpacity>
                    <View accessible={true} accessibilityLabel={'CustomizationCarCRUDCardTopView'} style={style.v2}>
                        <View accessible={true} accessibilityLabel={'CustomizationCarCRUDCardTextView'} style={style.v3}>
                            <Text accessible={true} accessibilityLabel={'CustomizationCarCRUDCardNumbText'} preset={Text.preset.titleH3B}>{this.getData('carNumber')}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View accessible={true} accessibilityLabel={'CustomizationCarCRUDCardIconView'} style={style.v4}>
                    <SGIcon accessible={true} accessibilityLabel={'CustomizationCarCRUDCardDeleteIcon'} name={SGIcon.Icon.delete} style={style.icon} preset={SGIcon.preset.h3} onPress={this.props.onDelete} />
                </View>
            </View>
        );
    }
}



export class CustomizationCarCRUDForm extends SGBaseForm {
    initStyleSheet(propStyle) {
        if (this._strStyle !== JSON.stringify(propStyle)) {
            this._strStyle = JSON.stringify(propStyle);
            this._whp = { w: propStyle.width, h: propStyle.height, p: propStyle.padding }
            var { w, h, p } = this._whp;
            this._style = StyleSheet.create({
                v1: { width: ((w - 10 * p)), backgroundColor: 'white',justifyContent:'center',alignItems:'center',paddingVertical:2*p},
                ti1: { width: (w - 15 * p), color: 'rgb(100,100,100)', borderColor: 'rgb(150,150,150)' },
            });
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);

        this.initData(this.props.data);
        this.initStyleSheet(this.props.style);
    }
    _onBlur(){
        if(this.props.onBlurAdd && this.props.mode==="add"){
            setTimeout(() => { this.props.onBlurAdd(); console.log("add")} , 100);
        }
        else if(this.props.onBlurEdit && this.props.mode==="edit"){
            setTimeout(() => { this.props.onBlurEdit(); console.log("edit")} , 100);
        }
    }
    render() {
        this.initData(this.props.data);
        this.initStyleSheet(this.props.style);
        var { w, h, p } = this._whp;
        var style = this._style;
        var ro = this.props.readonly;
        var language = "en";
        return (
            <View accessible={true} accessibilityLabel={'CustomizationCarCRUDFormRootView'} style={this.props.style.height ? style.v1 : { ...style.v1, height: this.props.style.height }}>
                <TextInput accessible={true} accessibilityLabel={'CustomizationCarCRUDFormRootTextInput'} style={style.ti1} editable={!ro} placeholder={SGLocalize.translate('UserProfileScreen.carPlateNumberPlaceHolder')} value={this.getData('carNumber')} onChangeText={(v) => { this.setData('carNumber', v) }} autoCapitalize={'characters'} onBlur={() => { this._onBlur()}}/>
            </View>
        );
    }
}

export class CustomizationCarCRUDList extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { overflow: 'visible', flex: 1, minHeight: w * 0.25, width: w - 10 * p, marginVertical: p, justifyContent: 'flex-start', },
            v2: { flex: 1, width: w - 10 * p, backgroundColor: 'rgb(252,252,252)', borderRadius: p, justifyContent: 'space-between', alignItems: 'flex-end',borderWidth:1,borderColor:'rgb(228,228,228)',borderRadius:2*p },
            v3: { width: w * 0.15, marginTop: 1.5 * p, flexDirection: 'row', width: w - 10 * p, justifyContent: 'flex-end', alignItems: 'flex-start' },
            v4: { width: w - 10 * p, padding: 0, justifyContent: 'center', alignItems: 'center' },
            sv1: { width: w - 10 * p, maxHeight: w * 0.5, },
            c1: { width: w, padding: p, },
            c2: { width: w, padding: p },
            title: { alignSelf: 'flex-start',paddingLeft:p }
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this._style = this.createStyleSheet(this._whp);
        this._data = this._getCarJSON();
        this.mode = 'list'
        this.data = this._data
        this.tempData = new CustomizationData()

    }

    onAddPress() {
        this.mode = 'add'
        this.tempData = new CustomizationData()
        this.forceUpdate()
    }
    onCardPress(args) {
        var data = this.data
        this.mode = this.props.readonly ? 'view' : 'edit'
        // console.log(this.mode);
        this.index = args
        this.tempData = new CustomizationData(data)
        this.forceUpdate()
    }
    onDeletePress(index) {
        console.log('ini index' + index);
        this.index = index
        // console.log(this.data);
        this.data.splice(index, 1);
        // console.log(this.data);
        this.props.updateCarPlate(this.data);
        this.forceUpdate()
    }
    onSaveAddPress() {
        var data = this.data;
        var isAdded = false;
        if (data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].carNumber === this.tempData._current.carNumber) {
                    DialogBox.showFail(null, SGLocalize.translate('UserProfileScreen.AlertCarPlateUsedTitle'), SGLocalize.translate('UserProfileScreen.AlertCarPlateUsedText'), SGLocalize.translate('globalText.ok'));
                    break;
                }
                if (this.tempData._current.carNumber === '') {
                    DialogBox.showFail(null, SGLocalize.translate('UserProfileScreen.AlertCarPlateEmptyTitle'), SGLocalize.translate('UserProfileScreen.AlertCarPlateEmptyText'), SGLocalize.translate('globalText.ok'));
                    break;
                }
                if (i === data.length - 1) {
                    isAdded = true;
                }
            }
            if (isAdded) {
                data.push(this.tempData);
                this.mode = 'list'
                this.data = data
                // this.setState({ mode: 'list', data: data });
                this.refs.SV1.scrollToEnd();
                this.props.updateCarPlate(this.data);
                this.forceUpdate()
            }
        }
        else {
            data.push(this.tempData);
            this.mode = 'list'
            this.data = data
            // this.setState({ mode: 'list', data: data });
            this.refs.SV1.scrollToEnd();
            this.props.updateCarPlate(this.data);
            this.forceUpdate()
        }
    }
    // console.log(this.state.tempData);

    onSaveEditPress() {
        var data = this.data;
        var isAdded = false;
        for (var i = 0; i < data.length; i++) {
            if (data[i].carNumber === this.tempData._current.carNumber) {
                DialogBox.showFail(null, SGLocalize.translate('UserProfileScreen.AlertCarPlateUsedTitle'), SGLocalize.translate('UserProfileScreen.AlertCarPlateUsedText'), SGLocalize.translate('globalText.ok'));
                break;
            }
            if (this.tempData._current.carNumber === '') {
                DialogBox.showFail(null, SGLocalize.translate('UserProfileScreen.AlertCarPlateEmptyTitle'), SGLocalize.translate('UserProfileScreen.AlertCarPlateEmptyText'), SGLocalize.translate('globalText.ok'));
                break;
            }
            if (i === data.length - 1) {
                isAdded = true;
            }
            if (isAdded) {
                var tempData = this.tempData;
                var index = this.index
                this.data[index] = tempData
                this.mode = 'list'
                // this.data = data
                // this.setState({ mode: 'list', data: data, });
                // this.props.updateCarPlate(this.data);
                // this.forceUpdate()
            }
        }

    }
    onBackPress() {
        this.mode = 'list'
        this.forceUpdate()
        // this.setState({ mode: 'list' });
    }
    _getCarJSON() {
        var carJSON = []
        var dataList = JSON.parse(JSON.stringify(this.props.dataList))
        for (var i = 0; i < dataList.length; i++) {
            carJSON.push(new CustomizationData({ carNumber: dataList[i] }))
        }
        return carJSON
    }
    render() {
        var { w, h, p } = this._whp;
        var style = this._style;
        var data = this._getCarJSON();
        var mode = this.mode;
        var ro = this.props.readonly;

        return (
            <View accessible={true} accessibilityLabel={'CustomizationCarCRUDListRootView'} style={style.v1}>
                <Text accessible={true} accessibilityLabel={'CustomizationCarCRUDListTitle'} style={style.title}>{SGLocalize.translate('UserProfileScreen.CarPlateNumber')}</Text>
                <View accessible={true} accessibilityLabel={'CustomizationCarCRUDListContainerView'}  style={style.v2}>
                    <View accessible={true} accessibilityLabel={'CustomizationCarCRUDListIconView'} style={style.v3}>
                        <SGIcon preset={SGIcon.preset.h2} accessible={true} accessibilityLabel={'CustomizationCarCRUDListAddIcon'} name={SGIcon.Icon.add} style={(mode === 'list' && !ro ? { marginRight: -4 * p } : { fontSize: 0.01 })} onPress={this.onAddPress.bind(this)} />
                        <SGIcon preset={SGIcon.preset.h2} accessible={true} accessibilityLabel={'CustomizationCarCRUDListBackIcon'} name={SGIcon.Icon.back} style={((mode === 'add' || mode === 'edit' || mode === 'view') ? {} : { fontSize: 0.01 })} onPress={this.onBackPress.bind(this)} />
                        <SGIcon preset={SGIcon.preset.h2} accessible={true} accessibilityLabel={'CustomizationCarCRUDListSavedAddIcon'} name={SGIcon.Icon.save} style={(mode === 'add' && !ro ? {} : { fontSize: 0.01 })} onPress={this.onSaveAddPress.bind(this)} />
                        <SGIcon preset={SGIcon.preset.h2} accessible={true} accessibilityLabel={'CustomizationCarCRUDListSaveEditIcon'} name={SGIcon.Icon.save} style={(mode === 'edit' && !ro ? {} : { fontSize: 0.01 })} onPress={this.onSaveEditPress.bind(this)} />
                    </View>
                    <View accessible={true} accessibilityLabel={'CustomizationCarCRUDListCardView'} style={mode === 'list' ? { alignSelf: 'center' } : { height: 0 }}>
                        <ScrollView accessible={true} accessibilityLabel={'CustomizationCarCRUDListScrollView'} ref='SV1' style={style.sv1} contentContainerStyle={style.v4} showsVerticalScrollIndicator={false}>
                            {
                                data.map((d, i) => {
                                    return (
                                        <CustomizationCarCRUDCard accessible={true} accessibilityLabel={'CustomizationCarCRUDListCustCarCRUDCard'} key={d.GUID} readonly={ro} style={style.c1} data={d} onPress={this.onCardPress.bind(this, i)} onDelete={ro ? () => { } : this.onDeletePress.bind(this, i)} />
                                    );
                                })
                            }
                        </ScrollView>
                    </View>

                    {mode === 'add' || mode === 'view' || mode === 'edit' ?
                        (<View accessible={true} accessibilityLabel={'CustomizationCarCRUDListBottomView'} >
                            <CustomizationCarCRUDForm accessible={true} accessibilityLabel={'CustomizationCarCRUDListForm'} readonly={ro} style={style.c2} data={this.tempData} onBlurAdd={this.onSaveAddPress.bind(this)} onBlurEdit={this.onSaveEditPress.bind(this)} mode={mode}/>
                        </View>) : (null)}

                </View>
            </View>
        );
    }
}