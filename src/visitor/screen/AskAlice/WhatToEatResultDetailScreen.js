/**
 * Version 1.2.0
 * 1. Yohanes March 29 2021
 * - add Error Handling
* Leon, 4 May 2021
  - Fix Like
*/

import React from 'react';
import { StyleSheet,Linking } from 'react-native';
import { SGRootView as RootView, SGView as View, SGText as Text, SGScrollView as ScrollView, SGActivityIndicator as ActivityIndicator,SGDialogBox as DialogBox,SGWebView as WebView } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperType, SGHelperErrorHandling,SGHelperWindow } from '../../../core/helper';
import { WhatToEatDetailHeader } from '../../container_V2/WhatToEatDetailHeader';
import { VAliceResultAPI } from '../../api/VAliceResultAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';

export class WhatToEatResultDetailScreen extends SGBaseScreen {
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

    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        if(valid){
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                DialogBox.showWebView(url,()=>{});
                // DialogBox.showWarning(null,SGLocalize.translate("AlertMessage.Fail"),SGLocalize.translate("AlertMessage.AlertHandleLink"),SGLocalize.translate("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                // console.log("Don't know how to open URI: " + url);
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
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: this.data.restoKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
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

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.baseRunSingleAPIWithRedoOption('getWhatToEatResultDetail', (async (v1) => { return VAliceResultAPI.getWhatToEatResultDetail(v1) }).bind(this,this.contentKey), (async (v) => {
            this.data = v 
            this._construcArrayOfLinks();
            console.log('data')
            console.log(this.data)
            this.dataContent = this.data['fContentRec' + this.Language.toUpperCase()];
            this.dataContentFooter = this.data['fContentStore' + this.Language.toUpperCase()];
            this.alreadyMount = true;

            this.forceUpdate();
            this._addUserView()
        }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes")); 
       
        // await tbVUserViewAPI.addUserView(jsonInput)

    }
    async _addUserView(){
        try {
            var jsonInput = { fID: '', fContentType: 'WhatToEat',fContentKey: this.data.key, fTargetKey: this.data.restoKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
            await tbVUserViewAPI.addUserView(jsonInput) 
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addUserView.bind(this))
        }
       
    }
    _getLikeResource(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentRecID = data.fContentRecID;
        var contentRecEN = data.fContentRecEN;
        var contentRecCN = data.fContentRecCN;
        return (
            { fContentType: 'WhatToEat', fContentKey: data.key, fText1: { id: contentRecID.fRecName, en: contentRecEN.fRecName, cn: contentRecCN.fRecName }, fText2: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentRecID.fImageJSON, fImageEN: contentRecEN.fImageJSON, fImageCN: contentRecCN.fImageJSON, fTargetKey: data.restoKey }
        )
    }

    _getCommentResource(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentRecID = data.fContentRecID;
        var contentRecEN = data.fContentRecEN;
        var contentRecCN = data.fContentRecCN;

        return (
            {
                fUserImage: this.userData.fProfileImageJSON, fContentType: 'WhatToEat', fContentKey: data.key,
                fContentName: { id: contentRecID.fRecName, en: contentRecEN.fRecName, cn: contentRecCN.fRecName },
                fContentText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText2: { id: contentRecID.fShortDescription, en: contentRecEN.fShortDescription, cn: contentRecCN.fShortDescription },
                fContentImage: { id: contentRecID.fImageJSON, en: contentRecEN.fImageJSON, cn: contentRecCN.fImageJSON },
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

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        console.log(this.data);
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'WhatToEatResultDetailScreenRootView'} style={style.mainContainer}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("whatToEatResultDetailScreen.screenTitle")}></RibbonHeader>
                {this.alreadyMount ?
                    this.data !== null ?
                        <ScrollView accessible={true} accessibilityLabel={'WhatToEatResultDetailScreenScrollView'} style={style.scrollContainer} contentContainerStyle={style.scrollContainerContent} showsVerticalScrollIndicator={false}>
                           
                            <WhatToEatDetailHeader whatsapp={this.data.whatsapp} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountRec+=c; this.forceUpdate();}).bind(this, this.data)} accessible={true} accessibilityLabel={'WhatToEatResultDetailScreenWTBDetailHeader'} commentPackage={this._getCommentResource(this.data)} likePackage={this._getLikeResource(this.data)} imageSetting={this.imageSetting} currency={this.currentUserCurrency} language={this.Language} data={this.data} contentKey={this.contentKey} navigator={this.props.navigation} contentLikeCount={this.data.fLikeCountRec} productName={(this.dataContent.fRecName)} style={style.throwWHP}></WhatToEatDetailHeader>
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
                        <EmptyDetailView text={SGLocalize.translate('globalText.emptyDetail')} style={style.throwWHP}></EmptyDetailView>
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>

                <BottomNavigationContainer accessible={true} accessibilityLabel={'WhatToEatResultDetailScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}
