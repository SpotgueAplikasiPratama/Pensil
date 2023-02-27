/**
 * wrap react-native View component with 2 additional behavior
 * 1. ability to randomize background color based on global property 'UseRandomColor'
 * 2. apply default style and have preset to choose
 * 3. hidden true|false
 * 4. shadow true|false with prop shadowIntensity from 0.0 to 1.0
 * 5. onComplete(link) event
 */

 import React from 'react';
 import { View, StyleSheet, Platform, Alert, Share, PermissionsAndroid } from 'react-native';
 import { SGHelperGlobalVar } from '../helper/SGHelperGlobalVar';
 import { SGHelperStyle } from '../helper/SGHelperStyle';
 import { SGHelperType } from '../helper/SGHelperType';
 import { SGBaseControl } from './SGBaseControl';
 import { SGDialogBox } from './SGDialogBox';
 import ViewShot from "react-native-view-shot";
 import CameraRoll from '@react-native-camera-roll/camera-roll';
 import RNFetchBlob from 'react-native-blob-util';
 import { tbCImageUploadAPI } from '../../core/api/tbCImageUploadAPI';
 
 export class SGViewShot extends SGBaseControl {
     getPermissionAndroid = async () => {
         try {
             const granted = await PermissionsAndroid.request(
                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                 {
                     title: 'Image Download Permission',
                     message: 'Your permission is required to save images to your device',
                     buttonNegative: 'Cancel',
                     buttonPositive: 'OK',
                 },
             );
             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                 return true;
             }
             Alert.alert(
                 'Save remote Image',
                 'Grant Me Permission to save Image',
                 [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                 { cancelable: false },
             );
         } catch (err) {
             Alert.alert(
                 'Save remote Image',
                 'Failed to save Image: ' + err.message,
                 [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                 { cancelable: false },
             );
         }
     };
 
     async uploadImage(path, callbackSuccess, callbackError) {
         var imageJSON = {};
         var xhr = new XMLHttpRequest();
         xhr.open("GET", path, true);
         xhr.responseType = "blob";
         xhr.onerror = async function (e) { callbackError(e); }
         xhr.onload = async function (e) {
             var reader = new FileReader();
             reader.onload = async function (event) {
                 var res = event.target.result;
                 var base64 = res.replace(/^data:image\/[a-z]+;base64,/, "");
                //  imageJSON = await tbCImageUploadAPI.uploadImage(base64);
                 imageJSON = await tbCImageUploadAPI.UploadImageFreeRatio(base64);
                 console.log('xx');
                 console.log(imageJSON);
                 callbackSuccess(imageJSON);
             }
             var file = this.response;
             reader.readAsDataURL(file)
         }
         xhr.send();
     }
 
     async onYesUploadHandler(flagDownload, onFinishUpload = (img) => { }) {
         this._DBID = SGDialogBox.showLoading('Loading');
         await this.uploadImage(
             this.state.url,
             (res) => {
                 if (flagDownload) {
                     this.handleDownload(res);
                 }
                 onFinishUpload(res);
             },
             (e) => { SGDialogBox.hideDialogBox(this._DBID);});
     }
 
     handleDownload = async (image) => {
         // if device is android you have to ensure you have permission
         if (Platform.OS === 'android') {
             const granted = await this.getPermissionAndroid();
             if (!granted) {
                 return;
             }
         }
         this.setState({ saving: true });
         console.log('aa');
         console.log(image);
         RNFetchBlob.config({
             fileCache: true,
             appendExt: 'png',
         })
             .fetch('GET', image.high.uri)
             .then(res => {
                 CameraRoll.save(res.data, 'photo')
                     .then(() => {
                         SGDialogBox.hideDialogBox(this._DBID);
                         Alert.alert(
                             'Save remote Image',
                             'Image Saved Successfully',
                             [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                             { cancelable: false },
                         );
                     })
                     .catch(err => {
                         SGDialogBox.hideDialogBox(this._DBID);
                         Alert.alert(
                             'Save remote Image',
                             'Failed to save Image: ' + err.message,
                             [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                             { cancelable: false },
                         );
                     })
                     .finally(() => this.setState({ saving: false }));
             })
             .catch(error => {
                 this.setState({ saving: false });
                 SGDialogBox.hideDialogBox(this._DBID);
                 Alert.alert(
                     'Save remote Image',
                     'Failed to save Image: ' + error.message,
                     [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                     { cancelable: false },
                 );
             });
     };
 
     async _onCapture(flagDownload, onFinishUpload = (img) => { }) {
         var uri = await this.captureRef.current.capture()
         this.setState({ url: uri });
         await this.onYesUploadHandler(flagDownload, onFinishUpload);
     }
 
     async Save(){
         await this._onCapture(true, (imageJSON)=>{
             if(this.props.onComplete){
                 this.props.onComplete(imageJSON);
             }
         });        
     }
 
     async Share() {
         await this._onCapture(false, (imageJSON) => {
             SGDialogBox.hideDialogBox(this._DBID);
             setTimeout(() => {
                 Share.share({
                     subject: 'MAG Share!',
                     title: 'Share MAG!',
                     message: 'Check this image out, \n' + imageJSON.high.uri,
                 }, {
                     // Android only:
                     dialogTitle: 'Share',
                     // iOS only:
                 });
                 if(this.props.onComplete){
                     this.props.onComplete(imageJSON);
                 }
                 }, 300);
         });
     }
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this.captureRef = React.createRef();
         this.state = {
             url :'',
             saving: false,
           };
     }
 
     render() {
         return (
             <ViewShot ref={this.captureRef} options={this.props.options}>{this.props.children}</ViewShot>
         );
     }
 }