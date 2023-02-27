import React from 'react';
import { View, ScrollView } from 'react-native';
import { SGHelperGlobalVar, SGHelperNavigation } from '../../core/helper';
import { SGText as Text } from '../../core/control';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'react-native-blob-util';
import CryptoJS from 'crypto-js';

export class DemoVerificationScreen extends React.Component {
    hash(str, key) {
        var mac = CryptoJS.HmacSHA256(str, key);
        return (mac.toString());
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
    }
    onPressHandler() {
        var DeviceUniqueID = DeviceInfo.getUniqueId();
        var DeviceModel = DeviceInfo.getModel();
        RNFetchBlob.fetch('POST', 'https://www.spotgue.com/server.php', { devid: this.hash(DeviceUniqueID, 'paulus'), devmodel: DeviceModel })
            .then((res) => {
                // alert(JSON.stringify(res.json()));
                let rs = res.json();
                if (this.hash(DeviceModel, 'ananias') == rs.message) {
                    SGHelperNavigation.navigateReset(this.props.navigation, 'Splash');
                } else {
                    alert('Perangkat Anda belum teregistrasi, silakan mendaftarkan perangkat Anda ke Admin spotgue dengan kode perangkat: \n'+DeviceUniqueID);
                }
            }).catch((err) => { 
                alert('Terjadi kesalahan, silakan hubungi Admin MAG'); 
            })
    }
    render() {
        return (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-start', padding: 20 }}>
                <Text preset={Text.preset.h1} style={{ color: 'red' }}>Peringatan</Text>
                <Text preset={Text.preset.h4}>Aplikasi ini adalah properti intelektual milik PT Spotgue Aplikasi Pratama ("Spotgue") dan hanya diperuntukkan bagi kalangan terbatas untuk keperluan internal demo Spotgue.</Text>
                <Text preset={Text.preset.h4}>Dilarang mengkopi, memodifikasi, meniru, membongkar, menyebarkan, menjual, membajak, atau menggunakan aplikasi ini dan segala isinya tanpa persetujuan tertulis dari Spotgue.</Text>
                <Text preset={Text.preset.h4}>Segala bentuk pelanggaran dapat memiliki sanksi hukum.</Text>
                <Text preset={Text.preset.h4}>Content didalam aplikasi adalah dummy data dan gambar bersumber dari www.google.com dan hanya dipergunakan untuk keperluan testing internal.</Text>
                <Text preset={Text.preset.h2} style={{ color: 'blue' }} onPress={this.onPressHandler.bind(this)}>Lanjut</Text>
            </View>
        )
    }
}
