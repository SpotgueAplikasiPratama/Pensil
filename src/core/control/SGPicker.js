/**
 * create custom multipicker component with additional behavior
 * 1. single true|false
 * 2. receive array of key-title pair for optionList
 * 3. receive array of key for value
 * 4. return array of key being selected
 * 5. hidden true|false
 * 6. disabled true|false
 * 7. shadow true|false with prop shadowIntensity from 0.0 to 1.0
 * 8. onValueChange event 
 * 9. show list of option in PopUp view 
 * 10. select all and deselect all
 * 11. search bar
 * 12. language property ID|EN|CN
 * 13. user can customize textStyle prop and textPreset prop
 * 14. filterMode true|false
 * 15. mandatory true|false (will auto select the first option when value is null and user must always choose 1, only work when single prop is also true)
 */

 import React from 'react';
 import { SGPicker as labels } from '../locale/lang.json';
 import { Platform, StyleSheet } from 'react-native';
 import { SGView } from './SGView';
 import { SGScrollView } from './SGScrollView';
 import { SGPopView } from './SGPopView';
 import { SGText } from './SGText';
 import { SGTextInput } from './SGTextInput';
 import { SGBaseControl } from '../../core/control/SGBaseControl';
 import { SGIcon } from './SGIcon';
 import { SGButton } from './SGButton';
 import { SGTouchableOpacity } from './SGTouchableOpacity';
 import { SGImage } from './SGImage';
 import { SGCheckBox } from './SGCheckBox';
 import { SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';
 import { SGImageButton } from './SGImageButton'
 
 export class SGPicker extends SGBaseControl {
     processData(arr, arr2) {
         this._selCount = 0;
         var res = [];
         var val = [].concat(arr2);
         for (var i = 0; i < arr.length; i++) {
             var isSelected = val.includes(arr[i].key);
             arr[i].image ?
                 (res.push({ index: i, key: arr[i].key, title: arr[i].title, image: arr[i].image, selected: isSelected }))
                 :
                 (res.push({ index: i, key: arr[i].key, title: arr[i].title, selected: isSelected }))
 
             this._selCount = this._selCount + (isSelected ? 1 : 0);
         }
         this._data = res;
     }
 
     filterData(arr, filter) {
         if (!filter || filter === '') {
             return arr;
         } else {
             return arr.filter((a) => { return a.title.toLowerCase().includes(filter); });
         }
     }
 
     get Value() {
         var val = [];
         var data = this._data;
         for (var i = 0; i < data.length; i++) {
             if (data[i].selected) {
                 val.push(data[i].key);
             }
         }
         if (this.props.single) {
             return (val.length > 0) ? val[0] : null;
         } else {
             return val;
         }
     }
 
     get Title() {
         var val = [];
         var data = this._data;
         for (var i = 0; i < data.length; i++) {
             if (data[i].selected) {
                 val.push(data[i].title);
             }
         }
         return val;
     }
 
     get Image() {
         var val = [];
         var data = this._data;
         for (var i = 0; i < data.length; i++) {
             if (data[i].selected) {
                 val.push(data[i].image);
             }
         }
         return val;
     }
 
     onShowHandler() {
         SGPopView.showPopView(this.pvID, false, this.props.SGDialogPicker);
     }
 
     onHideHandler() {
         SGPopView.hidePopView(this.pvID, false, this.props.SGDialogPicker);
     }
 
     onPressItemHandler(index, refreshDisplay) {
         if (this.props.disabled) return;
         if (this.props.single) {
             for (var i = 0; i < this._data.length; i++) {
                 if (i === index) {
                     this._data[i].selected = this.props.mandatory ? true : !this._data[i].selected;
                 } else {
                     this._data[i].selected = false;
                 }
             }
             this._selCount = (this._data[index].selected ? 1 : 0);
             if (refreshDisplay) { SGPopView.hidePopView(this.pvID, false, this.props.SGDialogPicker); }
         } else {
             this._data[index].selected = !this._data[index].selected;
             this._selCount = this._selCount + (this._data[index].selected ? 1 : -1);
         }
         this._value = this.Value;
         if (refreshDisplay) { this.initDisplayData(); }
         if (SGHelperType.isDefined(this.props.onValueChange)) {
             this.props.onValueChange(this._value);
         }
         if (!this.props.stateless) { super.mySetState({ data: this._data, selCount: this._selCount }); }
     }
 
     onSelectAllHandler() {
         if (this.props.disabled) return;
         var changeFlag = 0;
         var flagFilter = !(!this._filter || this._filter === '');
         for (var i = 0; i < this._data.length; i++) {
             if (!this._data[i].selected) {
                 if (!flagFilter) {
                     this._data[i].selected = true;
                     changeFlag++;
                 } else if (flagFilter && this._data[i].title.toLowerCase().includes(this._filter.toLowerCase())) {
                     this._data[i].selected = true;
                     changeFlag++;
                 }
             }
         }
         if (changeFlag > 0) {
             this._selCount = this._selCount + changeFlag;
             this._value = this.Value;
             this.initDisplayData();
             if (SGHelperType.isDefined(this.props.onValueChange)) {
                 this.props.onValueChange(this._value);
             }
             if (!this.props.stateless) { super.mySetState({ data: this._data, selCount: this._selCount }); }
         }
     }
 
     onDeselectAllHandler() {
         if (this.props.disabled) return;
         var changeFlag = 0;
         var flagFilter = !(!this._filter || this._filter === '');
         for (var i = 0; i < this._data.length; i++) {
             if (this._data[i].selected) {
                 if (!flagFilter) {
                     this._data[i].selected = false;
                     changeFlag++;
                 } else if (flagFilter && this._data[i].title.toLowerCase().includes(this._filter.toLowerCase())) {
                     this._data[i].selected = false;
                     changeFlag++;
                 }
             }
         }
         if (changeFlag > 0) {
             this._selCount = this._selCount - changeFlag;
             this._value = this.Value;
             this.initDisplayData();
             if (SGHelperType.isDefined(this.props.onValueChange)) {
                 this.props.onValueChange(this._value);
             }
             if (!this.props.stateless) { super.mySetState({ data: this._data, selCount: this._selCount }); }
         }
     }
 
     onFilterItemHandler(val) {
         if (this.props.disabled) return;
         this._filter = val;
         super.mySetState({ filter: this._filter });
     }
 
     onClearFilterHandler() {
         if (this.props.disabled) return;
         this._filter = '';
         super.mySetState({ filter: this._filter });
     }
 
     initDisplayData() {
         this._displayData = [];
         if (this.props.filterMode) {
             for (var i = 0; i < this._data.length; i++) {
                 if (this._data[i].selected) {
                     this._displayData.push(this._data[i]);
                 }
             }
             var counter = this._displayData.length;
             if (counter < 8) {
                 for (var i = 0; i < this._data.length; i++) {
                     if (counter >= 8) break;
                     if (!this._data[i].selected) {
                         this._displayData.push(this._data[i]);
                         counter++;
                     }
                 }
             }
         }
     }
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this.labels = labels;
         this._filter = '';
         this.pvID = SGPopView.getPopViewID();
     }
 
     initProps() {
         if (super.isPropsNeedInitOrChanged(this.props)) {
             var { w, h, p } = this._screenWHPNoHeader;
             this._style = {
                 default: StyleSheet.create({
                     v1: { width: w - 12 * p, marginVertical: 2 * p, paddingVertical: p, borderRadius: 2 * p, borderColor: SGHelperStyle.color.SGPicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGPicker.BGWhite },
                     v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: 0, paddingVertical: 1 * p },
                     v3: { width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: p },
                     t1: { flex: 1, color: SGHelperStyle.color.SGDatePicker.TextBlack },
                     i1: { color: SGHelperStyle.color.SGDatePicker.TextBlack },
                     svDisplay1: { flex: null },
                     svDisplay1_1: { flexDirection: 'row' },
                     displayButton: { borderRadius: 3 * p, justifyContent: 'center', marginTop: 3 * p, paddingVertical: 2.5 * p },
                     pv1: { paddingHorizontal: 4 * p, backgroundColor: SGHelperStyle.color.SGPicker.PVBGBlack, width: w, height: (this._screenWHPNoHeader.h) * 0.5, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                     pv1_t1: { alignSelf: 'flex-start', paddingLeft: 0, marginLeft: 0, color: SGHelperStyle.color.SGDatePicker.TextWhite },
                     v5: { width: w - 8 * p, padding: 0, flexDirection: 'row', paddingBottom: 2 * p, marginBottom: 2 * p, borderBottomWidth: 1, borderBottomColor: SGHelperStyle.color.borderColor, justifyContent: 'space-between' },
                     v6: { width: (w - 8 * p) * 0.8, borderRadius: 2 * p, backgroundColor: SGHelperStyle.color.pickerSearchBarColor, paddingVertical: 0, flexDirection: 'row', justifyContent: 'space-between', },
                     v7: { width: w - 12 * p, padding: 0, paddingVertical: 2 * p, flexDirection: 'row', justifyContent: 'space-between' },
                     sv1: { width: w - 8 * p, },
                     sv1_1: { width: w - 8 * p, paddingRight: p, justifyContent: 'flex-start', alignItems: 'flex-start', },
                     t2: { color: SGHelperStyle.color.SGPicker.TextWhite,width:w*0.8 },
                     t2_1: { color: SGHelperStyle.color.SGPicker.TextWhite,width:w*0.8 },
                     t3: { marginVertical: 2 * p, color: SGHelperStyle.color.TextBlue1, color: 'rgb(31,194,239)' },
                     ti1: { padding: 0, paddingLeft: 0, marginHorizontal: p / 2, width: (w - 5 * p) * 0.63, height: w * 0.1 },
                     ti1_1: { padding: 0, height: w * 0.1, paddingTop: 2 * p },
                     to1: { backgroundColor: 'white', width: w * 0.14, height: w * 0.009, marginTop: 3.5 * p, borderRadius: 5 * p, marginBottom: 3.5 * p },
                     to1a: { paddingHorizontal: 2 * p, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 2, borderRadius: 2 * p },
                     to1b: { paddingHorizontal: 2 * p, backgroundColor: 'transparent', marginTop: 2, borderRadius: 2 * p },
                     icon1: { marginVertical: 0, paddingVertical: 0 },
                     icon2: { color: SGHelperStyle.color.SGPicker.TextWhite },
                     image: { width: w * 0.1, height: w * 0.1, resizeMode: 'cover', marginRight: 0, backgroundColor: 'transparent' },
                     imageSelected: { width: w * 0.1, height: w * 0.1, resizeMode: 'cover', marginRight: 2.5 * p, backgroundColor: 'transparent' },
                     imageMini: { width: w * 0.05, height: w * 0.05, marginHorizontal: p, backgroundColor: 'transparent', borderRadius: 0 }
                 }),
                 disabled: StyleSheet.create({
                     v1: { width: w - 12 * p, marginVertical: 2 * p, paddingVertical: p, borderRadius: 2 * p, borderColor: SGHelperStyle.color.SGPicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGPicker.BGDisabled },
                     v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: 0, paddingVertical: 1 * p },
                     v3: { width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: p },
                     t1: { flex: 1, color: SGHelperStyle.color.SGDatePicker.TextDisabled },
                     i1: { color: SGHelperStyle.color.SGDatePicker.TextDisabled },
                     svDisplay1: { flex: null },
                     svDisplay1_1: { flexDirection: 'row' },
                     displayButton: { borderRadius: 3 * p, justifyContent: 'center', marginTop: 3 * p, paddingVertical: 2.5 * p },
                     pv1: { paddingHorizontal: 4 * p, backgroundColor: SGHelperStyle.color.SGPicker.PVBGBlack, width: w, height: (this._screenWHPNoHeader.h) * 0.5, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                     pv1_t1: { alignSelf: 'flex-start', paddingLeft: 0, marginLeft: 0, color: SGHelperStyle.color.SGDatePicker.TextWhite },
                     v5: { width: w - 8 * p, padding: 0, flexDirection: 'row', paddingBottom: 2 * p, marginBottom: 2 * p, borderBottomWidth: 1, borderBottomColor: SGHelperStyle.color.borderColor, justifyContent: 'space-between' },
                     v6: { width: (w - 8 * p) * 0.8, borderRadius: 2 * p, backgroundColor: SGHelperStyle.color.pickerSearchBarColor, paddingVertical: 0, flexDirection: 'row', justifyContent: 'space-between', },
                     v7: { width: w - 12 * p, padding: 0, paddingVertical: 2 * p, flexDirection: 'row', justifyContent: 'space-between' },
                     sv1: { width: w - 8 * p, },
                     sv1_1: { width: w - 8 * p, paddingRight: p, justifyContent: 'flex-start', alignItems: 'flex-start', },
                     t2: { color: SGHelperStyle.color.SGPicker.TextWhite, },
                     t2_1: { color: SGHelperStyle.color.SGPicker.TextWhite },
                     t3: { marginVertical: 2 * p, color: SGHelperStyle.color.TextBlue1, color: 'rgb(31,194,239)' },
                     ti1: { padding: 0, paddingLeft: 0, marginHorizontal: p / 2, width: (w - 5 * p) * 0.6, height: w * 0.1 },
                     ti1_1: { padding: 0, height: w * 0.1, paddingTop: 2 * p },
                     to1: { backgroundColor: 'white', width: w * 0.14, height: w * 0.009, marginTop: 3.5 * p, borderRadius: 5 * p, marginBottom: 3.5 * p },
                     to1a: { paddingHorizontal: 2 * p, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 2, borderRadius: 2 * p },
                     to1b: { paddingHorizontal: 2 * p, backgroundColor: 'transparent', marginTop: 2, borderRadius: 2 * p },
                     icon1: { marginVertical: 0, paddingVertical: 0 },
                     icon2: { color: SGHelperStyle.color.SGPicker.TextWhite },
                     image: { width: w * 0.1, height: w * 0.1, resizeMode: 'cover', marginRight: 0, backgroundColor: 'transparent' },
                     imageSelected: { width: w * 0.1, height: w * 0.1, resizeMode: 'cover', marginRight: 2.5 * p, backgroundColor: 'transparent' },
                     imageMini: { width: w * 0.05, height: w * 0.05, marginHorizontal: p, backgroundColor: 'transparent', borderRadius: 0 }
                 }),
             }
             this._lang = this.props.language ? this.props.language : 'ID';
         }
     }
 
     initValue() {
         if (!this._isValueInit || this.props.stateless || !this._renderBySelf) {
             this._value = !SGHelperType.isDefined(this.props.value) ? [] : (Array.isArray(this.props.value) ? this.props.value : [this.props.value]);
             this.processData(this.props.optionList, this._value);
             if (this.props.single && this.props.mandatory && this._data.length > 0 && this._selCount === 0) {
                 this._selCount = 1;
                 this._data[0].selected = true;
                 this._value = this.Value;
             }
             this.initDisplayData();
             this.state = { filter: this._filter, selCount: this._selCount, data: this._data };
             this._isValueInit = true;
         }
         this._renderBySelf = false;
     }
 
     render() {
 
         var { w, h, p } = this._screenWHPNoHeader
         this.initProps();
         this.initValue();
         var data = this.filterData(this._data, this._filter.toLowerCase());
       
         var style = this._style[this.props.disabled ? 'disabled' : 'default'];
         var vStyle = [style.v1, this.props.style,];
         if (this.props.hidden) {
             vStyle = { width: 0, height: 0, margin: 0, overflow: 'hidden' }
         } else {
             if (this.props.shadow && !this.props.disabled) {
                 vStyle = SGHelperStyle.addShadowStyle(vStyle, this.props.shadowIntensity);
             }
         }
        
         return (
             !this.props.hidden &&
             <SGTouchableOpacity  onPress={this.props.filterMode ? () => { } : this.onShowHandler.bind(this)} activeOpacity={this.props.filterMode ? 1.0 : 0.2} style={{ overflow: 'visible' }}>
                 <SGView accessible={true} accessibilityLabel={'SGPickerRootView'} style={vStyle} >
                     {
                         !this.props.filterMode &&
                         <SGView accessible={true} accessibilityLabel={'SGPickerTopView'} hidden={this.props.filterMode} style={style.v2} disabled={this.props.disabled}>
                             {this.Image[0] ?
                                 (<SGImage style={style.imageMini} source={{ uri: this._selCount === 0 ? this.labels[this._lang].pleaseSelect : this.props.single ? this.Image[0] : '(' + this._selCount + ' ' + this.labels[this._lang].selected + ')' }}></SGImage>)
                                 :
                                 (null)}
                             {this.Image[0] ?
                                 (<SGText accessible={true} accessibilityLabel={'SGPickerTitleText'} preset={this.props.textPreset ? this.props.textPreset : SGText.preset.titleH3} numberOfLines={1} style={[style.t1, this.props.textStyle, this._selCount === 0 ? { color: SGHelperStyle.color.pickerPlaceholderTextColor } : {}]}>{this._selCount === 0 ? this.labels[this._lang].pleaseSelect : this.props.single ? this.Title[0] : '(' + this._selCount + ' ' + this.labels[this._lang].selected + ')'}</SGText>)
                                 :
                                 (<SGText accessible={true} accessibilityLabel={'SGPickerTitleText2'} preset={this.props.textPreset ? this.props.textPreset : SGText.preset.titleH3} numberOfLines={1} style={[style.t1, this.props.textStyle, this._selCount === 0 ? { color: SGHelperStyle.color.pickerPlaceholderTextColor } : {}]}>{this._selCount === 0 ? this.labels[this._lang].pleaseSelect : this.props.single ? this.Title[0] : '(' + this._selCount + ' ' + this.labels[this._lang].selected + ')'}</SGText>)
                                 }
                             <SGIcon accessible={true} accessibilityLabel={'SGPickerArrowdownIcon'} preset={this.props.textPreset ? this.props.textPreset : SGText.preset.titleH3} name={SGIcon.Icon.arrowDown} style={style.i1} />
                         </SGView>
                     }
                     {this.props.filterMode &&
                         <SGView accessible={true} accessibilityLabel={'SGPickerFilterView'} hidden={!this.props.filterMode} style={style.v3}>
                             <SGScrollView accessible={true} accessibilityLabel={'SGPickerFScrollView'} showsHorizontalScrollIndicator={false} horizontal style={style.svDisplay1} contentContainerStyle={style.svDisplay1_1}>
                                 {
                                     this._displayData.map((d) => {
                                         return (
                                             <SGView >
                                                 <SGButton accessible={true} accessibilityLabel={'SGPickerFButton'} key={d.index} overrideDisabled disabled={this.props.disabled} onPress={this.onPressItemHandler.bind(this, d.index, false)} textPreset={SGText.preset.h7} preset={d.selected ? SGButton.preset.greenBorder : SGButton.preset.greyBorder} style={{ ...style.displayButton, borderColor: (d.selected ? SGHelperStyle.color.SGPicker.ButtonGreen : this.props.disabled ? SGHelperStyle.color.SGPicker.ButtonDisabled : SGHelperStyle.color.SGPicker.ButtonGrey), color: SGHelperStyle.color.TextFilterPickerColor, ...(this.props.disabled ? { backgroundColor: SGHelperStyle.color.SGPicker.BGDisabled } : {}) }} label={d.title} />
                                             </SGView>
                                         );
                                     })
                                 }
                             </SGScrollView>
                             <SGTouchableOpacity disabled={this.props.disabled} onPress={this.onShowHandler.bind(this)} ><SGText accessible={true} accessibilityLabel={'SGPickerSeeMoreText'} preset={SGText.preset.titleH4} style={style.t3}>{this.labels[this._lang].seeMore}</SGText></SGTouchableOpacity>
                         </SGView>
                     }
                     <SGPopView noDialogBox accessible={true} accessibilityLabel={'SGPickerPopView'} animationType={'slide'} popViewID={this.pvID} vPos='bottom'>
                         <SGView accessible={true} accessibilityLabel={'SGPickerPopContentView'} style={style.pv1} >
                             <SGTouchableOpacity accessible={true} accessibilityLabel={'SGPickerPopArrowdownIcon'} style={style.to1} onPress={this.onHideHandler.bind(this)} ></SGTouchableOpacity>
                             <SGText accessible={true} accessibilityLabel={'SGPickerPopLabelText'} preset={SGText.preset.titleH2B} style={style.pv1_t1} hidden={SGHelperType.isDefined(this.props.label) ? false : true}>{this.props.label}</SGText>
                             <SGView accessible={true} accessibilityLabel={'SGPickerPopContentView2'} style={style.v5} disabled={this.props.disabled}>
                                 <SGView accessible={true} accessibilityLabel={'SGPickerPopSearchView'} style={style.v6}>
                                     <SGIcon accessible={true} accessibilityLabel={'SGPickerSquareIcon'} preset={SGIcon.preset.h4} style={{ color: SGHelperStyle.color.SGPicker.TextBlack }} name={SGIcon.Icon.search} />
                                     <SGTextInput accessible={true} accessibilityLabel={'SGPickerPopSearchInput'} disabled={this.props.disabled} placeholder={this.labels[this._lang].search} style={style.ti1} textStyle={style.ti1_1} onChangeText={this.onFilterItemHandler.bind(this)} value={this._filter} SGDialogInput={this.props.SGDialogPicker} />
                                     <SGIcon accessible={true} accessibilityLabel={'SGPickerSearchCloseIcon'} preset={SGIcon.preset.h4} style={{ color: SGHelperStyle.color.SGPicker.TextBlack }} name={SGIcon.Icon.closecircle} onPress={this.onClearFilterHandler.bind(this)} />
                                 </SGView>
                                 <SGIcon accessible={true} accessibilityLabel={'SGPickerSquareIcon2'} preset={SGIcon.preset.h3} style={{ color: 'white' }} disabled={this.props.single && this.props.mandatory} name={SGIcon.Icon.square} onPress={this.onDeselectAllHandler.bind(this)} />
                                 <SGIcon accessible={true} accessibilityLabel={'SGPickerCheckSquareIcon'} preset={SGIcon.preset.h3} style={{ color: 'white' }} disabled={this.props.single} name={SGIcon.Icon.squareChecked} onPress={this.onSelectAllHandler.bind(this)} />
                             </SGView>
                             <SGScrollView accessible={true} accessibilityLabel={'SGPickerPopDataScrollView'} style={style.sv1} contentContainerStyle={style.sv1_1}>
                                 {
                                     data.map((d) => {
                                         return (
                                             <SGTouchableOpacity disabled={this.props.disabled} style={d.selected ? style.to1a : style.to1b} key={d.index} onPress={this.onPressItemHandler.bind(this, d.index, true)}>
                                                 <SGView accessible={true} accessibilityLabel={'SGPickerPopDataView'} style={style.v7}>
                                                     {d.image ?
                                                         (<SGImage style={(d.selected ? style.imageSelected : style.image)} source={{ uri: d.image }}></SGImage>)
                                                         :
                                                         (null)}
                                                     <SGText accessible={true} accessibilityLabel={'SGPickerPopDataText'} preset={d.selected ? SGText.preset.titleH3B : SGText.preset.titleH3} style={(d.selected ? style.t2_1 : style.t2)} numberOfLines={3} >{d.title}</SGText>
                                                     <SGIcon accessible={true} accessibilityLabel={'SGPickerPopDataSelectedIcon'} name={d.selected ? SGIcon.Icon.squareChecked : SGIcon.Icon.square} style={style.icon2} />
                                                 </SGView>
                                             </SGTouchableOpacity>
                                         );
                                     })
                                 }
                                 {
                                     Platform.OS === 'android' &&
                                     <SGView style={[style.v7, { height: SGHelperWindow.getHeaderHeight() }]}></SGView>
                                 }
                             </SGScrollView>
                         </SGView>
                     </SGPopView>
                 </SGView>
             </SGTouchableOpacity>
         );
     }
 }
 