/*
 * Version 1.2.0
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 * 2. Leon, 4 May 2021
   - Fix Like
    *Version 1.1.0
    Change Log By Melvin -> Fixing Hide Add On when not customize and Change Unavailable icon logo on customize
*/
import React from 'react';
import { StyleSheet, Animated,Linking,FlatList, Alert } from 'react-native';
import { SGRootView as RootView, SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGScrollView as ScrollView, SGViewPager as ViewPager, SGDialogBox as DialogBox, SGWebView as WebView, SGActivityIndicator as ActivityIndicator,SGPopView, } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { RestoMenuDetailHeader } from '../../container_V2/RestoMenuDetailHeader';
import { VRestoMenuDetailAPI } from '../../api/VRestoMenuDetailAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';
import { VRestoHomeAPI } from '../../api/VRestoHomeAPI';
import { WebViewRender } from '../../component_V2/WebViewRender';
import {VRewardAPI} from '../../api/VRewardAPI';

export class RestoMenuDetailScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            scrollContainer: { backgroundColor: '#FFFFFF' },
            scrollContainerContent: { backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            scV1:{width:w,marginVertical:2*p},
            vView1:{width: w,flex:1},
            vView2:{width: w,height:h},
            descriptionContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 5 },
            descriptionText: { alignSelf: 'flex-start',paddingLeft:5*p },

             //style popup reward
             rewardPV: { width: w - 12 * p, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' },
             headerPV: { width: w - 22 * p, paddingVertical: 2 * p },
             textPV1: { color: '#484848' },
             textPV2: { color: '#858585' },
             textPV3: { color: '#484848', marginVertical: p,alignItems:'flex-start' },
             textPV4: { color: '#484848', alignSelf: 'flex-start', marginVertical: p,paddingLeft:4*p},
             imagePV: { width: w * 0.667, height: w * 0.375, padding: p, marginVertical: 2 * p },
             buttonPV: { backgroundColor: '#01BBA0', width: w * 0.38, height: w * 0.1, borderRadius: p,alignItems:'center',justifyContent:'center'},
             buttonViewPV: { flexDirection: 'row', justifyContent: 'space-around', width: w - 22 * p, marginVertical: 2 * p },
        });
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            // await this._onRefreshAllItem();
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
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey:  this.data.restoKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
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


    async checkAPIBatchStatusAllDone(){
        if (this.data !== null) {
            this._construcArrayOfLinks();
    
            this.dataContent = this.data['fContentProduct' + this.Language.toUpperCase()];
            this.dataContentFooter = this.data['fContentResto' + this.Language.toUpperCase()];
        }
        if (this.alreadyMount === false) {
            var jsonInput = { fID: '', fContentType: 'RestoMenu', fContentKey: this.props.route.params.contentKey, fTargetKey: this.props.route.params.restoKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
            await this._addUserView(jsonInput)
        }

        this.alreadyMount = true;
        this.forceUpdate();

        console.log('resto menu')
        if(this.props.route.params.qr){
            console.log('qr reward')
            this.props.route.params.qr = false;
            await this._callReward() 
            //Pasang API QR Open Reward Disini
        }
    }

    onHideReward() {
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        SGPopView.hidePopView(this.pvID);
    }

    onShowReward() {
        setTimeout(() => { SGPopView.showPopView(this.pvID); this.forceUpdate(); }, 300);
    }

    async _callReward(){
        this.baseRunSingleAPIWithRedoOption('SurpriseRewardsOpenQRProduct', (async (v1,v2) => { return VRewardAPI.SurpriseRewardsOpenQRProduct(v1,v2) }).bind(this,this.props.route.params.restoKey,this.props.route.params.contentKey), (async (v) => {
            this.surpriseReward = v;
            if (this.surpriseReward.fID !== null) {
                this.onShowReward()
            }
        }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
    }

    async _onRefreshAllItem() {

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        
        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

        this.baseAddAPIParallel('getRestoSettings', (async (v1) => { return VRestoHomeAPI.getRestoSettings(v1) }).bind(this,this.props.route.params.restoKey), ((v) => {
                this.restoSettingsData = v 
                // console.log(v)
                console.log("RESTORAN SETTING Check")
                this.reservationActiveChecker();
                this.waitingListActiveChecker();
                this.orderMenuActiveChecker();
        }).bind(this), null);

        this.baseAddAPIParallel('getRestoProductDetail', (async (v1,v2) => { return VRestoMenuDetailAPI.getRestoProductDetail(v1,v2) }).bind(this,this.props.route.params.contentKey,this.props.route.params.restoKey), ((v) => {
            this.data = v 
            console.log('Resto Product Detail')
            // console.log(this.data)
        }).bind(this), null);

        this.baseRunAPIParallel();
    }

     // this.baseRunSingleAPIWithRedoOption('getRestoProductDetail', (async (v1,v2) => { return VRestoMenuDetailAPI.getRestoProductDetail(v1,v2) }).bind(this,this.props.route.params.contentKey,this.props.route.params.restoKey), (async (v) => {
        //     this.data = v //await VRestoMenuDetailAPI.getRestoProductDetail(this.props.route.params.contentKey, this.props.route.params.restoKey);

           
        // }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));

    async _addUserView(jsonInput){
        try {
            await tbVUserViewAPI.addUserView(jsonInput)
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

        this.pvID = SGPopView.getPopViewID();
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }

        this.data = '';
        this.dataContent = '';
        this.dataContentFooter = '';
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.contentKey = this.props.route.params.contentKey;
        this.restoKey = this.props.route.params.restoKey;
        this.alreadyMount = false;
        this.arrayOfLinksContent = SGHelperGlobalVar.getVar("arrayOfLinks");
        this.arrayOfLinksData = [];
        this.storeActivateWaitingList = false;
        this.storeActivateReservation = false;
        this.storeActiveOrderMenu = false;
        this.orderMenuTab = 2;
    }

    _getLikeResource(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentID = data.fContentProductID;
        var contentEN = data.fContentProductEN;
        var contentCN = data.fContentProductCN;
        return (
            { fContentType: 'RestoMenu', fContentKey: data.key, fText1: { id: contentID.fProductName, en: contentEN.fProductName, cn: contentCN.fProductName }, fText2: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.restoKey }
        )
    }

    _getCommentResource(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentID = data.fContentProductID;
        var contentEN = data.fContentProductEN;
        var contentCN = data.fContentProductCN;

        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RestoMenu', fContentKey: data.key,
                fContentName: { id: contentID.fProductName, en: contentEN.fProductName, cn: contentCN.fProductName },
                fContentText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText2: { id: contentID.fShortDescription, en: contentEN.fShortDescription, cn: contentCN.fShortDescription },
                fContentImage: { id: contentID.fImageJSON, en: contentEN.fImageJSON, cn: contentCN.fImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetKey: data.restoKey
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

    waitingListActiveChecker(){
        this.restoSettingsData.fShownWaitingList == "Y"?this.storeActivateWaitingList = false : this.storeActivateWaitingList = true;
    }

    reservationActiveChecker(){
        this.restoSettingsData.fShownReservation == "Y"?this.storeActivateReservation = false : this.storeActivateReservation = true;
    }

    orderMenuActiveChecker(){
        this.restoSettingsData.fShownOrderMenu == "Y"?this.storeActiveOrderMenu = false : this.storeActiveOrderMenu = true;
        if(this.restoSettingsData.fShownWaitingList == "Y" || this.restoSettingsData.fShownReservation == "Y"){
            this.orderMenuTab = 3;
        } else {
            this.orderMenuTab = 2;
        }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var surpriseReward = this.surpriseReward;
        var tR = SGLocalize.translate;
        var language = this.Language.toUpperCase()
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'RestoMenuDetailScreenRootView'} style={style.mainContainer}>
                
                <SGPopView accessible={true} accessibilityLabel={'MallHomeScreenPopView'} vPos={'Top'} animationType={'slideUp'}  popViewID={this.pvID} >
                    <View accessible={true} accessibilityLabel={'MallHomeScreenRewardView'} style={style.rewardPV}>
                        <View accessible={true} accessibilityLabel={'MallHomeScreenHeaderRewardView'} style={style.headerPV}>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenCongratsText'} style={style.textPV1} preset={Text.preset.titleH2B}>{tR('mallHomeScreen.RewardCongratulation')}</Text>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardText'} style={style.textPV2} preset={Text.preset.titleH4_5B}>{tR('mallHomeScreen.RewardText')} {surpriseReward['fReward' + language].fTenantName}</Text>
                            <Image accessible={true} accessibilityLabel={'MallHomeScreenRewardImage'} style={style.imagePV} source={{ uri: surpriseReward['fReward' + language].fImageJSON.length !== 0 ? surpriseReward['fReward' + language].fImageJSON[0][this.imageSetting].uri : '' }}></Image>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardName'} style={style.textPV3} preset={Text.preset.titleH3B}>{surpriseReward['fReward' + language].fRewardName}</Text>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenShortDesc'} style={style.textPV4} preset={Text.preset.titleH4}>{surpriseReward['fReward' + language].fShortDescription}</Text>
                            <View accessible={true} accessibilityLabel={'MallHomeScreenButtonView'} style={style.buttonViewPV}>
                                <Button accessible={true} accessibilityLabel={'MallHomeScreenOkButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.Okay')} onPress={() => this.onHideReward(this.pvID)}></Button>
                                <Button accessible={true} accessibilityLabel={'MallHomeScreenMyRewardsButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.MyRewards')} onPress={() => { this.onHideReward(this.pvID); SGHelperNavigation.navigatePush(this.props.navigation, 'MyRewards') }}></Button>
                            </View>
                        </View>
                    </View>
                </SGPopView>

                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("restoMenuDetailScreen.title")}></RibbonHeader>
                {this.alreadyMount ?
                    this.data !== null ?
                        (<View accessible={true}>
                            <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RestoMenuDetailScreenScrollView'} style={style.scrollContainer} contentContainerStyle={style.scrollContainerContent} showsVerticalScrollIndicator={false}>
                                {/* <Text accessible={true} accessibilityLabel={'RestoMenuDetailScreenTitle'} preset={Text.preset.h6_5B} style={style.textTitle} numberOfLines={1}>{(this.dataContent.fProductName).toUpperCase()}</Text> */}
                                <RestoMenuDetailHeader whatsapp={this.data.whatsapp} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this, this.data)} accessible={true} accessibilityLabel={'RestoMenuDetailScreenHeader'} currency={this.currentUserCurrency} likePackage={this._getLikeResource(this.data)} commentPackage={this._getCommentResource(this.data)} language={this.Language} productName={(this.dataContent.fProductName).toUpperCase()} imageSetting={this.imageSetting} data={this.data} style={style.throwWHP} likeCount={this.data.fLikeCountProduct} navigator={this.props.navigation}></RestoMenuDetailHeader>
                                {/* <RestoMenuDetailHeader accessible={true} accessibilityLabel={'RestoMenuDetailScreenHeader'} data={data} likePackage={this._getLikeResource(data)} commentPackage={this._getCommentResource(data)} language={this.Language} imageSetting={this.imageSetting} data={this.data} style={style.throwWHP}></RestoMenuDetailHeader> */}
                                <View accessible={true} accessibilityLabel={'RestoMenuDetailScreenContentView'} style={style.descriptionContainer}>
                                    {this.dataContent.fTypeDetail === 'longdescription' ?
                                        (
                                        <View style={style.vView1}> 
                                        <Text accessible={true} accessibilityLabel={'RestoMenuDetailScreenDescText'} preset={Text.preset.titleH3} style={style.descriptionText}>{this.dataContent.fLongDescription}</Text>
                                       </View>
                                        )
                                        :
                                        (null)
                                    }
                                    {this.dataContent.fTypeDetail === 'url' && this.dataContent.fURL !== '' ?
                                        (
                                        <View style={style.vView2}> 
                                            <WebViewRender nestedScrollEnabled={true} data={this.dataContent.fURL} style={style.throwWHP} fType='url'></WebViewRender>
                                        </View>
                                        )
                                        :
                                        (null)
                                    }
                                    {this.dataContent.fTypeDetail === 'html' && this.dataContent.fHTML !== '' ?
                                        (
                                        <View style={style.vView2}> 
                                        <WebViewRender nestedScrollEnabled={true} data={this.dataContent.fHTML} style={style.throwWHP} fType='html'></WebViewRender>
                                        </View>
                                        )
                                        :
                                        (null)
                                    }
                                     {this.arrayOfLinksData.map((item, i) => {
                                            return (
                                            <IconArrayOfLinks accessible={true} accessibilityLabel={'IconArrayOfLinks'} style={style.throwWHP}  data={item}  onIconArrayPress={this.handleLinkArrayOfLinks.bind(this, item)}  arrImage={item.arrContent.content.fImageJSON[0][this.imageSetting].uri}></IconArrayOfLinks >
                                                    );
                                                })
                                      }
                                    <ScrollView  horizontal contentContainerStyle={{width:w,flexDirection:'row',justifyContent:'space-evenly', alignItem:'center'}}>
                                        <Button disabled={this.storeActivateReservation} preset={Button.preset.yellow} textPreset={Text.preset.h8B} label={SGLocalize.translate("MyBooking.tabReservationTitle")} onPress={()=>{SGHelperNavigation.navigatePush(this.props.navigation, 'RestoReservation', {restoKey: this.restoKey})}}></Button>
                                        <Button disabled={this.storeActivateWaitingList} preset={Button.preset.blue} textPreset={Text.preset.h8B} label={SGLocalize.translate("MyBooking.tabWaitingListTitle")} onPress={()=>{SGHelperNavigation.navigatePush(this.props.navigation, 'RestoWaitingList', {restoKey: this.restoKey})}}></Button>
                                        <Button disabled={this.storeActiveOrderMenu} preset={Button.preset.green} textPreset={Text.preset.h8B} label={SGLocalize.translate("MyBooking.tabOrderMenuTitle")} onPress={()=>{SGHelperNavigation.navigatePush(this.props.navigation, 'RestoHome', {contentKey: this.restoKey, movetoOrderMenu:true})}}></Button>
                                    </ScrollView> 
                                </View>
                            </ScrollView>
                            <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight(), backgroundColor: '#181818' }}></View>
                            <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() * 2, backgroundColor: '#181818' }}></View>
                        </View>)
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