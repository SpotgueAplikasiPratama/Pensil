import React from 'react';
import Core from '../../core/core';

export default class Lesson10Screen extends Core.Screen.SGBaseScreen {

    createStyleSheet = (whp) => {
        const {StyleSheet } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
            inactiveOTPField: { padding: p, backgroundColor: 'white', borderRadius: 3 * p, fontSize: w * 0.1, color: "black", },
            activeOTPField: { padding: p, backgroundColor: 'white', borderColor: 'red', borderRadius: 3 * p, fontSize: w * 0.1, color: "black", },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this._darkMode = false;
        this.state = { file1: '', txt1: '', txt2: '', txt3: '', txt4: '', code: '', check: false, selected: null, drumIndex: 0, data: this._data, date1: new Date(), date2: new Date() }

        /*
        this.state.txt1 = 'hahaha';
        this.forceUpdate();
        */

        /*
        this.setState({ txt1: 'hihihi' });
        */
        this._name = 'Wonder Woman'
        this._imageData = [];
        this._imageData1 = [];
        this._imageData2 = [];
        this._imageData3 = [];
        this._imageData4 = [];
    }

    render() {
        const { SGRootScrollView, SGView, SGButton, SGText, SGTextInput, SGPicker, SGOTPInput, SGDatePicker, SGTimePicker, SGSwitch, SGCheckBox, SGCheckBoxList, SGFilePicker, SGImagePicker } = Core.Control;
        var style = this.style;
        var { w, h, p } = this.WHP;
        return (
            <SGRootScrollView style={{wdith:w, backgroundColor: this._darkMode ? 'black' : 'white' }}>
                <SGButton label={'Toggle Dark Mode'} onPress={() => { this._darkMode = !this._darkMode; this.forceUpdate(); }} />

                <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGTextInput:</SGText></SGView>
                <SGView style={{ padding: 20, alignItems: 'flex-start' }}>
                    <SGOTPInput accessible={true} accessibilityLabel={'VerifyOTPSignUpScreenOTPInput'}
                        shadow
                        pinCount={4}
                        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        // onCodeChanged = {code => { this.setState({code})}}
                        autoFocusOnLoad
                        codeInputFieldStyle={style.inactiveOTPField}
                        codeInputHighlightStyle={style.activeOTPField}
                        onCodeFilled={(otp) => { Core.log(otp); }}
                        style={{ marginTop: 10 * p, marginBottom: 8 * p }}
                    />
                </SGView>
                <SGView style={{ padding: 20, alignItems: 'flex-start' }}>
                    <SGText>Name</SGText>
                    <SGTextInput textStyle={{ color: 'red', backgroundColor: 'purple', height: 100, marginHorizontal: 0 }} style={{ height: 100, backgroundColor: 'orange' }} preset={SGTextInput.preset.default} value={this._nama} placeholder={'enter your name'} onChangeText={(v) => { this._nama = v }} />
                    <SGText>Address</SGText>
                    <SGTextInput style={{ marginRight: 0 }} textStyle={{ marginHorizontal: 0 }} onValueChange={(v) => { console.log(v) }} dataType={SGTextInput.dataType.multiline} preset={SGTextInput.preset.default} value={this.state.txt2} placeholder={'enter your address'} onChangeText={(v) => { this.setState({ txt2: v }) }} />
                    <SGText>Email</SGText>
                    <SGTextInput dataType={SGTextInput.dataType.email} autoCapitalize={'characters'} placeholder={'enter your email'} />
                    <SGText>Price</SGText>
                    <SGTextInput dataType={SGTextInput.dataType.currency} value={this.state.txt4} placeholder={'enter your price'} onChangeText={(v) => { this.setState({ txt4: v }) }} />
                    <SGText>Password</SGText>
                    <SGTextInput style={{}} dataType={SGTextInput.dataType.password} preset={SGTextInput.preset.default} value={this.state.txt5} placeholder={'enter your password'} onChangeText={(v) => { this.setState({ txt5: v }) }} />
                    <SGText>ConfirmPassword</SGText>
                    <SGTextInput dataType={SGTextInput.dataType.password} disabled preset={SGTextInput.preset.default} value={this.state.txt6} placeholder={'enter your password again'} onChangeText={(v) => { this.setState({ txt6: v }) }} />
                    <SGText>Website</SGText>
                    <SGTextInput dataType={SGTextInput.dataType.url} value={this.state.txt8} placeholder={'enter your website'} onChangeText={(v) => { this.setState({ txt8: v }) }} />
                    <SGText>HTML</SGText>
                    <SGTextInput dataType={SGTextInput.dataType.html} preset={SGTextInput.preset.default} value={this.state.txt9} placeholder={'enter your html code'} onChangeText={(v) => { this.setState({ txt9: v }) }} />
                    <SGText>Phone</SGText>
                    <SGTextInput dataType={SGTextInput.dataType.phone} value={this.state.txt7} placeholder={'enter your phone'} onChangeText={(v) => { this.setState({ txt7: v }) }} />
                </SGView>

                <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGPicker:</SGText></SGView>
                <SGView style={{ alignSelf: 'stretch', flex: 1 }}>
                    <SGPicker label={'Select Number'} language={'ID'} value={'b'} optionList={[{ key: 'a', title: 'satu' }, { key: 'b', title: 'dua' }, { key: 3, title: 'tiga' }, { key: 4, title: 'empat' }]} />
                    <SGPicker language={'ID'} style={{}} single optionList={[{ key: 1, title: 'satu' }, { key: 2, title: 'dua' }, { key: 3, title: 'tiga' }, { key: 4, title: 'empat' }]} value={1} />
                    <SGPicker language={'EN'} shadow disabled style={{}} single optionList={[{ key: 1, title: 'satu' }, { key: 2, title: 'dua' }, { key: 3, title: 'tiga' }, { key: 4, title: 'empat' }]} value={1} />
                    <SGPicker filterMode language={'ID'} onValueChange={(v) => { console.log(v) }} optionList={[{ key: 1, title: 'satu' }, { key: 2, title: 'dua' }, { key: 3, title: 'tiga' }, { key: 4, title: 'empat' }, { key: 5, title: 'lima' }, { key: 6, title: 'enam' }, { key: 7, title: 'tujuh' }, { key: 8, title: 'delapan' }, { key: 9, title: 'sembilan' }, { key: 10, title: 'sepuluh' }, { key: 11, title: 'sebelas' }, { key: 12, title: 'dua belas' }]} value={[1, 3, 4]} />
                    <SGPicker filterMode disabled language={'ID'} onValueChange={(v) => { console.log(v) }} optionList={[{ key: 1, title: 'satu' }, { key: 2, title: 'dua' }, { key: 3, title: 'tiga' }, { key: 4, title: 'empat' }, { key: 5, title: 'lima' }, { key: 6, title: 'enam' }, { key: 7, title: 'tujuh' }, { key: 8, title: 'delapan' }, { key: 9, title: 'sembilan' }, { key: 10, title: 'sepuluh' }, { key: 11, title: 'sebelas' }, { key: 12, title: 'dua belas' }]} value={[1, 3, 4]} />
                </SGView>

                <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGDatePicker:</SGText></SGView>
                <SGView style={{ alignSelf: 'stretch', flex: 1 }}>
                    <SGDatePicker label={'Select Date'} darkMode={this._darkMode} language={'EN'} value={this.state.date1} onValueChange={(v) => { this.state.date1=v;}} style={{ backgroundColor: 'white' }} />
                    <SGDatePicker darkMode={this._darkMode} shadow language={'EN'} style={{ backgroundColor: 'white' }} />
                    <SGDatePicker darkMode={this._darkMode} disabled shadow style={{ backgroundColor: 'white' }} />
                    <SGDatePicker darkMode={this._darkMode} shadow onValueChange={(v) => { console.log(v) }} value={new Date(2005, 1, 14)} dateRange={{ start: new Date(1983, 2, 5), end: new Date(2010, 9, 24) }} shadow style={{ backgroundColor: 'orange', width: w / 2 }} textStyle={{ color: 'white' }} />
                </SGView>

                <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGTimePicker:</SGText></SGView>
                <SGView style={{ alignSelf: 'stretch', flex: 1 }}>
                    <SGTimePicker label={'Select Time'} shadow style={{ backgroundColor: 'white' }} />
                    <SGTimePicker shadow shadowIntensity={0} style={{ backgroundColor: 'white' }} hourList={[{ key: 10, title: '10' }, { key: 11, title: '11' }, { key: 12, title: '12' }, { key: 13, title: '13' }, { key: 14, title: '14' }, { key: 15, title: '15' }, { key: 16, title: '16' }, { key: 17, title: '17' }, { key: 18, title: '18' }, { key: 19, title: '19' }, { key: 20, title: '20' }, { key: 21, title: '21' }]} minuteList={[{ key: 0, title: '00' }, { key: 15, title: '15' }, { key: 30, title: '30' }, { key: 45, title: '45' }]} />
                    <SGTimePicker disabled shadow style={{ backgroundColor: 'white' }} />
                    <SGTimePicker onValueChange={(v) => { console.log(v.toString() + ' vs ' + v.toUTCString()) }} value={new Date()} shadow style={{ backgroundColor: 'orange', width: w / 2 }} textStyle={{ color: 'grey' }} />
                </SGView>

                <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGSwitch:</SGText></SGView>
                <SGView style={{ alignSelf: 'stretch', flex: 1 }}>
                    <SGSwitch
                        shadow
                        value={this.state.check}
                        trackColor={{ true: "green", false: 'red' }}
                        thumbColor={this.state.check ? 'orange' : 'black'}
                        onValueChange={(v) => { this.setState({ check: v }); }}
                    ></SGSwitch>
                    <SGSwitch hidden />
                    <SGSwitch
                        shadow
                        preset={SGSwitch.preset.small}
                        trackColor={{ true: "pink", false: 'purple' }}
                        thumbColor={'white'} />
                    <SGSwitch disabled />
                    <SGSwitch disabled value={true} />
                    <SGSwitch />
                    <SGSwitch shadow />
                </SGView>

                <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGCheckBox:</SGText></SGView>
                <SGView style={{ alignSelf: 'stretch', flex: 1,}}>
                    <SGCheckBox darkMode={this._darkMode} value={this._v1} onValueChange={(v) => { this._v1 = v; }} />
                    <SGCheckBox darkMode={this._darkMode} title='OK' value={this._v1} onValueChange={(v) => { this._v1 = v; }} />
                    <SGCheckBox darkMode={this._darkMode} title='Active' value={false} onValueChange={(v) => { alert(v) }} />
                    <SGCheckBox darkMode={this._darkMode} title='Active' style={{ fontSize: 45, color: 'green', backgroundColor: 'orange' }} value={this._v1} onValueChange={(v) => { this._v1 = v; }} />
                    <SGCheckBox darkMode={this._darkMode} title='H6 Active' textPreset={SGText.preset.h6} value={true} />
                    <SGCheckBox darkMode={this._darkMode} title='H8 Active' hidden textPreset={SGText.preset.h8} value={true} />
                    <SGText>v1: {this._v1 ? 'true' : 'false'}</SGText>
                </SGView>

                <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGCheckBoxList:</SGText></SGView>
                <SGView style={{ alignSelf: 'stretch', flex: 1, }}>
                    <SGText preset={SGText.preset.h3B}>Set of Checkbox List 1</SGText>
                    <SGCheckBoxList darkMode={this._darkMode} numberOfColumns={3} style={{ width: w - 2 * p }} disabled optionList={[{ key: '1', title: 'alone' }, { key: '2', title: 'parents' }, { key: '3', title: 'family' }, { key: '4', title: 'friends' }]} value={null} onValueChange={(v) => { console.log(v) }} />
                    <SGText preset={SGText.preset.h3B}>Set of Checkbox List 2</SGText>
                    <SGCheckBoxList darkMode={this._darkMode} numberOfColumns={2} style={{ width: w - 2 * p }} textPreset={SGText.preset.h2} optionList={[{ key: '1', title: 'Alone' }, { key: '2', title: 'parents' }, { key: '3', title: 'family' }, { key: '4', title: 'friends' }]} value={['1', '3']} onValueChange={(v) => { console.log(v) }} />
                    <SGText preset={SGText.preset.h3B}>Set of Checkbox List 3 (single)</SGText>
                    <SGCheckBoxList darkMode={this._darkMode} single optionList={[{ key: '1', title: 'alone' }, { key: '2', title: 'parents' }, { key: '3', title: 'family' }, { key: '4', title: 'friends' }]} value={''} onValueChange={(v) => { console.log(v) }} />
                    <SGText preset={SGText.preset.h3B}>Set of Checkbox List 4 (single)</SGText>
                    <SGCheckBoxList darkMode={this._darkMode} hidden single optionList={[{ key: '1', title: 'alone' }, { key: '2', title: 'parents' }, { key: '3', title: 'family' }, { key: '4', title: 'friends' }]} value={''} onValueChange={(v) => { console.log(v) }} />
                    <SGText preset={SGText.preset.h3B}>Set of Checkbox List 5</SGText>
                    <SGCheckBoxList darkMode={this._darkMode} numberOfColumns={2} style={{ width: w - 2 * p, }} preset={SGCheckBoxList.preset.default} optionList={[{ key: '1', title: 'Alone' }, { key: '2', title: 'parents' }, { key: '3', title: 'family' }, { key: '4', title: 'friends' }]} value={['1', '3']} onValueChange={(v) => { console.log(v) }} />
                </SGView>

                <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGFilePicker:</SGText></SGView>
                <SGView style={{ alignSelf: 'stretch', flex: 1, justifyContent: 'flex-start', }}>
                    <SGFilePicker darkMode={this._darkMode} maxSize={5 * 1024 * 1024} placeholder={"Select PDF"} label={'Select PDF'} value={this.state.file1} fileType={[SGFilePicker.fileType.pdf]} onValueChange={(v) => { this.setState({ file1: v }) }} />
                    <SGFilePicker darkMode={this._darkMode} disabled maxSize={5 * 1024 * 1024} placeholder={"Select PDF"} label={'Select PDF'} value={this.state.file1} fileType={[SGFilePicker.fileType.pdf]} onValueChange={(v) => { this.setState({ file1: v }) }} />
                </SGView>

                <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGImagePicker:</SGText></SGView>
                <SGView style={{ alignSelf: 'stretch', flex: 1, }}>
                    <SGImagePicker label={'Profile Image'} imageFactor={0.25} onValueChange={(e)=>{Core.log(JSON.stringify(e));}} value={this._imageData} ratio={SGImagePicker.ratio.r9x9} />
                    <SGImagePicker shadow label={'Profile Image'} imageFactor={0.25} value={this._imageData1} ratio={SGImagePicker.ratio.r9x16} />
                    <SGImagePicker disabled label={'Profile Image'} hideText imageFactor={0.25} value={this._imageData2} ratio={SGImagePicker.ratio.r16x9} />
                    <SGImagePicker previewMode maxImageCount={1} label={'Profile Image'} hideText imageFactor={0.25} value={this._imageData3} ratio={SGImagePicker.ratio.r16x9} />
                    <SGImagePicker disabled previewMode maxImageCount={1} label={'Profile Image'} hideText imageFactor={0.25} value={this._imageData4} ratio={SGImagePicker.ratio.r9x16} />
                </SGView>
            </SGRootScrollView>
        );
    }
}