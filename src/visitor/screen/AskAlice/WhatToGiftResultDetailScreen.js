/**
 * Version 1.2.0
 * 1. Yohanes March 29 2021
 * - add Error Handling
 * Leon, 4 May 2021
  - Fix Like
*/
import React from 'react';
import { StyleSheet,Linking } from 'react-native';
import { SGRootView as RootView, SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGScrollView as ScrollView, SGViewPager as ViewPager, SGScrollView, SGActivityIndicator as ActivityIndicator,SGDialogBox as DialogBox,SGWebView as WebView } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperType, SGHelperErrorHandling,SGHelperWindow } from '../../../core/helper';
import { WhatToGiftDetailHeader } from '../../container_V2/WhatToGiftDetailHeader';
import { VAliceResultAPI } from '../../api/VAliceResultAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';

export class WhatToGiftResultDetailScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            scrollContainer: { backgroundColor: '#FFFFFF' },
            scrollContainerContent: { backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            descriptionContainer: { width: w - p * 10, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 5 },
            descriptionText: { alignSelf: 'flex-start', textAlign: 'justify' },
            scV1:{width:w,marginVertical:2*p},
            vView2:{width: w - p * 10,flex:1},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.contentKey = this.props.route.params.contentKey;
        this.alreadyMount = false;
        this.arrayOfLinksContent = SGHelperGlobalVar.getVar("arrayOfLinks");
        this.arrayOfLinksData = [];
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
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

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async _onRefreshAllItem() {

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.baseRunSingleAPIWithRedoOption('getWhatToGiftResultDetail', (async (v1) => { return VAliceResultAPI.getWhatToGiftResultDetail(v1) }).bind(this,this.contentKey), (async (v) => {
            this.data = v// await VAliceResultAPI.getWhatToGiftResultDetail(this.contentKey);
            this._construcArrayOfLinks();
            this.dataContent = this.data['fContentRec' + this.Language.toUpperCase()];
            this.dataContentFooter = this.data['fContentStore' + this.Language.toUpperCase()];
            this.alreadyMount = true;
            this.forceUpdate();
            if (this.data.fType === 'giftResto') {
                var contentType = 'RestoWhatToGift'
            }
            if (this.data.fType === 'giftStore') {
                var contentType = 'StoreWhatToGift'
            }
            var jsonInput = { fID: '', fContentType: contentType,fContentKey: this.data.key, fTargetKey: this.data.storeKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
            this._addUserView(jsonInput)
        }).bind(this), (()=>{this.setState({ refresh: false })}),  SGHelperGlobalVar.getVar("ResponTimes")); 
      
    }
    async _addUserView(jsonInput){
        try {
            await tbVUserViewAPI.addUserView(jsonInput)
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addUserView.bind(this,jsonInput))
        }
        
    }
    _getLikeResource(data) {
        if (data.fType === 'giftResto') {
            var contentType = 'RestoWhatToGift'
        }
        if (data.fType === 'giftStore') {
            var contentType = 'StoreWhatToGift'
        }
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentRecID = data.fContentRecID;
        var contentRecEN = data.fContentRecEN;
        var contentRecCN = data.fContentRecCN;
        return (
            { fContentType: contentType, fContentKey: data.key, fText1: { id: contentRecID.fRecName, en: contentRecEN.fRecName, cn: contentRecCN.fRecName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentRecID.fImageJSON, fImageEN: contentRecEN.fImageJSON, fImageCN: contentRecCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getCommentResource(data) {
        if (data.fType === 'giftResto') {
            var contentType = 'RestoWhatToGift'
        }
        if (data.fType === 'giftStore') {
            var contentType = 'StoreWhatToGift'
        }

        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentRecID = data.fContentRecID;
        var contentRecEN = data.fContentRecEN;
        var contentRecCN = data.fContentRecCN;

        return (
            {
                fUserImage: this.userData.fProfileImageJSON, fContentType: contentType, fContentKey: data.key,
                fContentName: { id: contentRecID.fRecName, en: contentRecEN.fRecName, cn: contentRecCN.fRecName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentRecID.fShortDescription, en: contentRecEN.fShortDescription, cn: contentRecCN.fShortDescription },
                fContentImage: { id: contentRecID.fImageJSON, en: contentRecEN.fImageJSON, cn: contentRecCN.fImageJSON },
                fTargetType: data.fType === 'giftStore' ? 'Store' : 'Resto', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
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
        console.log(this.data);
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'WhatToGiftResultDetailScreenRootView'} style={style.mainContainer}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("whatToGiftResultDetailScreen.screenTitle")}></RibbonHeader>
                {this.alreadyMount ?
                    this.data !== null ?
                        <ScrollView accessible={true} accessibilityLabel={'WhatToGiftResultDetailScreenScrollView'} style={style.scrollContainer} contentContainerStyle={style.scrollContainerContent} showsVerticalScrollIndicator={false}>
                            <WhatToGiftDetailHeader whatsapp={this.data.whatsapp} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountRec+=c; this.forceUpdate();}).bind(this, this.data)} accessible={true} accessibilityLabel={'WhatToGiftResultDetailScreenHeader'} commentPackage={this._getCommentResource(this.data)} likePackage={this._getLikeResource(this.data)} contentType={this.data.fType === 'giftResto' ? 'RestoWhatToGift' : 'StoreWhatToGift'} currency={this.currentUserCurrency} language={this.Language} data={this.data} imageSetting={this.imageSetting} contentKey={this.contentKey} navigator={this.props.navigation} contentLikeCount={this.data.fLikeCountRec} productName={(this.dataContent.fRecName)} style={style.throwWHP}></WhatToGiftDetailHeader>
                            {this.dataContent.fTypeDetail === 'longdescription' ?
                            <View style={style.vView2}> 
                            <Text preset={Text.preset.titleH3} accessible={true} accessibilityLabel={'WhatToEatResultDetailScreenContentDesc'} style={style.descriptionText}>{this.dataContent.fLongDescription}</Text>
                                <ScrollView style={style.scV1}>
                                { this.arrayOfLinksData.map((item, i) => {
                                return (
                                <IconArrayOfLinks accessible={true} accessibilityLabel={'IconArrayOfLinks'} style={style.throwWHP}  data={item}  onIconArrayPress={this.handleLinkArrayOfLinks.bind(this, item)}  arrImage={item.arrContent.content.fImageJSON[0][this.imageSetting].uri}></IconArrayOfLinks >
                                        );
                                    })
                                }
                                </ScrollView>       
                            </View>
                            : null
                            }
                            {this.dataContent.fTypeDetail === 'url' && this.dataContent.fURL !== '' ?
                                        
                            <View style={style.vView2}> 
                                <View style={{width:w-16*p,height:h}}> 
                                    <WebView accessible={true} accessibilityLabel={'RestoMenuDetailUrl'} style={{flex:1,backgroundColor:'white'}} source={{ uri: this.dataContent.fURL }}></WebView>
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
                                :
                                 null
                            }
                            {this.dataContent.fTypeDetail === 'html' && this.dataContent.fHTML !== '' ?
                            <View style={style.vView2}> 
                                <View style={{width:w-16*p,height:h}}> 
                                    <WebView accessible={true} accessibilityLabel={'RestoMenuDetailHtml'} style={{flex:1,backgroundColor:'white'}} source={{ html: this.dataContent.fHTML }}></WebView>
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
                                :
                            null}
                        </ScrollView>
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyDetail')} style={style.throwWHP}></EmptyDetailView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }

                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>

                <BottomNavigationContainer accessible={true} accessibilityLabel={'WhatToGiftResultDetailScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}
