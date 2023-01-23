/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Animated,Linking } from 'react-native';
import { SGRootView as RootView, SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGScrollView as ScrollView, SGViewPager as ViewPager, SGActivityIndicator as ActivityIndicator, SGWebView as WebView, SGDialogBox } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { EventDetailHeader } from '../../container_V2/EventDetailHeader';
import { VPlaceEventDetailAPI } from '../../api/VPlaceEventDetailAPI';
import { BackMenuBar } from '../../component_V2/BackMenuBar';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbVNotificationAPI } from '../../api/tbVNotificationAPI';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';
import { WebViewRender } from '../../component_V2/WebViewRender';

export class PlaceEventDetailScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            eventNameText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4, marginTop: p * 3 },
            shortDescText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4,marginVertical:p },
            sv1: { backgroundColor: 'white' },
            sv1_2: { justifyContent: 'flex-start',backgroundColor: 'white'},
            throwWHP: { width: w, height: h, padding: p },
            textContentLiked: { color: '#A7A7A7', alignSelf: 'flex-start', marginHorizontal: p * 4 },
            descriptionContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 2 },
            descriptionText: { color: '#000000',paddingLeft:5*p, alignSelf: 'flex-start' },
            webView: { width: '100%', height: w * 2 },
            scV1:{width:w,marginVertical:2*p},
            vView1:{width: w,flex:1},
            vView2:{width: w,height:h},

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
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey:  this.data.buildingKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
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


    async _onRefreshAllItem() {
        try {
            this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
            this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
            this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
            this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
            if (SGHelperType.isDefined(this.props.route.params.notificationKey)) {
                await tbVNotificationAPI.readStatus(this.props.route.params.notificationKey)
            }
            this.baseRunSingleAPIWithRedoOption('getPlaceEventDetail', (async (v1) => { return VPlaceEventDetailAPI.getPlaceEventDetail(v1) }).bind(this,this.props.route.params.contentKey), (async(v) => {
                this.data = v 
                console.log(this.data);
                if (this.data !== null) {
                    this._construcArrayOfLinks();
                    this.dataContent = this.data['fContentBuildingEvent' + this.Language.toUpperCase()];
                    this.dataContentFooter = this.data['fContentBuilding' + this.Language.toUpperCase()];
                }
        
                if (this.alreadyMount === false) {
                    if(this.data !== null){
                        var jsonInput = { fID: '', fContentType: 'PlaceEvent', fContentKey: this.data.key, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date(), fTargetKey: this.data.buildingKey }
                        await this._addUserView(jsonInput)
                    }
                }
                this.alreadyMount = true;
                this.forceUpdate();
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
            
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._onRefreshAllItem.bind(this))
        }
       
    }
    async _addUserView(jsonInput){
        try {
            await tbVUserViewAPI.addUserView(jsonInput);
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addUserView.bind(this,jsonInput),null,false)
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
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
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentBuildingEventID = data.fContentBuildingEventID;
        var contentBuildingEventEN = data.fContentBuildingEventEN;
        var contentBuildingEventCN = data.fContentBuildingEventCN;
        return (
            { fContentType: 'PlaceEvent', fContentKey: data.key, fText1: { id: contentBuildingEventID.fEventName, en: contentBuildingEventEN.fEventName, cn: contentBuildingEventCN.fEventName }, fText2: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fText3: { id: contentBuildingEventID.fShortDescription, en: contentBuildingEventEN.fShortDescription, cn: contentBuildingEventCN.fShortDescription }, fImageID: contentBuildingEventID.fImageJSON, fImageEN: contentBuildingEventEN.fImageJSON, fImageCN: contentBuildingEventCN.fImageJSON, fTargetKey: data.buildingKey }
        )
    }

    _getCommentResource(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentBuildingEventID = data.fContentBuildingEventID;
        var contentBuildingEventEN = data.fContentBuildingEventEN;
        var contentBuildingEventCN = data.fContentBuildingEventCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'PlaceEvent', fContentKey: data.key,
                fContentName: { id: contentBuildingEventID.fEventName, en: contentBuildingEventEN.fEventName, cn: contentBuildingEventCN.fEventName },
                fContentText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText2: { id: contentBuildingEventID.fShortDescription, en: contentBuildingEventEN.fShortDescription, cn: contentBuildingEventCN.fShortDescription },
                fContentImage: { id: contentBuildingEventID.fImageJSON, en: contentBuildingEventEN.fImageJSON, cn: contentBuildingEventCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.buildingKey
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
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'PlaceEventDetailScreenRootView'} style={style.mainContainer}>
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("placeEventDetailScreen.title")} ribbonWidth={0.6}></RibbonHeader>
                {this.alreadyMount ?
                    this.data !== null ? 
                        (<ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'PlaceEventDetailScreenScrollView'} style={style.sv1} contentContainerStyle={style.sv1_2} showsVerticalScrollIndicator={false}>
                            <Text accessible={true} accessibilityLabel={'PlaceEventDetailScreenTitle'} preset={Text.preset.titleH1B} style={style.eventNameText}>{(this.dataContent.fEventName)}</Text>
                            <Text accessible={true} accessibilityLabel={'PlaceEventShortDescription'} preset={Text.preset.titleH3} style={style.shortDescText}>{(this.dataContent.fShortDescription)}</Text>
                            <Text accessible={true} accessibilityLabel={'PlaceEventDetailScreenLikeCount'} preset={Text.preset.titleH4B} style={style.textContentLiked}>{this.data.fLikeCountEvent} {SGLocalize.translate('globalText.likeCountText')}</Text>
                            <EventDetailHeader whatsapp={this.data.whatsapp} eventName={this.dataContent.fEventName} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountEvent+=c; this.forceUpdate();}).bind(this,this.data)} accessible={true} accessibilityLabel={'PlaceEventDetailScreenHeader'} imageSetting={this.imageSetting} language={this.Language} contentType='PlaceEvent' likePackage={this._getLikeResource(this.data)} commentPackage={this._getCommentResource(this.data)} footerName={this.dataContentFooter.fBuildingName} footerLogo={this.dataContentFooter.fImageJSON[0][this.imageSetting].uri} footerLocation={this.data.location} footerLikedCount={this.data.fLikeCountBuilding} imageSlider={this.dataContent.fImageJSON} isUserLikeThis={this.data.fUserLikedThis} contentKey={this.data.key} buildingKey={this.data.buildingKey} navigator={this.props.navigation} startDate={this.data.startDate} endDate={this.data.endDate} shareMessage={this.dataContent.fShareMessage} targetKey={this.data.buildingKey} canComment={this.data.fCanComment} style={style.throwWHP}></EventDetailHeader>
                            <View accessible={true} accessibilityLabel={'PlaceEventDetailScreenContentView'} style={style.descriptionContainer}>
                                {this.dataContent.fTypeDetail === 'longdescription' ?
                                    (
                                    <View style={style.vView1}> 
                                        <Text accessible={true} accessibilityLabel={'PlaceEventDetailScreenDescText'} preset={Text.preset.titleH3} style={style.descriptionText}>{this.dataContent.fLongDescription}</Text>
                                    </View>
                                    )
                                    :
                                    (null)
                                }
                                {this.dataContent.fTypeDetail === 'url' && this.dataContent.fURL !== '' ?
                                    (
                                    <View style={style.vView2}> 
                                          <WebViewRender nestedScrollEnabled={true} data={ this.dataContent.fURL } style={style.throwWHP} fType='url'></WebViewRender>
                                    </View>
                                    )
                                    :
                                    (null)
                                }
                                {this.dataContent.fTypeDetail === 'html' && this.dataContent.fHTML !== '' ?
                                    (
                                    <View style={style.vView2}> 
                                     <WebViewRender nestedScrollEnabled={true} data={ this.dataContent.fHTML} style={style.throwWHP} fType='html'></WebViewRender>
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
