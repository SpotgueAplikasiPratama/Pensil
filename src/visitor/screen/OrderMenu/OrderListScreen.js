
/**
 * Version 1.2.0
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView as View, SGText as Text, SGScrollView as ScrollView, SGRootView as RootView, SGDialogBox, SGFlatList as FlatList } from '../../../core/control';
import WaiterHeader from '../../container_V2/WaiterHeader';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { FAB } from '../../component_V2/FAB';
import ProductOrderListCard from '../../container_V2/ProductOrderListCard';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { tbVOrderMenuAPI } from '../../api/tbVOrderMenuAPI';
import { VRestoProfileAPI } from '../../api/VRestoProfileAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';


export class OrderListScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        w = w;
        return StyleSheet.create({
            v1: { flex: 1, backgroundColor: "white",width:w },
            vcomp: { width: w - 2 * p, padding: p },
            vThrowWHP: { width: w, height: h, padding: p },
            vThrowWHP1: { width: w * 0.84, height: h, padding: p },
            vFab: { width: w, justifyContent: 'space-around', flexDirection: 'row', },
            fab: { width: w * 0.15, height: h, padding: p },
            ribbonHeader: { marginTop: -p, marginBottom: -2 * p },
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
        this.dataOrder = [];
        this.dataStore = [];
        this.checkHasNewOrder = false;
        this.state = { refresh: false };
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: false,
            headerBackTitle: "Back",
        });
    }

    async componentDidMount() {
        await this._getAllOrder();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._getAllOrder();
        });
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
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

    _checkHasNewOrder() {
        for (var i = 0; i < this.dataOrder[0].fOrderGroup.Count; i++) {
            for (var j = 0; j < this.dataOrder[0].fOrderGroup[i].fOrderDetail.Count; j++) {
                if (this.dataOrder[0].fOrderGroup[i].fOrderDetail[j].fStatus == "neworder") {
                    this.checkHasNewOrder = true;
                }
            }
        }
    }

    async _callBackForceUpdate() {
        await this._getAllOrder();
    }
    checkAPIBatchStatusAllDone() {
        this._countTotalPrice(); 
        // SGDialogBox.hideDialogBox(this.dbID2, true)
        this.forceUpdate();

    }
    async _getAllOrder() {
        // this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'))
        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

        this.baseAddAPIParallel('searchAllOrderDetailVisitorByTableKey', (async (v1) => {   return tbVOrderMenuAPI.searchAllOrderDetailVisitorByTableKey(v1) }).bind(this,this.dataTableID), ((v) => {
            this.dataOrder = v 
        }).bind(this), null); 
        this.baseAddAPIParallel('getRestoHomeProfile', (async (v1) => {   return VRestoProfileAPI.getRestoHomeProfile(v1) }).bind(this,this.restoKey), ((v) => {
            this.profileResto = v 
        }).bind(this),  null); 
            
        this.baseRunAPIParallel();    
    }
    _onFABAddOrderPress() {
        SGHelperNavigation.navigatePush(this.props.navigation, "OrderMenuList", { fID: this.dataTableID, restoKey: this.restoKey });
    }
    _onFABBillRequestPress() {
        SGHelperNavigation.navigatePush(this.props.navigation, "RequestBill", { fID: this.dataTableID, restoKey: this.restoKey });
    }

    async _onFABConfirmOrderPress() {
        try {
            this.dbID3 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
            await tbVOrderMenuAPI.updateConfirmOrderVisitor(this.dataOrder[0]);
            SGDialogBox.hideDialogBox(this.dbID3, true)
            SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("AlertMessage.SuccessConfirmOrderMenu"), SGLocalize.translate("AlertMessage.OK"), async () => { await this._callBackForceUpdate(); }, true)
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID3, true)
            SGHelperErrorHandling.Handling(error,this._onFABConfirmOrderPress.bind(this))
            // SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("AlertMessage.FailConfirmOrderMenu"), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
        }
    }

    async _onCancelOrderPress(data, comment) {
        data.fCancelComment = comment;
        if (data.fStatus !== "cancelled") {
            try {
                await tbVOrderMenuAPI.cancelOrderDetailByVisitor(data);
                SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("AlertMessage.SuccessCancelOrderMenu"), SGLocalize.translate("AlertMessage.OK"), async () => { await this._callBackForceUpdate(); }, true)
            } catch (error) {
                SGHelperErrorHandling.Handling(error,this._onCancelOrderPress.bind(this,data,comment))
                // SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("AlertMessage.FailCancelOrderMenu"), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
            }
        } else {
            SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('AlertMessage.FailCancelOrderMenu'), SGLocalize.translate("AlertMessage.Cancel"), () => { }, true)
        }

    }


    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'AddOrderScreenRootView'} style={style.v1}>

                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>

                <RibbonHeader style={style.ribbonHeader} goldTheme borderTopOff imageSetting={this.imageSetting} title={SGLocalize.translate('orderMenuListScreen.listOrder')} ribbonWidth={0.35}></RibbonHeader>
                {/* Header */}
                {this.dataOrder.length != 0 &&
                    <View style={style.v1}>
                        <WaiterHeader accessible={true} accessibilityLabel={'AddOrderScreenWaiterHeader'} imageSetting={this.imageSetting} style={style.vcomp} data={this.dataOrder} dataStore={this.profileResto} language={this._language} priceTotal={this.totalPrice} ></WaiterHeader>
                        <FlatList refreshing={this.state.refresh} onRefresh={this._getAllOrder.bind(this)} initialNumToRender={50} accessible={true} accessibilityLabel={'AddOrderScreenItemList'} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.dataOrder[0].fOrderGroup} renderItem={({ item }) => {
                            return (
                                <ProductOrderListCard accessible={true} accessibilityLabel={'AddOrderScreenProductCard'} imageSetting={this.imageSetting} dataStore={this.profileResto} data={item} style={style.vcomp} language={this._language} onCancelPress={this._onCancelOrderPress.bind(this)}></ProductOrderListCard>
                            );
                        }} keyExtractor={item => item.fID}>
                        </FlatList>
                        {this.dataOrder[0].fStatus === 'neworder' &&
                            <View accessible={true} accessibilityLabel={'AddOrderScreenBottomView'} style={style.vFab}>
                                <FAB accessible={true} accessibilityLabel={'AddOrderScreenFABBill'} style={style.vThrowWHP} type='bill' onPress={this._onFABBillRequestPress.bind(this)} smallIcon></FAB>
                                <FAB accessible={true} accessibilityLabel={'AddOrderScreenFABCheck'} style={style.vThrowWHP} type='check' onPress={this._onFABConfirmOrderPress.bind(this)} smallIcon></FAB>
                                <FAB accessible={true} accessibilityLabel={'AddOrderScreenFABAdd'} style={style.vThrowWHP} type='add' onPress={this._onFABAddOrderPress.bind(this)} smallIcon></FAB>
                            </View>
                        }
                    </View>
                }
            </RootView>
        );
    }
}
