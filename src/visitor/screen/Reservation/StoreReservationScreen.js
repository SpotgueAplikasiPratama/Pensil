
/**
 * Version 1.2.0
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SGView as View, SGRootView as RootView, SGTouchableOpacity as TouchableOpacity, SGPopView, SGActivityIndicator as ActivityIndicator, SGText as Text, SGIcon as Icon, SGScrollView as ScrollView, SGButton as Button, SGDialogBox, SGImage as Image } from '../../../core/control';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow ,SGHelperErrorHandling} from '../../../core/helper';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { tbReservationData } from '../../db/tbReservationDAO';
import { ReservationForm } from '../../form_V2/ReservationForm';
import { SGFormButton } from '../../../core/form';
import { VStoreProfileAPI } from '../../api/VStoreProfileAPI';
import { tbVReservationAPI } from '../../api/tbVReservationAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class StoreReservationScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainView1: { width: w, height: h, backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: "black", paddingLeft: 2 * p },
            text2: { color: "black", marginTop: 5 * p },
            text3: { color: '#676464' },
            text4:{color:'black',paddingLeft:2*p,marginTop:2*p},
            text5:{color:'red',paddingLeft:4*p,marginTop:2*p,alignSelf:'flex-start'},
            containerView1: { width: w, height: w * 0.3, resizeMode: 'cover', borderRadius: 0, marginVertical: 0, justifyContent: 'flex-start' },
            containerView2: { width: w, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'white' },
            containerView2_1: { width: w, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'white', borderBottomWidth: p * 0.3, borderBottomColor: '#E4E4E4' },
            containerView2_2: { flexDirection: 'row', paddingLeft: 5 * p },
            containerView3: { width: w, height: h, padding: p },
            containerView4: { width: w, flexDirection: 'row', justifyContent: 'space-evenly' },
            containerView5:{width:w,flexDirection:'row',justifyContent:'space-evenly'},
            button: { marginBottom: 2 * p, borderRadius: 4 * p, width: w * 0.3, minHeight: w * 0.115, alignItems: 'center', justifyContent: 'center' },
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
        });

        this.reservationData = new tbReservationData();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.storeKey = this.props.route.params.storeKey;
        this.dataSetting = [];
        this.doneRenderProfileStore = false;
        this.canReserved = false;
        this.pvID2 = SGPopView.getPopViewID();
    }

    async componentDidMount() {
        await this._onRefreshData();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshData();
        });

    }

    checkAPIBatchStatusAllDone() {
        this.doneRenderProfileStore = true;
        SGDialogBox.hideDialogBox(this.dbID2, true);
        this.forceUpdate();
    }

    async _onRefreshData() {

        this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));

        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this),(()=>{this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));}).bind(this));

        this.baseAddAPIParallel('getStoreHomeProfile', (async (v1) => { return VStoreProfileAPI.getStoreHomeProfile(v1) }).bind(this,this.storeKey), ((v) => {
            this.profileStore = v 
        }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID2, true);}).bind(this));
        this.baseAddAPIParallel('getSettingReservationByContentKey', (async (v1) => { return tbVReservationAPI.getSettingReservationByContentKey(v1) }).bind(this,this.storeKey), ((v) => {
            this.dataSetting = v 
        }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID2, true);}).bind(this));
        this.baseRunAPIParallel();
    }

    _checkReservationBookTime(data, bookTime,bookDate) {
        var date = SGHelperType.convertNewDate(bookDate);
        var time = SGHelperType.formatTime(SGHelperType.convertNewDate(bookTime));
        var getDay =new Date(date).getDay();
        var Day = this._constructDay(getDay);
        if (Day == 0) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[0].fOpen)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[0].fClose)) && data[0].fActive === 'Y') {
                this.canReserved = true;
            }
        } if (Day == 1) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[1].fOpen)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[1].fClose)) && data[1].fActive === 'Y') {
                this.canReserved = true;
            }
        } if (Day == 2) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[2].fOpen)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[2].fClose)) && data[2].fActive === 'Y') {
                this.canReserved = true;
            }
        } if (Day == 3) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[3].fOpen)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[3].fClose)) && data[3].fActive === 'Y') {
                this.canReserved = true;
            }
        }
        if (Day == 4) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[4].fOpen)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[4].fClose)) && data[4].fActive === 'Y') {
                this.canReserved = true;
            }
        } if (Day == 5) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[5].fOpen)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[5].fClose)) && data[5].fActive === 'Y') {
                this.canReserved = true;
            }
        } if (Day == 6) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[6].fOpen)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[6].fClose)) && data[6].fActive === 'Y') {
                this.canReserved = true;
            }
        }
    }
    async _onAddButton() {
        var dateNow = new Date();
        var bookDate = new Date(this.reservationData.fBookDate);
        var bookTime = new Date(this.reservationData.fBookTime);
        var minimumReservationTime = new Date(dateNow.setMinutes(dateNow.getMinutes() + this.dataSetting.fMinimumReservation));
        minimumReservationTime.setSeconds(0);
        this.reservationData.fBookDateTime = new Date(bookDate.getFullYear(), bookDate.getMonth(), bookDate.getDate(), bookTime.getHours(), bookTime.getMinutes());

        if (this.dataSetting.fResetReservation === 'N') {
            var dateNow = new Date();
            this.reservationData.fExpiredDate = new Date(bookDate.getFullYear() + 1, bookDate.getMonth(), bookDate.getDate(), bookTime.getHours(), bookTime.getMinutes());
        } else {
            this.reservationData.fExpiredDate = new Date(bookDate.getFullYear(), bookDate.getMonth(), bookDate.getDate(), bookTime.getHours(), bookTime.getMinutes() + this.dataSetting.fAutoCancelReservation);
        }

        this.reservationData.fStoreKey = this.storeKey;
        if (SGHelperType.convertNewDate(this.reservationData.fBookDateTime) >= SGHelperType.convertNewDate(minimumReservationTime)) {
            SGDialogBox.showConfirmation(null, SGLocalize.translate('AlertMessage.Confirmation'), SGLocalize.translate('AlertMessage.ConfirmationAddReservation'), SGLocalize.translate("AlertMessage.Cancel"), () => { }, SGLocalize.translate("AlertMessage.OK"),
                async () => {
                    this._checkReservationBookTime(this.dataSetting.fOperationHour, this.reservationData.fBookTime,this.reservationData.fBookDate);
                    if (this.canReserved) {
                        try {
                            this.reservationData.fBookDate = new Date(bookDate.getFullYear(),bookDate.getMonth(),bookDate.getDate(),0,0,0)
                            await tbVReservationAPI.addReservation(this.reservationData);
                            if(SGHelperType.isDefined(SGHelperGlobalVar.getVar('GlobalCallReservation'))){
                                SGHelperGlobalVar.setVar('GlobalCallReservation',true)
                            }else{
                                SGHelperGlobalVar.addVar('GlobalCallReservation',true)
                            }
                            SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("AlertMessage.SuccessAddReservation"), SGLocalize.translate("AlertMessage.OK"), () => { SGHelperNavigation.navigatePop(this.props.navigation) }, true)
                        } catch (error) {
                            SGHelperErrorHandling.Handling(error,this._onAddButton.bind(this))
                            // SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("Screen.Reservation") + ' ' + SGLocalize.translate("AlertMessage.FailAddReservation"), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
                        }
                    } else {
                        SGDialogBox.showWarning(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('AlertMessage.FailAddReservation'), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
                    }
                })
        } else {
            SGDialogBox.showWarning(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("AlertMessage.FailAddReservationMinimumTime", { count: this.dataSetting.fMinimumReservation }), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
        }
    }

    _constructDay(Day){
    // minggu itu 0 -> database data ke 6
    // senin itu 1 -> database data ke 0
    // selasa itu 2 -> data ke 1
    //rabu itu 3 -> data ke 2
    //kamis itu 4 -> data ke 3
    //jumt itu 5 ->data ke 4
    //sabtu itu 6 ->data ke 5
        if(Day ==0){
            return 6
        }else if(Day==1){
            return 0
        }else if(Day ==2){
            return 1
        }else if(Day ==3){
            return 2
        }else if(Day ==4){
            return 3
        }else if(Day ==5){
            return 4
        }else if(Day ==6){
            return 5
        }
    }

    _forceUpdate(){
        console.log('call refresh')
        this.forceUpdate();
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
        var getDay =new Date(this.reservationData.fBookDate).getDay();
        var language = this.currentUserData.fLanguage;
        var Day = this._constructDay(getDay);
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'StoreReservationScreenRootView'} style={style.mainView1}>

                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>

                <Image accessible={true} accessibilityLabel={'StoreReservationScreenImage'} style={style.containerView1} source={{ uri: this.doneRenderProfileStore == true ? this.profileStore['fContent' + this._language.toUpperCase()].fStoreBackgroundImageJSON[0][this.imageSetting].uri : '' }}></Image>
                <View accessible={true} accessibilityLabel={'AddWaitingListScreenContainerIconView1'} style={style.containerView2}>
                    <Text preset={Text.preset.titleH2B} style={style.text1}>{SGLocalize.translate('ReservationAddView.AddReservation')}</Text>
                </View>

                <View accessible={true} accessibilityLabel={'StoreReservationScreenDateTimeView'} style={style.containerView2_1}>
                    <View accessible={true} accessibilityLabel={'StoreReservationScreenDateView'} style={style.containerView2_2}>
                        <Text accessible={true} accessibilityLabel={'StoreReservationScreenDateText'} preset={Text.preset.titleH3} style={style.text3}>{SGHelperType.formatDate(new Date(), this._language)}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'StoreReservationScreenTimeView'} style={style.containerView2_2}>
                        <Text accessible={true} accessibilityLabel={'StoreReservationScreenTimeText'} preset={Text.preset.titleH3} style={style.text3}>{SGHelperType.formatTime(new Date(), this._language)}</Text>
                    </View>
                </View>

                {this.doneRenderProfileStore &&
                 this.dataSetting.fOperationHour[Day].fActive == 'Y' ?
                <View style={style.containerView5}>
                    <Text style={style.text4} preset={Text.preset.titleH3B}>{SGLocalize.translate('ReservationAddView.openText')} : {SGHelperType.formatTime(SGHelperType.convertNewDate(this.dataSetting.fOperationHour[Day].fOpen))}</Text>
                    <Text style={style.text4} preset={Text.preset.titleH3B}>{SGLocalize.translate('ReservationAddView.closeText')} : {SGHelperType.formatTime(SGHelperType.convertNewDate(this.dataSetting.fOperationHour[Day].fClose))}</Text>
                </View> :
                    <Text style={style.text5}>{SGLocalize.translate('ReservationAddView.closeText')}</Text>
                }

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
                <ScrollView  accessible={true} accessibilityLabel={'StoreReservationScreenScrollView'} contentContainerStyle={{ bacgroundColor: 'white' }} showsHorizontalScrollIndicator={false}>
                    <View accessible={true} accessibilityLabel={'StoreReservationScreenResvAddView'}>
                        <Text accessible={true} accessibilityLabel={'StoreReservationScreenResvAddText1'} preset={Text.preset.titleH2B} style={style.text2}>{SGLocalize.translate('ReservationAddView.Text1')}</Text>
                        <ReservationForm screenAdd={true} accessible={true} accessibilityLabel={'StoreReservationScreenForm'} style={style.throwWHP} data={this.reservationData} userData={this.currentUserData} language={this._language} disabled={false} callback={this._forceUpdate.bind(this)}></ReservationForm>
                    
                        { this.dataSetting.fTermsAndConditionsReservation['fTermsAndConditions'+language.toUpperCase()] != "" &&
                            <TouchableOpacity onPress={() => {this._showTnCPopView()}}>
                                <Text preset={Text.preset.titleH4B} style={{color:'#63AEE0', marginBottom: 3*p}}>{SGLocalize.translate("ReservationAddView.TnC")}</Text>
                            </TouchableOpacity>
                        }

                    </View>
                    {this.doneRenderProfileStore &&
                    this.dataSetting.fOperationHour[Day].fActive == 'Y' &&
                    <View accessible={true} accessibilityLabel={'StoreReservationScreenButtonView'} style={style.containerView4}>
                        <Button preset={Button.preset.red} accessible={true} accessibilityLabel={'StoreReservationScreenCancelButton'} label={SGLocalize.translate('ReservationAddView.CancelButtonText')} style={style.button} onPress={() => { this.props.navigation.goBack() }}></Button>
                        <SGFormButton accessible={true} accessibilityLabel={'StoreReservationScreenAddButton'} shadow preset={SGFormButton.preset.v1} data={this.reservationData} label={SGLocalize.translate('ReservationAddView.AddButtonText')} onPress={this._onAddButton.bind(this)} />
                    </View>
                    }
                      <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                      <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                </ScrollView>
                :
                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }

                <BottomNavigationContainer accessible={true} accessibilityLabel={'StoreReservationScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.containerView3}></BottomNavigationContainer>
            </RootView>
        );
    }
}
