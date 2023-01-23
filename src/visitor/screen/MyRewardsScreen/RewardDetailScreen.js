/**
 * Version 1.2.0
 * 1. Yohanes 13 April 2021
 * - add ErrorHandling
 * - change flow reward, pull to refresh to check is reward used
 * 2. Yohanes 19 April 2021
 * - fix redeemed reward show pop up success
 */
import React  from 'react';
import { StyleSheet,AppState,Linking,RefreshControl,Animated ,Easing} from 'react-native';
import { SGView as View, SGQRImage as QRImage, SGImage as Image, SGScrollView as ScrollView, SGViewPager as ViewPager, SGDialogBox, SGRootView as RootView, SGText as Text, SGWebView as WebView, SGActivityIndicator as ActivityIndicator, SGTextInput as TextInput, SGButton as Button, SGIcon as Icon, SGIcon } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGPopView } from '../../../core/control/SGPopView';
import { CommentPopup } from '../../container_V2/CommentPopup';
import { SGLocalize } from '../../locales/SGLocalize'
import { SGHelperType, SGHelperNavigation, SGHelperErrorHandling } from '../../../core/helper';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperGlobalVar } from '../../../core/helper';
import { RewardDetailHeader } from '../../container_V2/RewardDetailHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { VRewardAPI } from '../../api/VRewardAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';
// import SwipeButton from 'rn-swipe-button';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import image from '../../asset/image';

