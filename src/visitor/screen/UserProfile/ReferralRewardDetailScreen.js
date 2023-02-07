
/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet,AppState,Linking,RefreshControl } from 'react-native';
import { SGView as View, SGQRImage as QRImage, SGImage as Image, SGScrollView as ScrollView, SGViewPager as ViewPager, SGDialogBox, SGRootView as RootView, SGText as Text, SGWebView as WebView, SGActivityIndicator as ActivityIndicator, SGButton as Button } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGPopView } from '../../../core/control/SGPopView';
import { CommentPopup } from '../../container_V2/CommentPopup';
import { SGLocalize } from '../../locales/SGLocalize'
import { SGHelperType, SGHelperNavigation, SGHelperErrorHandling ,SGHelperWindow} from '../../../core/helper';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperGlobalVar } from '../../../core/helper';
import { RewardDetailHeader } from '../../container_V2/RewardDetailHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { tbVReferralCodeAPI } from '../../api/tbVReferralCodeAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';

export class ReferralRewardDetailScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            textTitle: { alignSelf: 'flex-start', marginLeft: 4 * p, marginTop: 4 * p, color: '#7b7b7b' },
            throwWHP: { width: w, height: h, padding: p },
            sv1: { backgroundColor: 'white' },
            sv1_2: { justifyContent: 'flex-start', backgroundColor: 'white', },

            descriptionContainer: { width: w * 0.93, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 2 },
            totalAvilable: { color: '#63AEE0', alignSelf:'flex-end',paddingRight:4*p },
            webView: { width: '100%', height: w * 2 },
            button1: { justifyContent: "center", alignItems: 'center', backgroundColor: "#1DB382", width: w * 0.7, height: w * 0.1, marginHorizontal: 0, marginVertical: 4*p, borderRadius: 3 * p, paddingVertical: 0 },
            scV1:{width:w,marginVertical:2*p},
            vView2:{width: w - p * 10,flex:1},
            textPoint: {color: '#63AEE0'},
        });
    }

    showPopView(args) {
        SGPopView.showPopView(args[0]);
    }

    async tradePoint(data){
        try {
            var res = await tbVReferralCodeAPI.tradeReferralPoint(data.fID, data.fType)
            if(res == true){
                if(data.fTotalAvailable !== 0){
                    data.fTotalAvailable = data.fTotalAvailable -1;
                    this.totalPointAvailable = this.totalPointAvailable -this.data.fReferralPrice;
                }
                SGDialogBox.showSuccess(null, SGLocalize.translate('globalText.SuccessText'), SGLocalize.translate('globalText.SuccessClaimRefferalReward'), SGLocalize.translate('Alert.Close'), () => {this.forceUpdate()}, true)
            }else{
                SGDialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.FailClaimRefferalReward'), SGLocalize.translate('Alert.Close'))
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this.tradePoint.bind(this,data))
        }
    }

    async componentDidMount() {
        if (this.props.route.params.fType === "store" || this.props.route.params.fType === 'resto'){
            this.baseRunSingleAPIWithRedoOption('getTenantReferralRewardDetail', (async (v1) => { return tbVReferralCodeAPI.getTenantReferralRewardDetail(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
                this.data = v
                this._construcArrayOfLinks();
                this.calculateReward();
                this.alreadyMount = true;
                this.forceUpdate();
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));

        } 
        else if (this.props.route.params.fType === "building"){
            this.baseRunSingleAPIWithRedoOption('getTenantReferralRewardDetail', (async (v1) => { return tbVReferralCodeAPI.getBuildingReferralRewardDetail(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
                this.data = v
              
                this._construcArrayOfLinks();
                this.calculateReward();
                this.alreadyMount = true;
                this.forceUpdate();
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        } 
    }

    async _responRewardDone(){
        if (this.data.fAllocatedStatus === 'Y' && this.data.fRedeemedStatus === 'N' && this.data.fExpiredStatus === 'N') {
            await this._checkReward()
        }
        
    }

    _checkRewardHandler(tempRewardData){
        if (tempRewardData.fRedeemedStatus === 'Y') {
            SGDialogBox.showSuccess(null, SGLocalize.translate('RewardDetailScreen.ClaimedTitle'), SGLocalize.translate('RewardDetailScreen.Claimed'), SGLocalize.translate('Alert.Okay'), () => { this.props.route.params.callback(); SGHelperNavigation.goBack(this.props.navigation) }, true)
        } else if (tempRewardData.fExpiredStatus === 'Y') {
            this.data = tempRewardData
            SGDialogBox.showFail(null, SGLocalize.translate('RewardDetailScreen.ExpiredTitle'), SGLocalize.translate('RewardDetailScreen.Expired'), SGLocalize.translate('Alert.Close'))
        }
        this.calculateReward();
        this.alreadyMount = true;
        this.forceUpdate();
    }
    async _checkReward(){
        
        if (this.props.route.params.fType === "store" || this.props.route.params.fType === 'resto'){
            this.baseRunSingleAPIWithRedoOption('getTenantReferralRewardDetail', (async (v1) => { return tbVReferralCodeAPI.getTenantReferralRewardDetail(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
                var tempRewardData = v
                this._checkRewardHandler(tempRewardData)
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        } 
        else if (this.props.route.params.fType === "building") {
            this.baseRunSingleAPIWithRedoOption('getBuildingReferralRewardDetail', (async (v1) => { return tbVReferralCodeAPI.getBuildingReferralRewardDetail(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
                var tempRewardData = v
                this._checkRewardHandler(tempRewardData)
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        }
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
                // SGDialogBox.showWarning(null,SGLocalize.translate("AlertMessage.Whoops"),SGLocalize.translate("AlertMessage.AlertHandleLink"),SGLocalize.translate("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                // console.log("Don't know how to open URI: " + url);
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
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: this.data.storeKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
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

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
        }
        this.setState({ appState: nextAppState });
        
    };
    
    componentWillUnmount() {
        // AppState.removeEventListener('change', this._handleAppStateChange);
        clearInterval(this.interval);
        if (this._unsubscribe) { this._unsubscribe(); }
    }

   
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.pvID1 = SGPopView.getPopViewID();
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.data = {
            fID: 'null', fExpiredUseDate: new Date(0), fLocation: '',
            fRewardID: { fRewardName: '', fShortDescription: '', fLongDescription: '', fImageJSON: [], location: '' },
            fRewardEN: { fRewardName: '', fShortDescription: '', fLongDescription: '', fImageJSON: [], location: '' },
            fRewardCN: { fRewardName: '', fShortDescription: '', fLongDescription: '', fImageJSON: [], location: '' },
        }
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.alreadyMount = false;
        this.dateMaxExpiredUse = '';
        this.state = { appState: AppState.currentState,refreshing:false}
        this.arrayOfLinksContent = SGHelperGlobalVar.getVar("arrayOfLinks");
        this.arrayOfLinksData = [];
        this.totalPointAvailable =this.props.route.params.myPoint.totalAvailable;
    }

    _getCommentResourcePlaceRewardReferral(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentRewardID = data.fContentID;
        var contentRewardEN = data.fContentEN;
        var contentRewardCN = data.fContentCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RewardReferralPlace', fContentKey: data.fID,
                fContentName: { id: contentRewardID.fRewardName, en: contentRewardEN.fRewardName, cn: contentRewardCN.fRewardName },
                fContentText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText2: { id: contentRewardID.fShortDescription, en: contentRewardEN.fShortDescription, cn: contentRewardCN.fShortDescription },
                fContentImage: { id: contentRewardID.fImageJSON, en: contentRewardEN.fImageJSON, cn: contentRewardCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.buildingKey
            }
        )
    }

    _getCommentResourceStoreRewardReferral(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentRewardID = data.fContentID;
        var contentRewardEN = data.fContentEN;
        var contentRewardCN = data.fContentCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RewardReferralStore', fContentKey: data.fID,
                fContentName: { id: contentRewardID.fRewardName, en: contentRewardEN.fRewardName, cn: contentRewardCN.fRewardName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentRewardID.fTargetName, en: contentRewardEN.fTargetName, cn: contentRewardCN.fTargetName },
                fContentImage: { id: contentRewardID.fImageJSON, en: contentRewardEN.fImageJSON, cn: contentRewardCN.fImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.storeKey
            }
        )
    }

    _getCommentResourceRestoRewardReferral(data) {
        var contentRestoID = data.fContentStoreID;
        var contentRestoEN = data.fContentStoreEN;
        var contentRestoCN = data.fContentStoreCN;
        var contentRewardID = data.fContentID;
        var contentRewardEN = data.fContentEN;
        var contentRewardCN = data.fContentCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RewardReferralResto', fContentKey: data.fID,
                fContentName: { id: contentRewardID.fRewardName, en: contentRewardEN.fRewardName, cn: contentRewardCN.fRewardName },
                fContentText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText2: { id: contentRewardID.fTargetName, en: contentRewardEN.fTargetName, cn: contentRewardCN.fTargetName },
                fContentImage: { id: contentRewardID.fImageJSON, en: contentRewardEN.fImageJSON, cn: contentRewardCN.fImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetKey: data.storeKey
            }
        )
    }

    calculateReward(){
        var dateNow = new Date()
        var newDate = new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate()+this.data.fExpiredUse,dateNow.getHours(),dateNow.getMinutes(),dateNow.getSeconds());
        console.log(SGHelperType.formatDate(SGHelperType.convertNewDate(newDate),this._language.toUpperCase()))
        console.log(SGHelperType.formatDate(SGHelperType.convertNewDate(this.data.fExpiredDefinedDate),this._language.toUpperCase()))
        if(SGHelperType.convertNewDate(newDate) >= SGHelperType.convertNewDate(this.data.fExpiredDefinedDate)){
            this.dateMaxExpiredUse = this.data.fExpiredDefinedDate
        }else{
            this.dateMaxExpiredUse = newDate;
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
    _isRewardExpired(date){
        // return false
        return(date<new Date().toISOString())
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var data = this.data;
        var language = this._language.toUpperCase();
        var isRewardExpired = this._isRewardExpired(data.fEndDate)
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'RewardDetailScreenRootView'} style={style.mainContainer}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                {/* <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate('RewardDetailScreen.Title')}></RibbonHeader> */}
                <View style={{width:w, justifyContent:'space-between', flexDirection:'row', paddingHorizontal: p*4}}>
                    <Text preset={Text.preset.titleH2B} style={style.text}>{SGLocalize.translate('RewardDetailScreen.Title')}</Text>
                    <Text preset={Text.preset.titleH3B} style={style.textPoint}>{SGLocalize.translate('RewardDetailScreen.ReferralPoint')} {this.totalPointAvailable}</Text>
                 </View>
                {this.alreadyMount ?
                    this.data !== null ?
                        (
                        // <View>
                            <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RewardDetailScreenScrollView'} style={style.sv1} contentContainerStyle={style.sv1_2} showsVerticalScrollIndicator={false} refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._responRewardDone.bind(this)}
                                /> }>
                                   <SGPopView accessible={true} accessibilityLabel={'RewardDetailScreenPopView'} vPos={'Top'} modal popViewID={this.pvID1}>
                                        <CommentPopup accessible={true} accessibilityLabel={'RewardDetailScreenCommentPopup'} popViewID={this.pvID1} style={style.throwWHP}></CommentPopup>
                                    </SGPopView>
                                    <Text accessible={true} accessibilityLabel={'RewardDetailScreenRewardName'} preset={Text.preset.titleH1B} style={style.textTitle} numberOfLines={1}>{(data['fContent' + language].fRewardName).toUpperCase()}</Text>
                                    <Text accessible={true} accessibilityLabel={'TotalAvailable'} preset={Text.preset.titleH3B} style={style.totalAvilable}>{SGLocalize.translate('MyReferralScreen.totalAvailable')} {data.fTotalAvailable}</Text>
                                    {data.fType === 'building' ?
                                        (<RewardDetailHeader accessible={true} accessibilityLabel={'RewardDetailScreenHeader'} commentPackage={this._getCommentResourcePlaceRewardReferral(this.data)} imageSetting={this.imageSetting} footerKey={data.buildingKey} contentType={'RewardReferralPlace'} fType={data.fType} canComment={data.fCanComment} footerName={data['fContentBuilding' + language].fBuildingName} footerLogo={data['fContentBuilding' + this.Language.toUpperCase()].fImageJSON[0]} footerLikedCount={data.fLikeCountBuilding} imageSlider={data['fContent' + language].fImageJSON} contentKey={data.fID} navigator={this.props.navigation} city={data.fCity} referralPrice = {data.fReferralPrice} validDate={SGHelperType.formatDate(SGHelperType.convertNewDate(this.dateMaxExpiredUse),this._language.toUpperCase())} referralRewardStyle style={style.throwWHP}></RewardDetailHeader>)
                                        :
                                        (null)}
                                    {data.fType === 'store' ?
                                        (<RewardDetailHeader accessible={true} accessibilityLabel={'RewardDetailScreenHeader'} commentPackage={this._getCommentResourceRestoRewardReferral(this.data)} imageSetting={this.imageSetting} footerKey={data.storeKey} contentType={'RewardReferralStore'} fType={data.fType} canComment={data.fCanComment} footerName={data['fContent' + language].fTenantName} footerLogo={data['fContentStore' + this.Language.toUpperCase()].fStoreImageJSON[0]} footerLikedCount={data.fLikeCountStore} imageSlider={data['fContent' + language].fImageJSON} placeName={data['fContent' + language].fTargetName} isUserLikeThis={data.isUserLikeThis} contentKey={data.fID} navigator={this.props.navigation} storeCategory={data.storeCategory} referralPrice = {data.fReferralPrice} referralRewardStyle validDate={SGHelperType.formatDate(SGHelperType.convertNewDate(this.dateMaxExpiredUse),this._language.toUpperCase())} style={style.throwWHP}></RewardDetailHeader>)
                                        :
                                        (null)
                                    }
                                    {data.fType === 'resto' ?
                                        (<RewardDetailHeader accessible={true} accessibilityLabel={'RewardDetailScreenHeader'} commentPackage={this._getCommentResourceRestoRewardReferral(this.data)} imageSetting={this.imageSetting} footerKey={data.storeKey} contentType={'RewardReferralResto'} fType={data.fType} canComment={data.fCanComment} footerName={data['fContent' + language].fTenantName} footerLogo={data['fContentStore' + this.Language.toUpperCase()].fStoreImageJSON[0]} footerLikedCount={data.fLikeCountStore} imageSlider={data['fContent' + language].fImageJSON} placeName={data['fContent' + language].fTargetName} isUserLikeThis={data.isUserLikeThis} contentKey={data.fID} navigator={this.props.navigation} restoCategory={data.storeCategory} restoCuisine={data.restoCuisine} referralPrice = {data.fReferralPrice} referralRewardStyle validDate={SGHelperType.formatDate(SGHelperType.convertNewDate(this.dateMaxExpiredUse),this._language.toUpperCase())} style={style.throwWHP}></RewardDetailHeader>)
                                        :
                                        (null)
                                    }
                                    <View accessible={true} accessibilityLabel={'PlaceEventDetailScreenContentView'} style={style.descriptionContainer}>
                                        {data['fContent' + language].fTypeDetail === 'longdescription' ?
                                            (
                                            <View style={style.vView2}> 
                                              <Text accessible={true} accessibilityLabel={'PlaceEventDetailScreenDescText'} preset={Text.preset.titleH3} style={style.descriptionText}>{data['fContent' + language].fLongDescription}</Text>
                                            <ScrollView style={style.scV1}>
                                            { this.arrayOfLinksData.map((item, i) => {
                                            return (
                                            <IconArrayOfLinks accessible={true} accessibilityLabel={'IconArrayOfLinks'} style={style.throwWHP}  data={item}  onIconArrayPress={this.handleLinkArrayOfLinks.bind(this, item)}  arrImage={item.arrContent.content.fImageJSON[0][this.imageSetting].uri}></IconArrayOfLinks >
                                                    );
                                                })
                                            }
                                            </ScrollView>
                                            </View>
                                          
                                            )
                                            :
                                            (null)
                                        }
                                        {data['fContent' + language].fTypeDetail === 'url' && data['fContent' + language].fURL !== '' ?
                                            (
                                            <View style={style.vView2}> 
                                                <View style={{width:w-16*p,height:h}}> 
                                                    <WebView accessible={true} accessibilityLabel={'RefferalRewardDetailUrl'} style={{flex:1,backgroundColor:'white'}} source={{ uri: data['fContent' + language].fURL }}></WebView>
                                                </View>
                                            <ScrollView style={style.scV1}>
                                            { this.arrayOfLinksData.map((item, i) => {
                                            return (
                                            <IconArrayOfLinks accessible={true} accessibilityLabel={'IconArrayOfLinks'} style={style.throwWHP}  data={item}  onIconArrayPress={this.handleLinkArrayOfLinks.bind(this, item)}  arrImage={item.arrContent.content.fImageJSON[0][this.imageSetting].uri}></IconArrayOfLinks >
                                                    );
                                                })
                                            }
                                            </ScrollView>
                                            </View>
                                           
                                            )
                                            :
                                            (null)
                                        }
                                        {data['fContent' + language].fTypeDetail === 'html' && data['fContent' + language].fHTML !== '' ?
                                            (
                                            <View style={style.vView2}> 
                                                <View style={{width:w-16*p,height:h}}> 
                                                    <WebView accessible={true} accessibilityLabel={'RefferalRewardDetailHtml'} style={{flex:1,backgroundColor:'white'}} source={{ html: data['fContent' + language].fHTML }}></WebView>
                                                </View>
                                            <ScrollView style={style.scV1}>
                                            { this.arrayOfLinksData.map((item, i) => {
                                            return (
                                            <IconArrayOfLinks accessible={true} accessibilityLabel={'IconArrayOfLinks'} style={style.throwWHP}  data={item}  onIconArrayPress={this.handleLinkArrayOfLinks.bind(this, item)}  arrImage={item.arrContent.content.fImageJSON[0][this.imageSetting].uri}></IconArrayOfLinks >
                                                    );
                                                })
                                            }
                                            </ScrollView>
                                            </View>
                                          
                                            )
                                            :
                                            (null)
                                        }
                                    </View>
                                    <Button disabled={isRewardExpired} accessible={true} accessibilityLabel={'SignInScreenSignInButton'} textPreset={Text.preset.titleH3B} style={!isRewardExpired? style.button1:[style.button1,{backgroundColor:'rgb(220,220,220)'}]} label={isRewardExpired ?SGLocalize.translate("ReferralButton.Expired") :SGLocalize.translate('ReferralButton.Trade')} onPress={()=> {this.tradePoint(data)}}></Button>

                               
                            </ScrollView>
                        // {/* </View> */}
                        )
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyDetail')} style={style.throwWHP}></EmptyDetailView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <BottomNavigationContainer accessible={true} accessibilityLabel={'RewardDetailScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}
