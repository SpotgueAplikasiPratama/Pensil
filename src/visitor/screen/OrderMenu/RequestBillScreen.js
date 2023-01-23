/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
 import React from 'react';
 import { StyleSheet, Alert } from 'react-native';
 import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
 import { SGView as View, SGText as Text, SGScrollView as ScrollView, SGImage as Image, SGButton as Button, SGRootView as RootView, SGIcon as Icon, SGDialogBox } from '../../../core/control';
 import { SGHelperGlobalVar, SGHelperType, SGHelperNavigation, SGHelperErrorHandling } from '../../../core/helper';
 import { RibbonHeader } from '../../component_V2/RibbonHeader';
 import { SGLocalize } from '../../locales/SGLocalize';
 import image from '../../asset/image';
 import { tbVOrderMenuAPI } from '../../api/tbVOrderMenuAPI';
 import { VRestoProfileAPI } from '../../api/VRestoProfileAPI';
 import { VRestoHomeAPI } from '../../api/VRestoHomeAPI';
 import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
 import { VisitorHelper } from '../../helper/VisitorHelper';
 export class RequestBillScreen extends SGBaseScreen {
 
     createStyleSheet = (whp) => {
         var { w, h, p } = whp;
         return StyleSheet.create({
            v1: { flex: 1, backgroundColor: 'white', width: w },
            v2: { width: w, height: w * 0.15, resizeMode: 'cover', borderRadius: 0, marginVertical: 0, backgroundColor: "white", justifyContent: 'flex-start' },
            v3: { width: w, height: w * 0.1, backgroundColor: '#181818', borderBottomRightRadius: 2.5 * p, borderBottomLeftRadius: 2.5 * p },
            containerTopView: { width: w * 0.925, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 * p },
            cardContainerView: { width: w * 0.925, borderWidth: 0.5, borderColor: '#181818', borderRadius: 2 * p, flexDirection: 'row' },
            cardView1: { width: w * 0.925 / 3 },
            image: { resizeMode: 'cover', width: w * 0.25, height: w * 0.25, marginVertical: 2 * p },
            cardView2: { width: (w - 2 * p) * 0.93 * 6.5 / 10, height: w * 0.35 },
            cardView2_1: { width: (w - 2 * p) * 0.93 * 6.5 / 10, height: w * 0.125, alignSelf: 'flex-end', alignItems: 'flex-start', },
            cardView2_2: { width: (w - 2 * p) * 0.93 * 6.5 / 10, height: w * 0.175, flexDirection: 'row', alignItems: 'flex-start', },
            cardView2_2_1: { justifyContent: 'flex-start', width: (w - 2 * p) * 0.93 * 6.5 / 10 * 0.5, alignItems: 'flex-start' },

            cardbillBackground: { width: w * 0.925, borderRadius: 2 * p, backgroundColor: 'white', marginBottom: 2 * p },
            billBackground: { width: w * 0.925, backgroundColor: 'white', borderWidth: 0.2 * p, borderColor: 'rgba(237,237,237,1)', borderBottomLeftRadius: 2 * p, borderBottomRightRadius: 2 * p, paddingVertical: 4 * p, justifyContent: 'flex-start' },
            cardBackground: { width: w * 0.925, backgroundColor: 'rgba(242,181,62, 0.05)', borderTopLeftRadius: 2 * p, borderTopRightRadius: 2 * p, justifyContent: 'flex-start', flexDirection: 'row' },

            containerView1: { flexDirection: 'row', width: w - 8 * p },
            containerView1_1: { alignItems: 'flex-start', justifyContent: 'flex-end', width: (w - 8 * p) / 3, height: w * 0.27 },
            containerView1_1_1: { justifyContent: 'flex-start', width: (w - 8 * p) / 3, height: w * 0.235 * 0.7, alignSelf: 'flex-end' },
            contentView: { justifyContent: 'flex-start', flexDirection: 'row', width: w * 0.925 * 2 / 3 / 2 },
            textReminder: { width: w * 0.8, color: '#FFF7E4', opacity: 0.7, marginTop: w * 0.03, alignSelf: 'center' },
            top: { width: w, padding: p },
            button1: { justifyContent: "center", alignItems: 'center', backgroundColor: "#1DB382", width: w * 0.85, height: w * 0.1, marginHorizontal: 0, marginTop: 2 * p, borderRadius: 3 * p, paddingVertical: 0 },
            billView: { width: w * 0.85 },
            vbillMain: { width: w * 0.8, marginBottom: 3 * p },
            vbill: { width: w * 0.85, justifyContent: 'space-between', flexDirection: 'row' },
            vbill1: { flexDirection: 'row', width: w * 0.06, justifyContent: 'flex-start' },
            vbill2: { flexDirection: 'row', width: w * 0.45, justifyContent: 'flex-start' },
            vbill3: { flexDirection: 'row', width: w * 0.24, justifyContent: 'flex-end' },
            vbill4: { flexDirection: 'row', width: w * 0.3, justifyContent: 'flex-end' },
            footerPrice: { width: w, borderTopWidth: 0.2 * p, borderColor: 'rgba(237,237,237,1)', backgroundColor: 'white', paddingVertical: 3 * p },
            textBillColor: { color: '#181818' },
            totalColor: { color: 'green' },
            textBillColor1: { color: '#181818', paddingLeft: 2 * p },
            textColor: { color: '#181818' },
            textColorName: { color: '#00a8a8' },
            text1: { color: "black", paddingLeft: 2 * p },
            icon: { width: w * 0.042, height: w * 0.042, resizeMode: 'contain', backgroundColor: 'transparent' },
            ribbonHeader: { marginTop: -p, marginBottom: -2 * p },
            textCardTitle: { marginVertical: 0, color: 'black' },
            totalLine: { width: w * 0.8, height: 2, color: 'black' },
            popView: { width: w, height: h, padding: p },
         });
     }
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this.style = this.createStyleSheet(this.WHP);
         this.dataTableID = this.props.route.params.fID;
         this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
         this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
         this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
         this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
         this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
         this.restoKey = this.props.route.params.restoKey;
         this.dataSetting = [];
         this.dataOrder = [];
         this.dataKotor = [];
         this.totalPrice = 0;
         this.taxPrice = 0;
         this.servicePrice = 0;
         this.finalPrice = 0;
         this.index = 0;
         this.checkDeliverData = false;
         this.alreadyMount = false;
         this.props.navigation.setOptions({
             headerShown: false,
             headerTitle: "",
             headerBackTitle: "Back",
         });
     }
 
     async componentDidMount() {
         await this._getAllOrder();
         this._unsubscribe = this.props.navigation.addListener('focus', async () => {
             await this._getAllOrder();
         });
     }
 
     _countTotalPrice() {
         this.totalPrice = 0;
         for (var i = 0; i < this.dataOrder[0].fOrderGroup.length; i++) {
             for (var j = 0; j < this.dataOrder[0].fOrderGroup[i].fOrderDetail.length; j++) {
                 if (this.dataOrder[0].fOrderGroup[i].fOrderDetail[j].fStatus !== "cancelled") {
                     this.totalPrice = this.totalPrice + this.dataOrder[0].fOrderGroup[i].fOrderDetail[j].fPriceSubTotal;
                 }
             }
         }
     }

     _countTaxAndServices(){
        this.finalPrice = 0;
        this.taxPrice = 0;
        this.servicePrice = 0;

        if(this.dataSetting.fShowService == 'Y'){
            this.servicePrice = this.totalPrice * (this.dataSetting.fServicePrice / 100);
        }

        if(this.dataSetting.fShowTax == 'Y'){
            this.taxPrice = (this.totalPrice + this.totalPrice * (this.dataSetting.fServicePrice / 100)) * (this.dataSetting.fTaxPrice / 100);
        }

        this.finalPrice = this.totalPrice + this.taxPrice + this.servicePrice;
    }

     checkAPIBatchStatusAllDone() {
        console.log('all done 11');
         SGDialogBox.hideDialogBox(this.dbID2, true)
         this.dataGrouping();
         console.log('all done');
         this._countTotalPrice();
         this._countTaxAndServices();
         this.alreadyMount = true;
         this.forceUpdate()
     }
 
     async _getAllOrder() {
 
         this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
         this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));
     
         this.baseAddAPIParallel('searchAllOrderDetailVisitorByTableKey', (async (v1) => { return tbVOrderMenuAPI.searchAllOrderDetailVisitorByTableKey(v1) }).bind(this,this.dataTableID), ((v) => {
             this.dataOrder = v;
             console.log(this.dataOrder);
         }).bind(this), null);
         this.baseAddAPIParallel('getRestoHomeProfile', (async (v1) => { return VRestoProfileAPI.getRestoHomeProfile(v1) }).bind(this,this.restoKey), ((v) => {
             this.profileResto = v;   
         }).bind(this), null);
         this.baseAddAPIParallel('getRestoSettings', (async (v1) => { return VRestoHomeAPI.getRestoSettings(v1) }).bind(this,this.restoKey), ((v) => {
             this.dataSetting = v;   
         }).bind(this), null);
         this.baseRunAPIParallel();   
     }
     
     dataGrouping() {
        var i = 0;
        this.dataOrderRapih = []
        this.dataOrder[0].fOrderGroup.sort((a, b) => (a.fOrderDetail[0].fProductJSON.fID > b.fOrderDetail[0].fProductJSON.fID) ? 1 : -1);
        var data = SGHelperType.copyJSON(this.dataOrder)
        var for1 = data[0].fOrderGroup.length;
        var for2 = 0;
        var language = this._language.toUpperCase();
        try {
            for (let index = 0; index < for1; index++) {
                for2 = data[0].fOrderGroup[index].fOrderDetail.length
                for (let v = 0; v < for2; v++) {
                    if (data[0].fOrderGroup[index].fOrderDetail[v].fStatus === "cancelled") {
                        if (data[0].fOrderGroup[index].fOrderDetail.length === 1) {
                            data[0].fOrderGroup.splice(index, 1)
                            index--;
                            for1--;
                            this.forceUpdate();
                            break
                        }
                        else {
                            data[0].fOrderGroup[index].fOrderDetail.splice(v, 1);
                            v--;
                            for2--;
                            this.forceUpdate();
                        }

                    }
                }
            }
        } catch (error) {
            console.log('1')
            console.log(error)
        }

        if (data.length !== 0) {
            try {
                this.dataOrderRapih.push({
                    'fID': data[0].fOrderGroup[0].fOrderDetail[0].fProductJSON.fID,
                    'qty': data[0].fOrderGroup[0].fOrderDetail.length,
                    'MenuName': data[0].fOrderGroup[0].fOrderDetail[0].fProductJSON["fProductName" + language],
                    'totalprice': (data[0].fOrderGroup[0].fOrderDetail[0].fProductJSON.fDiscountPrice) * data[0].fOrderGroup[0].fOrderDetail.length,

                    'arrCustomize': []
                })

                if (data[0].fOrderGroup[0].fOrderDetail[0].fOrderCustomize[0] !== undefined) {
                    for (let index = 0; index < data[0].fOrderGroup[0].fOrderDetail[0].fOrderCustomize.length; index++) {
                        this.dataOrderRapih[0].arrCustomize.push({
                            'nameCustomize': data[0].fOrderGroup[0].fOrderDetail[0].fOrderCustomize[index].fCustomizationJSON["fCustomizeName" + language],
                            'qty': data[0].fOrderGroup[0].fOrderDetail.length,
                            'totalprice': data[0].fOrderGroup[0].fOrderDetail.length * data[0].fOrderGroup[0].fOrderDetail[0].fOrderCustomize[index].fCustomizationJSON.fDiscountPrice
                        })
                    }
                }
            } catch (error) {
                console.log('2')
                console.log(error)
            }

            for (let index = 1; index < data[0].fOrderGroup.length; index++) {
                if (this.dataOrderRapih[i].fID !== data[0].fOrderGroup[index].fOrderDetail[0].fProductJSON.fID) {
                    this.dataOrderRapih.push({
                        'fID': data[0].fOrderGroup[index].fOrderDetail[0].fProductJSON.fID,
                        'qty': data[0].fOrderGroup[index].fOrderDetail.length,
                        'MenuName': data[0].fOrderGroup[index].fOrderDetail[0].fProductJSON["fProductName" + language],
                        'totalprice': (data[0].fOrderGroup[index].fOrderDetail[0].fProductJSON.fDiscountPrice) * data[0].fOrderGroup[index].fOrderDetail.length,
                        'arrCustomize': []
                    })
                    this.dataOrderRapih[i].arrCustomize.sort((a, b) => (a.nameCustomize > b.nameCustomize) ? 1 : -1);

                    var tempindex = 0
                    var tempdata = []
                    if(this.dataOrderRapih[i].arrCustomize.length !== 0){

                        tempdata[0] = { 'qty': this.dataOrderRapih[i].arrCustomize[0].qty, 'nameCustomize': this.dataOrderRapih[i].arrCustomize[0].nameCustomize, 'totalprice': this.dataOrderRapih[i].arrCustomize[0].totalprice }

                        for (let j = 0; j <  this.dataOrderRapih[i].arrCustomize.length - 1; j++) {
                            if(this.dataOrderRapih[i].arrCustomize[j].nameCustomize === this.dataOrderRapih[i].arrCustomize[j+1].nameCustomize){
                                tempdata[tempindex].qty += this.dataOrderRapih[i].arrCustomize[j+1].qty
                                tempdata[tempindex].nameCustomize = this.dataOrderRapih[i].arrCustomize[j+1].nameCustomize
                                tempdata[tempindex].totalprice += this.dataOrderRapih[i].arrCustomize[j+1].totalprice
                            }else{
                                tempindex++;
                                tempdata[tempindex] = { 'qty': this.dataOrderRapih[i].arrCustomize[j+1].qty, 'nameCustomize': this.dataOrderRapih[i].arrCustomize[j+1].nameCustomize, 'totalprice': this.dataOrderRapih[i].arrCustomize[j+1].totalprice }
                            }
                        }
                    }
                    this.dataOrderRapih[i].arrCustomize = tempdata
                    i++;
                } else {
                    this.dataOrderRapih[i].qty += data[0].fOrderGroup[index].fOrderDetail.length;
                    this.dataOrderRapih[i].totalprice += (data[0].fOrderGroup[index].fOrderDetail[0].fProductJSON.fDiscountPrice) * data[0].fOrderGroup[index].fOrderDetail.length;
                }

                if (data[0].fOrderGroup[index].fOrderDetail[0].fOrderCustomize[0] !== undefined) {
                    for (let j = 0; j < data[0].fOrderGroup[index].fOrderDetail[0].fOrderCustomize.length; j++) {
                        this.dataOrderRapih[i].arrCustomize.push({
                            'nameCustomize': data[0].fOrderGroup[index].fOrderDetail[0].fOrderCustomize[j].fCustomizationJSON["fCustomizeName" + language],
                            'qty': data[0].fOrderGroup[index].fOrderDetail.length,
                            'totalprice': data[0].fOrderGroup[index].fOrderDetail.length * data[0].fOrderGroup[index].fOrderDetail[0].fOrderCustomize[j].fCustomizationJSON.fDiscountPrice
                        })
                    }
                }
            }
        }
    }
    
     _checkOrderUndeliver(data) {
         breakpoint:
         for (var i = 0; i < data.fOrderGroup.length; i++) {
             for (var j = 0; j < data.fOrderGroup[i].fOrderDetail.length; j++) {
                 if (data.fOrderGroup[i].fOrderDetail[j].fStatus !== "deliver" && data.fOrderGroup[i].fOrderDetail[j].fStatus !== "cancelled" && data.fOrderGroup[i].fOrderDetail[j].fStatus !== "completed") {
                     { SGDialogBox.showWarning(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('requestBillScreen.alertFailTextMenuInProcessing'), SGLocalize.translate("AlertMessage.Cancel"), () => { }), true }
                     this.checkDeliverData = true
                     break breakpoint;
                 }
             }
         }
     }
     
     async _onCompleteOrderPress(){
             var data = this.dataOrder[0];
             data.fTotalPrice = this.finalPrice;
             data.fTaxPrice = this.taxPrice;
             data.fTaxPercentage = this.dataSetting.fTaxPrice;
             data.fServicePrice = this.servicePrice;
             data.fServicePercentage = this.dataSetting.fServicePrice;
             this._checkOrderUndeliver(data);
             if (this.checkDeliverData === false) {
                 SGDialogBox.showConfirmation(null, SGLocalize.translate("AlertMessage.Confirmation"), SGLocalize.translate("requestBillScreen.alertConfirmation"), SGLocalize.translate("AlertMessage.Cancel"), () => { },
                 SGLocalize.translate("AlertMessage.OK"),
                 async () => {
                     try {
                     await tbVOrderMenuAPI.updateCompleteOrderVisitor(data)
                     if (this.dataSetting.fOrderMenuDoneActionAlert === 1) {
                         { SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate('requestBillScreen.alertSuccessText'), SGLocalize.translate("AlertMessage.OK"), () => { SGHelperNavigation.navigatePop(this.props.navigation); SGHelperNavigation.navigatePop(this.props.navigation, "RestoHome", { contentKey: this.restoKey }) }, true) }
                     } else {
                         { SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate('requestBillScreen.alertSuccessText2'), SGLocalize.translate("AlertMessage.OK"), () => { SGHelperNavigation.navigatePop(this.props.navigation); SGHelperNavigation.navigatePop(this.props.navigation, "RestoHome", { contentKey: this.restoKey }) }, true) }
                     }
                 } catch (error) {
                     SGHelperErrorHandling.Handling(error,this._onCompleteOrderPress.bind(this))
                 }
                 }, true)
             }
         }
 
     render() {
         var { w, h, p } = this.WHP;
         var style = this.style;
         var language = this._language.toUpperCase();
         console.log('bill detail')
         console.log(this.dataOrder);
        
         return (
             <RootView dummyStatusBar accessible={true} accessibilityLabel={'RequestBillScreenRootView'} style={style.v1}>
                 <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                 <RibbonHeader style={style.ribbonHeader} goldTheme borderTopOff imageSetting={this.imageSetting} title={SGLocalize.translate('orderMenuListScreen.Bill')} ribbonWidth={0.35}></RibbonHeader>
                
                 {this.dataOrder.length != 0 ?
                    <ScrollView showsVerticalScrollIndicator={false} accessible={true} accessibilityLabel={'RequestBillScreenScrollView'} style={{ flex: 1, backgroundColor: '#f7f8fa' }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }}>

                        <View accessible={true} accessibilityLabel={'RequestBillScreenTopView'} style={style.containerTopView}>
                            <Text accessible={true} accessibilityLabel={'RequestBillScreenOrderName'} preset={Text.preset.h5B} style={style.textColorName}>{this.dataOrder[0].fOrderName}</Text>
                        </View>

                        <View shadow style={style.cardbillBackground}>
                            <View style={style.cardBackground}>
                                <View accessible={true} accessibilityLabel={'RequestBillScreenImageView'} style={style.cardView1}>
                                <Image accessible={true} accessibilityLabel={'RequestBillScreenImage'} style={style.image} source={{ uri: this.alreadyMount === true ? this.profileResto['fContent' + language].fStoreImageJSON[0][this.imageSetting].uri : '' }}></Image>
                                </View>
                                <View accessible={true} accessibilityLabel={'RequestBillScreenTextView'} style={style.cardView2}>
                                    <View accessible={true} accessibilityLabel={'RequestBillScreenTitleView'} style={style.cardView2_1}>
                                    <Text accessible={true} accessibilityLabel={'RequestBillScreenStoreName'} preset={Text.preset.titleH2B} style={style.textCardTitle}>{this.profileResto['fContent' + language].fStoreName}</Text>
                                     <Text accessible={true} accessibilityLabel={'RequestBillScreenBuildingName'} preset={Text.preset.titleH4B} style={style.textCardTitle}>{this.profileResto['fBuildingName' + language]}</Text>
                                    </View>
                                    <View accessible={true} accessibilityLabel={'RequestBillScreenContentTextView'} style={style.cardView2_2}>
                                        <View accessible={true} accessibilityLabel={'RequestBillScreenDateTimeView'} style={style.cardView2_2_1}>
                                            <View accessible={true} accessibilityLabel={'RequestBillScreenDateView'} style={style.contentView}>
                                                <Image accessible={true} accessibilityLabel={'RequestBillScreenDateIconImage'} source={{ uri: image.dateIcon[this.imageSetting].url }} style={style.icon}></Image>
                                                <Text accessible={true} accessibilityLabel={'RequestBillScreenDateText'} preset={Text.preset.h8B} style={style.textColor}>{SGHelperType.formatDate(SGHelperType.convertNewDate(this.dataOrder[0].fCreatedDate), language)}</Text>
                                            </View>
                                            <View accessible={true} accessibilityLabel={'RequestBillScreenTimeView'} style={style.contentView}>
                                                <Image accessible={true} accessibilityLabel={'RequestBillScreenTimeIconImage'} source={{ uri: image.timeIcon[this.imageSetting].url }} style={style.icon}></Image>
                                                <Text accessible={true} accessibilityLabel={'RequestBillScreenTimeText'} preset={Text.preset.h8B} style={style.textColor}>{SGHelperType.formatTime(SGHelperType.convertNewDate(this.dataOrder[0].fCreatedDate), language)}</Text>
                                            </View>
                                            <View accessible={true} accessibilityLabel={'RequestBillScreenTableView'} style={style.contentView}>
                                                <Image accessible={true} accessibilityLabel={'RequestBillScreenTableIconImage'} source={{ uri: image.tableIcon[this.imageSetting].url }} style={style.icon}></Image>
                                                <Text accessible={true} accessibilityLabel={'RequestBillScreenTableText'} preset={Text.preset.h8B} style={style.textColor}>{SGLocalize.translate('requestBillScreen.LabelTable')} {this.dataOrder[0].fTableNumber}</Text>
                                            </View>
                                        </View>
                                        <View accessible={true} accessibilityLabel={'RequestBillScreenPeopleKeyView'} style={style.cardView2_2_1}>
                                            <View accessible={true} accessibilityLabel={'RequestBillScreenPeopleView'} style={style.contentView}>
                                                <Image accessible={true} accessibilityLabel={'RequestBillScreenPeopleIconImage'} source={{ uri: image.peopleIcon[this.imageSetting].url }} style={style.icon}></Image>
                                                <Text accessible={true} accessibilityLabel={'RequestBillScreenNumbPersonText'} preset={Text.preset.h8B} style={style.textColor}>{this.dataOrder[0].fNumberOfPerson} {SGLocalize.translate('requestBillScreen.LabelPerson')}</Text>
                                            </View>
                                            <View accessible={true} accessibilityLabel={'RequestBillScreenKeyView'} style={style.contentView}>
                                                <Image accessible={true} accessibilityLabel={'RequestBillScreenKeyIconImage'} source={{ uri: image.keyIcon[this.imageSetting].url }} style={style.icon}></Image>
                                                <Text accessible={true} accessibilityLabel={'RequestBillScreenKeyText'} preset={Text.preset.h8B} style={style.textColor}>{this.dataOrder[0].fTableKey}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View accessible={true} accessibilityLabel={'CashierDetailScreenBillBackground'} style={style.billBackground}>
                                <View accessible={true} accessibilityLabel={'CashierDetailScreenBillView'} style={style.billView}>
                                    {
                                        this.dataOrderRapih.map((d, i) => {
                                            return (
                                                <View>
                                                    {
                                                        i === 0 ? <View /> : <View style={{ width: 0.9 * w, height: 0.2 * p, backgroundColor: '#DADADA', marginVertical: 2 * p }} />
                                                    }
                                                    <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTextView'} style={style.vbill}>
                                                        <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTitleView'} style={style.vbill1}>
                                                            <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTitleText'} preset={Text.preset.h7B} style={style.textBillColor}>x{d.qty}</Text>
                                                        </View>
                                                        <View accessible={true} accessibilityLabel={'CashierDetailScreenBillProductNameView'} style={style.vbill2}>
                                                            <Text accessible={true} accessibilityLabel={'CashierDetailScreenProductName'} preset={Text.preset.h7B} style={style.textBillColor}>{d.MenuName}</Text>
                                                        </View>
                                                        <View accessible={true} accessibilityLabel={'CashierDetailScreenBillOrderPriceView'} style={style.vbill3}>
                                                            <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillOrderPriceText'} preset={Text.preset.h7B} style={style.textBillColor}>{this.dataSetting.fCurrency} {SGHelperType.addThousandSeparator((d.totalprice).toString())}</Text>
                                                        </View>
                                                    </View>
                                                    {
                                                        d.arrCustomize.map((dt) => {
                                                            return (
                                                                <View accessible={true} accessibilityLabel={'CashierDetailScreenBillCustomizationView'} style={style.vbill} key={SGHelperType.getGUID()}>
                                                                    {/* <View accessible={true} accessibilityLabel={'CashierDetailScreenBillCustomization2View'} style={style.vbill1}>
                                                                    </View> */}
                                                                    {/* angka */}
                                                                    <View accessible={true} accessibilityLabel={'CashierDetailScreenBillCustomizeNameView'} style={style.vbill1}>
                                                                        <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTitleText'} preset={Text.preset.h7} style={style.textBillColor}>x{dt.qty}</Text>
                                                                    </View>
                                                                    {/* kustomisasi */}
                                                                    <View accessible={true} accessibilityLabel={'CashierDetailScreenBillCustomizeNameView'} style={style.vbill2}>
                                                                        <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillCustomizeNameText'} preset={Text.preset.h7} style={style.textBillColor}>{dt.nameCustomize}</Text>
                                                                    </View>
                                                                    {/* harga */}
                                                                    <View accessible={true} accessibilityLabel={'CashierDetailScreenBillCustomizePriceView'} style={style.vbill3}>
                                                                        <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillCustomizePriceText'} preset={Text.preset.h7} style={style.textBillColor}>{this.dataSetting.fCurrency} {SGHelperType.addThousandSeparator((dt.totalprice).toString())}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            )
                                        })
                                    }

                                </View>
                            </View>
                        </View>

                    </ScrollView>
                    : <View style={{ flex: 1 }}></View>}

                <View style={style.footerPrice}>
                    {(this.dataSetting.fShowTax === 'Y' || this.dataSetting.fShowService === 'Y') &&
                        <View style={style.billView}>
                            {/* sub-total */}

                            <View accessible={true} accessibilityLabel={'CashierDetailScreenBillBottomView'} style={style.vbill} key={SGHelperType.getGUID()}>
                                <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalView'} style={style.vbill2}>
                                    <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalText'} preset={Text.preset.h7} style={style.textBillColor}>{SGLocalize.translate('requestBillScreen.LabelSubTotal')}</Text>
                                </View>
                                <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalPriceView'} style={style.vbill4}>
                                    <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalPriceText'} preset={Text.preset.h7} style={style.textBillColor}>{this.dataSetting.fCurrency} {SGHelperType.addThousandSeparator((this.totalPrice.toFixed(0)).toString())}</Text>
                                </View>
                            </View>

                            {/* Services  */}
                            {this.dataSetting.fShowService === 'Y' &&
                                <View accessible={true} accessibilityLabel={'CashierDetailScreenBillBottomView'} style={style.vbill} key={SGHelperType.getGUID()}>
                                    <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalView'} style={style.vbill2}>
                                        <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalText'} preset={Text.preset.h7} style={style.textBillColor}>{SGLocalize.translate('requestBillScreen.LabelService')} {this.dataSetting.fServicePrice}%</Text>
                                    </View>
                                    <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalPriceView'} style={style.vbill3}>
                                        <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalPriceText'} preset={Text.preset.h7} style={style.textBillColor}>{this.dataSetting.fCurrency} {SGHelperType.addThousandSeparator((this.servicePrice.toFixed(0)).toString())}</Text>
                                    </View>
                                </View>
                            }

                            {/* Tax  */}
                            {this.dataSetting.fShowTax === 'Y' &&
                                <View accessible={true} accessibilityLabel={'CashierDetailScreenBillBottomView'} style={style.vbill} key={SGHelperType.getGUID()}>
                                    <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalView'} style={style.vbill2}>
                                        <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalText'} preset={Text.preset.h7} style={style.textBillColor}>{SGLocalize.translate('requestBillScreen.LabelTax')} {this.dataSetting.fTaxPrice}% </Text>
                                    </View>
                                    <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalPriceView'} style={style.vbill3}>
                                        <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalPriceText'} preset={Text.preset.h7} style={style.textBillColor}>{this.dataSetting.fCurrency} {SGHelperType.addThousandSeparator((this.taxPrice.toFixed(0)).toString())}</Text>
                                    </View>
                                </View>
                            }

                        </View>
                    }

                    {/* total  */}
                    <View accessible={true} accessibilityLabel={'CashierDetailScreenBillBottomView'} style={style.vbill} key={SGHelperType.getGUID()}>
                        <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalView'} style={style.vbill2}>
                            <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalText'} preset={Text.preset.h6B} style={style.totalColor}>{SGLocalize.translate('requestBillScreen.LabelTotal')}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalPriceView'} style={style.vbill4}>
                            <Text accessible={true} accessibilityLabel={'CashierDetailScreenBillTotalPriceText'} preset={Text.preset.h6B} style={style.totalColor}>{this.dataSetting.fCurrency} {SGHelperType.addThousandSeparator((this.finalPrice.toFixed(0)).toString())}</Text>
                        </View>
                    </View>

                    <Button accessible={true} accessibilityLabel={'RequestBillScreenFinishButton'} style={style.button1} label={SGLocalize.translate('requestBillScreen.finishButton')} textPreset={Text.preset.h7B} onPress={this._onCompleteOrderPress.bind(this)}></Button>
                </View>

             </RootView>
         );
     }
 }