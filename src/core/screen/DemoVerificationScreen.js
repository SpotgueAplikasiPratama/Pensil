import React from 'react';
import { View, ScrollView, Text, Dimensions, Linking } from 'react-native';
import { SGHelperGlobalVar, SGHelperNavigation } from '../helper';
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

    componentDidMount() {
        Linking.getInitialURL().then((u) => {
            console.log(u)
            if (u !== null) {
                this._navigateFromDeeplink(u);
            }
        });
    }

    _navigateFromDeeplink(u) {
        var DeviceUniqueID = DeviceInfo.getUniqueId();
        var DeviceModel = DeviceInfo.getModel();
        RNFetchBlob.fetch('POST', 'https://www.spotgue.com/server.php', { devid: this.hash(DeviceUniqueID, 'paulus'), devmodel: DeviceModel })
            .then((res) => {
                // alert(JSON.stringify(res.json()));
                let rs = res.json();
                if (this.hash(DeviceModel, 'ananias') == rs.message) {
                    SGHelperGlobalVar.addVar('deepLinkingURL', u)
                    console.log(u)
                    SGHelperNavigation.navigateReset(this.props.navigation, 'RootMenu');
                } else {
                    alert('Perangkat Anda belum teregistrasi, silakan mendaftarkan perangkat Anda ke Admin spotgue dengan kode perangkat: \n' + DeviceUniqueID);
                }
            }).catch((err) => {
                alert('Terjadi kesalahan, silakan hubungi Admin MAG');
            })
    }

    onPressHandler() {
        var DeviceUniqueID = DeviceInfo.getUniqueId();
        var DeviceModel = DeviceInfo.getModel();
        RNFetchBlob.fetch('POST', 'https://www.spotgue.com/server.php', { devid: this.hash(DeviceUniqueID, 'paulus'), devmodel: DeviceModel })
            .then((res) => {
                // alert(JSON.stringify(res.json()));
                let rs = res.json();
                if (this.hash(DeviceModel, 'ananias') == rs.message) {
                    SGHelperNavigation.navigateReset(this.props.navigation, 'RootMenu');
                } else {
                    alert('Perangkat Anda belum teregistrasi, silakan mendaftarkan perangkat Anda ke Admin spotgue dengan kode perangkat: \n' + DeviceUniqueID);
                }
            }).catch((err) => {
                alert('Terjadi kesalahan, silakan hubungi Admin Spotgue');
            })
    }
    render() {
        var w = Dimensions.get('screen').width;
        return (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-start', padding: 20 }}>
                <Text style={{ fontSize: w * 0.07, lineHeight: w * 0.08, color: 'red' }}>Peringatan</Text>
                <Text style={{ fontSize: w * 0.035, lineHeight: w * 0.045, marginTop: w * 0.01 }}>Aplikasi ini adalah properti intelektual milik PT Spotgue Aplikasi Pratama ("Spotgue") dan hanya diperuntukkan bagi kalangan terbatas untuk keperluan internal demo Spotgue.</Text>
                <Text style={{ fontSize: w * 0.035, lineHeight: w * 0.045, marginTop: w * 0.01 }}>Dilarang mengkopi, memodifikasi, meniru, membongkar, menyebarkan, menjual, membajak, atau menggunakan aplikasi ini dan segala isinya tanpa persetujuan tertulis dari Spotgue.</Text>
                <Text style={{ fontSize: w * 0.035, lineHeight: w * 0.045, marginTop: w * 0.01 }}>Segala bentuk pelanggaran dapat memiliki sanksi hukum.</Text>
                <Text style={{ fontSize: w * 0.035, lineHeight: w * 0.045, marginTop: w * 0.01 }}>Content didalam aplikasi adalah dummy data dan gambar bersumber dari www.google.com dan hanya dipergunakan untuk keperluan testing internal.</Text>
                <Text style={{ fontSize: w * 0.045, lineHeight: w * 0.055, marginTop: w * 0.01, color: 'blue' }} onPress={this.onPressHandler.bind(this)}>Lanjut >></Text>
            </View>
        )
    }
}
