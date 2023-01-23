import React from 'react';
import { StyleSheet, Alert, Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGPopView, SGIcon as Icon, SGScrollView as ScrollView, SGButton as Button, SGDialogBox, SGImage as Image,SGActivityIndicator as ActivityIndicator  } from '../../../core/control';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { tbWaitingListDAO, tbWaitingListData } from '../../db/tbWaitingListDAO';
import { WaitingListForm } from '../../form_V2/WaitingListForm';
import { tbUserDAO } from '../../db/tbUserDAO';
import { SGFormButton } from '../../../core/form';
import { tbVWaitingListAPI } from '../../api/tbVWaitingListAPI';
import { VStoreProfileAPI } from '../../api/VStoreProfileAPI';
import { VStoreHomeAPI } from '../../api/VStoreHomeAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class AddWaitingListStoreScreen extends SGBaseScreen {

    getFilterCheckWaitingList() {

        return ([
            { name: 'fStoreKey', operator: '=', value: this.storeKey, visible: false },
            { name: 'fStatus', operator: 'IN', value: ['waiting', 'called'], visible: false },
            { name: 'fCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
        ]);
    }


    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:false,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainView1: { width: w, height: h, backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: "black", paddingLeft: 2 * p },
            text2: { color: "black", marginTop: 5 * p },
            text3: { color: '#676464' },
            containerView1: { width: w, height: w * 0.3, resizeMode: 'cover', borderRadius: 0, marginVertical: 0, justifyContent: 'flex-start' },
            containerView2: { width: w, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'white' },
            containerView2_1: { width: w, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'white', borderBottomWidth: p * 0.3, borderBottomColor: '#E4E4E4' },
            containerView2_2: { flexDirection: 'row', paddingLeft: 5 * p },
            containerView3: { width: w, height: h, padding: p },
            containerView4: { width: w, flexDirection: 'row', justifyContent: 'space-evenly' },
            button: { marginBottom: 2 * p, backgroundColor: '#E64D4D', borderRadius: 4 * p, width: w * 0.3, minHeight: w * 0.115, alignItems: 'center', justifyContent: 'center' },
            pv1: { width: 8.5*w/10, padding: p, borderRadius: 2 * p, marginBottom: p, backgroundColor: '#f8f8ff', justifyContent: 'flex-start' },
            pv2: { marginTop: 3*p, maxHeight: 2*h/3 },
            pv3: { marginTop: 3*p, maxHeight: 2*h/3 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: false,
            headerBackTitle: 'Back'
        });
        this.waitingListData = new tbWaitingListData();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.storeKey = this.props.route.params.storeKey;
        this.filterCheckWaiting = this.getFilterCheckWaitingList();
        this.alreadyMount = false;
    }

    async componentDidMount() {
        await this._onRefreshData();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshData();
        });

    }

    checkAPIBatchStatusAllDone() {
        this.alreadyMount = true;
        SGDialogBox.hideDialogBox(this.dbID2, true);
        this.forceUpdate();
    }

    async _onRefreshData() {

        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this),(()=>{this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));}).bind(this));
        this.baseRunSingleAPIWithRedoOption('getStoreHomeProfile', (async (v1) => { return VStoreProfileAPI.getStoreHomeProfile(v1) }).bind(this,this.storeKey), ((v) => {
            this.profileStore = v //await VRestoProfileAPI.getRestoHomeProfile(this.restoKey);
            this.doneRenderProfileStore = true;
        }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID2, true);}).bind(this));
        this.baseAddAPIParallel('getStoreSettings', (async (v1) => { return VStoreHomeAPI.getStoreSettings(v1) }).bind(this,this.storeKey), ((v) => {
            this.dataSetting = v;     
        }).bind(this), null);
        this.baseRunAPIParallel();
    
    }
    async _onCancelButtonHandler(){
        try {
            this.waitingListData.fStoreKey = this.storeKey;
            await tbVWaitingListAPI.addWaitingListVisitor(this.waitingListData)
            //Triggered Global Var Calling Waiitng List On
                if(SGHelperType.isDefined(SGHelperGlobalVar.getVar('GlobalCallWaitingList'))){
                SGHelperGlobalVar.setVar('GlobalCallWaitingList',true)
            }else{
                SGHelperGlobalVar.addVar('GlobalCallWaitingList',true)
            }
            
            SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("AlertMessage.SuccessAddWaitingList"), SGLocalize.translate("AlertMessage.OK"), () => { SGHelperNavigation.navigatePop(this.props.navigation); this.props.route.params.callback() }, true)
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._onCancelButtonHandler.bind(this))
        }
      
       
    }
    async _onAddButton() {
        this.paging = this.getPagingData()
        var checkDataWaiting = await tbVWaitingListAPI.searchWaitingListVisitor(this.filterCheckWaiting, [],this.paging);
        if (checkDataWaiting.length > 0) {
            SGDialogBox.showWarning(null, SGLocalize.translate('AlertMessage.Fail'), SGLocalize.translate('AlertMessage.FailAddActiveWaitingList'), SGLocalize.translate('AlertMessage.OK'), () => { SGHelperNavigation.navigatePop(this.props.navigation); this.props.route.params.callback() }, true)
        } else {
            SGDialogBox.showConfirmation(null, SGLocalize.translate('AlertMessage.Confirmation'), SGLocalize.translate('AlertMessage.ConfirmationAddWaitingList'), SGLocalize.translate("AlertMessage.Cancel"), () => { }, SGLocalize.translate("AlertMessage.OK"),
            async () => {
                await this._onCancelButtonHandler()
            })
        }

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

            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'AddWaitingListScreenRootView'} style={style.mainView1}>
                <Image accessible={true} accessibilityLabel={'AddWaitingListScreenImage'} style={style.containerView1} source={{ uri: this.doneRenderProfileStore == true ? this.profileStore['fContent' + this._language.toUpperCase()].fStoreBackgroundImageJSON[0][this.imageSetting].uri : '' }}></Image>
                <View accessible={true} accessibilityLabel={'AddWaitingListScreenContainerIconView1'} style={style.containerView2}>
                    <Text preset={Text.preset.titleH2B} style={style.text1}>{SGLocalize.translate('WaitingListAddView.TitleAddWaitingList')}</Text>
                </View>
                <View accessible={true} accessibilityLabel={'AddWaitingListScreenContainerIconView2'} style={style.containerView2_1}>
                    <View accessible={true} accessibilityLabel={'AddWaitingListScreenDateView'} style={style.containerView2_2}>
                        <Text accessible={true} accessibilityLabel={'AddWaitingListScreenDateText'} preset={Text.preset.titleH3} style={style.text3}>{SGHelperType.formatDate(new Date(), this._language)}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'AddWaitingListScreenTimeView'} style={style.containerView2_2}>
                        <Text accessible={true} accessibilityLabel={'AddWaitingListScreenTimeText'} preset={Text.preset.titleH3} style={style.text3}>{SGHelperType.formatTime(new Date(), this._language)}</Text>
                    </View>
                </View>

                {this.alreadyMount ?
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
                :
                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }

                {this.alreadyMount ?
                <ScrollView accessible={true} accessibilityLabel={'AddWaitingListScreenScrollView'} contentContainerStyle={{ backgroundColor: 'white' }}>

                    <Text accessible={true} accessibilityLabel={'AddWaitingListScreenAddText1'} preset={Text.preset.titleH2B} style={style.text2}>{SGLocalize.translate('WaitingListAddView.Text1')}</Text>
                    <WaitingListForm addScreen={true} accessible={true} accessibilityLabel={'AddWaitingListForm'} style={style.throwWHP} data={this.waitingListData} userData={this.currentUserData} language={this._language} disabled={false}></WaitingListForm>

                    { this.dataSetting.fTermsAndConditionsWaitingList['fTermsAndConditions'+language.toUpperCase()] != "" &&
                        <TouchableOpacity onPress={() => {this._showTnCPopView()}}>
                            <Text preset={Text.preset.titleH4B} style={{color:'#63AEE0', marginBottom: 3*p}}>{SGLocalize.translate("WaitingListAddView.TnC")}</Text>
                        </TouchableOpacity>
                    }

                    <View accessible={true} accessibilityLabel={'AddWaitingListScreenBottomView'} style={style.containerView4}>
                        <Button accessible={true} accessibilityLabel={'AddWaitingListScreenCancelButton'} label={SGLocalize.translate('WaitingListAddView.CancelButtonText')} style={style.button} onPress={() => { this.props.navigation.goBack() }}></Button>
                        <SGFormButton accessible={true} accessibilityLabel={'AddWaitingListScreenWaitingListDataButton'} shadow preset={SGFormButton.preset.v1} data={this.waitingListData} label={SGLocalize.translate('WaitingListAddView.AddButtonText')} onPress={this._onAddButton.bind(this)} />
                    </View>
                    
                     <View style={{width:w,height:w*0.15,backgroundColor:'transparent'}}></View>
                </ScrollView>
                :
                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer accessible={true} accessibilityLabel={'AddWaitingListScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.containerView3}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}