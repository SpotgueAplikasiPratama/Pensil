/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 */
 import React from 'react';
 import { StyleSheet, Alert,Linking } from 'react-native';
 import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
 import { SGRootView as RootView, SGScrollView as ScrollView, SGView as View, SGDialogBox as DialogBox,SGActivityIndicator as ActivityIndicator,SGText as Text,SGImage as Image,SGTouchableOpacity as TouchableOpacity,SGPopView,SGImagePicker } from '../../../core/control';
 import { SGHelperGlobalVar ,SGHelperErrorHandling,SGHelperType,SGHelperWindow,SGHelperStyle} from '../../../core/helper';
 import { SGLocalize } from '../../locales/SGLocalize';
 import { tbCMyHealthData, tbUserDAO } from '../../db/tbMyHealthDAO';
 import { SGFormButton as FormButton } from '../../../core/form/SGFormButton';
 import { tbCMyHealthAPI } from '../../api/tbCMyHealthAPI';
 import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
 import image from '../../asset/image';

 export class MyHealthScreen extends SGBaseScreen {
 
     createStyleSheet = (whp) => {
         var { w, h, p } = whp;
         return StyleSheet.create({
             v1: { width: w, height: h,  justifyContent: 'center', backgroundColor: '#191919' },
             throwWHP: { width: w, padding: p },
             text_1:{alignSelf:'center',marginVertical:2*p},
             text_2:{alignSelf:'flex-end',paddingRight:7*p,marginVertical:2*p},
             text_3:{alignSelf:'center',marginTop:6*p},
             sliderImage: {width: w-14*p, height: w * 8.5 / 16, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: 4*p},
             icon: { width: w * 0.13, height: w * 0.13, resizeMode: 'contain', backgroundColor: 'transparent'},
             touch_1:{alignSelf:'flex-start',paddingLeft:2*p},
             view_Icon:{width:w,flexDirection:'row',justifyContent:'center',marginTop:2*p},
             firstHeaderNew:{ width: w, height: w * 0.1, backgroundColor: '#181818'},
             secondContainerNew: { width: w, backgroundColor: '#FFFFFF', borderTopLeftRadius: p * 8, borderTopRightRadius: p * 8, justifyContent: 'flex-start', overflow: 'visible',paddingTop:w*0.15 },
             imageContainerNew: { width: w * 0.22, height: w * 0.22, backgroundColor: '#FFFFFF', borderRadius: w, position: 'absolute', top:  -8.5*p, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
             profileImageNew: { width: w * 0.21, height: w * 0.21, borderRadius: w, marginVertical: 0, overflow: 'hidden' },
        });
     }
 
     async componentDidMount() {
         await this._refreshData();
         this._unsubscribe = this.props.navigation.addListener('focus', async () => {
             await this._refreshData();
         });
     }
 
 
     _componentWillUnmount() {
         if (this._unsubscribe) { this._unsubscribe(); }
     }
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this.style = this.createStyleSheet(this.WHP);
         this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
         this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
         this.language = SGHelperGlobalVar.getVar('GlobalLanguage');
         this.myHealthDataModel = new tbCMyHealthData();
         this.alreadyMount = false;
         this.props.navigation.setOptions({
             headerShown: false,
         });
         this.newCurrentUserData = '';
     }
 
 
     async _refreshData() {
        this.baseRunSingleAPIWithRedoOption('getUserByID', (async () => { return tbCMyHealthAPI.searchMyHealth() }).bind(this), (async (v) => {  
        this.myHealthDataModel = v;
        this.myHealthDataModel = new tbCMyHealthData(this.myHealthDataModel);
        this.alreadyMount = true;
        this.forceUpdate();
        }).bind(this), null, SGHelperGlobalVar.getVar("ResponTimes"));
     }
     
     openLink_1() {
        if(Platform.OS === 'ios'){ 
            var url = SGHelperType.getSystemParamsValue('LinkPeduliLindugiAppStore')
        }else{
            var url = SGHelperType.getSystemParamsValue('LinkPeduliLindugiPlayStore')
        }
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                DialogBox.showWebView(url,()=>{});
                // DialogBox.showWarning(null,tR("AlertMessage.Fail"),tR("AlertMessage.AlertHandleLink"),tR("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                // console.log('Don\'t know how to open URI: ' + url);
            }
        });
    }

    openLink_2() {
        if(Platform.OS === 'ios'){ 
            var url = SGHelperType.getSystemParamsValue('LinkJakiAppStore')
        }else{
            var url = SGHelperType.getSystemParamsValue('LinkJakiPlayStore')
        }
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                DialogBox.showWebView(url,()=>{});
                // DialogBox.showWarning(null,tR("AlertMessage.Fail"),tR("AlertMessage.AlertHandleLink"),tR("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                // console.log('Don\'t know how to open URI: ' + url);
            }
        });
    }
    
    async saveButton(){
        try {
            var data = (this.myHealthDataModel.getCurrentJSON());
            await tbCMyHealthAPI.updateMyHealth(data);
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this.saveButton.bind(this))
        }
    }

     render() {
         var { w, h, p } = this.WHP;
         var style = this.style;
        
         return (
             <RootView dummyStatusBar accessible={true} accessibilityLabel={'DetailProfileScreenRootView'} style={style.v1}>
              
                 <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.userData} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                 <ScrollView accessible={true} accessibilityLabel={'DetailProfileScreenScrollView'} style={{ flex: 1 }}>
                 <View accessible={true} style={style.firstHeaderNew}></View>
                 <View accessible={true} style={style.secondContainerNew}>
                    <View accessible={true} shadow style={style.imageContainerNew}>
                        <Image style={{ backgroundColor: 'transparent' }} source={{ uri: this.currentUserData.fProfileImageJSON[0][this.imageSetting].uri }} style={style.profileImageNew}></Image>
                    </View>
                    <Text preset={Text.preset.titleH2B}>{this.currentUserData.fName}</Text>
                    <Text style={style.text_1} preset={Text.preset.titleH3}>{SGLocalize.translate('MyHealth.MyCertificateTitle')}</Text>
                 </View>
                     {this.alreadyMount ?
                         ((
                         <View style={{flex:1,width:w,backgroundColor:'white'}}>
                            <Text style={style.text_2} preset={Text.preset.titleH3B}>{SGLocalize.translate('MyHealth.FirstVaccineTitle')}</Text>
                            <SGImagePicker ref={this.IP1}  language={this.language.toUpperCase()}  previewMode maxImageCount={1} shadow onValueChange={(v) => {this.myHealthDataModel.fVaccineImage1 = v;this.saveButton()}} hideText value={this.myHealthDataModel.fVaccineImage1} ratio={SGImagePicker.ratio.r16x9} previewStyle={style.sliderImage}/>
                            <Text style={style.text_2} preset={Text.preset.titleH3B}>{SGLocalize.translate('MyHealth.SecondVaccineTitle')}</Text>
                            <SGImagePicker ref={this.IP1}  language={this.language.toUpperCase()}  previewMode maxImageCount={1} shadow onValueChange={(v) => {this.myHealthDataModel.fVaccineImage2 = v;this.saveButton()}} hideText value={this.myHealthDataModel.fVaccineImage2} ratio={SGImagePicker.ratio.r16x9} previewStyle={style.sliderImage}/>
                            <Text style={style.text_3} preset={Text.preset.titleH4_5}>{SGLocalize.translate('MyHealth.moreInfoTitle')}</Text>
                            <View style={style.view_Icon}>
                                <TouchableOpacity onPress={() => {this.openLink_1() }} style={style.touch_1}>
                                    <Image  accessible={true} accessibilityLabel={'IconPeduliLindungiImage'} source={{ uri: image.peduliLindugiLogo[this.imageSetting].url }} style={style.icon}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {this.openLink_2() }} style={style.touch_1}>
                                    <Image  accessible={true} accessibilityLabel={'IconJaki'} source={{ uri: image.jakiLogo[this.imageSetting].url }} style={style.icon}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                         </View>
                         ))
                         :
                         (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ width:w,height:h }}></ActivityIndicator>)}
                 </ScrollView>
             </RootView>
         );
     }
 }