export class RewardDetailScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            textTitle: { alignSelf: 'flex-start', marginLeft: 4 * p, marginTop: 4 * p, color: '#7b7b7b' },
            textContentLiked: { alignSelf: 'flex-start', marginLeft: 4 * p, color: '#bebebe' },
            sliderView1: { width: w - 2 * p, height: (w * 0.5) - 2 * p, backgroundColor: '#F4F3EF' },
            throwWHP: { width: w, height: h, padding: p },
            sv1: { backgroundColor: 'white' },
            sv1_2: { justifyContent: 'flex-start', backgroundColor: 'white', },
            image: { width: w - 2 * p, height: w * 0.5, resizeMode: 'contain', borderRadius: w * 0.05, },
            textView1: { alignItems: 'flex-start', width: w - 2 * p, height: w * 0.05 },
            text1: { fontSize: w * 0.035, opacity: 0.8 },
            containerView1: { flexDirection: 'row', width: w - 2 * p, height: w * 0.1 },
            containerView1_1: { justifyContent: 'flex-start', flexDirection: 'row', width: (w - 2 * p) / 2, height: w * 0.1 },
            containerView1_1_1: { width: (w - 2 * p) / 2 * 0.3, height: w * 0.1 },
            containerView2: { width: w, height: w * 0.5, padding: p },
            icon: { fontSize: w * 0.075, },
            text2: { fontSize: w * 0.040, },
            containerView3: { marginVertical: w * 0.01, alignItems: 'flex-start', width: w - 2 * p, height: w * 0.1 },
            text3: { marginLeft: w * 0.03, fontSize: w * 0.05, },
            containerView4: { marginVertical: w * 0.01, width: w - 2 * p, borderWidth: w * 0.001, borderRadius: 6, shadowOpacity: 0.05 },
            text4: { marginLeft: w * 0.03, marginVertical: w * 0.02, fontSize: w * 0.04, color: 'green' },
            text5: { marginHorizontal: w * 0.03, marginBottom: w * 0.01, fontSize: w * 0.035, },
            qrcode: { marginVertical: w * 0.03, alignSelf: 'center' },
            text6: { alignSelf: 'center', fontSize: w * 0.050 },
            tag: { position: 'absolute', alignSelf: 'flex-start', top: -6 * p, height: w * 0.135, left: - 7 * p, width: w * 0.525 },
            contentView: { overflow: 'visible', backgroundColor: '#ededed', marginHorizontal: 2 * p, marginTop: 4 * p, width: w * 0.92, justifyContent: 'flex-start', padding: p, borderTopLeftRadius: 2 * p, borderTopRightRadius: 2 * p, paddingBottom: 6 * p },
            textDesc: { marginTop: 8 * p, textAlign: 'justify', marginHorizontal: 4 * p, color: '#888888' },
            webView: { width: '100%', height: w * 2 },
            descriptionContainer: { width: w * 0.93, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 2 },
            descriptionText: { color: '#000000', textAlign: 'justify', alignSelf: 'flex-start' },
            webView: { width: '100%', height: w * 2 },
            scV1:{width:w,marginVertical:2*p},
            vView2:{width: w - p * 10,flex:1},
            startUseText:{color:'red'},
            shortDescText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4,marginVertical:p },
            qrCodeSwipeContainer: { width: w * 0.9, backgroundColor: '#FFF', borderColor: '#E4E4E4', borderWidth: w * 0.004, borderRadius: p * 4, marginTop: p * 4, paddingVertical: p * 2 },
            textQRCodeSwipeScan: { width: w * 0.8, marginBottom: -p },
            codeTextInput: { width: w * 0.8, marginTop: p * 4 },
            codeButtonSubmit: { width: w * 0.8, marginTop: p * 3 },
            swipeButton: { width: w * 0.8, marginTop: p * 5 },
            redeemMethod: { width: w * 0.9, alignItems: 'flex-start', marginTop: p * 3 },
            redeemDate: { width: w * 0.9, alignItems: 'flex-start', marginTop: p * 3,flexDirection:'row' },
            mysteryBox: { width: w * 0.9, backgroundColor: 'orange', borderRadius: p * 1.5, paddingVertical: p * 4, alignItems: 'center', marginTop: p * 2 },
            mystertBoxTextSection: { backgroundColor: 'white', opacity: 0.7, borderRadius: p * 1.5, paddingVertical: p * 1.5, paddingHorizontal: p * 7 },
            mysteryBoxResult: { width: w * 0.9, backgroundColor: '#ededed', borderRadius: p * 1.5, paddingVertical: p * 4, marginTop: p * 2, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: p * 3 },
            mystertBoxResultTextSection: { width: w * 0.6 },
            mystertBoxResultIconSection: { width: w * 0.15 },
            pvContainer: { width: w * 0.85, height: h * 0.9, backgroundColor: 'white', borderRadius: p * 2, justifyContent: 'space-between'},
            pvContent: { width: w * 0.85, flex: 1, justifyContent: 'flex-start' },
            pvImage: { width: w * 0.85, height: w * 0.85 * 9 / 16, marginVertical: 0, borderRadius: 0, borderTopLeftRadius: p * 2, borderTopRightRadius: p * 2},
            pvTitleContainer: { width: w * 0.85, paddingHorizontal: p * 2, marginTop: p * 3, marginBottom: 0, alignItems: 'flex-start' },
            pvDescContainer: { width: w * 0.85, paddingHorizontal: p * 2.6, alignItems: 'flex-start' },
            pvButton: { marginBottom: p * 3 },
            sv2: { backgroundColor: 'white'},
            leftAction: {backgroundColor:'blue'},
        });
    }

    showPopView(args) {
        SGPopView.showPopView(args[0]);
    }
    async _responRewardDone(dialogBoxOff=false){
        console.log('_responRewardDone')
        if (this.data.fAllocatedStatus === 'Y' && this.data.fRedeemedStatus === 'N' && this.data.fExpiredStatus === 'N') {
            await this._checkReward(dialogBoxOff)
        }
        
    }
    async componentDidMount() {
        if (this.props.route.params.fType === "store" || this.props.route.params.fType === 'resto'){
            
            this.baseRunSingleAPIWithRedoOption('getRedeemRewardTenantByID', (async (v1) => { return VRewardAPI.getRedeemRewardTenantByID(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
                this.data = v
                this.data.fContentID = null;
                this.data.fContentEN = null;
                this.data.fContentCN = null;
                this._checkRewardHandler(v)
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        } 
        else if (this.props.route.params.fType === "building") {
           
            this.baseRunSingleAPIWithRedoOption('getRedeemRewardBuildingByID', (async (v1) => { return VRewardAPI.getRedeemRewardBuildingByID(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
                this.data = v
                this._checkRewardHandler(v)
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        }

        AppState.addEventListener('change', this._handleAppStateChange);
        //check apps still active or not
        if (this.state.appState === "active") {
            this.interval = setInterval(async () => {
                console.log('interval')
                await this._responRewardDone(false);
            },   SGHelperType.getSysParamsValueToInt('RewardDetailScreenInterval1'));
        }

    }
    
    _checkRewardHandler(tempRewardData){
        this._construcArrayOfLinks();
        setTimeout(() => {
            if (tempRewardData.fRedeemedStatus === 'Y' && this.alreadyMount) {
            
                if(!this.showSuccess){
                        clearInterval(this.interval)
                        SGDialogBox.showSuccess(null, SGLocalize.translate('RewardDetailScreen.ClaimedTitle'), SGLocalize.translate('RewardDetailScreen.Claimed'), SGLocalize.translate('Alert.Okay'), () => { this.props.route.params.callback(); this.showSuccess=true;clearInterval(this.interval),this.showDetailMysteryBox(); }, true)
                    }   
                } else if (tempRewardData.fExpiredStatus === 'Y') {
                this.data = tempRewardData

                if(this.alreadyMount)SGDialogBox.showFail(null, SGLocalize.translate('RewardDetailScreen.ExpiredTitle'), SGLocalize.translate('RewardDetailScreen.Expired'), SGLocalize.translate('Alert.Close'))
                
            }
            this.expiredReward()
            this.startReward();
            this.alreadyMount = true;
            this.forceUpdate();
        }, 300);
    }

    async _checkReward(dialogBoxOff){
        console.log(this.props.route.params.fType)
        if (this.props.route.params.fType === "store" || this.props.route.params.fType === 'resto'){
            this.baseRunSingleAPIWithRedoOption('getRedeemRewardTenantByID', (async (v1) => { return VRewardAPI.getRedeemRewardTenantByID(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
                this.data = v
                var tempRewardData = v
                this.data.fContentID = null;
                this.data.fContentEN = null;
                this.data.fContentCN = null;
                if(dialogBoxOff)SGDialogBox.hideDialogBox(this.dbID2,true)
                this._checkRewardHandler(tempRewardData)
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        } 
        else if (this.props.route.params.fType === "building") {
            this.baseRunSingleAPIWithRedoOption('getRedeemRewardBuildingByID', (async (v1) => { return VRewardAPI.getRedeemRewardBuildingByID(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
                this.data = v

                var tempRewardData = v
                if(dialogBoxOff) SGDialogBox.hideDialogBox(this.dbID2,true)
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
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: this.data.fStoreKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
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
        AppState.removeEventListener('change', this._handleAppStateChange);
        if(this.interval)clearInterval(this.interval);
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false
        });
        this.pvID1 = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.data = {
            fID: 'null', fExpiredUseDate: new Date(0), fLocation: '',
            fRewardID: { fRewardName: '', fShortDescription: '', fLongDescription: '', fImageJSON: [], location: '' },
            fRewardEN: { fRewardName: '', fShortDescription: '', fLongDescription: '', fImageJSON: [], location: '' },
            fRewardCN: { fRewardName: '', fShortDescription: '', fLongDescription: '', fImageJSON: [], location: '' },
        }
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.alreadyMount = false;
        this.expiredDate=new Date();
        this.canUse = false;
        this.state={appState: AppState.currentState,refreshing:false, promoCode: '', redeemButtonDisabled: true }
        this.arrayOfLinksContent = SGHelperGlobalVar.getVar("arrayOfLinks");
        this.arrayOfLinksData = [];
        this.showSuccess=false;
        this._trans=1  
        this._animMovement = new Animated.Value(0);
    }

    _getCommentResourcePlaceReward(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentRewardID = data.fRewardID;
        var contentRewardEN = data.fRewardEN;
        var contentRewardCN = data.fRewardCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RewardPlace', fContentKey: data.fRewardKey,
                fContentName: { id: contentRewardID.fRewardName, en: contentRewardEN.fRewardName, cn: contentRewardCN.fRewardName },
                fContentText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText2: { id: contentRewardID.fShortDescription, en: contentRewardEN.fShortDescription, cn: contentRewardCN.fShortDescription },
                fContentImage: { id: contentRewardID.fImageJSON, en: contentRewardEN.fImageJSON, cn: contentRewardCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.fBuildingKey
            }
        )
    }

    _getCommentResourceStoreReward(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentRewardID = data.fRewardID;
        var contentRewardEN = data.fRewardEN;
        var contentRewardCN = data.fRewardCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RewardStore', fContentKey: data.fRewardKey,
                fContentName: { id: contentRewardID.fRewardName, en: contentRewardEN.fRewardName, cn: contentRewardCN.fRewardName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentRewardID.fTargetName, en: contentRewardEN.fTargetName, cn: contentRewardCN.fTargetName },
                fContentImage: { id: contentRewardID.fImageJSON, en: contentRewardEN.fImageJSON, cn: contentRewardCN.fImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.fStoreKey
            }
        )
    }

    _getCommentResourceRestoReward(data) {
        var contentRestoID = data.fContentStoreID;
        var contentRestoEN = data.fContentStoreEN;
        var contentRestoCN = data.fContentStoreCN;
        var contentRewardID = data.fRewardID;
        var contentRewardEN = data.fRewardEN;
        var contentRewardCN = data.fRewardCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RewardResto', fContentKey: data.fRewardKey,
                fContentName: { id: contentRewardID.fRewardName, en: contentRewardEN.fRewardName, cn: contentRewardCN.fRewardName },
                fContentText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText2: { id: contentRewardID.fTargetName, en: contentRewardEN.fTargetName, cn: contentRewardCN.fTargetName },
                fContentImage: { id: contentRewardID.fImageJSON, en: contentRewardEN.fImageJSON, cn: contentRewardCN.fImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetKey: data.fStoreKey
            }
        )
    }

    expiredReward(){
        var data = this.data;
        if(SGHelperType.convertNewDate(data.fExpiredUseDate) > SGHelperType.convertNewDate(data.fExpiredDefinedDate)){
        this.expiredDate = data.fExpiredDefinedDate
        }else{
         this.expiredDate = data.fExpiredUseDate
        }
     }

     startReward(){
        var data = this.data;
        if(SGHelperType.convertNewDate(new Date()) > SGHelperType.convertNewDate(data.fStartUseDate)){
            this.canUse = true;
           
        }else{
            this.canUse = false;
           
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
    
    _setRewardCode(value) {
        this.setState({rewardCode: value});
        if(value.length == 4){
            this.setState({redeemButtonDisabled: false});
        }else{
            this.setState({redeemButtonDisabled: true});
        }
    }
    
    async _onRedeemPress(){
        if(this.data.fType == 'store' || this.data.fType == 'resto'){
            try {
                this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
                this.inputData = {userCode: this.state.rewardCode, redeemReward: this.data};
                await VRewardAPI.redeemTenantRewardByCode(this.inputData);
                // SGDialogBox.hideDialogBox(this.dbID2, true);
                await this._checkReward(true)
                // SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.MessageClaimTitle"), SGLocalize.translate("AlertMessage.MessageClaim"), 'OK', () => { this.props.route.params.callback(); this.showSuccess=true;clearInterval(this.interval) }, true);
            } catch (error) {
                SGDialogBox.hideDialogBox(this.dbID2, true);
                SGHelperErrorHandling.Handling(error,this._onUseButton.bind(this));
            };
        }else if(this.data.fType == 'building'){
            try {
                this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
                this.inputData = {userCode: this.state.rewardCode, redeemReward: this.data};
                await VRewardAPI.redeemBuildingRewardByCode(this.inputData);
                // SGDialogBox.hideDialogBox(this.dbID2, true);
                await this._checkReward(true)
                // SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.MessageClaimTitle"), SGLocalize.translate("AlertMessage.MessageClaim"), 'OK', () => { this.props.route.params.callback(); this.showSuccess=true;clearInterval(this.interval) }, true);
            } catch (error) {
                SGDialogBox.hideDialogBox(this.dbID2, true);
                SGHelperErrorHandling.Handling(error,this._onUseButton.bind(this));
            };
        }
    }
    
    
    async _onUseButton() {
        console.log('use')
        if(this.data.fType == 'store' || this.data.fType == 'resto'){
            try {
                this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
                await VRewardAPI.redeemTenantReward(this.data);
                // SGDialogBox.hideDialogBox(this.dbID2, true);
                await this._checkReward(true)
                // SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.MessageClaimTitle"), SGLocalize.translate("AlertMessage.MessageClaim"), 'OK', () => { this.props.route.params.callback(); this.showSuccess=true;clearInterval(this.interval) }, true);
      
            } catch (error) {
                SGDialogBox.hideDialogBox(this.dbID2, true);
                SGHelperErrorHandling.Handling(error,this._onUseButton.bind(this));
            };
        }else if(this.data.fType == 'building'){
            try {
                this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
                await VRewardAPI.redeemBuildingReward(this.data);
                console.log('_onUseButton')
                // SGDialogBox.hideDialogBox(this.dbID2, true);
                await this._checkReward(true)
                // SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.MessageClaimTitle"), SGLocalize.translate("AlertMessage.MessageClaim"), 'OK', () => {this.props.route.params.callback(); this.showSuccess=true;clearInterval(this.interval) }, true);
             
            } catch (error) {
                SGDialogBox.hideDialogBox(this.dbID2, true);
                SGHelperErrorHandling.Handling(error,this._onUseButton.bind(this));
            };
        }
    }

    showDetailMysteryBox(){
        SGPopView.showPopView(this.pvID2);
    }

    hideDetailMysteryBox(){
        SGPopView.hidePopView(this.pvID2);
    }

    renderMysteryBoxInfo(){
        var style = this.style;
        var language = this._language.toUpperCase();

        var data = this.data
        if(this.data['fContent' + language] === null){
            return(null);
        }else{
            if(this.data.fMysteryBox === 'Y' && this.data.fRedeemedStatus === 'N'){
                return(
                    <View style={style.mysteryBox}>
                        <View style={style.mystertBoxTextSection}>
                            <Text preset={Text.preset.titleH3B}>{SGLocalize.translate('RewardDetailScreen.RedeemToFindOut')}</Text>
                        </View>
                    </View>
                )
            }else if(this.data.fMysteryBox === 'Y' && this.data.fRedeemedStatus === 'Y'){
                return(
                    <View style={style.mysteryBoxResult}>
                        <View style={style.mystertBoxResultTextSection}>
                            <Text preset={Text.preset.titleH3}>{data['fContent' + language].fTitle}</Text>
                        </View>
                        <View style={style.mystertBoxResultIconSection}>
                            <Icon name={Icon.Icon.dialogInputBox} preset={Icon.preset.w12} style={{color: 'rgb(62,148,221)'}} onPress={() => this.showDetailMysteryBox()}></Icon>
                        </View>
                    </View>
                )
            }
        }
    }
    renderLeftActions(progress, dragX) {
        var {w,h,p} = this.WHP
        const trans = dragX.interpolate({
            inputRange: [0, 100,150,300],
            outputRange: [0, 50,100,180],
            
        });
        
 

        return (
            <RectButton style={{width:w*0.8,height:w*0.12,backgroundColor:'#1FBC8D'}} onPress={()=>{console.log('close')}} >

                <View style={{width:w*0.8,height:w*0.12}}>
                    <Text preset={Text.preset.titleH3} style={{color:'white'}}>{SGLocalize.translate('RewardDetailScreen.swipeSuccess')}</Text>
                </View>
            </RectButton>
            );
        
      };
      
      
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var data = this.data;
        var language = this._language.toUpperCase();
        console.log(data);
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'RewardDetailScreenRootView'} style={style.mainContainer}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                {/* <ScrollView  > */}
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate('RewardDetailScreen.Title')}></RibbonHeader>
                {this.alreadyMount ?
                    this.data !== null ?
                        (
                            <ScrollView  dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RewardDetailScreenScrollView'} style={style.sv1} contentContainerStyle={style.sv1_2} showsVerticalScrollIndicator={false} refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._responRewardDone.bind(this)}
                                /> }>
                                <View accessible={true} accessibilityLabel={'RewardDetailScreenContainerView'} style={style.mainView1}>
                                   
                                    <Text accessible={true} accessibilityLabel={'RewardDetailScreenRewardName'} preset={Text.preset.titleH1B} style={style.textTitle} numberOfLines={1}>{(data['fReward' + language].fRewardName).toUpperCase()}</Text>
                                    {
                                        data.fType === 'building' &&
                                        <Text accessible={true} accessibilityLabel={'RewardDetailScreenRewardName'} preset={Text.preset.titleH3} style={style.shortDescText} numberOfLines={3}>{(data['fReward' + language].fShortDescription).toUpperCase()}</Text>
                                    }
                                    {
                                        data.fType === 'store' || data.fType === 'resto' &&
                                        <Text accessible={true} accessibilityLabel={'RewardDetailScreenRewardName'} preset={Text.preset.titleH3} style={style.shortDescText} numberOfLines={3}>{(data['fReward' + language].fShortDescription).toUpperCase()}</Text>
                                    }
                                    {
                                        data.fType === 'building' &&
                                        <RewardDetailHeader accessible={true} accessibilityLabel={'RewardDetailScreenHeader'} commentPackage={this._getCommentResourcePlaceReward(this.data)} imageSetting={this.imageSetting} footerKey={data.fBuildingKey} contentType={'RewardPlace'} fType={data.fType} footerName={data['fReward' + language].fTargetName} footerLogo={data['fContentBuilding' + this.Language.toUpperCase()].fImageJSON[0]} footerLikedCount={data.fLikeCountBuilding} imageSlider={data['fReward' + language].fImageJSON} isUserLikeThis={data.isUserLikeThis} contentKey={data.fID} navigator={this.props.navigation} city={data.fCity} canComment={data.fCanComment} validDate={SGHelperType.formatDate(SGHelperType.convertNewDate(this.expiredDate),this._language.toUpperCase())} style={style.throwWHP}></RewardDetailHeader>
                                    }
                                    {
                                        data.fType === 'store' &&
                                        <RewardDetailHeader accessible={true} accessibilityLabel={'RewardDetailScreenHeader'} commentPackage={this._getCommentResourceStoreReward(this.data)} imageSetting={this.imageSetting} footerKey={data.fStoreKey} contentType={'RewardStore'} fType={data.fType} footerName={data['fReward' + language].fTenantName} footerLogo={data['fContentStore' + this.Language.toUpperCase()].fStoreImageJSON[0]} footerLikedCount={data.fLikeCountStore} imageSlider={data['fReward' + language].fImageJSON} placeName={data['fReward' + language].fTargetName} isUserLikeThis={data.isUserLikeThis} contentKey={data.fID} navigator={this.props.navigation} city={data.fCity} canComment={data.fCanComment} storeCategory={data.fCategoryStore} validDate={SGHelperType.formatDate(SGHelperType.convertNewDate(this.expiredDate),this._language.toUpperCase())} style={style.throwWHP}></RewardDetailHeader>

                                    }
                                    {
                                        data.fType === 'resto' &&
                                        <RewardDetailHeader accessible={true} accessibilityLabel={'RewardDetailScreenHeader'} commentPackage={this._getCommentResourceRestoReward(this.data)} imageSetting={this.imageSetting} footerKey={data.fStoreKey} contentType={'RewardResto'} fType={data.fType} footerName={data['fReward' + language].fTenantName} footerLogo={data['fContentStore' + this.Language.toUpperCase()].fStoreImageJSON[0]} footerLikedCount={data.fLikeCountStore} imageSlider={data['fReward' + language].fImageJSON} placeName={data['fReward' + language].fTargetName} isUserLikeThis={data.isUserLikeThis} contentKey={data.fID} navigator={this.props.navigation} city={data.fCity} canComment={data.fCanComment} restoCategory={data.fCategoryStore} restoCuisine={data.fCuisine} validDate={SGHelperType.formatDate(SGHelperType.convertNewDate(this.expiredDate),this._language.toUpperCase())} style={style.throwWHP}></RewardDetailHeader>

                                    }
                                    
                                    {
                                    data.fExpiredStatus !== 'Y'&&
                                        this.renderMysteryBoxInfo()
                                    }
                                    
                                    {this.startUse === false &&
                                     <Text preset={Text.preset.titleH4_5} style={style.startUseText}>{SGLocalize.translate('RewardDetailScreen.RewardCanUseAfter')} : {SGHelperType.formatDate(SGHelperType.convertNewDate(data.fStartUseDate),this._language.toUpperCase())}</Text>
                                    }
                                    {data.fRedeemedStatus !== 'Y' && data.fExpiredStatus !== 'Y' ? 
                                        <View style={style.redeemMethod}>
                                            <Text preset={Text.preset.titleH3}>{SGLocalize.translate('RewardDetailScreen.redeemMethodText')} : {SGLocalize.translate('RewardDetailScreen.' + this.data.fMethod)}</Text>
                                        </View>
                                    : null }

                                    {data.fRedeemedStatus == 'Y' ? 
                                        <View style={style.redeemDate}>
                                            <Text preset={Text.preset.titleH3B}>{SGLocalize.translate('RewardDetailScreen.redeemOn')} : </Text>
                                            <Text preset={Text.preset.titleH3B} style={{color:'red'}}> {SGHelperType.formatDate(SGHelperType.convertNewDate(data.fUsedDate),this._language.toUpperCase())}</Text>
                                        </View>
                                    : null }

                                    {data.fExpiredStatus == 'Y' && data.fMethod !== 'swipe' ? 
                                        <View style={style.redeemDate}>
                                            <Text preset={Text.preset.titleH3B}>{SGLocalize.translate('ActiveRewardCard.expired')}</Text>
                                            {/* <Text preset={Text.preset.titleH3B} style={{color:'red'}}> {SGHelperType.formatDate(SGHelperType.convertNewDate(this.expiredDate),this._language.toUpperCase())}</Text> */}
                                        </View>
                                    : null }

                        
                                    {data.fMethod == 'qr' ?
                                        (<View style={style.qrCodeSwipeContainer}>
                                            {data.fRedeemedStatus !== 'Y' && data.fExpiredStatus !== 'Y' &&
                                            <Text preset={Text.preset.titleH2B} style={style.textQRCodeSwipeScan}>{SGLocalize.translate('RewardDetailScreen.qrTitle')}</Text>
                                            }
                                            <QRImage accessible={true} accessibilityLabel={'RewardDetailScreenQRImage'} value={data.fID}></QRImage>
                                        </View>)
                                    :
                                    data.fMethod == 'code' ? 
                                        (<View style={style.qrCodeSwipeContainer}>
                                            {data.fRedeemedStatus !== 'Y' && data.fExpiredStatus !== 'Y' &&
                                                <Text preset={Text.preset.titleH2B} style={style.textQRCodeSwipeScan}>{SGLocalize.translate('RewardDetailScreen.codeTitle')}</Text>
                                            }
                                            <TextInput disabled={data.fExpiredStatus == 'Y' || data.fRedeemedStatus == 'Y' ? true : false} style={style.codeTextInput} placeholder={SGLocalize.translate('RewardDetailScreen.enterCode')} onValueChange={(v) => { this._setRewardCode(v) }} dataType={TextInput.dataType.numeric} maxLength={4} value={this.state.rewardCode}></TextInput>
                                            <Button disabled={this.state.redeemButtonDisabled} style={style.codeButtonSubmit} preset={Button.preset.black} label={SGLocalize.translate('RewardDetailScreen.redeemButton')} textPreset={Text.preset.titleH2B} onPress={this._onRedeemPress.bind(this)}></Button>
                                        </View>)
                                    :
                                    data.fMethod == 'swipe' ?
                                        (
                                        data.fRedeemedStatus !== 'Y' && data.fExpiredStatus !== 'Y' ?
                                        <View style={style.qrCodeSwipeContainer}>
                                            <Text preset={Text.preset.titleH2B} style={style.textQRCodeSwipeScan}>{SGLocalize.translate('RewardDetailScreen.swipeTitle')}</Text>
                                          
                                            <View style={{borderRadius:w*0.1,marginVertical:w*0.05,backgroundColor:'#EDEDED'}}>
                                                <Swipeable renderLeftActions={this.renderLeftActions.bind(this)} onSwipeableLeftOpen={()=>{this._onUseButton()}} >
                                                    <View style={[{width:w*0.8,height:w*0.12,borderRadius:w*0.1,backgroundColor:'#EDEDED',justifyContent:'flex-start',flexDirection:'row'}]} >
                                                        <Animated.View style={{width:w*0.12,height:w*0.12,borderRadius:w*0.1,borderWidth:1,borderColor:'#ABABAB',backgroundColor:'#FFFFFF'} }>
                                                        </Animated.View>
                                                        <View style={{flexDirection:'row',justifyContent:'flex-start',marginLeft:w*0.12}} >
                                                            <Text style={{color:'black'}} preset={Text.preset.titleH3}>{SGLocalize.translate('RewardDetailScreen.swipeRight')}</Text>
                                                            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                                                                <SGIcon name={SGIcon.Icon.arrowRight} style={{marginTop:p*1.5}}></SGIcon>
                                                                <SGIcon name={SGIcon.Icon.arrowRight} style={{marginTop:p*1.5}}></SGIcon>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </Swipeable>
                                            </View>
                                            <Text preset={Text.preset.titleH4} style={style.textQRCodeSwipeScan}>* {SGLocalize.translate('RewardDetailScreen.SwipeMoreInfo')}</Text>    
                                        </View>
                                        :
                                        <View style={style.qrCodeSwipeContainer}>              
                                        <View style={{borderRadius:w*0.1,marginVertical:w*0.05,backgroundColor:'#EDEDED'}}>           
                                                <View style={[{width:w*0.8,height:w*0.12,borderRadius:w*0.1,backgroundColor: data.fExpiredStatus !=='Y'? 'rgb(31,188,141)' : '#EDEDED',justifyContent:'center'}]} >
                                                    <Text style={{color: data.fExpiredStatus !=='Y'? 'white' :'black'}} preset={Text.preset.titleH3}>{data.fExpiredStatus !=='Y'? SGLocalize.translate('RewardDetailScreen.Claimed'):SGLocalize.translate('RewardDetailScreen.ExpiredTitle')}</Text>
                                                </View>
                                        </View>
                                        <Text preset={Text.preset.titleH4} style={style.textQRCodeSwipeScan}>* {SGLocalize.translate('RewardDetailScreen.SwipeMoreInfo')}</Text>    
                                    </View>
                                        )
                                    :
                                        null
                                    }
                                     <View accessible={true} accessibilityLabel={'PlaceEventDetailScreenContentView'} style={style.descriptionContainer}>
                                        {data['fReward' + language].fTypeDetail === 'longdescription' ?
                                            (
                                    <View style={style.vView2}> 
                                        <Text accessible={true} accessibilityLabel={'PlaceEventDetailScreenDescText'} preset={Text.preset.titleH3} style={style.descriptionText}>{data['fReward' + language].fLongDescription}</Text>
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
                                        {data['fReward' + language].fTypeDetail === 'url' && data['fReward' + language].fURL !== '' ?
                                            (
                                        <View style={style.vView2}> 

                                            <View style={{width:w-16*p,height:h}}> 
                                                <WebView accessible={true} accessibilityLabel={'RewardDetailUrl'} style={{flex:1,backgroundColor:'white'}} source={{ uri: data['fReward' + language].fURL  }}></WebView>
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
                                        {data['fReward' + language].fTypeDetail === 'html' && data['fReward' + language].fHTML !== '' ?
                                            (
                                            <View style={style.vView2}> 

                                                <View style={{width:w-16*p,height:h}}> 
                                                    <WebView accessible={true} accessibilityLabel={'RewardDetailUrl'} style={{flex:1,backgroundColor:'white'}} source={{ html: data['fReward' + language].fHTML   }}></WebView>
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
                                </View>
                                {this.data['fContent' + language] === null ? null 
                                :
                                    <SGPopView accessible={true} accessibilityLabel={'MysteryBoxRewardDetail'} shadow animationType={'slide'} popViewID={this.pvID2} vPos='center'>
                                        <View style={style.pvContainer}>
                                            <View style={style.pvContent}>
                                                <Image accessible={true} accessibilityLabel={'MysteryBoxRewardImage'} style={style.pvImage} source={{ uri: data['fContent' + language].fImageJSON[0][this.imageSetting].uri }}></Image>
                                                <ScrollView style={style.sv2}>
                                                    <View style={style.pvTitleContainer}>
                                                        <Text preset={Text.preset.titleH2B}>{data['fContent' + language].fTitle}</Text>
                                                    </View>
                                                    <View style={style.pvDescContainer}>
                                                        <Text preset={Text.preset.titleH3}>{data['fContent' + language].fDescription}</Text>
                                                    </View>
                                                </ScrollView>
                                            </View>
                                            <Button style={style.pvButton} label={SGLocalize.translate('Alert.Close')} textPreset={Text.preset.titleH3B} onPress={() => this.hideDetailMysteryBox()}></Button>
                                        </View>
                                    </SGPopView>
                                }
                            </ScrollView>
                        )
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyDetail')} style={style.throwWHP}></EmptyDetailView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
             {/* </ScrollView> */}
                <BottomNavigationContainer accessible={true} accessibilityLabel={'RewardDetailScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}
