/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
 import React from 'react';
 import { StyleSheet, Animated,Linking } from 'react-native';
 import { SGRootView as RootView, SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGScrollView as ScrollView, SGViewPager as ViewPager, SGActivityIndicator as ActivityIndicator, SGWebView as WebView, SGDialogBox } from '../../../core/control';
 import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
 import { RibbonHeader } from '../../component_V2/RibbonHeader';
 import { SGLocalize } from '../../locales/SGLocalize';
 import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
 import { SponsorEventDetailHeader } from '../../container_V2/SponsorEventDetailHeader';
 import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
 import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
 import { tbVNotificationAPI } from '../../api/tbVNotificationAPI';
 import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
 import {IconArrayOfLinks} from '../../component_V2/IconArrayOfLinks';
 import { tbVEventSponsorshipAPI } from '../../api/tbVEventSponsorshipAPI';
 export class SponsorshipDetailScreen extends SGBaseScreen {
     createStyleSheet = (whp) => {
         var { w, h, p } = whp;
         return StyleSheet.create({
             mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
             eventNameText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4, marginTop: p * 3 },
             sv1: { backgroundColor: 'white' },
             sv1_2: { justifyContent: 'flex-start', backgroundColor: 'white', },
             throwWHP: { width: w, height: h, padding: p },
             textContentShare: { color: '#A7A7A7', alignSelf: 'flex-start', marginHorizontal: p * 4 },
             descriptionContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 2 },
             descriptionText: { color: '#000000',paddingLeft:2*p,alignSelf: 'flex-start' },
             scV1:{width:w,marginVertical:2*p},
             button:{marginVertical:3*p},
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
            if((SGHelperType.left(url,8) != 'https://')){
                Linking.openURL('https://'+url).then(()=>{}).catch(()=>{
                SGDialogBox.showWebView(url,()=>{});    
                });
            }else{
                Linking.openURL(url).then(()=>{}).catch(()=>{
                    SGDialogBox.showWebView(url,()=>{});   
                });
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
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: this.data.fID, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
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
             this.baseRunSingleAPIWithRedoOption('getSponsorshipEventDetail', (async (v1) => { return tbVEventSponsorshipAPI.searchEventSponsorshipDetail(v1) }).bind(this,this.props.route.params.contentKey), (async(v) => {
                 this.data = v 
                 if (this.data !== null) {
                     this._construcArrayOfLinks();
                     this.dataContent = this.data['fContent' + this.Language.toUpperCase()];
                     this.dataContentFooter = this.data['fProfileContent' + this.Language.toUpperCase()];
                 }
         
                 if (this.alreadyMount === false) {
                     if(this.data !== null){
                         var jsonInput = { fID: '', fContentType: 'SponsorshipEvent', fContentKey: this.data.fID, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date(), fTargetKey: this.data.fProfileSponsorshipKey }
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
             SGHelperErrorHandling.Handling(error,this._addUserView.bind(this,jsonInput))
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
             <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SponsorEventDetailScreenRootView'} style={style.mainContainer}>
                 <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("HomeScreen.SponsorshipTitle")} ribbonWidth={0.6}></RibbonHeader>
                 {this.alreadyMount ?
                     this.data !== null ? 
                         (<ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'SponsorEventDetailScreenScrollView'} style={style.sv1} contentContainerStyle={style.sv1_2} showsVerticalScrollIndicator={false}>
                             <Text accessible={true} accessibilityLabel={'SponsorEventDetailScreenTitle'} preset={Text.preset.titleH1B} style={style.eventNameText}>{(this.dataContent.fEventName)}</Text>
                             <SponsorEventDetailHeader onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountEvent+=c; this.forceUpdate();}).bind(this,this.data)} accessible={true} accessibilityLabel={'SponsorEventDetailScreenHeader'} imageSetting={this.imageSetting} language={this.Language} contentType='SponsorEvent' dataContentFooter={this.dataContentFooter} imageSlider={this.dataContent.fImageJSON} contentKey={this.data.fID} navigator={this.props.navigation} startDate={this.data.fStartDate} endDate={this.data.fEndDateSponsor} fTargetKey={this.data.fProfileSponsorshipKey} shareMessage={this.dataContent.fShareMessage}  style={style.throwWHP} ></SponsorEventDetailHeader>
                             <View accessible={true} accessibilityLabel={'SponsorEventDetailScreenContentView'} style={style.descriptionContainer}>
                                 {this.dataContent.fTypeDetail === 'longdescription' ?
                                     (
                                    <View style={style.vView1}> 
                                        <Text accessible={true} accessibilityLabel={'SponsorshipDetail'} preset={Text.preset.titleH3} style={style.descriptionText}>{this.dataContent.fLongDescription}</Text>
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
                                        <WebViewRender nestedScrollEnabled={true} data={ this.dataContent.fHTML } style={style.throwWHP} fType='html'></WebViewRender>
                                    </View>
                                     )
                                     :
                                     (null)
                                 }
                             </View>
                             {this.data.fCallForAction !== null &&
                                            <Button preset={Button.preset.black} accessible={true} accessibilityLabel={'ButtonCallForAction'} label={this.data.fCallForAction['fLabel'+this.Language.toUpperCase()]} style={style.button} onPress={() => { this.handleLink(this.data.fCallForAction.fLink) }}></Button>
                             }
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
 