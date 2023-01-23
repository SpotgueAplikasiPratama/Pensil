/*
* Version 1.2.0
* 1. Leon 12 Apr 2021
* - add ErrorHandling
* Leon, 4 May 2021
  - Fix Like
*/
import React from 'react';
import { StyleSheet, Animated,Linking } from 'react-native';
import { SGRootView as RootView, SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGScrollView as ScrollView, SGViewPager as ViewPager, SGWebView as WebView, SGActivityIndicator as ActivityIndicator,SGDialogBox as DialogBox } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { StorePromoDetailHeader } from '../../container_V2/StorePromoDetailHeader';
import { VStorePromoDetailAPI } from '../../api/VStorePromoDetailAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';
import { WebViewRender } from '../../component_V2/WebViewRender';
export class StorePromoDetailScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            eventNameText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4, marginTop: p * 3 },
            shortDescText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4,marginVertical:p },
            sv1: { backgroundColor: 'white' },
            sv1_2: { justifyContent: 'flex-start', backgroundColor: 'white', },
            throwWHP: { width: w, height: h, padding: p },
            textContentLiked: { color: '#A7A7A7', alignSelf: 'flex-start', marginHorizontal: p * 4 },
            descriptionContainer: { width: w * 0.93, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 2 },
            descriptionText: { color: '#000000',paddingLeft:5*p,alignSelf: 'flex-start' },
            webView: { width: '100%', height: w * 2 },
            scV1:{width:w,marginVertical:2*p},
            vView1:{width: w,flex:1},
            vView2:{width: w,height:h},
        });
    }

    async componentDidMount() {
        this.alreadyMount = false;
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }
    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        if(valid){
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                DialogBox.showWebView(url,()=>{});   
            }
        });
        }else{
            DialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };

    handleLinkArrayOfLinks(data) {
        var url = data.arrLink;
        var valid = SGHelperType.validURL(url)

        if(data.arrContent.key == SGHelperType.getSystemParamsValue('IDWhatsapp')){
            console.log('whatsapp link')
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: this.data.storeKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)
        }        
        if(valid){
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                DialogBox.showWebView(url,()=>{});   
            }
        });
        }else{
            DialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };


    _addUserClick(jsonInput){
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }

    async _onRefreshAllItem() {

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.baseRunSingleAPIWithRedoOption('getStorePromoDetail', (async (v1) => { return VStorePromoDetailAPI.getStorePromoDetail(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.data = v 
            if (this.data !== null) {
                this._construcArrayOfLinks();
                this.dataContent = this.data['fContentStoreEvent' + this.Language.toUpperCase()];
                this.dataContentFooter = this.data['fContentStore' + this.Language.toUpperCase()];
            }
            if (this.alreadyMount === false) {
                if (this.data !== null) {
                    var jsonInput = { fID: '', fContentType: 'StorePromo', fContentKey: this.props.route.params.contentKey, fTargetKey: this.data.storeKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
                    this._addUserView(jsonInput)
                }
            }
            this.alreadyMount = true;
            this.forceUpdate();
        }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
    }
    _addUserView(jsonInput){
        tbVUserViewAPI.addUserView(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserView(this,jsonInput))
        })
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: false,
            headerBackTitle: 'Back',
        });
        this.data = '';
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.contentKey = this.props.route.params.contentKey;
        this.alreadyMount = false;
        this.arrayOfLinksContent = SGHelperGlobalVar.getVar("arrayOfLinks");
        this.arrayOfLinksData = [];
    }

    _getLikeResource(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStorePromoID = data.fContentStorePromoID;
        var contentStorePromoEN = data.fContentStorePromoEN;
        var contentStorePromoCN = data.fContentStorePromoCN;
        return (
            { fContentType: 'StorePromo', fContentKey: data.key, fText1: { id: contentStorePromoID.fEventName, en: contentStorePromoEN.fEventName, cn: contentStorePromoCN.fEventName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentStorePromoID.fImageJSON, fImageEN: contentStorePromoEN.fImageJSON, fImageCN: contentStorePromoCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getCommentResource(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStorePromoID = data.fContentStorePromoID;
        var contentStorePromoEN = data.fContentStorePromoEN;
        var contentStorePromoCN = data.fContentStorePromoCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'StorePromo', fContentKey: data.key,
                fContentName: { id: contentStorePromoID.fEventName, en: contentStorePromoEN.fEventName, cn: contentStorePromoCN.fEventName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentStorePromoID.fShortDescription, en: contentStorePromoEN.fShortDescription, cn: contentStorePromoCN.fShortDescription },
                fContentImage: { id: contentStorePromoID.fImageJSON, en: contentStorePromoEN.fImageJSON, cn: contentStorePromoCN.fImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.storeKey
            }
        )
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
        var data = this.data;
        console.log(data);
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'StorePromoDetailScreenRootView'} style={style.mainContainer}>
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("storePromoDetailScreen.title")} ribbonWidth={0.6}></RibbonHeader>
                {this.alreadyMount ?
                    this.data !== null ?
                        (<ScrollView accessible={true} accessibilityLabel={'StorePromoDetailScreenScrollView'} style={style.sv1} contentContainerStyle={style.sv1_2} showsVerticalScrollIndicator={false}>
                            <Text accessible={true} accessibilityLabel={'StorePromoDetailScreenTitle'} preset={Text.preset.titleH1B} style={style.eventNameText}>{(data['fContentStorePromo' + this.Language.toUpperCase()].fEventName).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'EventShortDescription'} preset={Text.preset.titleH3} style={style.shortDescText}>{data['fContentStorePromo' + this.Language.toUpperCase()].fShortDescription}</Text>
                            <Text accessible={true} accessibilityLabel={'StorePromoDetailScreenLikeCount'} preset={Text.preset.titleH4B} style={style.textContentLiked}>{data.fLikeCountStorePromo} {SGLocalize.translate('globalText.likeCountText')}</Text>
                            <StorePromoDetailHeader whatsapp={this.data.whatsapp} eventName={data['fContentStorePromo' + this.Language.toUpperCase()].fEventName} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountStorePromo+=c; this.forceUpdate();}).bind(this, data)} accessible={true} accessibilityLabel={'StorePromoDetailScreenHeader'} language={this.Language} imageSetting={this.imageSetting} contentType='StorePromo' likePackage={this._getLikeResource(data)} commentPackage={this._getCommentResource(data)} footerName={data['fContentStore' + this.Language.toUpperCase()].fStoreName} footerLogo={data['fContentStore' + this.Language.toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} footerCategory={data.storeCategory} placeName={data['fBuildingName' + this.Language.toUpperCase()]} footerLikedCount={data.fLikeCountStore} imageSlider={data['fContentStorePromo' + this.Language.toUpperCase()].fImageJSON} isUserLikeThis={data.fUserLikedThis} contentKey={data.key} storeKey={data.storeKey} navigator={this.props.navigation} startDate={data.startDate} endDate={data.endDate} shareMessage={data['fContentStorePromo' + this.Language.toUpperCase()].fShareMessage} targetKey={data.storeKey} canComment={data.fCanComment} style={style.throwWHP}></StorePromoDetailHeader>
                            <View accessible={true} accessibilityLabel={'StorePromoDetailScreenContentView'} style={style.descriptionContainer}>
                                {data['fContentStorePromo' + this.Language.toUpperCase()].fTypeDetail === 'longdescription' ?
                                    (
                                    <View style={style.vView1}> 
                                        <Text accessible={true} accessibilityLabel={'StorePromoDetailScreenDescText'} preset={Text.preset.titleH3} style={style.descriptionText}>{data['fContentStorePromo' + this.Language.toUpperCase()].fLongDescription}</Text>
                                    </View>
                                    )
                                    :
                                    (null)
                                }
                                {data['fContentStorePromo' + this.Language.toUpperCase()].fTypeDetail === 'url' &&
                                    data['fContentStorePromo' + this.Language.toUpperCase()].fURL !== '' ?
                                    (
                                    <View style={style.vView2}> 
                                        <WebViewRender nestedScrollEnabled={true} data={data['fContentStorePromo' + this.Language.toUpperCase()].fURL } style={style.throwWHP} fType='url'></WebViewRender>
                                    </View>
                                    )
                                    :
                                    (null)
                                }
                                {data['fContentStorePromo' + this.Language.toUpperCase()].fTypeDetail === 'html' &&
                                    data['fContentStorePromo' + this.Language.toUpperCase()].fHTML !== '' ?
                                    (
                                    <View style={style.vView2}> 
                                     <WebViewRender nestedScrollEnabled={true} data={data['fContentStorePromo' + this.Language.toUpperCase()].fHTML } style={style.throwWHP} fType='html'></WebViewRender>
                                    </View>
                                    )
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
                        </ScrollView>)
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyDetail')} style={style.throwWHP}></EmptyDetailView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                </Animated.View>
              
            </RootView>
        );
    }
}
