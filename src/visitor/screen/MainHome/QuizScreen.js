import React, { Fragment } from 'react';
import { StyleSheet, Alert, Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGPopView, SGIcon as Icon, SGScrollView as ScrollView, SGButton as Button, SGImage as Image, SGDialogBox,SGViewPager as ViewPager,SGCheckBox,SGCheckBoxListImage, SGButton,SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbTQuizAPI } from '../../api/tbTQuizAPI';
import { VRewardAPI } from '../../api/VRewardAPI';

export class QuizScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainView1: { flex: 1, backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            v1:{width:w},
            v2: { width: w, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5 * p },
            v3:{width:w*0.5,alignItems:'center',justifyContent:'center', marginVertical:-p * 2},
            
            vSponsorshipMain: { width: w * 0.9, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 2 * p},
            vSponsorship: { width:w*0.225,alignItems:'center',justifyContent:'center'},
            sponsorshipImage:{width:w*0.15,height:w*0.15,resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: p * 2},
            textSponsorship:{width: w*0.85, marginTop:p*10, alignItems: 'center'},

            sliderContainer: { width: w *0.7, height: w * 0.75, backgroundColor: 'white', marginBottom: 0, marginTop: p*2 },
            sliderImage: { width: w *0.7, height: w * 0.7, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: p * 2,  backgroundColor: 'white' },
            answerImage:{width:w*0.3,height:w*0.3,resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: p * 2},
            answerImageFail:{width:w*0.3,height:w*0.3,resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: p * 2, opacity: 0.4},
            answerViewImage:{width:w*0.32,height:w*0.32,resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: p * 2},
            dummyView:{minWidth:w*0.4,minHeight:w*0.1, borderRadius: p*5, backgroundColor: '#173d5a', justifyContent:'center'},
            dummyViewSelected:{minWidth:w*0.4,minHeight:w*0.1, borderRadius: p*5, backgroundColor: '#469c66', justifyContent:'center'},
            borderRed:{marginVertical:2*p, backgroundColor: '#469c66', borderRadius: p * 2},
            borderTransparent:{marginVertical:2*p, backgroundColor: '#173d5a', borderRadius: p * 2},
            // borderRed1:{marginVertical:2*p, backgroundColor: 'green', borderRadius: p * 2},
            // borderTransparent1:{marginVertical:2*p,backgroundColor: '#173d5a', borderRadius: p * 2},
            button: { marginVertical: 2 * p, width: w * 0.3, minHeight: w * 0.115, alignItems: 'center', justifyContent: 'center' },
            // Text
            textTitle1:{width: w*0.9, borderBottomWidth:p*0.2, borderBottomColor: 'grey', marginVertical:3*p, alignItems:'flex-start', paddingVertical: p},
            textTitle2:{marginTop:2*p,textAlign:'center', color:'#173d5a', width: w*0.8},
            textTitle3:{width: w*0.8, marginVertical:p*5,textAlign:'center'},
            textAnswerDefault: {color: '#173d5a'},
            textAnswerSelected: {color: '#469c66'},

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

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false
        });

        this.pvID = SGPopView.getPopViewID();
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        this.quizData = [];
        this.fID = this.props.route.params.fID;
        this.totalAnswer = '';
        this.finished = false;
        this.alreadyMount = false;
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.answer = -1;
        this.answerJSON = '';
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }


    checkAPIBatchStatusAllDone(){
        if(this.totalAnswer.totalWrong >= this.quizData.fMaxRetry)
        {
            this.finished = true
            // this.answer = this.quizData.fAnswerIndex
        }
        if(this.totalAnswer.totalCorrect > 0){
            this.finished = true;
            this.answer = this.quizData.fAnswerIndex
        }
        this.alreadyMount = true;
        this.forceUpdate();
    }

    async _onRefreshAllItem() {

        if(!this.anonymousMode){
            this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));


            this.baseAddAPIParallel('tbTQuizAPI', (async (v1) => { return tbTQuizAPI.GetTenantQuizByID(v1) }).bind(this,this.fID), ((v) => {
                this.quizData = v;
                if(this.quizData.fAnswerList.length > 0){
                    this.answerJSON = this.quizData.fAnswerList[0];
                }
                
            }).bind(this), null);
    
            this.baseAddAPIParallel('GetTenantQuizUserTotalAnswer', (async (v1) => { return tbTQuizAPI.GetTenantQuizUserTotalAnswer(v1) }).bind(this,this.fID), ((v) => {
                this.totalAnswer = v;
                console.log(this.totalAnswer)
                console.log('refresh answer setelah reward')
            }).bind(this), null);
    
            this.baseRunAPIParallel();
        }else{
            this.alreadyMount = true;
        }
    }
    
    async _refreshGetTenantQuizUserTotalAnswer(){
        this.baseRunSingleAPIWithRedoOption('GetTenantQuizUserTotalAnswer',(async (v1) => { return tbTQuizAPI.GetTenantQuizUserTotalAnswer(v1) }).bind(this,this.fID), ((v) => {
             this.totalAnswer = v;
             if(this.totalAnswer.totalWrong >= this.quizData.fMaxRetry)
             {
                 this.finished = true
                 this.answer = this.quizData.fAnswerIndex
             }
             if(this.totalAnswer.totalCorrect > 0){
                 this.finished = true;
                 this.answer = this.quizData.fAnswerIndex
             }
             console.log(this.totalAnswer)
             console.log('refresh answer setelah reward')
             this.forceUpdate();
         }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
    }

    async _onCheckPress(index,data) {
        if(this.answer == index){
            this.answer = null;
            this.forceUpdate();
            return  
        }
        this.answer = index;
        this.answerJSON = data;
        this.forceUpdate();

        if(this.totalAnswer.totalCorrect == 0){
            if(this.totalAnswer.totalWrong < this.quizData.fMaxRetry){
                SGDialogBox.showConfirmation(null, SGLocalize.translate('AlertMessage.Confirmation'), SGLocalize.translate('QRQuiz.ConfirmMessageAnswer'), SGLocalize.translate('globalText.no'), () => {this.answer = -1, this.forceUpdate()}, SGLocalize.translate('globalText.ok'), 
                () => {
                    if(this.answer == this.quizData.fAnswerIndex){
                        SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate('QRQuiz.CorrectAnswerText'), SGLocalize.translate("AlertMessage.OK"), () => { 
                            this.baseRunSingleAPIWithRedoOption('SurpriseRewardsOpenTenantQRQuiz', (async (v1,v2) => { return VRewardAPI.SurpriseRewardsOpenTenantQRQuiz(v1,v2) }).bind(this,this.quizData.fStoreKey,this.quizData.fID), (async (v) => {
                                this.surpriseReward = v;
                                this.finished = true
                                // this.forceUpdate();
                                if (this.surpriseReward.fID !== null) {
                                    console.log('masuk ke reward')
                                    this.onShowReward()
                                    this.answerXUser = {fID:null,fStoreKey:this.quizData.fStoreKey,fUserKey:this.currentUser,fQuizKey:this.quizData.fID,fAnswerIndex:this.answer,fAnswerJSON:this.answerJSON,fResult:'correct',fRewardKey:this.surpriseReward.fRewardKey,fRedeemRewardKey:this.surpriseReward.fMysteryBoxKey,fActive:'Y',fCreatedByID:this.currentUser,fCreatedDate:new Date(),fLastModifiedByID:this.currentUser,fLastModifiedDate:new Date()}
                                    this.baseRunSingleAPIWithRedoOption('SubmitTenantQuizAnswer', (async (v1) => { return tbTQuizAPI.SubmitTenantQuizAnswer(v1) }).bind(this,this.answerXUser), (async (v) => {
                                        await this._refreshGetTenantQuizUserTotalAnswer();
                                    }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                                } else {
                                    this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
                                    this.answerXUser = {fID:null,fStoreKey:this.quizData.fStoreKey,fUserKey:this.currentUser,fQuizKey:this.quizData.fID,fAnswerIndex:this.answer,fAnswerJSON:this.answerJSON,fResult:'correct',fRewardKey:null,fRedeemRewardKey:null,fActive:'Y',fCreatedByID:this.currentUser,fCreatedDate:new Date(),fLastModifiedByID:this.currentUser,fLastModifiedDate:new Date()}
                                    this.baseRunSingleAPIWithRedoOption('SubmitTenantQuizAnswer', (async (v1) => { return tbTQuizAPI.SubmitTenantQuizAnswer(v1) }).bind(this,this.answerXUser), (async (v) => {
                                        await this._refreshGetTenantQuizUserTotalAnswer();
                                    }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                                }
                            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
                        }, true)
                        
                    }else{
                        SGDialogBox.showWarning(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('QRQuiz.WrongAnswerText'), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
                        this.answerXUser = {fID:null,fStoreKey:this.quizData.fStoreKey,fUserKey:this.currentUser,fQuizKey:this.quizData.fID,fAnswerIndex:this.answer,fAnswerJSON:this.answerJSON,fResult:'wrong',fRewardKey:null,fRedeemRewardKey:null,fActive:'Y',fCreatedByID:this.currentUser,fCreatedDate:new Date(),fLastModifiedByID:this.currentUser,fLastModifiedDate:new Date()}
                        this.baseRunSingleAPIWithRedoOption('SubmitTenantQuizAnswer', (async (v1) => { return tbTQuizAPI.SubmitTenantQuizAnswer(v1) }).bind(this,this.answerXUser), (async (v) => {
                            await this._refreshGetTenantQuizUserTotalAnswer();
                        }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
                        this.answer = -1
                    }
                }, true)
            }else{
                SGDialogBox.showWarning(null, SGLocalize.translate("AlertMessage.Fail"),SGLocalize.translate('QRQuiz.MaxRetryText'), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
                this.finished = true
            }
        }
    }

    onHideReward() {
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        SGPopView.hidePopView(this.pvID);
    }

    onShowReward() {
        console.log('show reward')
        setTimeout(() => { SGPopView.showPopView(this.pvID); this.forceUpdate(); }, 300);
    }
    
    _renderAbjad(index){
        var abjad = 'abcdefghijklmnopqrstuvwxyz';
        return abjad[index].toUpperCase();
    }

    render() {
        var { w, h, p } = this.WHP;
        var language = this.currentUserData.fLanguage.toUpperCase();
        var style = this.style;
        var tR = SGLocalize.translate;
        var surpriseReward = this.surpriseReward;
        
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'ViewQuizScreen'} style={style.mainView1}>
                {!this.anonymousMode &&
                <SGPopView accessible={true} accessibilityLabel={'QuizPopView'} vPos={'Top'} animationType={'slideUp'}  popViewID={this.pvID} >
                     <View accessible={true} accessibilityLabel={'QuizRewardView'} style={style.rewardPV}>
                         <View accessible={true} accessibilityLabel={'QuizHeaderRewardView'} style={style.headerPV}>
                             <Text accessible={true} accessibilityLabel={'QuizCongratsText'} style={style.textPV1} preset={Text.preset.titleH2B}>{tR('mallHomeScreen.RewardCongratulation')}</Text>
                             <Text accessible={true} accessibilityLabel={'QuizRewardText'} style={style.textPV2} preset={Text.preset.titleH4_5B}>{tR('mallHomeScreen.RewardText')} {surpriseReward['fReward' + language].fTenantName}</Text>
                             <Image accessible={true} accessibilityLabel={'QuizRewardImage'} style={style.imagePV} source={{ uri: surpriseReward['fReward' + language].fImageJSON.length !== 0 ? surpriseReward['fReward' + language].fImageJSON[0][this.imageSetting].uri : '' }}></Image>
                             <Text accessible={true} accessibilityLabel={'QuizRewardName'} style={style.textPV3} preset={Text.preset.titleH3B}>{surpriseReward['fReward' + language].fRewardName}</Text>
                             <Text accessible={true} accessibilityLabel={'QuizShortDesc'} style={style.textPV4} preset={Text.preset.titleH4}>{surpriseReward['fReward' + language].fShortDescription}</Text>
                             <View accessible={true} accessibilityLabel={'QuizButtonView'} style={style.buttonViewPV}>
                                 <Button accessible={true} accessibilityLabel={'QuizOkButton'} style={style.buttonPV}  textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.Okay')} onPress={() => this.onHideReward(this.pvID)}></Button>
                                 <Button accessible={true} accessibilityLabel={'QuizMyRewardsButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.MyRewards')} onPress={() => { this.onHideReward(this.pvID); SGHelperNavigation.navigatePush(this.props.navigation, 'MyRewards') }}></Button>
                             </View>
                         </View>
                     </View>
                 </SGPopView>
                }

                {this.alreadyMount && !this.anonymousMode ?
                <ScrollView showsVerticalScrollIndicator={false} style={style.v1}>
                    <View style={style.textTitle1}>
                        <Text preset={Text.preset.titleH2B}>{this.quizData['fContent'+language].fQuizName}</Text>
                    </View>
                    <Text preset={Text.preset.titleH4} style={style.textTitle3}>{this.quizData['fContent'+language].fShortDescription}</Text>
                    <ViewPager accessible={true} accessibilityLabel={'QuizDetailViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                    {(this.quizData['fContent'+language].fImageJSON).map((x, index) => {
                        return (
                            <View style={{backgroundColor:'white',  width: w*0.7, height: w*0.7}}>
                                <Image accessible={true} accessibilityLabel={'QuizDetailHeaderImage'} style={style.sliderImage} source={{ uri: x[this.imageSetting].uri }}></Image>
                            </View>
                         )
                        })}
                    </ViewPager>
                    <Text preset={Text.preset.titleH2B} style={style.textTitle2}>{this.quizData['fContent'+language].fQuestion}</Text>
                    
                    {this.totalAnswer.totalWrong >= this.quizData.fMaxRetry &&
                        <View style={{backgroundColor:'#e9e9e9',marginTop:2*p,minHeight:w*0.15}}>
                            <Text preset={Text.preset.titleH2B} style={style.textTitle2}>{SGLocalize.translate('QRQuiz.MaxRetryLimitInfo')}</Text>
                        </View>
                    }
                    {this.totalAnswer.totalCorrect > 0 &&
                        <View style={{backgroundColor:'#e9e9e9',marginTop:2*p,minHeight:w*0.15}}>
                            <Text preset={Text.preset.titleH2B} style={style.textTitle2}>{SGLocalize.translate('QRQuiz.WinnerInfo')}</Text>
                        </View>
                    }

                    <View style={style.v2}>
                        {
                           this.quizData.fAnswerList.map((data,index) => 
                           {
                           return ( 
                            <View style={{marginVertical: p*2}}>
                                { data.fAnswerType == 'textimage' &&
                                    <View>
                                        <Text preset={Text.preset.h5B} style={index == this.answer && this.finished == false  ? style.textAnswerSelected : style.textAnswerDefault}>{this._renderAbjad(index)}</Text>
                                        <View style={style.v3}>
                                            <TouchableOpacity  disabled={this.finished} onPress={() => {this._onCheckPress(index,data)}} style={index == this.answer && this.finished == false ? style.borderRed : style.borderTransparent}>
                                                <View style={style.answerViewImage}>
                                                    <Image accessible={true} accessibilityLabel={'ImageAnswerList'} style={this.finished ? style.answerImageFail : style.answerImage} source={{ uri: data.fAnswerImage[0][this.imageSetting].uri }}></Image>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <Text preset={Text.preset.h6B} style={index == this.answer && this.finished == false ? style.textAnswerSelected : style.textAnswerDefault}>{data['fAnswerText'+language]}</Text>
                                    </View>
                                }
                                { data.fAnswerType == 'text' &&
                                     <TouchableOpacity disabled={this.finished} onPress={() => {this._onCheckPress(index,data)}} style={index == this.answer && this.finished == false  ? style.dummyViewSelected : style.dummyView}>
                                         <View>
                                            <Text style={this.finished ? {color: 'grey'} : {color: 'white'}} textPreset={Text.preset.h6}>{data['fAnswerText'+language]}</Text>
                                         </View>
                                    </TouchableOpacity>
                                }
                                { data.fAnswerType == 'image' &&
                                    <View>
                                        <Text preset={Text.preset.h5B} style={index == this.answer && this.finished == false  ? style.textAnswerSelected : style.textAnswerDefault}>{this._renderAbjad(index)}</Text>
                                        <View style={style.v3}>
                                            <TouchableOpacity disabled={this.finished} onPress={() => {this._onCheckPress(index,data)}} style={index == this.answer && this.finished == false  ? style.borderRed : style.borderTransparent}>
                                                <View style={style.answerViewImage}>
                                                    <Image accessible={true} accessibilityLabel={'ImageAnswerList'} style={this.finished ? style.answerImageFail : style.answerImage} source={{ uri: data.fAnswerImage[0][this.imageSetting].uri }}></Image>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </View>
                            )
                         }
                        )            
                    }
                    </View>

                    {this.quizData.fBottomText != '' &&
                        <View style={style.textSponsorship}>
                            <Text preset={Text.preset.h8B}>{this.quizData.fBottomText}</Text>
                        </View>
                    }
                    {this.quizData.fBottomImage.length != 0 &&
                        <View style={style.vSponsorshipMain}>
                            {
                                this.quizData.fBottomImage.map((data,index) => 
                                {
                                return ( 
                                <View style={{marginVertical: p*2}}>
                                    <View style={style.vSponsorship}>             
                                        <Image accessible={true} accessibilityLabel={'ImageAnswerList'} style={style.sponsorshipImage} source={{ uri: data[this.imageSetting].uri }}></Image>
                                    </View>
                                </View>
                                )
                                }
                                )            
                            }
                        </View>
                    }
    
                 {/* <Button disabled={this.totalAnswer.totalCorrect >0 ? true:false} preset={SGButton.preset.green} style={style.button} accessible={true} accessibilityLabel={'QuizButton'} label={'Kirim'}  onPress={async () => {this._onSubmit()}}></Button> */}
                 <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight(), backgroundColor: 'white' }}></View>
                 <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() * 2, backgroundColor: 'white' }}></View>
                </ScrollView>
                :
                !this.anonymousMode ?
                (<View accessible={true}  style={{ flex: 1, color: '#606060' }}>
                    {this.quizData.length == 0 ? 
                     <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                    :
                    <Text preset={Text.preset.titleH4}>{SGLocalize.translate('QRQuiz.QuizNotFound')}</Text>
                    }
                </View>)
                :
                  (SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignIn') }, true))
                }

                {this.anonymousMode &&
                (<View accessible={true}  style={{ width:w*0.8,height:h, color: '#606060' }}>
                     <Text preset={Text.preset.titleH4} style={{textAlign:'center'}}>{SGLocalize.translate('PleaseRegisterPopup.mainText')}</Text>
                </View>)
                }
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack accessible={true} accessibilityLabel={'QuizHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer accessible={true} accessibilityLabel={'AddQuizScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}