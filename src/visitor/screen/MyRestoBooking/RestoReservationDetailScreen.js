
/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 * 2. Leon 10-11 Apr 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGIcon as Icon, SGScrollView as ScrollView, SGButton as Button, SGTouchableOpacity as TouchableOpacity, SGDialogBox, SGImage as Image, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGPopView } from '../../../core/control/SGPopView';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { tbReservationDAO, tbReservationData } from '../../db/tbReservationDAO';
import { ReservationForm } from '../../form_V2/ReservationForm';
import { SGFormButton } from '../../../core/form';
import { tbVReservationAPI } from '../../api/tbVReservationAPI';
import { VRestoProfileAPI } from '../../api/VRestoProfileAPI';
import { VRestoHomeAPI } from '../../api/VRestoHomeAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class RestoReservationDetailScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainView1: { width: w, height: h, backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: "black", paddingLeft: 2 * p },
            text2: { color: "black", marginTop: 5 * p },
            text3: { color: '#676464' },
            text4: { color: this.props.route.params.data.fStatus === 'waiting' ? 'orange' : this.props.route.params.data.fStatus === 'done' ? '#59E812' : '#D30300', paddingRight: 2 * p },
            containerView1: { width: w, height: w * 0.3, resizeMode: 'cover', borderRadius: 0, marginVertical: 0, justifyContent: 'flex-start' },
            containerView2: { width: w, height: w * 0.1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
            containerView2_1: { width: w, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'white', borderBottomWidth: p * 0.3, borderBottomColor: '#E4E4E4' },
            containerView2_2: { flexDirection: 'row', paddingLeft: 5 * p },
            containerView2_3: { flexDirection: 'row' },
            containerView3: { width: w, height: h, padding: p },
            button: { marginBottom: 2 * p, backgroundColor: '#E64D4D', borderRadius: 4 * p, width: w * 0.25, height: w * 0.115, alignItems: 'center', justifyContent: 'center' },
            pv1: { width: 8.5*w/10, padding: p, borderRadius: 2 * p, marginBottom: p, backgroundColor: '#f8f8ff', justifyContent: 'flex-start' },
            pv2: { marginTop: 3*p, maxHeight: 2*h/3 },
            pv3: { marginTop: 3*p, maxHeight: 2*h/3 },
        });
    }

    getFilterOnGoingData() {
        return ([
            { name: 'fStatus', operator: '=', value: 'waiting', visible: false },
            { name: 'reservationfCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
        ]);
      }

      getPagingReservation() {
        var itemPerPage = SGHelperType.getPaging()
        return { paging: false, offset: this.pagingCounterReservation, totalPerPage: itemPerPage }
      }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });

        this.reservationData = this.props.route.params.data;
        this.activeReservation = this.props.route.params.active;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.profileResto = [];
        this.counterBatch=0
        this.errorBatch = [];
        this.doneRenderProfileStore = false;
        this.pvID2 = SGPopView.getPopViewID();
    }

    async componentDidMount() {
        await this._onSelectProfileResto();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onSelectProfileResto();
        });
    }

    checkAPIBatchStatusAllDone() {
        this.doneRenderProfileStore = true;
        SGDialogBox.hideDialogBox(this.dbID3, true);
        this.forceUpdate();
    }

    async _onSelectProfileResto() {
        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this),(()=>{this.dbID3 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));}).bind(this));

        this.baseAddAPIParallel('getRestoHomeProfile', (async (v1) => { return VRestoProfileAPI.getRestoHomeProfile(v1) }).bind(this, this.reservationData.fStoreKey), ((v) => {           
            this.profileResto = v
           
         }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID3, true)}).bind(this)); 

         this.baseAddAPIParallel('getRestoSettings', (async (v1) => { return VRestoHomeAPI.getRestoSettings(v1); }).bind(this,this.reservationData.fStoreKey), ((v) => {
            this.dataSetting = v;
        }).bind(this),  (()=>{SGDialogBox.hideDialogBox(this.dbID3, true)}).bind(this));
         
         this.baseRunAPIParallel();
    }
    async _onCancelPressHandler(){
        try {
            this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Processing"))
            await tbVReservationAPI.cancelReservationVisitor(this.reservationData)

            this.pagingReservation = this.getPagingReservation();
            this.filterReservationData = this.getFilterOnGoingData();
            var result = await tbVReservationAPI.searchReservationMyBookingVisitor(this.filterReservationData, [], this.pagingReservation)
            if(result.length == 0){
                SGHelperGlobalVar.addVar('GlobalCallReservation',false) 
                SGHelperGlobalVar.addVar('GlobalReservationReminder',false) 
            }
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("AlertMessage.SuccessCancelReservation"), SGLocalize.translate("AlertMessage.OK"), () => { SGHelperNavigation.navigatePop(this.props.navigation); this.props.route.params.callback() }, true)
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGHelperErrorHandling.Handling(error,this._onCancelPressHandler.bind(this))
            // SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("AlertMessage.FailCancelReservation"), SGLocalize.translate("AlertMessage.OK"), () => { SGDialogBox.hideDialogBox(this.dbID2) }, true)
        }
    }
    async _onCancelPress() {
        SGDialogBox.showConfirmation(null, SGLocalize.translate('AlertMessage.Confirmation'), SGLocalize.translate('AlertMessage.ConfirmationCancelReservation'), SGLocalize.translate("AlertMessage.Cancel"), () => { }, SGLocalize.translate("AlertMessage.OK"),
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
        var style = this.style;
        var language = this.currentUserData.fLanguage;
       
        return (

            <RootView dummyStatusBar accessible={true} accessibilityLabel={'RestoReservationDetailScreenRootView'} style={style.mainView1}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'RestoReservationHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <Image accessible={true} accessibilityLabel={'ViewWaitingListScreenImage'} style={style.containerView1} source={{ uri: this.profileResto.length !== 0 ? this.profileResto['fContent' + this._language.toUpperCase()].fStoreBackgroundImageJSON[0][this.imageSetting].uri : '' }}></Image>
                <View accessible={true} accessibilityLabel={'AddWaitingListScreenContainerIconView1'} style={style.containerView2}>
                    <Text preset={Text.preset.titleH1B} style={style.text1}>{this.activeReservation === true ? SGLocalize.translate('ReservationAddView.DetailReservation') : SGLocalize.translate('ReservationAddView.HistoryReservation')}</Text>
                    <Text preset={Text.preset.titleH2B} style={style.text4}>{this.reservationData.fStatus.toUpperCase()}</Text>
                </View>
                <View accessible={true} accessibilityLabel={'RestoReservationDetailScreenContainerView'} style={style.containerView2_1}>
                    <View accessible={true} accessibilityLabel={'RestoReservationDetailScreenContainerView_1'} style={style.containerView2_2}>
                        <Text accessible={true} accessibilityLabel={'RestoReservationDetailScreenDateText'} preset={Text.preset.titleH3} style={style.text3}>{SGHelperType.formatDate(SGHelperType.convertNewDate(this.reservationData.fBookDateTime), this._language)}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'RestoReservationDetailScreenContainerView_2'} style={style.containerView2_2}>
                        <Text accessible={true} accessibilityLabel={'RestoReservationDetailScreenTimeText'} preset={Text.preset.titleH3} style={style.text3}>{SGHelperType.formatTime(SGHelperType.convertNewDate(this.reservationData.fBookDateTime), this._language)}</Text>
                    </View>
                </View>

                {this.doneRenderProfileStore ?
                <SGPopView accessible={true} accessibilityLabel={'TermsAndConditionsPopView'} shadow animationType={'slide'} popViewID={this.pvID2} vPos='center'>
                    <View style={style.pv1}>
                        <View style={style.pv2}>
                            <Text preset={Text.preset.titleH2B}>{SGLocalize.translate("ReservationAddView.TnC")}</Text>
                        </View>
                        <View style={style.pv3}>
                        
                            <ScrollView accessible={true} accessibilityLabel={'TnCScrollView'} style={{ width: 8*w/10 }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Text>{this.dataSetting.fTermsAndConditionsReservation['fTermsAndConditions'+language.toUpperCase()]}</Text>
                            </ScrollView>
                        
                        </View>
                    </View>
                </SGPopView> 
                :
                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }

                {this.doneRenderProfileStore ?
                <ScrollView style={{ marginBottom: SGHelperWindow.getHeaderHeight()}} accessible={true} accessibilityLabel={'RestoReservationDetailScreenScrollView'} contentContainerStyle={{ bacgroundColor: 'white' }}>
                    <ReservationForm accessible={true} accessibilityLabel={'RestoReservationDetailScreenForm'} style={style.throwWHP} data={this.reservationData} userData={this.currentUserData} language={this._language} disabled={true} ></ReservationForm>
                    
                    { this.dataSetting.fTermsAndConditionsReservation['fTermsAndConditions'+language.toUpperCase()] != "" &&
                        <TouchableOpacity onPress={() => {this._showTnCPopView()}}>
                            <Text preset={Text.preset.titleH4B} style={{color:'#63AEE0', marginBottom: 3*p}}>{SGLocalize.translate("ReservationAddView.TnC")}</Text>
                        </TouchableOpacity>
                    }
                    
                    {this.activeReservation === true && <Button accessible={true} accessibilityLabel={'RestoReservationDetailScreenCancelButton'} label={SGLocalize.translate('ReservationAddView.CancelButtonText')} style={style.button} onPress={this._onCancelPress.bind(this)}></Button>}
                     <View style={{width:w,height:w*0.15,backgroundColor:'transparent'}}></View>
                </ScrollView>
                :
                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
                
                <BottomNavigationContainer accessible={true} accessibilityLabel={'RestoReservationDetailScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.containerView3}></BottomNavigationContainer>
            </RootView>
        );
    }
}
