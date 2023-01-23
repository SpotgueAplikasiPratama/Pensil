import React from 'react';
import { StyleSheet, Alert, Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGPopView, SGIcon as Icon, SGScrollView as ScrollView, SGButton as Button, SGImage as Image, SGDialogBox } from '../../../core/control';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { WaitingListForm } from '../../form_V2/WaitingListForm';
import { tbVWaitingListAPI } from '../../api/tbVWaitingListAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class ViewWaitingListScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainView1: { flex: 1, backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: "black", paddingLeft: 2 * p },
            text2: { color: "black", marginTop: 5 * p },
            text3: { color: '#676464' },
            containerView1: { width: w, height: w * 0.3, resizeMode: 'cover', borderRadius: 0, marginVertical: 0, justifyContent: 'flex-start' },
            containerView2: { width: w, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'white' },
            containerView2_1: { width: w, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'white', borderBottomWidth: p * 0.3, borderBottomColor: '#E4E4E4' },
            containerView2_2: { flexDirection: 'row', paddingLeft: 5 * p },
            containerView3: { width: w, height: h, padding: p },
            button: { marginBottom: 2 * p, backgroundColor: '#E64D4D', borderRadius: 4 * p, width: w * 0.25, height: w * 0.115, alignItems: 'center', justifyContent: 'center' },
            pv1: { width: 8.5*w/10, padding: p, borderRadius: 2 * p, marginBottom: p, backgroundColor: '#f8f8ff', justifyContent: 'flex-start' },
            pv2: { marginTop: 3*p, maxHeight: 2*h/3 },
            pv3: { marginTop: 3*p, maxHeight: 2*h/3 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false
        });

        this.waitingListData = this.props.route.params.data;
        this.dataSetting = this.props.route.params.dataSetting;
        this.pvID2 = SGPopView.getPopViewID();

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.restoKey = this.props.route.params.restoKey;
        this.profileResto = this.props.route.params.profileResto;
        this.state = { filterWaiting: this.filterDataWaiting, sortWaiting: this._sortDataWaiting };
    }

    componentDidMount() {
        this.forceUpdate();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.forceUpdate();
        });
    }

    async _onCancelPressHandler(){
        try {
            this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Processing"))
            var res = await tbVWaitingListAPI.cancelWaitingListVisitor(this.waitingListData)
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("AlertMessage.SuccessCancelWaitingList"), SGLocalize.translate("AlertMessage.OK"), () => { SGHelperNavigation.navigatePop(this.props.navigation); this.props.route.params.callback() }, true)
            
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGHelperErrorHandling.Handling(error,this._onCancelPressHandler.bind(this))
        }
       
    }
    _onCancelPress() {
        SGDialogBox.showConfirmation(null, SGLocalize.translate('AlertMessage.Confirmation'), SGLocalize.translate('AlertMessage.ConfirmationCancelWaitingList'), SGLocalize.translate("AlertMessage.Cancel"), () => { }, SGLocalize.translate("AlertMessage.OK"),
            async () => {
               await this._onCancelPressHandler()
            })
    }

    _showTnCPopView() {
        SGPopView.showPopView(this.pvID2);
    }

    _hideTnCPopView(){
        SGPopView.hidePopView(this.pvID2);
    }

    render() {
        var { w, h, p } = this.WHP;
        var language = this.currentUserData.fLanguage;
        var style = this.style;
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'ViewWaitingListScreenRootView'} style={style.mainView1}>
                <Image accessible={true} accessibilityLabel={'ViewWaitingListScreenImage'} style={style.containerView1} source={{ uri: this.profileResto['fContent' + this._language.toUpperCase()].fStoreBackgroundImageJSON[0][this.imageSetting].uri }}></Image>
                <View accessible={true} accessibilityLabel={'AddWaitingListScreenContainerIconView1'} style={style.containerView2}>
                    <Text preset={Text.preset.titleH2B} style={style.text1}>{SGLocalize.translate('WaitingListAddView.TitleViewWaitingList')}</Text>
                </View>
                <View accessible={true} accessibilityLabel={'AddWaitingListScreenContainerIconView2'} style={style.containerView2_1}>
                    <View accessible={true} accessibilityLabel={'AddWaitingListScreenDateView'} style={style.containerView2_2}>
                        <Text accessible={true} accessibilityLabel={'AddWaitingListScreenDateText'} preset={Text.preset.titleH3} style={style.text3}>{SGHelperType.formatDate(new Date(), this._language)}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'AddWaitingListScreenTimeView'} style={style.containerView2_2}>
                        <Text accessible={true} accessibilityLabel={'AddWaitingListScreenTimeText'} preset={Text.preset.titleH3} style={style.text3}>{SGHelperType.formatTime(new Date(), this._language)}</Text>
                    </View>
                </View>

                <SGPopView accessible={true} accessibilityLabel={'TermsAndConditionsPopView'} shadow animationType={'slide'} popViewID={this.pvID2} vPos='center'>
                    <View style={style.pv1}>
                        <View style={style.pv2}>
                            <Text preset={Text.preset.titleH2B}>{SGLocalize.translate("WaitingListAddView.TnC")}</Text>
                        </View>
                        <View style={style.pv3}>
                        
                            <ScrollView accessible={true} accessibilityLabel={'TnCScrollView'} style={{ width: 8*w/10 }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Text>{this.dataSetting.fTermsAndConditionsWaitingList['fTermsAndConditions'+language.toUpperCase()]}</Text>
                            </ScrollView>
                        
                        </View>
                    </View>
                </SGPopView> 

                <ScrollView accessible={true} accessibilityLabel={'ViewWaitingListScreenScrollView'} style={{ marginBottom: SGHelperWindow.getHeaderHeight()+ p * 6}} contentContainerStyle={{ bacgroundColor: 'white' }}>

                    <WaitingListForm addScreen={false} accessible={true} accessibilityLabel={'ViewWaitingListScreenWLForm'} style={style.throwWHP} data={this.waitingListData} language={this._language} disabled={true}></WaitingListForm>

                    { this.dataSetting.fTermsAndConditionsWaitingList['fTermsAndConditions'+language.toUpperCase()] != "" &&
                        <TouchableOpacity onPress={() => {this._showTnCPopView()}}>
                            <Text preset={Text.preset.titleH4B} style={{color:'#63AEE0', marginBottom: 3*p}}>{SGLocalize.translate("WaitingListAddView.TnC")}</Text>
                        </TouchableOpacity>
                    }

                    <Button accessible={true} accessibilityLabel={'ViewWaitingListScreenCalledButton'} disabled={this.waitingListData.fStatus === "called" ?? true} label={SGLocalize.translate('WaitingListAddView.CancelButtonText')} style={style.button} onPress={this._onCancelPress.bind(this)}></Button>
                     <View style={{width:w,height:w*0.15,backgroundColor:'transparent'}}></View>
                </ScrollView>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer accessible={true} accessibilityLabel={'ViewWaitingListScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.containerView3}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}