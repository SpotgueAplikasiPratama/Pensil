import React from 'react';
import Core from '../../core/core';

export default class Lesson14Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const {StyleSheet} = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
    });
  }

  constructor(props, context, ...args) {
    Core.log('constructor');
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    this._darkMode = false;
    this._pvID1 = Core.Control.SGPopView.getPopViewID();
}

  render() {
    Core.log('render')
    const {SGRootScrollView, SGDialogBox, SGView, SGButton, SGPopView, SGTextInput } = Core.Control;
    var style = this.style;
    var {w,h,p} =this.WHP;
    return (
      <SGRootScrollView style={{width:w, backgroundColor:'white'}}>
        <SGButton label={'Toggle Dark Mode'} onPress={()=>{this._darkMode=!this._darkMode; this.forceUpdate();}} />
        <SGView style={{ alignSelf: 'stretch', flex: 1, backgroundColor: this._darkMode ? 'black' : 'white' }}>
            <SGButton label={'showSuccess'}
                onPress={() => { SGDialogBox.showSuccess(null, 'Berhasil', 'Dialog box berhasil ditampilkan', 'OK', () => { Core.log('OK') }) }} />
            <SGButton label={'showFail'}
                onPress={() => { SGDialogBox.showFail(null, 'Gagal', 'Gagal menyimpan file', 'Tutup', () => { Core.log('Tutup') }) }} />
            <SGButton label={'showConfirmation'}
                onPress={() => { SGDialogBox.showConfirmation(null, 'Konfirmasi', 'Anda yakin melakukan reset smartphone ini?', 'Tidak', () => { Core.log('Tidak') }, 'Ya', () => { Core.log('Ya') }) }} />
            <SGButton label={'showAction'}
                onPress={() => { SGDialogBox.showAction(null, 'Fitur Terbatas', 'Fitur yang Anda inginkan hanya tersedia bagi user terdaftar yang sudah melakukan login', 'Daftar', () => { Core.log('Tidak') }, 'Login', () => { Core.log('Ya') }) }} />
            <SGButton label={'showInputBox'}
                onPress={() => { SGDialogBox.showInputBox(null, 'Nama', 'Masukkan nama Anda', SGTextInput.dataType.text, (v) => { Core.log(v) }, false, 'Batal', () => { Core.log('Batal') }, 'OK', () => { Core.log('OK') }, true, 'test') }} />
            <SGButton label={'showPickerBox'}
                onPress={() => { SGDialogBox.showPickerBox(null, 'Plat Number', 'Masukkan plat number kendaraan Anda', true, true, [{ key: 'P001', title: 'B1234A' }, { key: 'P002', title: 'B4321A' }], (v) => { Core.log(v) }, false, 'Batal', () => { Core.log('Batal') }, 'OK', () => { Core.log('OK') }, true, 'P002') }} />
            <SGButton label={'showLoading'}
                onPress={() => { this.dBID2 = SGDialogBox.showLoading('processing'); setTimeout(() => { SGDialogBox.hideDialogBox(this.dBID2); SGDialogBox.showSuccess(null, 'AA', 'AA aaa', 'OK', () => { }) }, 3000); }} />
            <SGButton label={'showProgress'}
                onPress={() => {
                    this.dBID2 = SGDialogBox.showProgress('processing');
                    this._progressCounter = 0;
                    this._tempTimerID = setInterval(() => {
                        this._progressCounter++;
                        if (this._progressCounter < 10) {
                            SGDialogBox.updateProgress(this._progressCounter * 10);
                        } else {
                            clearInterval(this._tempTimerID);
                            SGDialogBox.hideDialogBox(this.dBID2);
                        }
                    }, 1000);
                }} />
            <SGButton label={'showPopUp'}
                onPress={() => { SGPopView.showPopView(this._pvID1) }} />
            <SGPopView popViewID={this._pvID1}>
                <SGView style={{ width: 350, height: 350, backgroundColor: 'orange' }}>
                    <SGButton label={'showSuccess'}
                        onPress={() => { SGDialogBox.showSuccess(null, 'Berhasil', 'Dialog box berhasil ditampilkan', 'OK', () => { Core.log('OK') }) }} />
                </SGView>
            </SGPopView>
            <SGDialogBox dialogBoxID={this._dbID} />
        </SGView>
      </SGRootScrollView>
    );
  }
}