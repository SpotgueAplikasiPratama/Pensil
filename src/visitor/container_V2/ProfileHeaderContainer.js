import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGButton as Button,SGDialogBox  } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperType ,SGHelperWindow,SGHelperGlobalVar} from '../../core/helper';
import { CardIconButtonShare } from '../component_V2/CardIconButton';

export class ProfileHeaderContainer extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, justifyContent: 'center', backgroundColor: '#191919' },
            firstHeader: { width: w, height: w * 0.28, backgroundColor: '#181818' },
            secondContainer: { width: w, backgroundColor: '#FFFFFF', borderTopLeftRadius: p * 8, borderTopRightRadius: p * 8, justifyContent: 'flex-start', overflow: 'visible', paddingTop: w * 0.18 },
            imageContainer: { width: w * 0.3, height: w * 0.3, backgroundColor: '#FFFFFF', borderRadius: w, position: 'absolute', top: -6 * p, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
            profileImage: { width: w * 0.295, height: w * 0.295, borderRadius: w, marginVertical: 0, overflow: 'hidden' },
            nameText: { width: w - p * 6, color: '#000000', alignSelf: 'center', textAlign: 'center',marginTop:7*p },
            myReferralText: { color: '#63AEE0', alignSelf: 'center', textAlign: 'center', marginBottom: 4 * p },
            btnContainer: { width: w, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around' },
            btn: { minWidth: w * 0.25, height: w * 0.08, paddingVertical: p * 0.5 },
            imageBackground: { width: w, height: w * 0.525, justifyContent: 'flex-start', marginVertical: 0, borderRadius: 0, backgroundColor: '#ED474B' },
            text1: { color: '#545454', },
            buttonView: { flexDirection: 'row', justifyContent: 'space-around' },
            arrowUp:{width:w,alignItems:'center',backgroundColor:'white'},
            iconContainer: {width: w-2*p,flexDirection:'row',justifyContent:'center',marginVertical:p},
            iconButton: { width: w,height:w,padding: p },
            //Hide Show Header
            firstHeaderNew:{ width: w, height: w * 0.2, backgroundColor: '#181818'},
            secondContainerNew: { width: w, backgroundColor: '#FFFFFF', borderTopLeftRadius: p * 8, borderTopRightRadius: p * 8, justifyContent: 'flex-start', overflow: 'visible',paddingTop:w*0.13 },
            imageContainerNew: { width: w * 0.19, height: w * 0.19, backgroundColor: '#FFFFFF', borderRadius: w, position: 'absolute', top:  -2.5*p, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
            profileImageNew: { width: w * 0.18, height: w * 0.18, borderRadius: w, marginVertical: 0, overflow: 'hidden' },
            nameTextNew:{ width: w - p * 6, color: '#000000', alignSelf: 'center', textAlign: 'center',marginTop:3.5*p},
            btnContainerNew: { width: w, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around' },
            arrowDownNew:{alignSelf:'center',height:w*0.09, marginBottom:-p, width:w*0.1, alignItems:'center', justifyContent:'flex-end', backgroundColor:'transparent'},
            btnNew: { minWidth: w * 0.25, height: w * 0.07, paddingVertical: p * 0.3 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.state={selectedTab: 'checkIn',show:true}
    }

    _changeHeader() { this.setState({ show: !this.state.show }); }

    _shareMessageRefferal(){
        var referralCode =this.props.currentUserData.fReferralCode;
        if(this.props.language == 'id'){
            var shareMessage = eval('`' +  SGHelperType.getSystemParamsValue('RefferalRewardTextID') + '`')
            return shareMessage;
        }else if (this.props.language == 'en'){
            var shareMessage = eval('`' +  SGHelperType.getSystemParamsValue('RefferalRewardTextEN') + '`')
            return shareMessage;
        }else if (this.props.language == 'cn'){   
            var shareMessage = eval('`' +  SGHelperType.getSystemParamsValue('RefferalRewardTextCN') + '`')
            return shareMessage;
        }
    }

    _onNavigateReferral(){
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerMyReward')
        var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
        if(circuitBreaker.fActive==="Y"){
            SGHelperNavigation.navigatePush(this.props.navigator, 'MyReferralInMyReward',{referral:true})
            // SGHelperNavigation.navigatePush(this.props.navigator, 'MyReferral')
        }   
        else{
            SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
        }
    }
    
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var currentUserData = this.props.currentUserData;
        return (
            <View>
                {this.state.show ?
                <View accessible={true} accessibilityLabel={'ProfileHeaderContainerRootView'} style={style.mainContainer}>
                    <View style={{height:SGHelperWindow.getHeaderHeight()+SGHelperWindow.getFooterHeight()+SGHelperWindow.getStatusBarHeight()}}></View>
                    <View accessible={true} style={style.secondContainer}>
                        <View accessible={true} shadow style={style.imageContainer}>
                            <Image accessible={true} accessibilityLabel={'ProfileHeaderContainerImage'} source={{ uri: currentUserData.fProfileImageJSON[0][this.props.imageSetting].uri }} style={style.profileImage}></Image>
                        </View>
                        <Text accessible={true} accessibilityLabel={'ProfileHeaderContainerUName'} style={style.nameText} preset={Text.preset.titleH2B}>{currentUserData.fName}</Text>
                        <Text accessible={true} accessibilityLabel={'ProfileHeaderContainerUName'}  preset={Text.preset.titleH3}>{SGLocalize.translate('ProfileScreen.MyReferralIDLabel')} {currentUserData.fReferralCode}</Text>
                        
                        <View style={style.iconContainer}>
                            <TouchableOpacity onPress={() => {this.props.copyContent()}}>
                                    <Icon preset={Icon.preset.h3} name={Icon.Icon.copy}></Icon>
                            </TouchableOpacity>
                            <CardIconButtonShare accessible={true} accessibilityLabel={'UserProfileShareIconButton'} textColor='white' navigator={this.props.navigator} contentType='UserRefferal' contentKey={SGHelperType.getGUID()} shareMessage={this._shareMessageRefferal()} targetKey={SGHelperType.getGUID()} type={'share'} style={style.iconButton}></CardIconButtonShare>
                        </View>
                        <TouchableOpacity onPress={() => this._onNavigateReferral()}>
                            <Text accessible={true} accessibilityLabel={'ProfileHeaderContainerUName'} style={style.myReferralText} preset={Text.preset.titleH4B}>{SGLocalize.translate('ProfileScreen.MyReferralButton')}</Text>
                        </TouchableOpacity>
                        <View accessible={true} style={style.btnContainer}>
                            <Button accessible={true} preset={this.state.selectedTab === 'checkIn' ? Button.preset.black : Button.preset.blackBorder} textPreset={Text.preset.titleH3B} label={SGLocalize.translate("mallHomeScreen.buttonCheckIn")} style={style.btn} onPress={() => { this.props.onRenderChangePress('checkIn'); this.setState({ selectedTab: 'checkIn' }) }}></Button>
                            <Button accessible={true} preset={this.state.selectedTab === 'favorite' ? Button.preset.black : Button.preset.blackBorder} textPreset={Text.preset.titleH3B} label={SGLocalize.translate("HomeScreen.tabFavoriteTitle")} style={style.btn} onPress={() => { this.props.onRenderChangePress('favorites'); this.setState({ selectedTab: 'favorite' }) }}></Button>
                            <Button accessible={true} preset={this.state.selectedTab === 'like' ? Button.preset.black : Button.preset.blackBorder} textPreset={Text.preset.titleH3B} label={SGLocalize.translate("cardIconButton.like")} style={style.btn} onPress={() => { this.props.onRenderChangePress('likes'); this.setState({ selectedTab: 'like' }) }}></Button>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._changeHeader.bind(this)} style={style.arrowUp}>
                            <Icon name={Icon.Icon.arrowUp} preset={Icon.preset.h3}></Icon>
                    </TouchableOpacity>
                </View>
                :
                <View accessible={true} accessibilityLabel={'ProfileHeaderContainerRootView'} style={style.mainContainer}>
                      <View accessible={true} style={style.firstHeaderNew}></View>
                      <View accessible={true} style={style.secondContainerNew}>
                        <View accessible={true} shadow style={style.imageContainerNew}>
                            <Image accessible={true} accessibilityLabel={'ProfileHeaderContainerImage'} source={{ uri: currentUserData.fProfileImageJSON[0][this.props.imageSetting].uri }} style={style.profileImageNew}></Image>
                        </View>
                        <Text accessible={true} accessibilityLabel={'ProfileHeaderContainerUName'} style={style.nameTextNew} preset={Text.preset.titleH4B}>{currentUserData.fName}</Text>
                        <View accessible={true} style={style.btnContainerNew}>
                            <Button accessible={true} preset={this.state.selectedTab === 'checkIn' ? Button.preset.black : Button.preset.blackBorder} textPreset={Text.preset.titleH3B} label={SGLocalize.translate("mallHomeScreen.buttonCheckIn")} style={style.btnNew} onPress={() => { this.props.onRenderChangePress('checkIn'); this.setState({ selectedTab: 'checkIn' }) }}></Button>
                            <Button accessible={true} preset={this.state.selectedTab === 'favorite' ? Button.preset.black : Button.preset.blackBorder} textPreset={Text.preset.titleH3B} label={SGLocalize.translate("HomeScreen.tabFavoriteTitle")} style={style.btnNew} onPress={() => { this.props.onRenderChangePress('favorites'); this.setState({ selectedTab: 'favorite' }) }}></Button>
                            <Button accessible={true} preset={this.state.selectedTab === 'like' ? Button.preset.black : Button.preset.blackBorder} textPreset={Text.preset.titleH3B} label={SGLocalize.translate("cardIconButton.like")} style={style.btnNew} onPress={() => { this.props.onRenderChangePress('likes'); this.setState({ selectedTab: 'like' }) }}></Button>
                        </View>
                        <TouchableOpacity onPress={this._changeHeader.bind(this)} style={style.arrowDownNew}>
                            <Icon name={Icon.Icon.arrowDown} preset={Icon.preset.h3}></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
                }
            </View>
        );
    }
}
