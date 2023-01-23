import React from 'react';
import { StyleSheet, Dimensions, Platform, PermissionsAndroid, Text } from 'react-native';
import { SGRootView as RootView, SGView as View, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGScrollView as ScrollView, SGViewPager as ViewPager, SGScrollView, SGDialogBox, SGPopView } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import Pdf from 'react-native-pdf';
import { BackButton } from '../../component_V2/BackButton';
import image from '../../asset/image.js';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperFileMgr } from '../../../core/helper';
import RNFetchBlob from 'react-native-blob-util';
import { SGLocalize } from '../../locales/SGLocalize';

export class PDFViewerScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView: { width: w, backgroundColor: '#191919', justifyContent: 'flex-start' },
            pdf: { flex: 1, width: '100%', height: '100%' },
            mainContainer: { width: w, height: w * 0.11, backgroundColor: '#191919', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: p, paddingLeft: p * 5, paddingRight: p * 1.5, borderBottomLeftRadius: p * 3.5, borderBottomRightRadius: p * 3.5 },
            searchBar: {},
            iconBack: { width: w * 0.045, height: w * 0.04, backgroundColor: 'transparent', resizeMode: 'contain' },
            icon: { width: w * 0.1, height: w * 0.1, backgroundColor: 'transparent', resizeMode: 'contain' },
            searchBar: { backgroundColor: '#FFFFFF', width: (w - (p * 2)) * 0.100 * 7, height: (w - (p * 2)) * 0.080, resizeMode: 'contain', alignItems: 'center', borderRadius: p * 2 },
            throwWHP: { width: w, height: h, padding: p },
            textSearch: { backgroundColor: '#E6E6E6' },
            iconBar: { flexDirection: 'row' },
            iconDownload:{ width: w * 0.1, height: w * 0.1, resizeMode: 'contain', backgroundColor: 'transparent'}
        });
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }
    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async _onRefreshAllItem() {
        this.forceUpdate();
    }

    onDownloadHandler(pdfLink) {
        // this._dbID = SGDialogBox.showLoading('Loading');
        this._dbID = SGDialogBox.showProgress('Downloading');
        var URL = pdfLink;
        var arrStr = URL.split('/');
        var fName = arrStr[arrStr.length - 1];
        var options = {};
        var dir = SGHelperFileMgr.getDownloadDir();
        if (Platform.OS === 'android') {
            console.log('a')
            options = {
                fileCache: true,
                path: dir + '/' + fName,
            };
            console.log('b')
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((granted) => {
                console.log('c')
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('d')
                    RNFetchBlob.fetch('GET', URL).progress((received, total) => {
                        console.log('e')
                        SGDialogBox.updateProgress(Math.round(received * 100 / total, 0));
                    }).then((res) => {
                        console.log('f')
                        SGDialogBox.hideDialogBox(this._dbID, true);
                        SGDialogBox.showToast(SGLocalize.translate('ShowToastMessage.pdfDownloaded'),null)
                    })
                }
            });
        } else {
            options = {
                fileCache: true,
                path: dir + '/' + fName,
            };
            RNFetchBlob.fetch('GET', URL).progress((received, total) => {
                SGDialogBox.updateProgress(Math.round(received * 100 / total, 0));
            }).then((res) => {
                SGDialogBox.hideDialogBox(this._dbID, true);
                SGDialogBox.showToast(SGLocalize.translate('ShowToastMessage.pdfDownloaded'),null)
            })
        }
    }

    
     async permissionFunc(pdfLink){
        if (Platform.OS == 'ios') {
            this.actualDownload(pdfLink);
        } else {
                try {
                    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.actualDownload(pdfLink);
                    } else {
                        SGDialogBox.showToast(SGLocalize.translate('DownloadPdf.giveStoragePermission'),null)
                    }
                } catch (err) {
                    console.warn(err);
                }
        }
    }
    
    actualDownload(pdfLink){
        this._dbID = SGDialogBox.showProgress('Downloading');
        var URL = pdfLink;
        var arrStr = URL.split('/');
        var fName = arrStr[arrStr.length - 1];
        var title = fName+'.pdf';
        console.log(fName);
        
        const { dirs } = RNFetchBlob.fs;
        const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
        
        const configfb = {
            fileCache: true,
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: fName+'.pdf',
            path: `${dirToSave}/${title}`,
        }
        const configOptions = Platform.select({
            ios: {
                fileCache: configfb.fileCache,
                title: configfb.title,
                path: configfb.path,
                appendExt: 'pdf',
            },
            android: configfb,
        });
    
        console.log('The file saved to 23233', configfb, dirs);
        
        RNFetchBlob.config(configOptions)
            .fetch('GET', pdfLink, {}).progress((received, total) => {
            console.log('e')
            SGDialogBox.updateProgress(Math.round(received * 100 / total, 0));
            }).then((res) => {
                if (Platform.OS === "ios") {
                    SGDialogBox.hideDialogBox(this._dbID, true);
                    RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                    setTimeout(() => { RNFetchBlob.ios.previewDocument(configfb.path); }, 300);
                }
                if (Platform.OS == 'android') {
                    console.log('done download')
                    SGDialogBox.hideDialogBox(this._dbID, true);
                    SGDialogBox.showToast(SGLocalize.translate('ShowToastMessage.pdfDownloaded'),null)
                }
                console.log('The file saved to ', res);
            })
            .catch((e) => {
                SGDialogBox.hideDialogBox(this._dbID, true);
                console.log(e.message);
                console.log('The file saved to ERROR', e.message)
            });
       
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: false,
            headerBackTitle: 'Back',
        });
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.pdfLink = this.props.route.params.pdfLink;
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'RestoMenuDetailScreenRootView'} style={style.mainView}>
                <View accessible={true} accessibilityLabel={'NoSortSearchBarRootView'} style={style.mainContainer}>
                    <BackButton hidden={!SGHelperNavigation.canGoBack(this.props.navigation)} imageSetting={this.imageSetting} navigator={this.props.navigation} style={style.iconBack}></BackButton>
                    <View style={style.iconBar}>
                        <TouchableOpacity onPress={() => this.permissionFunc(this.pdfLink)}>
                            <Image accessible={true} accessibilityLabel={''} source={{ uri: image.downloadIconWhite[this.imageSetting].url }} style={style.iconDownload}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <Pdf source={{ uri: this.pdfLink, cache: true }} style={style.pdf} />
            </RootView>
        );
    }
}
