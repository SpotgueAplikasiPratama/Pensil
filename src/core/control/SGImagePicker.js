/**
 * 
 * Version 1.4.2
 * GH Version 14 july 2021
 * - Updated new Component
 *
 * Changing By Melvin
 * Fix Style Tocuhable and Modal in Uploaded file in 30 June 2021
 * Change Log By Melvin, 15 April 2021
 * Add Paging on Folder Uploded Images
 * 
 * 
 * Custom Component to select image
 * 1. user can select image from
 *    a. camera with crop
 *    b. gallery upload with crop
 *    c. server folder list for particular mall/store
 * 2. ratio prop : '16:9' | '9:9' | '9:16'
 *    Server will keep 3 version (low 480p, med 720p, high 1080p res, thumbnailLow 160p, thumbnailMed 240p, thumbnailHigh 360p)
 * 3. imageFactor prop : in percent of screen width
 * 4. maxImageCount prop : how many image can be selected at max
 * 5. default style and user can customize
 * 6. display image thumbnail and plus button to add.  Thumbnail have delete button to remove image
 * 7. when image thumbnail or plus button click, load the detail in pop up view
 *    a. picker button : camera, gallery, server
 *    b. text description
 *    c. text position alignment (picker)
 *    d. preview image via slider (hi, med, low res with text)
 * 8. hidden: true|false
 * 9. disabled: true|false
 * 10. shadow : true|false with shadowIntensity
 * 11. value prop as array of JSON : 
       [{high:{uri:x,width:w,height:h},med:{uri:x,width:w,height:h},low:{uri:x,width:w,height:h},
        thumbnailHigh:{uri:x,width:w,height:h},thumbnailMed:{uri:x,width:w,height:h},thumbnailLow:{uri:x,width:w,height:h},
        text:t, textPosition:p}]
 * 12. onValueChange pass array of JSON 
       [{high:{uri:x,width:w,height:h},med:{uri:x,width:w,height:h},low:{uri:x,width:w,height:h},
        thumbnailHigh:{uri:x,width:w,height:h},thumbnailMed:{uri:x,width:w,height:h},thumbnailLow:{uri:x,width:w,height:h},
        text:t, textPosition:p}]
 * 13. after terapkan, if from camera/gallery upload the image to server, display the progress bar, once done trigger onValueChange which return the data object
 * 14. props hideText to hide text description and text position 
 * 15. props pngTransparent will use document picker
 */

        import React from 'react';
        import { SGImagePicker as labels } from '../locale/lang.json';
        import { SGFilePicker as labelsFilePicker } from '../locale/lang.json';
        import { Platform, StyleSheet, NativeModules, PermissionsAndroid,RefreshControl } from 'react-native';
        import { SGView } from './SGView';
        import { SGImage } from './SGImage';
        import { SGImageButton } from './SGImageButton';
        import { SGText } from './SGText';
        import { SGPopView } from './SGPopView';
        import { SGIconButton } from './SGIconButton';
        import { SGScrollView } from './SGScrollView';
        import { SGBaseControl } from './SGBaseControl';
        import { SGTextInput } from './SGTextInput';
        import { SGPicker } from './SGPicker';
        import { SGTabView } from './SGTabView';
        import { SGButton } from './SGButton';
        import { SGDialogBox } from './SGDialogBox';
        import {SGFlatList} from './SGFlatList';
        import { SGActivityIndicator } from './SGActivityIndicator';
        import { SGHelperType, SGHelperStyle, SGHelperWindow, SGHelperMsgBox, SGHelperFileMgr,SGHelperGlobalVar,SGHelperErrorHandling } from '../helper'
        import { SGIcon } from './SGIcon';
        import RNFetchBlob from 'react-native-blob-util';
        const ImagePicker = NativeModules.ImageCropPicker;
        const fileReader = new FileReader();
        import ImageResizer from 'react-native-image-resizer';
        import { tbCImageUploadAPI } from '../api/tbCImageUploadAPI';
        import { SGTouchableOpacity } from '.';
        import DocumentPicker from 'react-native-document-picker';
        import RNFS from 'react-native-fs';
        
        export class SGImagePicker extends SGBaseControl {
            static ratio = {
                r16x9: 'r16x9',
                r9x9: 'r9x9',
                r9x16: 'r9x16',
            }
            static _hRatio = {
                r16x9: 9 / 16,
                r9x9: 1,
                r9x16: 16 / 9,
            }
            static _imageMaxWidth = {
                high: 1080, med: 720, low: 480, thumbnailHigh: 360, thumbnailMed: 240, thumbnailLow: 160,
            }
            static textPos = {
                topLeft: 'topLeft',
                topMid: 'topMid',
                topRight: 'topRight',
                centerLeft: 'centerLeft',
                centerMid: 'centerMid',
                centerRight: 'centerRight',
                bottomLeft: 'bottomLeft',
                bottomMid: 'bottomMid',
                bottomRight: 'bottomRight',
            }
        
            static fileType = {
                image: DocumentPicker.types.images,
                pdf: DocumentPicker.types.pdf,
                all: DocumentPicker.types.allFiles,
            }
        
            getPagingData(){
                var itemPerPage = SGHelperType.getPaging()
                return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
            }
        
            getNewBlankImageData() {
                return {
                    id: '',
                    high: { uri: '', width: 0, height: 0 },
                    med: { uri: '', width: 0, height: 0 },
                    low: { uri: '', width: 0, height: 0 },
                    thumbnailHigh: { uri: '', width: 0, height: 0 },
                    thumbnailMed: { uri: '', width: 0, height: 0 },
                    thumbnailLow: { uri: '', width: 0, height: 0 },
                    text: '',
                    textPosition: SGImagePicker.textPos.topLeft,
                };
            }
            getTextPositionList() {
                var arr = [];
                var lang = this._lang;
                var keys = Object.keys(SGImagePicker.textPos);
                for (var i = 0; i < keys.length; i++) {
                    arr.push({ key: keys[i], title: this.labels[lang][keys[i]] })
                }
                return arr;
            }
            getImageContentAlignment(textPos) {
                switch (textPos) {
                    case SGImagePicker.textPos.topLeft:
                        return ({ img: { justifyContent: 'flex-start', alignItems: 'flex-start' }, txt: { textAlign: 'left' } });
                        break;
                    case SGImagePicker.textPos.topMid:
                        return ({ img: { justifyContent: 'flex-start', alignItems: 'center' }, txt: { textAlign: 'center' } });
                        break;
                    case SGImagePicker.textPos.topRight:
                        return ({ img: { justifyContent: 'flex-start', alignItems: 'flex-end' }, txt: { textAlign: 'right' } });
                        break;
                    case SGImagePicker.textPos.centerLeft:
                        return ({ img: { justifyContent: 'center', alignItems: 'flex-start' }, txt: { textAlign: 'left' } });
                        break;
                    case SGImagePicker.textPos.centerMid:
                        return ({ img: { justifyContent: 'center', alignItems: 'center' }, txt: { textAlign: 'center' } });
                        break;
                    case SGImagePicker.textPos.centerRight:
                        return ({ img: { justifyContent: 'center', alignItems: 'flex-end' }, txt: { textAlign: 'right' } });
                        break;
                    case SGImagePicker.textPos.bottomLeft:
                        return ({ img: { justifyContent: 'flex-end', alignItems: 'flex-start' }, txt: { textAlign: 'left' } });
                        break;
                    case SGImagePicker.textPos.bottomMid:
                        return ({ img: { justifyContent: 'flex-end', alignItems: 'center' }, txt: { textAlign: 'center' } });
                        break;
                    case SGImagePicker.textPos.bottomRight:
                        return ({ img: { justifyContent: 'flex-end', alignItems: 'flex-end' }, txt: { textAlign: 'right' } });
                        break;
                }
            }
            onImagePressHandler(index) {
                this._tempImageData = this._value[index];
                this._mode = (this.props.disabled ? 'VIEW' : 'EDIT');
                super.mySetState({});
                SGPopView.showPopView(this.pvID);
            }
        
            onDeleteImageHandler(index) {
                SGDialogBox.showConfirmation(null, this.labels[this._lang].confirmationTitle,
                    this.labels[this._lang].confirmationMessage,
                    this.labels[this._lang].no, () => { },
                    this.labels[this._lang].yes, () => {
                        this._value.splice(index, 1);
                        if (this.props.onValueChange) {
                            this.props.onValueChange(this._value)
                        }
                        if (!this.props.stateless) { super.mySetState({}); }
                    }
                );
            }
            onAddImageHandler() {
                if (this._value.length < this._maxImageCount) {
                    this._mode = 'ADD';
                    this._tempImageData = this.getNewBlankImageData();
                    this._value.push(this._tempImageData);
                    if (this.props.onValueChange) { this.props.onValueChange(this._value) }
                    if (!this.props.stateless) { super.mySetState({}); }
                    SGPopView.showPopView(this.pvID);
                }
            }
            //1. open camera
            //2. when user take picture -> copy to internal folder
            //3. ask user, are you sure want to upload this image (show with preview and yes no)
            //4. if user said no. close window
            //5. if user said yes. 
            //   a. final version: upload to server and wait server to return JSON with 6 URL (uri, width, height)
            //   b. temp version: create function to resize the image into 6 size and copy to internal folder using GUID naming and return similar JSON with server version
            //6. display the image in the preview section
            onCameraHandler() {
                var r = this._heightRatio;
                var f = this._imageFactor;
                var w = SGImagePicker._imageMaxWidth.high * f;
                var h = w * r;
                ImagePicker.openCamera({
                    cropping: true,
                    width: w,
                    height: h,
                    includeExif: true,
                    mediaType: 'photo',
                    compressImageQuality: 1,
                }).then(image => {
                    this._tempImageJSON = { uri: image.path, width: w, height: h };
                    super.mySetState({});
                    SGPopView.showPopView(this.pvID2);
                }).catch(e => { console.log(e) });
            }
        
        
            onGalleryHandler() {
                var r = this._heightRatio;
                var f = this._imageFactor;
                var w = SGImagePicker._imageMaxWidth.high * f;
                var h = w * r;
                ImagePicker.openPicker({
                    cropping: true,
                    width: w,
                    height: h,
                    includeExif: true,
                    mediaType: 'photo',
                    compressImageQuality: 1,
                }).then(image => {
                    this._tempImageJSON = { uri: image.path, width: w, height: h };
                    super.mySetState({});
                    SGPopView.showPopView(this.pvID2);
                }).catch(e => { console.log(e) });
            }
        
        
            async onUploadFolderHandler() {
        
                this.pagingCounter= 0
                this.paging = this.getPagingData()
                try {
                    this._dataFolderImages = await tbCImageUploadAPI.searchImages([], [{ name: 'fLastModifiedDate', descending: true, selected: true, visible: true }], this.paging);
                    this.pagingCounter = this._dataFolderImages.length
                    SGPopView.showPopView(this.pvID3);
                    this.alreadyMount = true;
                    this.refresh = false;
                    this.forceUpdate();
                } catch (error) {
                    SGHelperErrorHandling.Handling(error,this.onUploadFolderHandler.bind(this))
                }
            }
        
            async _onRefreshImage() {
                try{
                this.stopPulling = true;
                if(!this.refresh && !this.loading){
                    this.refresh= true
                    this.refreshFlatList = true;
                    this.pagingCounter = 0
                    this.paging = this.getPagingData()
                    this._dataFolderImages = await tbCImageUploadAPI.searchImages([], [{ name: 'fLastModifiedDate', descending: true, selected: true, visible: true }], this.paging);
                    this.pagingCounter = this._dataFolderImages.length
                    if(this._dataFolderImages.length<SGHelperType.getPaging()) this.stopPulling = true
                    else  this.stopPulling = false
                    this.refresh=false
                    this.refreshFlatList = false
                    this.forceUpdate()
                    
                }
                }catch (error) {
                    SGHelperErrorHandling.Handling(error,this._onRefreshImage.bind(this))
                }
            }
        
            async _onLoad(){
                try{
        
                    if(!this.loading && !this.stopPulling){
                        
                        this.loading = true;
                        this.forceUpdate();
                        this.paging = this.getPagingData()
                        
                        var resData = await tbCImageUploadAPI.searchImages([], [{ name: 'fLastModifiedDate', descending: true, selected: true, visible: true }], this.paging);
                            if(resData.length!==0){
                                for(var i=0;i<resData.length;i++){
                                    this._dataFolderImages.push(resData[i])
                                }
                                this.pagingCounter = this.pagingCounter + resData.length
                                
                            }else this.stopPulling = true
                            this.loading = false
                            this.forceUpdate();
                    }
                }catch (error) {
                    SGHelperErrorHandling.Handling(error,this._onLoad.bind(this))
                }
            }
        
            onImageFolderPress(linkImage) {
                this.imagepressed = linkImage;
                console.log(linkImage)
                this.onDownloadHandler(linkImage);
        
            }
        
            onDownloadHandler(downloadLink) {
                var URL = downloadLink;
                var arrStr = URL.split('/');
                var fName = arrStr[arrStr.length - 1];
                var options = {};
                var dir = SGHelperFileMgr.getDownloadDir();
                var r = this._heightRatio;
                var f = this._imageFactor;
                var w = SGImagePicker._imageMaxWidth.high * f;
                var h = w * r; 
                this._DBID = SGDialogBox.showLoading(this.labels[this._lang].downloading);
                if (Platform.OS === 'android') {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((granted) => {
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            RNFetchBlob.fetch('GET', URL).progress((received, total) => {
                            }).then((res) => {
                                
                                // do some magic here
                                this.respath = res.path();
                                //cropping here
                                ImagePicker.openCropper({
                                    path: URL,
                                    width: w,
                                    height: h,
                                }).then(image => {
                                    console.log('received cropped image', image);
                                    this._tempImageJSON = { uri: image.path, width: image.width, height: image.height };
                                    console.log(this._tempImageData);
                                    SGDialogBox.hideDialogBox(this._DBID,true);
                                    super.mySetState({});
                                    
                                    setTimeout(() => { SGPopView.showPopView(this.pvID4); }, 300); 
                                }).catch(e => {
                                    SGDialogBox.hideDialogBox(this._DBID,true);
                                    console.log(e);
                                });
                            })
                        }
                    });
                } else {
                    options = {
                        fileCache: true,
                        path: dir + '/' + fName,
                    };
                    RNFetchBlob.config(options).fetch('GET', URL).progress((received, total) => {
                        console.log('progress', received / total)
                    }).then((res) => {
                        
                        // do some magic here
                        this.respath = res.path();
                        //cropping here
                        ImagePicker.openCropper({
                            path: URL,
                            width: w,
                            height: h,
                        }).then(image => {
                            console.log('received cropped image', image);
                            this._tempImageJSON = { uri: image.path, width: image.width, height: image.height };
                            console.log(this._tempImageData);
                            SGDialogBox.hideDialogBox(this._DBID,true);
                            super.mySetState({});
                            setTimeout(() => { SGPopView.showPopView(this.pvID4); }, 300); 
                        }).catch(e => {
                            SGDialogBox.hideDialogBox(this._DBID,true);
                            console.log(e);
                        });
                    })
                }
            }
        
            async onYesUploadHandler() {
                this._DBID = SGDialogBox.showLoading(this.labels[this._lang].uploading);
                this.uploadImage(
                    this._tempImageJSON.uri,
                    (res) => {
                        this._tempImageData.id = res.id;
                        this._tempImageData.high = res.high;
                        this._tempImageData.med = res.med;
                        this._tempImageData.low = res.low;
                        this._tempImageData.thumbnailHigh = res.thumbnailHigh;
                        this._tempImageData.thumbnailMed = res.thumbnailMed;
                        this._tempImageData.thumbnailLow = res.thumbnailLow;
                        if (this.props.onValueChange) { this.props.onValueChange(this._value) }
                        if (!this.props.stateless) { super.mySetState({}); }
                        SGDialogBox.hideDialogBox(this._DBID);
                        SGPopView.hidePopView(this.pvID2);
                        if(this.props.noreview)setTimeout(() => {   SGPopView.hidePopView(this.pvID); }, 300); 
                        ImagePicker.cleanSingle(this._tempImageJSON.uri).then(() => { console.log('image cleaned') }).catch((e) => { console.log(e) });
                    },
                    (e) => {
                        SGDialogBox.hideDialogBox(this._DBID);
                        SGPopView.hidePopView(this.pvID2);
                    });
            }
        
            async onYesUploadHandlerFolder() {
                this._DBID = SGDialogBox.showLoading(this.labels[this._lang].uploading);
                this.uploadImage(
                    this._tempImageJSON.uri,
                    (res) => {
                        console.log('res sg image');
                        console.log(res);
                        this._tempImageData.id = res.id;
                        this._tempImageData.high = res.high;
                        this._tempImageData.med = res.med;
                        this._tempImageData.low = res.low;
                        this._tempImageData.thumbnailHigh = res.thumbnailHigh;
                        this._tempImageData.thumbnailMed = res.thumbnailMed;
                        this._tempImageData.thumbnailLow = res.thumbnailLow;
        
                        console.log(this._tempImageData);
                        if (this.props.onValueChange) { this.props.onValueChange(this._value) }
                        if (!this.props.stateless) { super.mySetState({}); }
                        SGDialogBox.hideDialogBox(this._DBID);
                        SGPopView.hidePopView(this.pvID4);
                        SGPopView.hidePopView(this.pvID3);
                        if(this.props.noreview)setTimeout(() => {   SGPopView.hidePopView(this.pvID); }, 300); 
                        ImagePicker.cleanSingle(this._tempImageJSON.uri).then(() => { console.log('image cleaned') }).catch((e) => { console.log(e) });
                    },
                    (e) => {
                        SGDialogBox.hideDialogBox(this._DBID);
                        SGPopView.hidePopView(this.pvID4);
                    });
            }
        
            onNoUploadHandler() {
                SGPopView.hidePopView(this.pvID2);
                ImagePicker.cleanSingle(this._tempImageJSON.uri).then(() => { console.log('image cleaned') }).catch((e) => { console.log(e) });
            }
        
            onNoUploadHandlerFolder() {
                SGPopView.hidePopView(this.pvID4);
                ImagePicker.cleanSingle(this._tempImageJSON.uri).then(() => { console.log('image cleaned') }).catch((e) => { console.log(e) });
            }
        
        
            async onYesUploadTransparentImage() {
                this._DBID = SGDialogBox.showLoading(this.labels[this._lang].uploading);
                this.uploadImage(
                    this._tempImageJSON.uri,
                    (res) => {
                        this._tempImageData.id = res.id;
                        this._tempImageData.high = res.high;
                        this._tempImageData.med = res.med;
                        this._tempImageData.low = res.low;
                        this._tempImageData.thumbnailHigh = res.thumbnailHigh;
                        this._tempImageData.thumbnailMed = res.thumbnailMed;
                        this._tempImageData.thumbnailLow = res.thumbnailLow;
                        if (this.props.onValueChange) { this.props.onValueChange(this._value) }
                        if (!this.props.stateless) { super.mySetState({}); }
                        SGDialogBox.hideDialogBox(this._DBID);
                        SGPopView.hidePopView(this.pvID2);
                    },
                    (e) => {
                        SGDialogBox.hideDialogBox(this._DBID);
                        SGPopView.hidePopView(this.pvID2);
                    });
            }
        
            async pickSingle() {
                try {
                    const _res = await DocumentPicker.pick({ type: [SGImagePicker.fileType.image], });
                    const res = Array.isArray(_res)?_res[0]:_res;
                    var maxSize = SGHelperType.isDefined(this.props.maxSize) ? this.props.maxSize : 8 * 1024 * 1024;
                    var maxSizeLabel = (maxSize >= 1024 * 1024 ? Math.floor(maxSize / 1024 / 1024 * 10) / 10.0 + 'MB' : Math.floor(maxSize / 1024 * 10) / 10.0 + 'KB');
                    if (res.size <= maxSize) {
                        this._DBID = SGDialogBox.showLoading(this.labels[this._lang].uploading);
                        var arr = res.name.split('.');
                        var ext = arr[arr.length - 1];
                        var newName = SGHelperType.getGUID() + '.' + ext;
                        this._newPath = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.MainBundleDir : RNFetchBlob.fs.dirs.DocumentDir) + '/' + newName;
                        if (Platform.OS === 'ios') {
                            var uri = decodeURIComponent(res.uri);
                            var str = (SGHelperType.left(uri, 6) === 'file:/') ? SGHelperType.right(uri, uri.length - 7) : uri;
                            RNFetchBlob.fs.stat(str).then((v) => {
                                this._srcPath = v.path;
                                RNFetchBlob.fs.cp(this._srcPath, this._newPath)
                                    .then(() => {
                                        SGDialogBox.hideDialogBox(this._DBID);
                                        // Upload Image
                                        console.log('upload image transparent')
                                        var r = this._heightRatio;
                                        var f = this._imageFactor;
                                        var w = SGImagePicker._imageMaxWidth.high * f;
                                        var h = w * r;
                                        this._tempImageJSON = { uri: this._newPath, width: w, height: h };
                                        super.mySetState({});
                                        SGPopView.showPopView(this.pvID2);
                                    }).catch((e) => {
                                        SGDialogBox.hideDialogBox(this._DBID);
                                        SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => { });
                                        console.log(e);
                                    });
                            }).catch((e) => {
                                SGDialogBox.hideDialogBox(this._DBID);
                                SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => { });
                                console.log(e);
                            });
                        } else {
                            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((granted) => {
                                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((granted) => {
                                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                            RNFS.copyFile(res.uri, this._newPath).then((response) => {
                                                this._newPath = 'file://'+this._newPath;
                                                SGDialogBox.hideDialogBox(this._DBID);
                                                //Upload Image
                                                console.log('upload image transparent')
                                                var r = this._heightRatio;
                                                var f = this._imageFactor;
                                                var w = SGImagePicker._imageMaxWidth.high * f;
                                                var h = w * r;
                                                this._tempImageJSON = { uri: this._newPath, width: w, height: h };
                                                super.mySetState({});
                                                SGPopView.showPopView(this.pvID2);
                                            }).catch((e) => {
                                                SGDialogBox.hideDialogBox(this._DBID);
                                                SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => { });
                                                console.log(e);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorSize + maxSizeLabel, this.labels[this._lang].close, () => { });
                    }
                } catch (err) {
                    if (DocumentPicker.isCancel(err)) {
                        // User cancelled the picker, exit any dialogs or menus and move on
                    } else {
                        SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => {
                        });
                    }
                }
            }
        
        
            //NO LONGER USED
            /*
            async dummyUploadImage(path, w, h) {
                var factor = 1;
                var result = {}
                //resize high
                var newPath = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.MainBundleDir : RNFetchBlob.fs.dirs.DocumentDir);
                await ImageResizer.createResizedImage(path, w * factor, h * factor, 'PNG', 100, 0, newPath).then((res) => {
                    result.high = { uri: res.uri, width: w * factor, height: h * factor };
                }).catch(e => { console.log(e) })
                //resize med
                factor = SGImagePicker._imageMaxWidth.med / SGImagePicker._imageMaxWidth.high;
                newPath = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.MainBundleDir : RNFetchBlob.fs.dirs.DocumentDir);
                await ImageResizer.createResizedImage(path, w * factor, h * factor, 'PNG', 100, 0, newPath).then((res) => {
                    result.med = { uri: res.uri, width: w * factor, height: h * factor };
                }).catch(e => { console.log(e) })
                //resize low
                factor = SGImagePicker._imageMaxWidth.low / SGImagePicker._imageMaxWidth.high;
                newPath = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.MainBundleDir : RNFetchBlob.fs.dirs.DocumentDir);
                await ImageResizer.createResizedImage(path, w * factor, h * factor, 'PNG', 100, 0, newPath).then((res) => {
                    result.low = { uri: res.uri, width: w * factor, height: h * factor };
                }).catch(e => { console.log(e) })
                //resize thumbnailHigh
                factor = SGImagePicker._imageMaxWidth.thumbnailHigh / SGImagePicker._imageMaxWidth.high;
                newPath = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.MainBundleDir : RNFetchBlob.fs.dirs.DocumentDir);
                await ImageResizer.createResizedImage(path, w * factor, h * factor, 'PNG', 100, 0, newPath).then((res) => {
                    result.thumbnailHigh = { uri: res.uri, width: w * factor, height: h * factor };
                }).catch(e => { console.log(e) })
                //resize thumbnailMed
                factor = SGImagePicker._imageMaxWidth.thumbnailMed / SGImagePicker._imageMaxWidth.high;
                newPath = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.MainBundleDir : RNFetchBlob.fs.dirs.DocumentDir);
                await ImageResizer.createResizedImage(path, w * factor, h * factor, 'PNG', 100, 0, newPath).then((res) => {
                    result.thumbnailMed = { uri: res.uri, width: w * factor, height: h * factor };
                }).catch(e => { console.log(e) })
                //resize thumbnailLow
                factor = SGImagePicker._imageMaxWidth.thumbnailLow / SGImagePicker._imageMaxWidth.high;
                newPath = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.MainBundleDir : RNFetchBlob.fs.dirs.DocumentDir);
                await ImageResizer.createResizedImage(path, w * factor, h * factor, 'PNG', 100, 0, newPath).then((res) => {
                    result.thumbnailLow = { uri: res.uri, width: w * factor, height: h * factor };
                }).catch(e => { console.log(e) })
                return result;
            }
            */
        
            async uploadImage(path, callbackSuccess, callbackError) {
                var imageJSON = {};
                var xhr = new XMLHttpRequest();
                xhr.open("GET", path, true);
                xhr.responseType = "blob";
                xhr.onerror = async function (e) { callbackError(e); }
                if(this.props.pngTransparent){
                    xhr.onload = async function (e) {
                        var reader = new FileReader();
                        reader.onload = async function (event) {
                            var res = event.target.result;
                            var base64 = res.replace(/^data:image\/[a-z]+;base64,/, "");
                            imageJSON = await tbCImageUploadAPI.UploadImageFreeRatio(base64);
                            callbackSuccess(imageJSON);
                        }
                        var file = this.response;
                        reader.readAsDataURL(file)
                    };
                } else {
                    xhr.onload = async function (e) {
                        var reader = new FileReader();
                        reader.onload = async function (event) {
                            var res = event.target.result;
                            var base64 = res.replace(/^data:image\/[a-z]+;base64,/, "");
                            imageJSON = await tbCImageUploadAPI.uploadImage(base64);
                            callbackSuccess(imageJSON);
                        }
                        var file = this.response;
                        reader.readAsDataURL(file)
                    };
                }
                xhr.send();
            }
        
            onWillHidePreviewHandler() {
                if (this._tempImageData.high.uri === '' && this._mode === 'ADD') {
                    if (this._value[this._value.length - 1].high.uri === '') {
                        this._value.pop();
                        if (this.props.onValueChange) { this.props.onValueChange(this._value) }
                        if (!this.props.stateless) { super.mySetState({}); }
                    }
                }
            }
            onTextValueChangeHandler(v) {
                this._tempImageData.text = v;
                if (this.props.onValueChange) { this.props.onValueChange(this._value) }
                if (!this.props.stateless) { super.mySetState({}); }
            }
            onTextPositionChangeHandler(v) {
                this._tempImageData.textPosition = v;
                if (this.props.onValueChange) { this.props.onValueChange(this._value) }
                if (!this.props.stateless) { super.mySetState({}); }
            }
        
            constructor(props, context, ...args) {
                super(props, context, ...args);
                if(SGHelperType.isDefined(this.props.pngTransparent)){
                    this.labels = labels
                }else{
                    this.labels = labelsFilePicker;
                }
                this._tempImageJSON = { uri: '', width: 0, height: 0 };
                this._tempImageData = this.getNewBlankImageData();
                this._dataFolderImages = [];
                this.imagepressed = '';
                this.respath = '';
                this.pvID = SGPopView.getPopViewID();
                this.pvID2 = SGPopView.getPopViewID();
                this.pvID3 = SGPopView.getPopViewID();
                this.pvID4 = SGPopView.getPopViewID();
                
                this.refreshFlatList = false;
                this.refresh=false
                this.loading = false;
                this.stopPulling = false;
                this.alreadyMount = false;
                this.pagingCounter = 0
        
            }
            initProps() {
                if (super.isPropsNeedInitOrChanged(this.props)) {
                    this._maxImageCount = SGHelperType.isDefined(this.props.maxImageCount) ? this.props.maxImageCount : 999;
                    this._imageFactor = (SGHelperType.isDefined(this.props.imageFactor) ? this.props.imageFactor : 1);
                    this._heightRatio = SGImagePicker._hRatio[(SGHelperType.isDefined(this.props.ratio) ? this.props.ratio : SGImagePicker.ratio.r9x9)];
                    this._lang = this.props.language ? this.props.language : 'ID';
                    this._textPosList = this.getTextPositionList();
                    var { w, h, p } = SGHelperWindow.getWHP();
                    var r = this._heightRatio;
                    var f = this._imageFactor;
                    this._style = StyleSheet.create({
                        v1: { width: w - 12 * p, height: (w - 2 * p) / 4 + 6 * p, marginVertical: 2 * p, backgroundColor: 'white', borderRadius: 2 * p, padding: 0, borderColor: SGHelperStyle.color.SGDatePicker.Border, borderWidth: p / 4, },
                        sv1: { backgroundColor: 'white', flex: 1, width: '100%', borderRadius: 2 * p, },
                        thumbB: { width: (w - 2 * p) / 4 / r, height: (w - 2 * p) / 4, borderRadius: 2 * p, margin: 0, marginRight: 4 * p, padding: 0, backgroundColor: 'white' },
                        thumbI: { width: (w - 2 * p) / 4 / r, height: (w - 2 * p) / 4, borderRadius: 2 * p, margin: 0, padding: 0, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'flex-end' },
                        thumbIB: { padding: 0, marginRight: 0, marginTop: 0, alignItems: 'center', color: 'white', borderRadius: 2 * p, width: w * 0.06, height: w * 0.06, backgroundColor: 'red', },
                        ibAdd: { color: SGHelperStyle.color.SGImagePicker.ButtonAdd, },
                        pv1: { padding: 4 * p, backgroundColor: SGHelperStyle.color.SGImagePicker.PVBGBlack, width: w, height: h * 0.96, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, justifyContent: 'flex-start' },
                        pv1_sv1: { alignSelf: 'stretch', flex: 1, },
                        pv1_t0: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGImagePicker.TextWhite, marginBottom: 2 * p, marginTop: 4 * p, },
                        pv1_v0: { flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', marginTop: 2 * p },
                        pv1_icon1: { marginVertical: 0, paddingVertical: 0 },
                        pv1_ib1: { borderWidth: 1, borderColor: SGHelperStyle.color.SGImagePicker.PVBGWhite, backgroundColor: SGHelperStyle.color.SGImagePicker.PVBGBlack, justifyContent: 'center', marginBottom: 2 * p, alignItems: 'center', color: SGHelperStyle.color.SGImagePicker.PVBGWhite, borderRadius: 2 * p, width: w / 4.5, height: w / 4.5, marginHorizontal: p, flexDirection: 'column' },
                        pv1_ib2: { borderWidth: 1, borderColor: SGHelperStyle.color.SGImagePicker.PVBGWhite, backgroundColor: SGHelperStyle.color.SGImagePicker.PVBGBlack, justifyContent: 'center', marginBottom: 2 * p, alignItems: 'center', color: SGHelperStyle.color.SGImagePicker.PVBGWhite, borderRadius: 2 * p, width: w / 4.5, height: w / 4.5, marginHorizontal: p, flexDirection: 'column' },
                        pv1_ib3: { borderWidth: 1, borderColor: SGHelperStyle.color.SGImagePicker.PVBGWhite, backgroundColor: SGHelperStyle.color.SGImagePicker.PVBGBlack, justifyContent: 'center', marginBottom: 2 * p, alignItems: 'center', color: SGHelperStyle.color.SGImagePicker.PVBGWhite, borderRadius: 2 * p, width: w / 4.5, height: w / 4.5, marginHorizontal: p, flexDirection: 'column' },
                        pv1_ti1: { width: w - 8 * p },
                        pv1_picker1: { width: w - 8 * p },
                        pv1_v1: { width: w - 8 * p, height: (w - 8 * p) * r * f + w * 0.12 + 4 * p, padding: 0, margin: 0, marginBottom: 2 * p },
                        pv_tb_ul: { backgroundColor: SGHelperStyle.color.SGImagePicker.PVBGWhite },
                        pv1_tv1_1: { fontSize: w * 0.035, },
                        pv1_tv1_2: { height: w * 0.1, backgroundColor: SGHelperStyle.color.SGImagePicker.PVBGBlack, width:w },
                        pv1_tv1_3: { alignSelf: 'stretch', flex: 1, padding: 0, backgroundColor: SGHelperStyle.color.SGImagePicker.PVBGBlack },
                        pv1_tv1_v1: { borderRadius: 2 * p, marginTop: 2 * p, width: w - 8 * p, height: (w - 8 * p) * r * f + 4 * p, borderWidth: 1, borderColor: SGHelperStyle.color.SGImagePicker.PVBGWhite },
                        pv1_i1: { margin: 0, padding: 0, width: (w - 12 * p) * f, height: (w - 12 * p) * r * f, alignSelf: 'center' },
                        pv1_i2: { margin: 0, padding: 0, width: (w - 12 * p) * f, height: (w - 12 * p) * r * f, alignSelf: 'center' },
                        pv1_i3: { margin: 0, padding: 0, width: (w - 12 * p) * f, height: (w - 12 * p) * r * f, alignSelf: 'center' },
                        pv1_t1: { overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.75)', color: 'white', paddingHorizontal: 3 * p, paddingVertical: 2 * p, borderRadius: 2 * p },
                        pv1_t2: { overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.75)', color: 'white', paddingHorizontal: 3 * p, paddingVertical: 2 * p, borderRadius: 2 * p },
                        pv1_t3: { overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.75)', color: 'white', paddingHorizontal: 3 * p, paddingVertical: 2 * p, borderRadius: 2 * p },
                        pv2: { padding: 4 * p, backgroundColor: SGHelperStyle.color.SGImagePicker.PVBGBlack, width: w, height: h * 0.98, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        pv2_sv1: { alignSelf: 'stretch', flex: 1 },
                        pv2_t1: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGImagePicker.PVBGWhite },
                        pv2_t2: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGImagePicker.PVBGWhite },
                        pv2_v1: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 * p, },
                        pv2_b1: { marginHorizontal: 2 * p },
                        pv2_i1: { margin: 0, padding: 0, width: w - 8 * p, height: (w - 8 * p) * r },
                        pv3: { padding: 4 * p, backgroundColor: SGHelperStyle.color.SGImagePicker.PVBGBlack, width: w, height: h * 0.98, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, justifyContent: 'flex-start' },
                        pv3_t0: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGImagePicker.TextWhite, },
                        pv3_sv1: { alignSelf: 'stretch', flex: 1 },
                        pv3_1: { width: w - 8 * p, flexWrap: 'wrap', flexDirection: 'row', },
                        v3_2: { width: (w - 16 * p) / 3, height: (w - 16 * p) / 3, justifyContent: 'center', alignItems: 'center', marginTop: 2 * p },
                        touchTo1:{width:w*0.3,height:w*0.05, marginVertical: 2 * p, borderRadius: 5 * p },
                        to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGWhite, width: w * 0.14, height: w * 0.009,alignSelf:'center'},
                    });
                }
            }
            initValue() {
                if (!this._isValueInit || this.props.stateless || !this._renderBySelf) {
                    this._value = (SGHelperType.isDefined(this.props.value) ? this.props.value : []);
                    this.state = { value: this._value };
                    this._isValueInit = true;
                }
                this._renderBySelf = false;
            }
            render() {
                this.initProps();
                this.initValue();
                var style = this._style;
                var { img, txt } = this.getImageContentAlignment(this._tempImageData.textPosition);
                var { w, h, p } = SGHelperWindow.getWHPNoHeader();
                
                return (
                    !this.props.hidden &&
                    <React.Fragment>
                        {
                            (!this.props.previewMode || this._maxImageCount > 1) &&
                            <SGView hidden={this.props.hidden} shadow={this.props.shadow} style={[style.v1, this.props.style]}>
                                <SGScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 3 * p }} style={[style.sv1, this.props.disabled ? { backgroundColor: SGHelperStyle.color.SGImagePicker.BGDisabled } : {}]} horizontal>
                                    {
                                        this._value.map((d, i) => {
                                            return (
                                                <SGImageButton onPress={this.onImagePressHandler.bind(this, i)} preset={SGImageButton.preset.default} shadow style={[style.thumbB, this.props.imageButtonStyle]} source={{ uri: d.thumbnailLow.uri }} imageStyle={style.thumbI}>
                                                    <SGIconButton disabled={this.props.disabled} shadow iconPreset={SGIcon.preset.h6} style={style.thumbIB} name={SGIcon.Icon.close} onPress={this.onDeleteImageHandler.bind(this, i)} />
                                                </SGImageButton>
                                            );
                                        })
                                    }
                                    <SGIconButton disabled={this.props.disabled || this._value.length >= this._maxImageCount} name={SGIcon.Icon.plus} textPreset={SGIcon.preset.h0} style={{ ...style.ibAdd, ...this.props.addButtonStyle }} onPress={this.onAddImageHandler.bind(this)} />
                                </SGScrollView>
                            </SGView>
                        }
                        {
                            (this.props.previewMode && this._maxImageCount === 1) &&
                            <SGTouchableOpacity onPress={this._value.length > 0 ? this.onImagePressHandler.bind(this, 0) : this.onAddImageHandler.bind(this)} >
                                <SGImage source={{ uri: this._value.length > 0 ? this._value[0].high.uri : '' }} style={{ ...style.pv1_i1, ...img, ...this.props.previewStyle }} >
                                    {
                                        this._value.length > 0 &&
                                        <SGText hidden={this._value[0].text === '' || this.props.hideText} preset={SGText.preset.h7} style={[style.pv1_t1, { ...txt }]}>{this._value[0].text}</SGText>
                                    }
                                    {
                                        this._value.length === 0 &&
                                        <SGIcon name={SGIcon.Icon.edit} preset={SGIcon.preset.h4} style={{ color: 'white', position: 'absolute', bottom: 0, right: 0 }} />
                                    }
                                </SGImage>
                            </SGTouchableOpacity>
                        }
        
                        <SGPopView onWillHide={this.onWillHidePreviewHandler.bind(this)} popViewID={this.pvID} on animationType={'slide'} vPos='bottom'>
                            <SGView style={style.pv1} >
                                <SGTouchableOpacity style={style.touchTo1} onPress={() => { SGPopView.hidePopView(this.pvID); }}>
                                    <SGView style={style.to1}></SGView>
                                </SGTouchableOpacity>
                                <SGScrollView style={style.pv1_sv1} showsVerticalcator={false}>
                                    <SGText preset={SGText.preset.h4B} style={style.pv1_t0} hidden={SGHelperType.isDefined(this.props.label) ? false : true}>{this.props.label}</SGText>
                                    <SGView style={style.pv1_v0}>
                                        <SGIconButton disabled={this.props.disabled} shadow iconPreset={SGIcon.preset.w16} textPreset={SGText.preset.h7} style={style.pv1_ib1} name={SGIcon.Icon.camera} label={this.labels[this._lang].camera} onPress={this.onCameraHandler.bind(this)} />
                                        <SGIconButton disabled={this.props.disabled} shadow iconPreset={SGIcon.preset.w15} textPreset={SGText.preset.h7} style={style.pv1_ib2} name={SGIcon.Icon.gallery} label={this.labels[this._lang].gallery} onPress={this.props.pngTransparent ? this.pickSingle.bind(this):this.onGalleryHandler.bind(this)} />
                                        <SGIconButton disabled={this.props.disabled} shadow iconPreset={SGIcon.preset.w15} textPreset={SGText.preset.h7} style={style.pv1_ib3} name={SGIcon.Icon.uploadFolder} label={this.labels[this._lang].uploadFolder} onPress={this.onUploadFolderHandler.bind(this)} />
                                    </SGView>
                                    <SGText hidden={this.props.hideText} preset={SGText.preset.h6B} style={style.pv1_t0} >{this.labels[this._lang].description}</SGText>
                                    <SGTextInput hidden={this.props.hideText} disabled={this.props.disabled || this._tempImageData.high.uri === ''} shadow style={style.pv1_ti1} value={this._tempImageData.text} onValueChange={this.onTextValueChangeHandler.bind(this)} />
                                    <SGText hidden={this.props.hideText} preset={SGText.preset.h6B} style={style.pv1_t0} >{this.labels[this._lang].textPosition}</SGText>
                                    <SGPicker hidden={this.props.hideText} disabled={this.props.disabled || this._tempImageData.high.uri === ''} single mandatory onValueChange={this.onTextPositionChangeHandler.bind(this)} style={style.pv1_picker1} shadow optionList={this._textPosList} />
                                    <SGText preset={SGText.preset.h6B} style={style.pv1_t0} >{this.labels[this._lang].preview}</SGText>
                                    <SGView style={style.pv1_v1}>
                                        <SGTabView locked={false} tabBarTextStyle={style.pv1_tv1_1} tabBarStyle={style.pv1_tv1_2} style={style.pv1_tv1_3} tabBarUnderlineStyle={style.pv_tb_ul} tabBarActiveTextColor={this.props.darkMode ? SGHelperStyle.color.SGImagePicker.TextBlack : SGHelperStyle.color.SGImagePicker.TextWhite} tabBarInactiveTextColor={this.props.darkMode ? SGHelperStyle.color.SGImagePicker.TextBlack : SGHelperStyle.color.SGImagePicker.TextWhite} tabBarActiveTextPreset={SGText.preset.heading4B} tabBarInactiveTextPreset={SGText.preset.heading4}>
                                            <SGView tabLabel={this.labels[this._lang].highRes} style={style.pv1_tv1_v1}>
                                                {
                                                    this._tempImageData.high.uri !== '' &&
                                                    <SGImage source={{ uri: this._tempImageData.high.uri }} style={{ ...style.pv1_i1, ...img }}>
                                                        <SGText hidden={this._tempImageData.text === '' || this.props.hideText} preset={SGText.preset.h7} style={[style.pv1_t1, { ...txt }]}>{this._tempImageData.text}</SGText>
                                                    </SGImage>
                                                }
                                            </SGView>
                                            <SGView tabLabel={this.labels[this._lang].medRes} style={style.pv1_tv1_v1}>
                                                {
                                                    this._tempImageData.med.uri !== '' &&
                                                    <SGImage source={{ uri: this._tempImageData.med.uri }} style={{ ...style.pv1_i2, ...img }}>
                                                        <SGText hidden={this._tempImageData.text === '' || this.props.hideText} preset={SGText.preset.h7} style={[style.pv1_t2, { ...txt }]}>{this._tempImageData.text}</SGText>
                                                    </SGImage>
                                                }
                                            </SGView>
                                            <SGView tabLabel={this.labels[this._lang].lowRes} style={style.pv1_tv1_v1}>
                                                {
                                                    this._tempImageData.low.uri !== '' &&
                                                    <SGImage source={{ uri: this._tempImageData.low.uri }} style={{ ...style.pv1_i3, ...img }}>
                                                        <SGText hidden={this._tempImageData.text === '' || this.props.hideText} preset={SGText.preset.h7} style={[style.pv1_t3, { ...txt }]}>{this._tempImageData.text}</SGText>
                                                    </SGImage>
                                                }
                                            </SGView>
                                        </SGTabView>
                                    </SGView>
                                </SGScrollView>
                            </SGView>
        
                            <SGPopView modal animationType={'slide'} popViewID={this.pvID2} vPos='bottom'>
                                <SGView style={style.pv2} >
                                    <SGTouchableOpacity style={style.touchTo1} onPress={this.onNoUploadHandler.bind(this)}>
                                        <SGView style={style.to1}></SGView>
                                    </SGTouchableOpacity>
                                    <SGScrollView style={style.pv2_sv1} showsVerticalScrollIndicator={false}>
                                        <SGText style={style.pv2_t1} preset={SGText.preset.h4B}>{this.labels[this._lang].imageUpload}</SGText>
                                        <SGText style={style.pv2_t2} preset={SGText.preset.h6}>{this.labels[this._lang].confirmMessage}</SGText>
                                        <SGView style={style.pv2_v1}>
                                            <SGButton style={style.pv2_b1} preset={SGButton.preset.grey} label={this.labels[this._lang].no} onPress={this.onNoUploadHandler.bind(this)} />
                                            <SGButton style={style.pv2_b1} preset={SGButton.preset.green} label={this.labels[this._lang].yes} onPress={this.props.pngTransparent ? this.onYesUploadTransparentImage.bind(this):this.onYesUploadHandler.bind(this)} />
                                        </SGView>
                                        <SGImage source={{ uri: this._tempImageJSON.uri }} style={style.pv2_i1} />
                                    </SGScrollView>
                                </SGView>
                            </SGPopView>
        
                            <SGPopView animationType={'slide'} popViewID={this.pvID3} vPos='bottom'>
                                <SGView style={style.pv3} >
                                    <SGTouchableOpacity style={style.touchTo1} onPress={() => { SGPopView.hidePopView(this.pvID3); }}>
                                        <SGView style={style.to1}></SGView>
                                    </SGTouchableOpacity>
                                    <SGText preset={SGText.preset.h4B} style={style.pv3_t0} hidden={SGHelperType.isDefined(this.props.label) ? false : true}>{this.labels[this._lang].albums}</SGText>
                                    <SGView style={style.pv3_sv1}> 
                                    {
                                    this.alreadyMount ?
                                        <SGFlatList    
                                            refreshControl={<RefreshControl
                                            colors={["white", "white"]}
                                            tintColor ={'white'}
                                            refreshing={this.refreshFlatList}
                                            onRefresh={this._onRefreshImage.bind(this)} />}
                                            contentContainerStyle={{flexDirection:'column'}} numColumns={3} data={this._dataFolderImages} renderItem={({ item }) => {
                                                return (
                                                        <SGTouchableOpacity shadow onPress={() => this.onImageFolderPress(item.fHigh.uri)} >
                                                            <SGImage style={style.v3_2} source={{ uri: this._dataFolderImages.length > 0 ? item.fThumbnailHigh.uri : '' }} />
                                                        </SGTouchableOpacity>
                                                );
                                                }} keyExtractor={item => item.fID}
                                                onEndReached={this._onLoad.bind(this)}
                                                onEndReachedThreshold={SGHelperType.getThreshold()}
                                                ListFooterComponent={()=>{
                                                    if( this.loading)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}} darkMode ></SGActivityIndicator>
                                                    else return null
                                            }}
                                                >
                                        </SGFlatList>
                                            :
                                            <SGView style={{flex:1}}><SGActivityIndicator preset={SGActivityIndicator.preset.h1}></SGActivityIndicator></SGView>
                                        }
                                    </SGView>
                                </SGView>
                                <SGPopView modal animationType={'slide'} popViewID={this.pvID4} vPos='bottom'>
                                    <SGView style={style.pv2} >
                                        <SGTouchableOpacity style={style.touchTo1} onPress={this.onNoUploadHandlerFolder.bind(this)}>
                                            <SGView style={style.to1}></SGView>
                                        </SGTouchableOpacity>
                                        <SGScrollView style={style.pv2_sv1} showsVerticalScrollIndicator={false}>
                                            <SGText style={style.pv2_t1} preset={SGText.preset.h4B}>{this.labels[this._lang].imageUpload}</SGText>
                                            <SGText style={style.pv2_t2} preset={SGText.preset.h6}>{this.labels[this._lang].confirmMessage}</SGText>
                                            <SGView style={style.pv2_v1}>
                                                <SGButton style={style.pv2_b1} preset={SGButton.preset.grey} label={this.labels[this._lang].no} onPress={this.onNoUploadHandlerFolder.bind(this)} />
                                                <SGButton style={style.pv2_b1} preset={SGButton.preset.green} label={this.labels[this._lang].yes} onPress={this.onYesUploadHandlerFolder.bind(this)} />
                                            </SGView>
                                            <SGImage source={{ uri: this._tempImageJSON.uri }} style={style.pv2_i1} />
                                        </SGScrollView>
                                    </SGView>
                                </SGPopView>
                            </SGPopView>
                        </SGPopView>
                    </React.Fragment>
                );
            }
        }
        
        