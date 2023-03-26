/**
 * Version 1.2.0
 * 1. Yohanes 05 April 2021
 * - add ErrorHandling
* Leon, 4 May 2021
  - Fix Like, Fix Favroite
*/
 import React from 'react';
 import { StyleSheet, Alert, Animated, Platform,  } from 'react-native';
 import { SGView as View, SGRootView as RootView, SGTabView as TabView, SGText as Text, SGImage as Image, SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity, SGPopView, SGActivityIndicator as ActivityIndicator, SGButton as Button,SGDialogBox,SGWebView as WebView } from '../../../core/control';
 import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
 import { StorePromoSlider } from '../../container_V2/StorePromoSlider';
 import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
 import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
 import { SGLocalize } from '../../locales/SGLocalize';
 import { StoreHomeHeader } from '../../container_V2/StoreHomeHeader';
 import {StoreHomeNewHeader} from '../../container_V2/StoreHomeNewHeader';
 import {StoreHomeNewHeaderLuxury} from '../../container_V2/StoreHomeNewHeaderLuxury';
 import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType ,SGHelperErrorHandling} from '../../../core/helper';
 import { StoreProductCategorySlider } from '../../container_V2/StoreProductCategorySlider';
 import Carousel from 'react-native-snap-carousel';
 import { CarouselProductCard } from '../../container_V2/CarouselProductCard';
 import { CarouselProductPdfCard } from '../../container_V2/CarouselProductPdfCard';
 import { VStoreHomeAPI } from '../../api/VStoreHomeAPI';
 import { VStoreProfileAPI } from '../../api/VStoreProfileAPI';
 import { tbVUserCheckInAPI } from '../../api/tbVUserCheckInAPI';
 import { VRewardAPI } from '../../api/VRewardAPI';
 import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
 import { tbUserCheckInData } from '../../db/tbUserCheckInDAO';
 import { sortDAO } from '../../db/sortDAO';
 import { VisitorHelper } from '../../helper/VisitorHelper';
 import { WebViewRender,WebViewButton } from '../../component_V2/WebViewRender';
 import {tbVAuctionAPI} from '../../api/tbVAuctionAPI';
 import {AuctionSlider} from '../../container_V2/AuctionSlider';

 export class StoreHomeScreen extends SGBaseScreen {
 
     getPagingData(){
         var itemPerPage = SGHelperType.getPaging()
         return {paging:false,offset:this.pagingCounter, totalPerPage:itemPerPage}
     }
 
     async componentDidMount() {
         await this._onRefreshAllItem(false);
         this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.touhableWL = false;
            this.touchableR = false;
            await this._onRefreshAllItem(true);
         });
     }
     
     componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async checkAPIBatchStatusAllDone(onFocusFlag) {

        try {
            await this._showProduct(onFocusFlag)
           
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this.checkAPIBatchStatusAllDone.bind(this))
        }
    }
    async checkAPIBatchStatusAllDone1(onFocusFlag){
        this._checkUserView()
        this._SurpriseRewardOpenStore(onFocusFlag);
        this.alreadyMount = true;
        this.forceUpdate();

        if(SGHelperType.isDefined(this.props.route.params.movetostorecatalog) && this.props.route.params.movetostorecatalog == true){
            this.props.route.params.movetostorecatalog = false;
            if(this.storeProductCategoryData.length !== 0){
                setTimeout((()=>{this.refs.TV1.goToPageLabel(SGLocalize.translate("storeHomeScreen.PromoAndCatalog"))}).bind(this),300);
            }
        }

        // if (!this.animFlag) { setTimeout(() => { this.animFlag = true; this.baseCreateAnimation(500, null); }, 1000); }
    }
    async _onRefreshAllItem(onFocusFlag) {
         this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
         this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
         this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
         this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
         this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
         this.paging = this.getPagingData();
 
         this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(onFocusFlag); }).bind(this));
         this.baseAddAPIParallel('getStoreSettings', (async (v1) => { return VStoreHomeAPI.getStoreSettings(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
             this.storeSettingsData = v 
             if(this.storeSettingsData.fShownReservation =='Y' || this.storeSettingsData.fShownWaitingList =='Y'){
                 this.showBooking = true;
             }
         }).bind(this), null); 
       
         this.baseAddAPIParallel('CheckUserCheckInHere', (async (v1) => { return tbVUserCheckInAPI.CheckUserCheckInHere(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
             this.isAlreadyCheckIn = v   
         }).bind(this), null);
         this.baseAddAPIParallel('getStoreHomeHeader', (async (v1) => { return VStoreHomeAPI.getStoreHomeHeader(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
             this.storeHeaderData = v  
             if(this.storeHeaderData.fLuxuryMode == 'Y') this.luxuryMode = true;
             else this.luxuryMode = false;
         }).bind(this), null);
         this.baseAddAPIParallel('getStoreHomeProfile', (async (v1) => { return VStoreProfileAPI.getStoreHomeProfile(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.storeProfileData = v
            console.log('STORE PROFILE')
            console.log(this.storeProfileData)  
            console.log('<h1>Heading1</h1><iframe width="100%" height="35%" src='+'"'+this.storeProfileData.linkYoutube+'"'+' allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen></iframe>')
        }).bind(this), null);
         this.baseAddAPIParallel('getStorePromoSlider', (async (v1) => { return VStoreHomeAPI.getStorePromoSlider(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
             this.storePromoData = v 
         }).bind(this), null);

         this.baseAddAPIParallel('searchStoreAuctionSlider', (async (v1) => { return tbVAuctionAPI.searchStoreAuctionSlider(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.storeAuctionData = v 
            console.log('searchStoreAuctionSlider')
            console.log(this.storeAuctionData);
        }).bind(this), null);


         this.baseAddAPIParallel('getStoreTrendingProductList', (async (v1) => { return VStoreHomeAPI.getStoreTrendingProductList(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
             this.storeTrendingProductDataList = v 
         }).bind(this), null);
         this.baseRunAPIParallel();
        
    }

    _checkTabPromoAndCatalog(){
        if(this.storeSettingsData.fShowHighlightType == 'typeB' && this.storeProfileData.linkWebsite !== ''){
            return true;
        }else if(this.storeSettingsData.fShowHighlightType == 'typeC' && this.storeProfileData.linkInstagram !== ''){
            return true;
        }else if(this.storeSettingsData.fShowHighlightType == 'typeD' && this.storeProfileData.linkFacebook !== ''){
            return true;
        }
        return false
    }

    async _checkUserView(){
         if (this.alreadyMount === false) {
             var jsonInput = { fID: '', fContentType: 'Store', fContentKey: this.props.route.params.contentKey, fTargetKey: this.props.route.params.contentKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
             try {
                 await tbVUserViewAPI.addUserView(jsonInput);
             } catch (error) {
                 SGHelperErrorHandling.Handling(error,this._checkUserView.bind(this),null,false)
             }
            
         }
    }
    async _showProduct(onFocusFlag){
                this.paging = this.getPagingData();

                this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone1(onFocusFlag) }).bind(this));
                

                this.baseAddAPIParallel('getStoreProductCategory', (async (v1,v2) => { return VStoreHomeAPI.getStoreProductCategory(v1,v2) }).bind(this,this.props.route.params.contentKey,this.storeSettingsData.fProductShownType), ((v) => {
                    this.storeProductCategoryData = v 
                    this.storeProductCategoryData = VisitorHelper._naturalSort(this.storeProductCategoryData, 'desc', 'fCategoryNameID');
                    console.log('storeProductCategoryData')
                    console.log(this.storeProductCategoryData);
                }).bind(this), null);

                if (this.storeSettingsData.fProductShownType === 'pdf') {

                    this.baseAddAPIParallel('getStoreProductPdfByCategoryDapper', (async (v1,v2) => { return VStoreHomeAPI.getStoreProductPdfByCategoryDapper(v1,v2) }).bind(this,this.props.route.params.contentKey,this.paging), ((v) => {
                        this.storeProductPdfDataList = v
                        this.storeProductPdfDataList = VisitorHelper._naturalSort(this.storeProductPdfDataList, 'desc', 'fCategoryNameID');
                    }).bind(this), null);

                }else{
                    this.baseAddAPIParallel('getStoreProductByCategoryDapper', (async (v1,v2,v3) => { return VStoreHomeAPI.getStoreProductByCategoryDapper(v1,v2,v3) }).bind(this,this.props.route.params.contentKey, this.sortArr,this.paging), ((v) => {
                        this.productDataList = v
                        this.productDataList = VisitorHelper._naturalSort(this.productDataList, 'desc', 'fCategoryNameID');
                        console.log('productDataList')
                        console.log(this.productDataList);
                    }).bind(this), null);
                }
                this.baseRunAPIParallel();
    }
  
    _getLikeResourceProduct(data) {
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: 'StoreProduct', fContentKey: data.key, fText1: { id: contentID.fProductName, en: contentEN.fProductName, cn: contentCN.fProductName }, fText2: { id: data.fStoreNameID, en: data.fStoreNameEN, cn: data.fStoreNameCN }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }
 
     _renderItem = ({ item, index }) => {
         return (
             <CarouselProductCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'StoreHomeScreenCarouselProductCard'} currency={this.currentUserCurrency} likePackage={this._getLikeResourceProduct(item)} navigator={this.props.navigation} contentKey={item.key} isAvailable={item.isAvailable} storeKey={this.selectedStoreKey} like={item.fUserLikedThis} normalPrice={item.fCNormalPrice} promoPrice={item.fCPromoPrice} productName={item['fContent' + this.Language.toUpperCase()].fProductName} contentImage={item['fContent' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentOwnerCurrency={item.fCurrency} style={this.style.throwWHP}></CarouselProductCard>
         );
     }
 
     _renderItemPdf = ({ item, index }) => {
         console.log(item);
         return (
             
             <CarouselProductPdfCard accessible={true} accessibilityLabel={'StoreHomeScreenCarouselProductPdfCard'} navigator={this.props.navigation} contentKey={item.key} storeKey={this.selectedStoreKey} productName={item['fContent' + this.Language.toUpperCase()].fProductPdf} pdfLink={item['fContent' + this.Language.toUpperCase()].fPdfFile} contentImage={item['fContent' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} style={this.style.throwWHP}></CarouselProductPdfCard>
 
         );
     }
 
     goToPage(pageId) {
         this.refs.TV1.goToPage(pageId);
     }
 
     createStyleSheet = (whp) => {
         var { w, h, p } = whp;
 
         return StyleSheet.create({
             mainView1: { width: w, backgroundColor: 'white', justifyContent: 'flex-start', },
             throwWHP: { width: w, height: h, padding: p },
             tabBarStyle: { borderColor: '#E7E7E7', borderTopWidth: w * 0.006, borderBottomWidth: w * 0.006, width:w },
             tabBarUnderlineStyle: { backgroundColor: '#1E1E1E' },
             textSeeMore: { alignSelf: 'flex-end', color: '#00cdf6', marginRight: 2 * p },
             viewSeeMore:{alignSelf:'flex-end',marginTop:2*p},
             //style popup reward
             rewardPV: { width: w - 12 * p, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' },
             headerPV: { width: w - 22 * p, paddingVertical: 2 * p },
             textPV1: { color: '#484848' },
             textPV2: { color: '#858585' },
             textPV3: { color: '#484848', marginVertical: p,alignItems:'flex-start' },
             textPV4: { color: '#484848', alignSelf: 'flex-start', marginVertical: p,paddingLeft:4*p},
             textEmpty: {marginVertical: 0.3 * w, textAlign:'center', maxWidth: w * 0.75, color: '#858585' },
             imagePV: { width: w * 0.667, height: w * 0.375, padding: p, marginVertical: 2 * p },
             buttonPV: { backgroundColor: '#01BBA0', width: w * 0.38, height: w * 0.1, borderRadius: p,alignItems:'center',justifyContent:'center'},
             buttonViewPV: { flexDirection: 'row', justifyContent: 'space-around', width: w - 22 * p, marginVertical: 2 * p },
             vStoreBooking: { width: w - 12 * p, height: w * 0.25, justifyContent: 'center', backgroundColor: "white", borderRadius: 4 * p, marginTop: 5 * p },
             vStoreBookingDisabled: { width: w - 12 * p, height: w * 0.25, justifyContent: 'center', backgroundColor: "#E7E7E7", borderRadius: 4 * p, marginTop: 5 * p },
             restoBookingText1: { color: 'black', alignSelf: 'flex-start', paddingLeft: 3 * p },
             restoBookingText2: { color: 'grey', alignSelf: 'flex-start', paddingLeft: 3 * p },
             notAvailable:{color:'red',alignSelf:'flex-end',paddingRight:2*p},
         });
     }
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this.style = this.createStyleSheet(this.WHP);
         this.alreadyMount = false;
         this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
         this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
         this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency')
         this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
         this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
         this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
         this.sortArr = sortDAO.getStoreProductNoSearchSortData();
         this.isAlreadyCheckIn = '';
         this.selectedStoreKey = this.props.route.params.contentKey;
         this.productDataList = [];
         this.storeProductPdfDataList = [];
         this.storeTrendingProductDataList = [];
         this.storeHeaderData = '';
         this.storePromoData = [];
         this.storeProductCategoryData = [];
         this.storeAuctionData = [];
         this.animFlag = false;
         this.showBooking = false;
         this.props.navigation.setOptions({
             headerShown: false,
         });
         this.pvID = SGPopView.getPopViewID();
         this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
         this.counterBatch=0
         this.errorBatch = []
         this._tabIndex = 0; 
         this.webViewRenderRef = React.createRef()
         this._baseAnimVar = new Animated.Value(1);
         this.luxuryMode = false;
         this.touhableWL = false;
         this.touchableR = false;
        }
     
     async _refreshCheckIn() {
        try {
            this.isAlreadyCheckIn = await tbVUserCheckInAPI.CheckUserCheckInHere(this.props.route.params.contentKey);
            console.log(this.surpriseReward)
            if (this.surpriseReward.fID !== null) {
                this.storeHeaderData.lastVisited = 0;
                this.onShowReward()
            } else{
                this.storeHeaderData.lastVisited = 0;
                 this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
                 this.forceUpdate();
                }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._refreshCheckIn.bind(this))
        }

    }

    async _refreshCheckOut(){
        try {
            this.isAlreadyCheckIn = await tbVUserCheckInAPI.CheckUserCheckInHere(this.props.route.params.contentKey);
            this.forceUpdate();
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._refreshCheckOut.bind(this))
        }
    }

    onHideReward() {
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        SGPopView.hidePopView(this.pvID);
    }

    onShowReward() {
        setTimeout(() => { SGPopView.showPopView(this.pvID); this.forceUpdate(); }, 300);
    }
 
    async _SurpriseRewardOpenStore(onFocusFlag) {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                if(onFocusFlag===false)this.surpriseReward = await VRewardAPI.SurpriseRewardOpenStore(this.props.route.params.contentKey)
                else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                    
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
    
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardOpenStore.bind(this))
        }
    }

    async _SurpriseRewardCheckInStore() {
         try {
             if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                 this.surpriseReward = await VRewardAPI.SurpriseRewardCheckInStore(this.props.route.params.contentKey)
                 if (this.surpriseReward.fID !== null) {
                     this.onShowReward()
                 } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
             }
         } catch (error) {
            
             SGHelperErrorHandling.Handling(error,this._SurpriseRewardCheckInStore.bind(this))
         }
 
 
    }

    async _SurpriseRewardLikeTenant(restoKey) {
         try {
             if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                 this.surpriseReward = await VRewardAPI.SurpriseRewardLikeStore(restoKey)
                 
                 if (this.surpriseReward.fID !== null) {
                     this.onShowReward()
                 } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
             }
         } catch (error) {
             
             SGHelperErrorHandling.Handling(error,this._SurpriseRewardLikeTenant.bind(this,restoKey))
         }
 
    }
 
    _onWaitingListButtonPress() {
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerWaitingListStore')
        var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
        if(circuitBreaker.fActive==="Y"){      
            if (this.anonymousMode) {
                SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignIn') }, true)
            }else{
            if(!this.touhableWL) {
                this.touhableWL = true;
                SGHelperNavigation.navigatePush(this.props.navigation, 'StoreWaitingList', { storeKey: this.selectedStoreKey })
            }
            }      
        }else{
            SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
        }
    }
 
    _onReservationButtonPress() {
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerReservationStore')
        var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
        if(circuitBreaker.fActive==="Y"){            
            if (this.anonymousMode) {
                SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignIn') }, true)
            }else{
                if(!this.touchableR) {
                    this.touchableR = true;
                    SGHelperNavigation.navigatePush(this.props.navigation, 'StoreReservation', { storeKey: this.selectedStoreKey })
                }
            }
        }else{
            SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
        }
    }
 
    async _onCheckInPress() {
         if (this.anonymousMode) {
             SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignIn') }, true)
         }
         else {
             if (this.currentUser) {
                 this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
                 await this._onCheckInPressHandler()
                 await this._SurpriseRewardCheckInStore();
                 SGDialogBox.hideDialogBox(this.dbID2, true);
                
             }
         }
    }
     
    async _onCheckInPressHandler(){
         try {
             var userCheckInData = new tbUserCheckInData().getCurrentJSON();
             userCheckInData.fID = null;
             userCheckInData.fUserKey = this.currentUser;
             userCheckInData.fCreatedBy = this.currentUser;
             userCheckInData.fLastModifiedBy = this.currentUser;
             userCheckInData.fContentType = 'Store';
             userCheckInData.fContentKey = this.props.route.params.contentKey;
             await tbVUserCheckInAPI.addUserCheckIn(userCheckInData);
         } catch (error) {
            
             SGHelperErrorHandling.Handling(error,this._onCheckInPressHandler.bind(this))
         }
    }

    _disabledBooking() {
         if (this.anonymousMode !== true) {
             if (this.isAlreadyCheckIn === true) {
                 return false;
             }
             else {
                 return true;
             }
         }
         else {
             return true;
         }
    }
    
    _onChangeTab(){
        if(!this._baseFlag){this.baseAnimateSlideIn();}

    }

    _renderEmbedYoutube(url){
        var newUrl = ''
        if((SGHelperType.left(url,17) == 'https://youtu.be/')){
            newUrl =url.replace("https://youtu.be/", "");
        }
        else if((SGHelperType.left(url,22) =='https://m.youtube.com/')){
            newUrl =url.replace("https://m.youtube.com/watch?v=", "");
        }
        else{
            newUrl =url.replace("https://www.youtube.com/watch?v=", "");
        }
        return 'https://www.youtube.com/embed/'+newUrl;
    }

     render() {
         var { w, h, p } = this.WHP;
         var style = this.style;
         var navigator = this.props.navigation;
         var language = this.Language.toUpperCase()
         var surpriseReward = this.surpriseReward;
         var tR = SGLocalize.translate;
        //GH : please get this from Mall profile
        var luxury = this.luxuryMode;
         return (
 
             <RootView dummyStatusBar={!luxury} accessible={true} accessibilityLabel={'StoreHomeScreenRootView'} style={style.mainView1}>
                 <SGPopView accessible={true} accessibilityLabel={'MallHomeScreenPopView'} vPos={'Top'} animationType={'slideUp'}  popViewID={this.pvID} >
                     <View accessible={true} accessibilityLabel={'MallHomeScreenRewardView'} style={style.rewardPV}>
                         <View accessible={true} accessibilityLabel={'MallHomeScreenHeaderRewardView'} style={style.headerPV}>
                             <Text accessible={true} accessibilityLabel={'MallHomeScreenCongratsText'} style={style.textPV1} preset={Text.preset.titleH2B}>{tR('mallHomeScreen.RewardCongratulation')}</Text>
                             <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardText'} style={style.textPV2} preset={Text.preset.titleH4_5B}>{tR('mallHomeScreen.RewardText')} {surpriseReward['fReward' + language].fTenantName}</Text>
                             <Image accessible={true} accessibilityLabel={'MallHomeScreenRewardImage'} style={style.imagePV} source={{ uri: surpriseReward['fReward' + language].fImageJSON.length !== 0 ? surpriseReward['fReward' + language].fImageJSON[0][this.imageSetting].uri : '' }}></Image>
                             <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardName'} style={style.textPV3} preset={Text.preset.titleH3B}>{surpriseReward['fReward' + language].fRewardName}</Text>
                             <Text accessible={true} accessibilityLabel={'MallHomeScreenShortDesc'} style={style.textPV4} preset={Text.preset.titleH4}>{surpriseReward['fReward' + language].fShortDescription}</Text>
                             <View accessible={true} accessibilityLabel={'MallHomeScreenButtonView'} style={style.buttonViewPV}>
                                 <Button accessible={true} accessibilityLabel={'MallHomeScreenOkButton'} style={style.buttonPV}  textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.Okay')} onPress={() => this.onHideReward(this.pvID)}></Button>
                                 <Button accessible={true} accessibilityLabel={'MallHomeScreenMyRewardsButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.MyRewards')} onPress={() => { this.onHideReward(this.pvID); SGHelperNavigation.navigatePush(this.props.navigation, 'MyRewards') }}></Button>
                             </View>
                         </View>
                     </View>
                 </SGPopView>
                 
                 {this.alreadyMount ?
                     <View style={{ flex: 1 }}>
                         {this.storeHeaderData !== '' ?
                            luxury?
                            <StoreHomeNewHeaderLuxury animVar={this._baseAnimVar} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this, this.storeHeaderData)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, this.storeHeaderData)} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCount+=c; this.forceUpdate();}).bind(this, this.storeHeaderData)} accessible={true} accessibilityLabel={'StoreHomeScreenHeader'} isAlreadyCheckIn={this.isAlreadyCheckIn} currentUserData={this.currentUserData} language={this.Language} imageSetting={this.imageSetting} refresh={this._refreshCheckIn.bind(this)} refreshCheckOut={this._refreshCheckOut.bind(this)} currentUserImage={this.currentUserImage} screen='StoreProfile' navigator={this.props.navigation} fullData={this.storeProfileData} headerData={this.storeHeaderData} style={style.throwWHP} checkInReward={async () => await this._SurpriseRewardCheckInStore()} likeTenantGetReward={async () => await this._SurpriseRewardLikeTenant(this.props.route.params.contentKey)}></StoreHomeNewHeaderLuxury>
                            :<StoreHomeNewHeader animVar={this._baseAnimVar} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this, this.storeHeaderData)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, this.storeHeaderData)} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCount+=c; this.forceUpdate();}).bind(this, this.storeHeaderData)} accessible={true} accessibilityLabel={'StoreHomeScreenHeader'} isAlreadyCheckIn={this.isAlreadyCheckIn} currentUserData={this.currentUserData} language={this.Language} imageSetting={this.imageSetting} refresh={this._refreshCheckIn.bind(this)} refreshCheckOut={this._refreshCheckOut.bind(this)} currentUserImage={this.currentUserImage} screen='StoreProfile' navigator={this.props.navigation} fullData={this.storeProfileData} headerData={this.storeHeaderData} style={style.throwWHP} checkInReward={async () => await this._SurpriseRewardCheckInStore()} likeTenantGetReward={async () => await this._SurpriseRewardLikeTenant(this.props.route.params.contentKey)}></StoreHomeNewHeader>
                             :
                             (null)
                         }
                         <TabView onChangeTab={(e)=>{ this._tabIndex = e.i;this._onChangeTab(); }} accessible={true} accessibilityLabel={'StoreHomeScreenTabView'} ref='TV1' tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} scrollableTabBar tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#716E6E'} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2} style={{ justifyContent: 'flex-start', flex: 1, }} initialPage={this._tabIndex} renderTabBar={() => <DefaultTabBar />} >
                            {this.storeSettingsData.fShowHighlightType == 'typeA' &&
                             (this.storePromoData.length !== 0 || this.storeProductCategoryData.length !== 0 || this.storeAuctionData.length !== 0) &&
                                <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'StoreHomeScreenScrollMainView'} style={{ backgroundColor: '#FFFFFF' }} tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                     {this.storeAuctionData.length !== 0 &&
                                        <AuctionSlider marginText oneLineSeeMore accessible={true} accessibilityLabel={'StoreHomeAuctionSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeMoreStoreAuction' contentKey={this.selectedStoreKey} seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} screen='AuctionDetail' navigator={this.props.navigation} data={this.storeAuctionData} titleHeading={SGLocalize.translate("storeHomeScreen.AuctionHeadingTitle")} title={SGLocalize.translate("storeHomeScreen.AuctionHeadingTitle")} style={style.throwWHP}></AuctionSlider>
                                    }
                                    {this.storeSettingsData ?
                                        (this.storeSettingsData.fProductShownPromoEvent === 'Y' && this.storePromoData.length !== 0 ?
                                            (<StorePromoSlider befSeeMoreScreen={'StoreHighlight'} marginText oneLineSeeMore borderBottom accessible={true} accessibilityLabel={'StoreHomeScreenPromoSlider'} contentKey={this.selectedStoreKey} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeMoreStorePromo' seeMoreLabel={SGLocalize.translate("storeHomeScreen.SeeMore")} screen='StorePromoDetail' navigator={this.props.navigation} data={this.storePromoData} titleHeading={SGLocalize.translate("storeHomeScreen.storePromoTitle")} style={style.throwWHP}></StorePromoSlider>) : (null))
                                        :
                                        (null)
                                    }
                                    {this.storeProductCategoryData.length !== 0 ?
                                        (<StoreProductCategorySlider accessible={true} accessibilityLabel={'StoreHomeScreenProductCategoryCard'} language={this.Language} showRestoBooking={this.showBooking} imageSetting={this.imageSetting} showTrending={this.storeSettingsData.fProductShownType === 'pdf' ? ('N') : (this.storeSettingsData.fProductShownTrending)} goToPage={this.goToPage.bind(this)} storeProductCategory={this.storeProductCategoryData} navigator={this.props.navigation} title={SGLocalize.translate("storeHomeScreen.productCategoryTitle")} style={style.throwWHP}></StoreProductCategorySlider>) :
                                        (null)
                                    }
                                </ScrollView>
                            }
                            {this.storeSettingsData.fShowHighlightType == 'typeB' &&
                                this.storeProfileData.linkWebsite !== '' && 
                                <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                    <WebViewRender ref={this.webViewRenderRef} data={this.storeProfileData.linkWebsite} style={style.throwWHP} fType='url' hideButton={true} highlightDisplay></WebViewRender>
                                    <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                        <WebViewButton webViewRef={this.webViewRenderRef}></WebViewButton>
                                    </View>
                                </View>
                            }
                            {this.storeSettingsData.fShowHighlightType == 'typeC' &&
                                this.storeProfileData.linkInstagram !== '' &&
                                <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                    <WebViewRender ref={this.webViewRenderRef} data={this.storeProfileData.linkInstagram} style={style.throwWHP} fType='url' hideButton={true} highlightDisplay></WebViewRender>
                                    <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                        <WebViewButton webViewRef={this.webViewRenderRef}></WebViewButton>
                                    </View>
                                </View>
                            }
                            {this.storeSettingsData.fShowHighlightType == 'typeD' &&
                                this.storeProfileData.linkFacebook !== '' &&
                                <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                    <WebViewRender ref={this.webViewRenderRef} data={this.storeProfileData.linkFacebook} style={style.throwWHP} fType='url' hideButton={true} highlightDisplay></WebViewRender>
                                    <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                        <WebViewButton webViewRef={this.webViewRenderRef}></WebViewButton>
                                    </View>
                                </View>
                            }
                            {this.storeSettingsData.fShowHighlightType == 'typeE' &&
                                <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,height:h}}>
                                    <WebView style={{ flex: 1 }} source={{ html: '<h1>Youtube</h1><iframe width="100%" height="35%" src="'+this._renderEmbedYoutube(this.storeProfileData.linkYoutube)+'"'+'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen></iframe>' }} />
                                </View>
                            }

                            {this.storeSettingsData.fShowHighlightType !== 'typeA' &&
                             (this.storePromoData.length !== 0 || this.storeProductCategoryData.length !== 0 || this.storeAuctionData.length !== 0) &&
                                <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'StoreHomeScreenScrollMainView'} style={{ backgroundColor: '#FFFFFF' }} tabLabel={SGLocalize.translate("storeHomeScreen.PromoAndCatalog")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                {this.storeAuctionData.length !== 0 &&
                                   <AuctionSlider marginText oneLineSeeMore accessible={true} accessibilityLabel={'StoreHomeAuctionSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeMoreStoreAuction' contentKey={this.selectedStoreKey} seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} screen='AuctionDetail' navigator={this.props.navigation} data={this.storeAuctionData} titleHeading={SGLocalize.translate("storeHomeScreen.AuctionHeadingTitle")} title={SGLocalize.translate("storeHomeScreen.AuctionHeadingTitle")} style={style.throwWHP}></AuctionSlider>
                                }
                                {
                                    this.storePromoData.length !== 0 ?
                                        <StorePromoSlider befSeeMoreScreen={'StoreHighlight'} marginText oneLineSeeMore borderBottom accessible={true} accessibilityLabel={'StoreHomeScreenPromoSlider'} contentKey={this.selectedStoreKey} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeMoreStorePromo' seeMoreLabel={SGLocalize.translate("storeHomeScreen.SeeMore")} screen='StorePromoDetail' navigator={this.props.navigation} data={this.storePromoData} titleHeading={SGLocalize.translate("storeHomeScreen.storePromoTitle")} style={style.throwWHP}></StorePromoSlider>
                                         : 
                                        (null)
                                } 
                                {this.storeProductCategoryData.length !== 0 ?
                                    (<StoreProductCategorySlider accessible={true} accessibilityLabel={'StoreHomeScreenProductCategoryCard'} language={this.Language} showRestoBooking={this.showBooking} imageSetting={this.imageSetting} showTrending={this.storeSettingsData.fProductShownType === 'pdf' ? ('N') : (this.storeSettingsData.fProductShownTrending)} goToPage={this.goToPage.bind(this)} storeProductCategory={this.storeProductCategoryData} navigator={this.props.navigation} title={SGLocalize.translate("storeHomeScreen.productCategoryTitle")} style={style.throwWHP} promoCatalog secondTab={this._checkTabPromoAndCatalog()}></StoreProductCategorySlider>) :
                                    (null)
                                }
                                </ScrollView>
                            }
                            {
                                 this.storeSettingsData && this.storeSettingsData.fProductShownType !== 'pdf' ?
                                     (
                                         this.storeSettingsData.fProductShownTrending === 'Y' && this.storeTrendingProductDataList.length !== 0 ?
                                             (<ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'StoreHomeScreenScrollTrendingWindowView'} tabLabel={SGLocalize.translate("storeHomeScreen.trendingTitle")} style={{ backgroundColor: '#F7F7F7'}} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                                   <View accessible={true} accessibilityLabel={'StoreHomeScreenTSeeMoreView'} style={style.viewSeeMore}>
                                                         <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigation, 'StoreProductList', { title: SGLocalize.translate("storeHomeScreen.trendingTitle"), data: this.storeTrendingProductDataList, storeKey: this.selectedStoreKey, categoryKey: 'trending' })}>
                                                             <Text accessible={true} accessibilityLabel={'StoreHomeScreenTSeeMoreText'} preset={Text.preset.titleH4B} style={style.textSeeMore}>{SGLocalize.translate('globalText.seeMoreText')}</Text>
                                                         </TouchableOpacity>
                                                     </View>
                                                 <Carousel accessible={true} accessibilityLabel={'StoreHomeScreenTCarousel'}
                                                     ref={(c) => { this._carousel = c; }}
                                                     data={this.storeTrendingProductDataList}
                                                     renderItem={this._renderItem}
                                                     sliderWidth={w}
                                                     itemWidth={w * 0.52}
                                                     containerCustomStyle={{ }}
                                                     contentContainerCustomStyle={{ justifyContent: 'center', alignItems: 'center'}}
                                                     inactiveSlideScale={0.6}
                                                 />    
                                             </ScrollView>
                                             ) :
                                             (null)
                                     )
                                     :
                                     (null)
                             }

                            

                             {this.storeSettingsData &&
                                 (this.storeSettingsData.fShownReservation =='Y' || this.storeSettingsData.fShownWaitingList =='Y') &&
                             <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'StoreHomeScreenScrollTrendingWindowView'} tabLabel={SGLocalize.translate('storeHomeScreen.bookingStoreText')} style={{ backgroundColor: '#F7F7F7', paddingTop: 4*p }} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                    <TouchableOpacity accessible={true} accessibilityLabel={'StoreHomeScreenWLView'}  onPress={() => this._onWaitingListButtonPress()} disabled={this.storeSettingsData.fShownWaitingList == 'N' ? true :false}>
                                             <View style={style.vStoreBooking }>
                                                 <Text accessible={true} accessibilityLabel={'StoreHomeScreenWLText1'} preset={Text.preset.titleH3B} style={style.restoBookingText1}>{SGLocalize.translate('storeHomeScreen.waitingListText1')}</Text>
                                                 <Text accessible={true} accessibilityLabel={'StoreHomeScreenWLText2'} preset={Text.preset.titleH4} style={style.restoBookingText2}>{SGLocalize.translate('storeHomeScreen.waitingListText2')}</Text>
                                                 {this.storeSettingsData.fShownWaitingList == 'N' &&
                                                 <Text preset={Text.preset.titleH4_5B} style={style.notAvailable}>{SGLocalize.translate('storeHomeScreen.notAvailableText')}</Text>
                                                 }
                                               
                                             </View>
                                         </TouchableOpacity>
                                         <TouchableOpacity accessible={true} accessibilityLabel={'StoreHomeScreenResvView'}  onPress={() => this._onReservationButtonPress()} disabled={this.storeSettingsData.fShownReservation == 'N' ? true :false}>
                                             <View style={style.vStoreBooking }>
                                                 <Text accessible={true} accessibilityLabel={'StoreHomeScreenResvText1'} preset={Text.preset.titleH3B}  style={style.restoBookingText1}>{SGLocalize.translate('storeHomeScreen.reservationText1')}</Text>
                                                 <Text accessible={true} accessibilityLabel={'StoreHomeScreenResvText2'} preset={Text.preset.titleH4} style={style.restoBookingText2}>{SGLocalize.translate('storeHomeScreen.reservationText2')}</Text>
                                                 {this.storeSettingsData.fShownReservation == 'N' &&
                                                 <Text preset={Text.preset.titleH4_5B} style={style.notAvailable}>{SGLocalize.translate('storeHomeScreen.notAvailableText')}</Text>
                                                 }
                                             </View>
                                         </TouchableOpacity>
                             </ScrollView>
                             }
                             {this.productDataList.length !== 0 && this.storeSettingsData.fProductShownType !== 'pdf' ?
                               (this.productDataList.map((x) => {
                                    return (
                                        <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'StoreHomeScreenScrollCatMapWindowView'} key={x.key} tabLabel={x['fCategoryName' + this.Language.toUpperCase()]} style={{ backgroundColor: '#ededed'}} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsHorizontalScrollIndicator={false}>
                                             <View accessible={true} accessibilityLabel={'StoreHomeScreenCatMapSeeMoreView'} style={style.viewSeeMore}>
                                                <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigation, 'StoreProductList', { title: x['fCategoryName' + this.Language.toUpperCase()], storeKey: this.selectedStoreKey, categoryKey: x.categoryKey })}>
                                                    <Text accessible={true} accessibilityLabel={'StoreHomeScreenCatMapSeeMoreText'} preset={Text.preset.titleH4B} style={style.textSeeMore}>{SGLocalize.translate('globalText.seeMoreText')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Carousel accessible={true} accessibilityLabel={'StoreHomeScreenCatMapCarousel'}
                                                ref={(c) => { this._carousel = c; }}
                                                data={x.fProduct}
                                                renderItem={this._renderItem}
                                                sliderWidth={w}
                                                itemWidth={w * 0.52}
                                                containerCustomStyle={{ marginVertical: 2*p }}
                                                contentContainerCustomStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                                inactiveSlideScale={0.6}
                                            />
                                           
                                        </ScrollView>
                                       
                                       
                                    )
                                }))
                                 :
                              null
                             }
 
                             {/* PDF MODE */}
                             {this.storeProductPdfDataList.length !== 0 && this.storeSettingsData.fProductShownType === 'pdf' ?
                                 (this.storeProductPdfDataList.map((x) => {
                                     return (
                                         <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'StoreHomeScreenScrollCatMapWindowView'} key={x.categoryKey} tabLabel={x['fCategoryName' + this.Language.toUpperCase()]} style={{ backgroundColor: '#ededed' }} showsHorizontalScrollIndicator={false}>
                                             <Carousel accessible={true} accessibilityLabel={'StoreHomeScreenCatMapCarousel'}
                                                 ref={(c) => { this._carousel = c; }}
                                                 data={x.fProduct}
                                                 renderItem={this._renderItemPdf}
                                                 sliderWidth={w}
                                                 itemWidth={w * 0.52}
                                                 containerCustomStyle={{}}
                                                 contentContainerCustomStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                                 inactiveSlideScale={0.6}
                                             />
                                         </ScrollView>
 
                                         
                                     )
                                 }))
                                 :
                                 (null)    
                             }
                         </TabView>
                         <View style={{width:w,height:w*0.035,backgroundColor: 'transparent'}}></View>
                     </View>
                     :
                     (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                 }

                 <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() ), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                     <SimpleSearchBar luxury={luxury} pushScreen accessible={true} accessibilityLabel={'StoreHomeScreenSimpleSearchBar'} imageSetting={this.imageSetting} language={this.Language} storeKey={this.selectedStoreKey} placeholder={SGLocalize.translate("storeHomeScreen.searchPlaceholder")} navigator={this.props.navigation} style={this.style.throwWHP}></SimpleSearchBar>
                 </Animated.View>
 
                 <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                     <BottomNavigationContainer accessible={true} accessibilityLabel={'StoreHomeScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                 </Animated.View>
             </RootView>
         );
     }
 }