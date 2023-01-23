/**
* Version 1.3.0
 * 1. Yohanes 21 May 2021
 * - change NotificationGetByID
 * Version 1.2.0
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet,Linking } from 'react-native';
import { SGRootView as RootView, SGView as View, SGImage as Image, SGText as Text, SGScrollView as ScrollView, SGViewPager as ViewPager, SGDialogBox, SGButton as Button, SGActivityIndicator as ActivityIndicator, SGWebView as WebView,SGTouchableOpacity as TouchableOpacity } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperType, SGHelperGlobalVar, SGHelperErrorHandling,SGHelperNavigation,SGHelperWindow } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { DateTag } from '../../component_V2/DateTag';
import { tbVNotificationAPI } from '../../api/tbVNotificationAPI';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { VisitorHelper } from '../../helper/VisitorHelper';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';

export class NotificationDetailScreen extends SGBaseScreen {

    _getBlankNotificationData(data) {
        console.log(data)
        if (data === null) {
            return {
                fID: '', fTargetKey: '', fNotificationNameID: '', fNotificationNameEN: '', fNotificationNameCN: '',
                fContentID: { fImageJSON: [], fLongDescription: '' },
                fContentEN: { fImageJSON: [], fLongDescription: '' },
                fContentCN: { fImageJSON: [], fLongDescription: '' },
                fBuildingNameID: '',fBuildingNameEN: '',fBuildingNameCN: '',fStoreNameID: '',fStoreNameEN: '',fStoreNameCN: '',fCity:'',
                fContentKey: '', fContentType: '', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date(), fRead: 'N', fActive: 'N',fType:'',fKey :'',fArrayOfLinks:[]
            };
        } else {
            return {
                fID: data.fID, fTargetKey: data.fTargetKey, fNotificationNameID: data.fNotificationNameID, fNotificationNameEN: data.fNotificationNameEN, fNotificationNameCN: data.fNotificationNameCN,
                fContentID: data.fContentID, fContentEN: data.fContentEN,
                fContentCN: data.fContentCN,
                fBuildingNameID: data.fBuildingNameID,fBuildingNameEN:  data.fBuildingNameEN,fBuildingNameCN:  data.fBuildingNameCN,fStoreNameID: data.fStoreNameID,fStoreNameEN: data.fStoreNameEN,fStoreNameCN: data.fStoreNameCN,fCity: data.fCity,
                fContentKey: data.fContentKey, fContentType: data.fContentType, fCreatedBy: data.fCreatedBy, fCreatedDate: data.fCreatedDate, fLastModifiedBy: data.fLastModifiedBy, fLastModifiedDate: data.fLastModifiedDate, fRead: data.fRead, fActive: data.fActive,
                fImageJSONID: data.fImageJSONID, fImageJSONEN: data.fImageJSONEN, fImageJSONCN: data.fImageJSONCN,fType : data.fType,fKey : data.fKey,fArrayOfLinks:data.fArrayOfLinks
            };
        }

    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', paddingVertical: 0, justifyContent: 'flex-start' },
            notificationNameText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 3, marginTop: p * 5 },
            topContainer: { width: w, backgroundColor: '#FFFFFF', position: 'relative' },
            sliderContainer: { width: w, height: w * 1.2 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0 },
            sliderImage: { width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: 0, overflow: 'visible' },
            placeAndIconContainer: { width: w * 0.97, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: p },
            placeContainer: { width: w * 0.8, flexDirection: 'row', justifyContent: 'flex-start' },
            placeThumbnailImage: { width: w * 0.165, height: w * 0.165, backgroundColor: '#FFFFFF', resizeMode: 'cover', borderRadius: p * 100 },
            placeNameText: { alignSelf: 'flex-start', color: '#000000' },
            placeLocationText: { alignSelf: 'flex-start', color: '#828282' }, contentView: { overflow: 'visible', backgroundColor: 'white', marginHorizontal: 2 * p, marginTop: 10 * p, width: w * 0.92, justifyContent: 'flex-start', padding: p, borderTopLeftRadius: 2 * p, borderTopRightRadius: 2 * p, borderColor: '#c09748', borderWidth: 0.75 },
            descriptionContainer: { width: w - p * 8, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: p * 4 },
            descriptionText: { color: '#000000', textAlign: 'justify' },
            tag: { position: 'absolute', top: 0, right: 0 },
            webView: { width: '100%', height: w * 2 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.data = this._getBlankNotificationData(null)
        this.alreadyMount = false;
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = this.currentUserData.fImageSetting
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.arrayOfLinksContent = SGHelperGlobalVar.getVar("arrayOfLinks");
        this.arrayOfLinksData = [];
    }
 
    async _pullDataFromAPI() {
       
        this.baseRunSingleAPIWithRedoOption('getNotificationByID', (async (v1,v2) => {  this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting')); return tbVNotificationAPI.getNotificationByID(v1,v2) }).bind(this,this.props.route.params.fID,this.props.route.params.fContentType), (async(v) => {
            var result = v //await tbVNotificationAPI.getNotificationByID(this.props.route.params.fID)
            console.log(result);
            console.log(this.props.route.params.fContentType)
            this.data = this._getBlankNotificationData(result)
            this.alreadyMount = true;
            this._construcArrayOfLinks();
            SGDialogBox.hideDialogBox(this.dbID2, true)
            await this._readStatus()
            this.forceUpdate();
        }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID2, true)}),  SGHelperGlobalVar.getVar("ResponTimes"));

        
    }
    async _readStatus(){
        try {
            await tbVNotificationAPI.readStatus(this.props.route.params.fID);
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._readStatus.bind(this.props.route.params.fID))
        }

    }
    async componentDidMount() {
        await this._pullDataFromAPI();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._pullDataFromAPI();
        });

    }
    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        if(valid){
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                SGDialogBox.showWebView(url,()=>{});   
            }
        });
        }else{
            SGDialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };

    handleLinkArrayOfLinks(data) {
        var url = data.arrLink;
        var valid = SGHelperType.validURL(url)
        if(data.arrContent.key == SGHelperType.getSystemParamsValue('IDWhatsapp')){
            console.log('whatsapp link')
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: this.data.fTargetKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)
        }        
        if(valid){
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                SGDialogBox.showWebView(url,()=>{});   
            }
        });
        }else{
            SGDialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };

    _addUserClick(jsonInput){
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }

    _onLogoPress(key,type){
        if(type == 'building'){
            SGHelperNavigation.navigatePush(this.props.navigation, 'MallHome', { contentKey: key });
        } else if(type == 'store'){
            SGHelperNavigation.navigatePush(this.props.navigation, 'StoreHome', { contentKey: key });
        } else if(type == 'resto'){
            SGHelperNavigation.navigatePush(this.props.navigation, 'RestoHome', { contentKey: key });
        }
    }
    _getArrayOfLinks(fID){
        for(var i =0;i< this.arrayOfLinksContent.length;i++){
            if(this.arrayOfLinksContent[i].key == fID){
                return this.arrayOfLinksContent[i];
            }
        }
    }

    _construcArrayOfLinks(){
        this.arrayOfLinksData=[]
        for(var i =0; i<this.data.fArrayOfLinks.length ;i++){
           var res = this._getArrayOfLinks(this.data.fArrayOfLinks[i].arrKey)
         
           if(SGHelperType.isDefined(res)){
            this.arrayOfLinksData.push({arrName : this.data.fArrayOfLinks[i].arrName,
                 arrLink : this.data.fArrayOfLinks[i].arrLink,
                 arrContent: res})
           }
        }
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var imageSetting = this.imageSetting
        var language = this._language.toUpperCase()
        var tenant = this.props.route.params.fContentType==="StorePromo" || this.props.route.params.fContentType==="RestoPromo" || this.props.route.params.fContentType==="StoreAuction" || this.props.route.params.fContentType==="RestoAuction" ? true:false
        var lookUpPointer = this.props.route.params.fContentType==="StorePromo" || this.props.route.params.fContentType==="StoreAuction"? "StoreCategory" : "RestoCategory"
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'NotificationDetailScreenRootView'} style={style.mainContainer}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                {this.alreadyMount ?
                    (this.data !== null ?
                        (<ScrollView accessible={true} accessibilityLabel={'NotificationDetailScreenScrollView'} >
                            <Text accessible={true} accessibilityLabel={'NotificationDetailScreenName'} preset={Text.preset.titleH1B} style={style.notificationNameText} numberOfLines={2}>{(this.data['fNotificationName' + this.Language.toUpperCase()])}</Text>
                            <View accessible={true} accessibilityLabel={'NotificationDetailScreenContentView'} style={style.topContainer}>
                                <View accessible={true}>
                                    <ViewPager hidden={!this.alreadyMount} key='1' accessible={true} accessibilityLabel={'NotificationDetailScreenViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }} >
                                        {this.data['fContent' + language].fImageJSON.map((x, index) => {
                                            return (
                                                <View accessible={true} accessibilityLabel={'NotificationDetailScreenImageView'} key={SGHelperType.getGUID()}>
                                                    <Image accessible={true} accessibilityLabel={'NotificationDetailScreenImage'} style={style.sliderImage} source={{ uri: x[imageSetting].uri }}></Image>
                                                </View>
                                            )
                                        })
                                        }
                                    </ViewPager>
                                    {/* <ViewPager hidden={this.alreadyMount} key={'2'} accessible={true} accessibilityLabel={'NotificationDetailScreenViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }} >
                                        <View style={style.sliderImage}></View>
                                    </ViewPager> */}
                                    <DateTag accessible={true} accessibilityLabel={'NotificationDetailScreenDateTag'} style={style.tag} imageSetting={this.imageSetting} data={this.data.fCreatedDate} language={this._language} leftMode></DateTag>
                                </View>
                                <View accessible={true} accessibilityLabel={'NotificationDetailScreenContainerView'} style={style.placeAndIconContainer}>
                                    <View accessible={true} style={style.placeContainer}>
                                        <TouchableOpacity onPress={() => {this._onLogoPress(this.data.fKey,this.data.fType)}}> 
                                            <Image accessible={true} accessibilityLabel={'NotificationDetailScreenBuildingImage'} style={style.placeThumbnailImage} source={{ uri: this.data.fID !== "" ? this.data['fImageJSON' + language][0][imageSetting].uri : '' }}></Image>
                                        </TouchableOpacity>
                                        <View accessible={true} accessibilityLabel={'NotificationDetailScreenTextView'}>
                                            <Text hidden={this.data["fStoreName"+language]===""?true:false} accessible={true} accessibilityLabel={'NotificationDetailScreenStoreName'} preset={Text.preset.titleH2B} style={style.placeNameText}>{  this.data["fStoreName"+language]}</Text>
                                            <Text accessible={true} accessibilityLabel={'NotificationDetailScreenBuildingName'} preset={Text.preset.titleH4} style={style.placeNameText}>{  this.data["fBuildingName"+language]}</Text>
                                            <Text accessible={true} accessibilityLabel={'NotificationDetailScreenBuildingCity'} preset={Text.preset.titleH4} style={style.placeNameText}>{!tenant  ? VisitorHelper.getLocalizeDataFromLookUp('City',this.data.fCity,this._language) : VisitorHelper.getLocalizeDataFromLookUp(lookUpPointer,this.data.fCity,this._language)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View accessible={true} accessibilityLabel={'NotificationDetailScreenBottomView'} style={style.descriptionContainer}>
                                {this.data['fContent' + language].fTypeDetail === 'longdescription' ?
                                    (<Text accessible={true} accessibilityLabel={'NotificationDetailScreenLongDesc'} preset={Text.preset.titleH3} style={style.descriptionText}>{this.data['fContent' + language].fLongDescription}</Text>)
                                    :
                                    (null)
                                }
                                {this.data['fContent' + language].fTypeDetail === 'url' && this.data['fContent' + language].fURL !== '' ?
                                    
                                    <View style={{width:w-16*p,height:h}}> 
                                        <WebView accessible={true} accessibilityLabel={'NotificationUrl'} style={{flex:1,backgroundColor:'white'}} source={{  uri: this.data['fContent' + language].fURL}}></WebView>
                                    </View>

                                    :
                                    (null)
                                }
                                {this.data['fContent' + language].fTypeDetail === 'html' && this.data['fContent' + language].fHTML !== '' ?

                                    <View style={{width:w-16*p,height:h}}> 
                                        <WebView accessible={true} accessibilityLabel={'NotificationHtml'} style={{flex:1,backgroundColor:'white'}} source={{  html: this.data['fContent' + language].fHTML}}></WebView>
                                    </View>
                                    :
                                    (null)
                                }
                            </View>
                            { this.arrayOfLinksData.map((item, i) => {
                                return (
                                <IconArrayOfLinks accessible={true} accessibilityLabel={'IconArrayOfLinks'} style={style.throwWHP}  data={item}  onIconArrayPress={this.handleLinkArrayOfLinks.bind(this, item)}  arrImage={item.arrContent.content.fImageJSON[0][this.imageSetting].uri}></IconArrayOfLinks >
                                        );
                                    })
                            }
                            <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                            <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                        </ScrollView>)
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyDetail')} style={style.throwWHP}></EmptyDetailView>)
                    )
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <BottomNavigationContainer accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        )
    }
}


