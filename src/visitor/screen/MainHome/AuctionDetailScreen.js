import React from 'react';
import { StyleSheet, Animated,Linking, RefreshControl } from 'react-native';
import { SGRootView as RootView, SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGScrollView as ScrollView, SGViewPager as ViewPager, SGActivityIndicator as ActivityIndicator,SGDialogBox as DialogBox, SGDialogBox} from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { AuctionDetailHeader } from '../../container_V2/AuctionDetailHeader';
import { VAuctionDetailAPI } from '../../api/VAuctionDetailAPI';
import { tbVReferralCodeAPI } from '../../api/tbVReferralCodeAPI'
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import { JoinAuctionForm } from '../../form_V2/JoinAuctionForm'
import { tbTAuctionxParticipantData, tbTAuctionxParticipantDataReceipt } from '../../db/tbTAuctionxParticipantDAO';
import { AuctionParticipantCard } from '../../container_V2/AuctionParticipantCard';
import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';
import { AuctionParticipantWinnerCard } from '../../container_V2/AuctionParticipantWinnerCard'

export class AuctionDetailScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            eventNameText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4, marginTop: p * 3 },
            shortDescText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4,marginVertical:p },
            sv1: { backgroundColor: 'white' },
            sv1_2: { justifyContent: 'flex-start', backgroundColor: 'white',  paddingBottom: p*10},
            throwWHP: { width: w, height: h, padding: p },
            textContentLiked: { color: '#A7A7A7', alignSelf: 'flex-start', marginHorizontal: p * 4 },
            auctionSummary: { width: w*0.93, backgroundColor: 'black', borderWidth: p*0.5, borderRadius: p*3, flexDirection: 'row', justifyContent: 'space-evenly', borderColor: 'grey' },
            auctionSummary_2: { marginVertical: p*2 },

            myBidView: {width: w*0.93, marginTop: p*2, justifyContent: 'flex-start', alignItems: 'flex-start' },
            titleMyBid: {marginLeft: p*2},
            titleWinnerBid: {width: w*0.93, borderBottomWidth: p*0.3, paddingVertical: p*2, justifyContent: 'center'},
            vcard: { width: w - 2 * p, padding: p },
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

    checkAPIBatchStatusAllDone() {
        if(this.data.fUploadReceipt == 'N'){
            this.auctionParticipant = new tbTAuctionxParticipantData()
        }else{
            this.auctionParticipant = new tbTAuctionxParticipantDataReceipt()
        }
        
        this.alreadyMount = true;
        this.forceUpdate();

    }

    async _onRefreshAllItem() {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        
        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));
        this.baseAddAPIParallel('getAuctionDetail', (async (v1) => { return VAuctionDetailAPI.getAuctionDetail(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.data = v //await VAuctionDetailAPI.getAuctionDetail(this.props.route.params.contentKey);
            console.log('getAuctionDetail')
            console.log(this.data)
            if (this.data !== null) {
                this._construcArrayOfLinks();
                for(var i = 0; i < this.data.fWinnerImage.length; i++){
                    this.data['fContentAuction' + this.Language.toUpperCase()].fImageJSON.splice(0,0,this.data.fWinnerImage[i])
                }
            }
            if (this.alreadyMount === false) {
                if (this.data !== null) {
                    var jsonInput = { fID: '', fContentType: this.data.fType =='store'? 'StoreAuction' : 'RestoAuction', fContentKey: this.props.route.params.contentKey, fTargetKey: this.data.storeKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
                    this._addUserView(jsonInput)
                }
            }
            console.log(this.data)
        }).bind(this), null);

        this.baseAddAPIParallel('GetSummarySilentAuction', (async (v1) => { return VAuctionDetailAPI.GetSummarySilentAuction(v1); }).bind(this, this.props.route.params.contentKey), ((v) => {
            this.dataSummary = v
            console.log('GetSummarySilentAuction')
            console.log(this.dataSummary)
        }).bind(this), null);

        if (!this.anonymousMode) {
        this.baseAddAPIParallel('getUserReferralPoint', (async () => { return tbVReferralCodeAPI.getUserReferralPoint(); }).bind(), ((v) => {
            this.myReferralPoint = v;
            console.log('getUserReferralPoint')
            console.log(this.myReferralPoint)
        }).bind(this), null);

        this.baseAddAPIParallel('getWinnerDetail', (async (v1) => { return VAuctionDetailAPI.getWinnerDetail(v1); }).bind(this, this.props.route.params.contentKey), ((v) => {
            this.dataWinner = v;
            console.log('getWinnerDetail')
            console.log(this.getWinnerDetail)
        }).bind(this), null);

        this.baseAddAPIParallel('GetMyAuctionBidList', (async (v1) => { return VAuctionDetailAPI.GetMyAuctionBidList(v1); }).bind(this, this.props.route.params.contentKey), ((v) => {
            this.dataMyAuction = v;
            console.log('GetMyAuctionBidList')
            console.log(this.dataMyAuction)
        }).bind(this), null);
        }
       
       
        this.baseRunAPIParallel();
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
        });
        this.myReferralPoint = 0;
        this.dataMyAuction = [];
        this.dataWinner = [];
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.data = '';
        this.auctionParticipant = new tbTAuctionxParticipantDataReceipt()
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.contentKey = this.props.route.params.contentKey;
        this.alreadyMount = false;
        this.arrayOfLinksContent = SGHelperGlobalVar.getVar("arrayOfLinks");
        this.arrayOfLinksData = [];
        this.state={refreshing:false }
    }

    _getLikeResource(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentAuctionID = data.fContentAuctionID;
        var contentAuctionEN = data.fContentAuctionEN;
        var contentAuctionCN = data.fContentAuctionCN;
        return (
            { fContentType: data.fType =='store' ? 'StoreAuction' : 'RestoAuction', fContentKey: data.key, fText1: { id: contentAuctionID.fAuctionName, en: contentAuctionEN.fAuctionName, cn: contentAuctionCN.fAuctionName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentAuctionID.fImageJSON, fImageEN: contentAuctionEN.fImageJSON, fImageCN: contentAuctionCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getCommentResource(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentAuctionID = data.fContentAuctionID;
        var contentAuctionEN = data.fContentAuctionEN;
        var contentAuctionCN = data.fContentAuctionCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType:  data.fType =='store' ? 'StoreAuction' : 'RestoAuction', fContentKey: data.key,
                fContentName: { id: contentAuctionID.fAuctionName, en: contentAuctionEN.fAuctionName, cn: contentAuctionCN.fAuctionName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentAuctionID.fShortDescription, en: contentAuctionEN.fShortDescription, cn: contentAuctionCN.fShortDescription },
                fContentImage: { id: contentAuctionID.fImageJSON, en: contentAuctionEN.fImageJSON, cn: contentAuctionCN.fImageJSON },
                fTargetType: data.fType =='store' ? 'Store' : 'Resto', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
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

    submitPress(){
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else{
        if(SGHelperType._revertUTCDate(this.data.fGMTValue, this.data.startDate) <= new Date()){
            if(this.currentUserData.fPhoneNumber == ""){
                DialogBox.showConfirmation(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate('auctionDetailScreen.failPhoneNumber'), SGLocalize.translate('globalText.no'),()=>{},SGLocalize.translate('globalText.yes'),()=>{            SGHelperNavigation.navigatePush(this.props.navigation, 'AddPhoneNumberScreen'),true})
            }else{
                if(this.data.bidCount >= this.data.fMaxBidUser){
                    SGDialogBox.showWarning(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('auctionDetailScreen.failMaxBid'), SGLocalize.translate('globalText.ok'), () => { }, true);
                }else{
                    this._checkInformation()
                }
            }
        }else{
            SGDialogBox.showWarning(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('auctionDetailScreen.failStartDate'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
        }
    }

    async _onCancelBidParticipant(data){
        try {
            this.dbID1 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Processing"))
            await VAuctionDetailAPI.cancelBidParticipant(data)
            await this._onRefreshAllItem();
            setTimeout(() => { SGDialogBox.hideDialogBox(this.dbID1, true)}, 300); 
           
        } catch (error) {
            setTimeout(() => { SGDialogBox.hideDialogBox(this.dbID1, true)}, 300); 
            SGHelperErrorHandling.Handling(error,this._onCancelBidParticipant.bind(this))
        }
    }

    async cancelBidParticipantPress(data){
        SGDialogBox.showConfirmation(null, SGLocalize.translate('AlertMessage.Confirmation'), SGLocalize.translate('AlertMessage.ConfirmCancelAuction'), SGLocalize.translate("AlertMessage.Cancel"), () => { }, SGLocalize.translate("AlertMessage.OK"),
            async () => {
                await this._onCancelBidParticipant(data)
            },true)
    }

    async _checkInformation(){
        this.dbID = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Processing"))
        if(this.data.isBan != 'Y'){
            this.totalPoint = this.myReferralPoint.totalAvailable - this.data.fReferralPrice
            this.auctionParticipant.fAuctionKey = this.props.route.params.contentKey;
            this.auctionParticipant.fStoreKey = this.data.storeKey
            this.auctionParticipant.fReferralPoint = this.data.fReferralPrice
            this.auctionParticipant.fUploadReceipt = this.data.fUploadReceipt
            if(this.totalPoint >= 0){
                if(this.auctionParticipant.fBidPrice <= this.data.fMaxBidPrice && this.auctionParticipant.fBidPrice >= this.data.fMinBidPrice){
                    if(this.data.fModulusBidPrice > 0){
                        if(this.auctionParticipant.fBidPrice % this.data.fModulusBidPrice == 0){
                            try {
                                await VAuctionDetailAPI.InsertAuctionParticipant(this.auctionParticipant.getCurrentJSON());
                                await this._onRefreshAllItem();
                                SGDialogBox.hideDialogBox(this.dbID, true);
                            } catch (error) {
                                SGDialogBox.hideDialogBox(this.dbID, true);
                                SGHelperErrorHandling.Handling(error,this._checkInformation.bind(this))
                            }
                        }else{
                            SGDialogBox.hideDialogBox(this.dbID, true);
                            SGDialogBox.showWarning(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('auctionDetailScreen.failModBidPrice', {amount: this.currency + ' ' + SGHelperType.addThousandSeparator((this.data.fModulusBidPrice.toFixed(0)).toString())}), SGLocalize.translate('globalText.ok'), () => { }, true);
                            return
                        }
                    }else{
                        try {
                            await VAuctionDetailAPI.InsertAuctionParticipant(this.auctionParticipant.getCurrentJSON());
                            await this._onRefreshAllItem();
                            SGDialogBox.hideDialogBox(this.dbID, true);
                        } catch (error) {
                            SGDialogBox.hideDialogBox(this.dbID, true);
                            SGHelperErrorHandling.Handling(error,this._checkInformation.bind(this))
                        }
                    }
                }else{
                    SGDialogBox.hideDialogBox(this.dbID, true);
                    SGDialogBox.showWarning(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('auctionDetailScreen.failBidPrice'), SGLocalize.translate('globalText.ok'), () => { }, true);
                    return
                }
            }else{
                SGDialogBox.hideDialogBox(this.dbID, true);
                SGDialogBox.showWarning(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('auctionDetailScreen.failPoint'), SGLocalize.translate('globalText.ok'), () => { }, true);
                return
            }
        }else{
            SGDialogBox.hideDialogBox(this.dbID, true);
            SGDialogBox.showWarning(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('auctionDetailScreen.isBanText') +'\n' + this.data.fReason,SGLocalize.translate('globalText.ok'), () => { }, true); 
            }
    }

    async _refreshScreen(){
        await this._onRefreshAllItem()
        
    }

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

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var data = this.data;
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'AuctionDetailScreenRootView'} style={style.mainContainer}>
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("auctionDetailScreen.title")} ribbonWidth={0.6}></RibbonHeader>
                 {this.alreadyMount ?
                    this.data !== null ?
                        (<ScrollView accessible={true} accessibilityLabel={'AuctionDetailScreenScrollView'} style={style.sv1} contentContainerStyle={style.sv1_2} showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._refreshScreen.bind(this)}
                            /> }
                            >
                            <Text accessible={true} accessibilityLabel={'AuctionDetailScreenTitle'} preset={Text.preset.heading4B} style={style.eventNameText}>{(data['fContentAuction' + this.Language.toUpperCase()].fAuctionName).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'EventShortDescription'} preset={Text.preset.h7I} style={style.shortDescText}>{data['fContentAuction' + this.Language.toUpperCase()].fShortDescription}</Text>
                            <Text accessible={true} accessibilityLabel={'AuctionDetailScreenLikeCount'} preset={Text.preset.h8B} style={style.textContentLiked}>{data.fLikeCountAuction} {SGLocalize.translate('globalText.likeCountText')}</Text>
                            <AuctionDetailHeader auctionName={(data['fContentAuction' + this.Language.toUpperCase()].fAuctionName).toUpperCase()} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountAuction+=c; this.forceUpdate();}).bind(this, data)} accessible={true} accessibilityLabel={'AuctionDetailScreenHeader'} language={this.Language} imageSetting={this.imageSetting} contentType={this.data.fType =='store'? 'StoreAuction' : 'RestoAuction'} likePackage={this._getLikeResource(data)} commentPackage={this._getCommentResource(data)} footerName={data['fContentStore' + this.Language.toUpperCase()].fStoreName} footerLogo={data['fContentStore' + this.Language.toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} footerCategory={data.storeCategory} placeName={data['fBuildingName' + this.Language.toUpperCase()]} footerLikedCount={data.fLikeCountStore} imageSlider={data['fContentAuction' + this.Language.toUpperCase()].fImageJSON} isUserLikeThis={data.fUserLikedThis} contentKey={data.key} storeKey={data.storeKey} navigator={this.props.navigation} startDate={data.startDate} endDate={data.endDate} shareMessage={data['fContentAuction' + this.Language.toUpperCase()].fShareMessage} targetKey={data.storeKey} canComment={data.fCanComment} style={style.throwWHP}></AuctionDetailHeader>
                            {this.data.fBidSilent === 'N' &&
                                <View style={style.auctionSummary}>
                                    <View style={style.auctionSummary_2}>
                                        <Text style={{color: 'white'}} preset={Text.preset.h3B}>{this.dataSummary.fTotalBids}</Text>
                                        <Text style={{color: 'white'}} preset={Text.preset.h6B}>{SGLocalize.translate('auctionDetailScreen.bid')}</Text>
                                    </View>
                                    <View style={style.auctionSummary_2}>
                                        <Text style={{color: 'white'}} preset={Text.preset.h3B}>{this.currency} {SGHelperType.addThousandSeparator((this.dataSummary.fHighestBid.toFixed(0)).toString())}</Text>
                                        <Text style={{color: 'white'}} preset={Text.preset.h6B}>{SGLocalize.translate('AuctionForm.HighestBid')}</Text>
                                    </View>
                                </View>
                            }
                            { this.arrayOfLinksData.map((item, i) => {
                            return (
                                    <IconArrayOfLinks accessible={true} accessibilityLabel={'IconArrayOfLinks'} style={style.throwWHP}  data={item}  onIconArrayPress={this.handleLinkArrayOfLinks.bind(this, item)}  arrImage={item.arrContent.content.fImageJSON[0][this.imageSetting].uri}></IconArrayOfLinks >
                                    );
                                })
                            }

                            {this.data.fActive == 'Y' ?
                            (
                                <JoinAuctionForm data={this.auctionParticipant} dataAuction={this.data} imageSetting={this.imageSetting} myPoint={this.myReferralPoint} myReferralPoint={this.myReferralPoint} style={style.throwWHP} userData={this.currentUserData} language={this._language} onPress={this.submitPress.bind(this)} navigator={this.props.navigation} disabled={this.data.fMinBidPrice == this.data.fMaxBidPrice ? true : false}></JoinAuctionForm>
                            )
                            :
                            (
                                <View>
                                    <View style={style.titleWinnerBid}>
                                        <Text preset={Text.preset.h3B}>{SGLocalize.translate('auctionDetailScreen.WinnerBidTitle')}</Text>
                                    </View>  
                                    {this.dataWinner.length > 0 &&
                                        this.dataWinner.map((item) => {
                                            return (
                                            <AuctionParticipantWinnerCard data={item} dataAuction={this.data} language={this._language} style={style.throwWHP} imageSetting={this.imageSetting}></AuctionParticipantWinnerCard>
                                            )
                                        })
                                    }
                                </View>
            
                                // <Text>Winner</Text>   
                            )}
                            {!this.anonymousMode &&
                            <View style={style.myBidView}>
                                <Text style={style.titleMyBid} preset={Text.preset.h3B}>{SGLocalize.translate('MyBooking.screenTitle2')}</Text>
                                {this.dataMyAuction.length !== 0 ? 
                                (
                                    this.dataMyAuction.map((item) => {
                                        return (
                                        <AuctionParticipantCard onCancelBid={this.cancelBidParticipantPress.bind(this,item)} data={item} dataAuction={this.data} language={this._language} style={style.throwWHP} imageSetting={this.imageSetting}></AuctionParticipantCard>
                                        )
                                    })
                                ) 
                                : 
                                (
                                    <View style={{width:w, marginVertical: p*10, justifyContent: 'center'}}>
                                        <Text>{SGLocalize.translate('auctionDetailScreen.myBidEmpty')}</Text>
                                    </View>
                                )}
     
                            </View>
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
