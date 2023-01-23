import React from 'react';
import Core from '../../core/core';
import ModelLessonData from '../model/ModelLessonData';


export default class Lesson24Screen extends Core.Screen.SGBaseScreen {

    createStyleSheet = (whp) => {
        const { StyleSheet, } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
        });
    }
    // coba(){
    //     var a = {
    //         id='1',
    //         nama:'gerry',
    //         tempatLahir:'jakarta', 
    //         keluarga:[ 
    //             {nama:'ivone',umur:'37'},
    //             {nama:'samuel',umur:'9'} 
    //         ]}
    //     var b = JSON.stringify(a);
    //     // "{id='1',nama:'gerry',tempatLahir:'jakarta'}"
    //     a.tempatLahir = 'asdasdasd';
    //     var c = JSON.parse(b);
    //     c.id='aaa';        
    //     Core.log(a.keluarga[1].nama);
    // }
    getImageData() {
        const {SGImagePicker} = Core.Control;
        return ([
            {
                high: { uri: 'https://www.spotgue.com/ComingSoon.jpg', width: 1080, height: 1080 },
                med: { uri: 'https://www.spotgue.com/ComingSoon.jpg', width: 720, height: 720 },
                low: { uri: 'https://www.spotgue.com/ComingSoon.jpg', width: 480, height: 480 },
                thumbnailHigh: { uri: 'https://www.spotgue.com/ComingSoon.jpg', width: 270, height: 270 },
                thumbnailMed: { uri: 'https://www.spotgue.com/ComingSoon.jpg', width: 180, height: 180 },
                thumbnailLow: { uri: 'https://www.spotgue.com/ComingSoon.jpg', width: 120, height: 120 },
                text: 'Silakan nantikan kedatangan kami\n10 October 2020',
                textPosition: SGImagePicker.textPos.topLeft,
            },
            {
                high: { uri: 'https://www.spotgue.com/logo.png', width: 1080, height: 1080 },
                med: { uri: 'https://www.spotgue.com/logo.png', width: 720, height: 720 },
                low: { uri: 'https://www.spotgue.com/logo.png', width: 480, height: 480 },
                thumbnailHigh: { uri: 'https://www.spotgue.com/logo.png', width: 270, height: 270 },
                thumbnailMed: { uri: 'https://www.spotgue.com/logo.png', width: 180, height: 180 },
                thumbnailLow: { uri: 'https://www.spotgue.com/logo.png', width: 120, height: 120 },
                text: 'PT Spotgue Aplikasi Pratama\nSOHO Capital Lt.32 Unit 9',
                textPosition: SGImagePicker.textPos.centerRight,
            }
        ]);
    }

    constructor(props, context, ...args) {
        console.log('constructor');
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this._darkMode = false;
        this._data = new ModelLessonData();
        this._data.imageList.push(this.getImageData()[0]);
        this._data.imageList.push(this.getImageData()[1]);
    }
    setData(fieldName, value) {
        this._data._setValue(fieldName, value);
        //this.setState({ data: this._data });
    }
    getData(fieldName) {
        return this._data._getValue(fieldName);
    }
    onTextBlurHandler() {
        const {SGDialogBox} = Core.Control;
        console.log('onTextBlurHandler');
        SGDialogBox.showSuccess(null, 'Success', 'Showing Dialog Message', 'OK', null);
    }

    render() {
        Core.log('render')
        var style = this.style;
        var { w, h, p } = this.WHP;
        const { SGRootScrollView, SGImagePicker,  SGButton, SGScrollView, SGTextInput, SGFilePicker,  } = Core.Control;
        const { SGFormFilePicker, SGFormImagePicker, SGFormTextInput, SGFormPicker, SGFormDatePicker, SGFormTimePicker, SGFormMapPicker, SGFormButton, SGFormSwitch } =Core.Form;
        return (
            <SGRootScrollView style={{width:w, backgroundColor:'white'}}>
                <SGButton label={'Print Console'} onPress={() => { Core.log(JSON.stringify(this._data.getCurrentJSON()))}} />
                <SGScrollView tabLabel='Form'>
                    <SGFormTextInput onBlur={(this.onTextBlurHandler.bind(this))} showFlag={'ID'} preset={SGFormTextInput.preset.default} dataType={SGTextInput.dataType.email} label={'Customization Title'} placeholder={'Input title here'} value={this.getData('title')} onValueChange={(v) => { this.setData('title', v) }} validator={this._data.getValidators('title')} />
                    <SGFormTextInput showFlag={'ID'} preset={SGFormTextInput.preset.defaultMulti} dataType={SGTextInput.dataType.multiline} label={'Customization Description'} placeholder={'Input title here'} value={this.getData('desc')} onValueChange={(v) => { this.setData('desc', v) }} validator={this._data.getValidators('desc')} />
                    <SGFormTextInput showFlag={'EN'} dataType={SGTextInput.dataType.currency} label={'Price'} placeholder={'Input price here'} value={this.getData('price')} onValueChange={(v) => { this.setData('price', v) }} validator={this._data.getValidators('price')} />
                    <SGFormTextInput showFlag={'ID'} dataType={SGTextInput.dataType.password} label={'Password'} placeholder={'Input password here'} value={this.getData('password')} onValueChange={(v) => { this.setData('password', v) }} validator={this._data.getValidators('password')} />
                    <SGFormTextInput showFlag={'ID'} dataType={SGTextInput.dataType.password} label={'Confirm Password'} placeholder={'Input confirm password here'} value={this.getData('confirmPassword')} onValueChange={(v) => { this.setData('confirmPassword', v) }} validator={this._data.getValidators('confirmPassword')} />
                    <SGFormPicker showFlag={'ID'} label={'Hobby'} value={this.getData('hobby')} onValueChange={(v) => { this.setData('hobby', v) }} validator={this._data.getValidators('hobby')} optionList={[{ key: 1, title: 'reading' }, { key: 2, title: 'swimming' }, { key: 3, title: 'music' }]} />
                    <SGFormPicker showFlag={'ID'} filterMode label={'Hobby2'} value={this.getData('hobby2')} onValueChange={(v) => { this.setData('hobby2', v) }} validator={this._data.getValidators('hobby2')} optionList={[{ key: 1, title: 'reading' }, { key: 2, title: 'swimming' }, { key: 3, title: 'music' }]} />
                    <SGFormDatePicker showFlag={'ID'} label={'Expiry Date'} value={this.getData('expiryDate')} onValueChange={(v) => { this.setData('expiryDate', v) }} validator={this._data.getValidators('expiryDate')} dateRange={{ start: new Date(0), end: new Date(2020, 8, 12) }} />
                    <SGFormTimePicker showFlag={'ID'} label={'Open Hour'} value={this.getData('openHour')} onValueChange={(v) => { this.setData('openHour', v) }} validator={this._data.getValidators('openHour')} />
                    <SGFormSwitch showFlag={'ID'} label={'Active'} value={this.getData('active')} onValueChange={(v) => { this.setData('active', v) }} />
                    <SGFormMapPicker showFlag={'ID'} label={'Map Location'} latitude={this.getData('latitude')} longitude={this.getData('longitude')} onValueChange={(v) => { this.setData('latitude', v.latitude); this.setData('longitude', v.longitude) }} />
                    <SGFormFilePicker showFlag={'ID'} placeholder={'select pdf'} label={'File PDF'} fileType={[SGFilePicker.fileType.pdf]} maxSize={10 * 1024 * 1024} value={this.getData('uri')} onValueChange={(v) => { this.setData('uri', v) }} validator={this._data.getValidators('uri')} />
                    <SGFormImagePicker showFlag={'ID'} label={'Image List (Slider)'} maxImageCount={9} ratio={SGImagePicker.ratio.r9x9} imageFactor={1} value={this.getData('imageList')} onValueChange={(v) => { this.setData('imageList', v) }} validator={this._data.getValidators('imageList')} />
                    <SGFormImagePicker previewMode showFlag={'ID'} label={'Image List (Slider)'} maxImageCount={1} ratio={SGImagePicker.ratio.r9x9} imageFactor={1} value={this.getData('imageList')} onValueChange={(v) => { this.setData('imageList', v) }} validator={this._data.getValidators('imageList')} />
                    <SGFormButton showFlag={'ID'} data={this._data} label={'Simpan'} onPress={() => { alert('berhasil'); Core.log(JSON.stringify(this._data._current)) }} />
                </SGScrollView>
            </SGRootScrollView>
        );
    }
}