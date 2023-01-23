
/**
 * Version 1.2.0
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView as View, SGText as Text, SGImage as Image, SGScrollView as ScrollView, SGRootView as RootView, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGTextInput as TextInput, SGButton as Button, SGSwitch as Switch, SGDialogBox, SGCheckBox as CheckBox } from '../../../core/control';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGFormTextInput, SGFormSwitch } from '../../../core/form';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGLocalize } from '../../locales/SGLocalize';
import image from '../../asset/image';
import { tbVOrderMenuAPI } from '../../api/tbVOrderMenuAPI';
import { DiscountTag } from '../../component_V2/DiscountTag';
import { VRestoProfileAPI } from '../../api/VRestoProfileAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { VisitorHelper } from '../../helper/VisitorHelper';
import Core from '../../../core/core';

export class AddChoosenOrderScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w, flex: 1, backgroundColor: "white" },
            v2: { width: w, height: (w * 0.925) * 9 / 16, justifyContent: 'center', alignItems: 'center', backgroundColor: "#e9e9e9", marginTop: 0, borderRadius: 0 },
            v3: { width: w * 0.9, flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 * p },
            v4: { width: w * 0.9, justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 2 * p },
            v4_1: { flexDirection: 'row', justifyContent: 'space-between', width: w * 0.9 },
            v5: { width: w, flexDirection: 'row', alignItems: 'center', marginVertical: 3 * p },

            v5_1: { width: w * 0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },

            v6: { width: w * 0.9, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 * p },
            
            v6_1: { width: w * 0.58, flexDirection: 'row', justifyContent: 'flex-start' },
            v6_2: { width: w * 0.1, justifyContent: 'flex-start' },
            v7: { width: (w * 0.125), height: w * 0.125, borderRadius: (((w * 0.125) + (w * 0.125)) / 2), justifyContent: 'center', alignItems: 'center', },
            v7_overlay: { width: (w * 0.125), height: w * 0.125, borderRadius: (((w * 0.125) + (w * 0.125)) / 2), backgroundColor: 'rgba(255,255,255,0.5)' },
            v7_notAvailable: { width: (w * 0.1), height: w * 0.1, borderRadius: (((w * 0.1) + (w * 0.1)) / 2), },

            v8: { width: w, height: w * 0.1, backgroundColor: '#181818', borderBottomRightRadius: 2.5 * p, borderBottomLeftRadius: 2.5 * p },
            v9: { width: w * 0.12, height: w * 0.1, backgroundColor: "white", justifyContent: 'center', alignItems: 'center', borderRadius: 2 * p, marginBottom: 2 * p, borderWidth: 0.1 * p, borderColor: 'lightgrey' },

            v10: { width: w, flexDirection: 'row', justifyContent: 'flex-start' },
            v11: { width: w, borderTopWidth: p * 1, borderBottomWidth: p * 1, borderTopColor: '#F5F5F5', borderBottomColor: '#F5F5F5' },
            v12: { flexDirection: 'row', width: w, justifyContent: 'space-between', paddingVertical: p, backgroundColor: 'rgba(242,181,62, 0.05)', paddingHorizontal: 0.05 * w, borderBottomColor: 'rgba(237,237,237,1)', borderBottomWidth: 0.2 * p, borderBottomWidth: 0.2 * p },

            top: { width: w, padding: p },
            vThrowWHP: { width: w - 2 * p, padding: p },
            containerView1: { width: w, height: w * 0.15, resizeMode: 'cover', borderRadius: 0, marginVertical: 0, backgroundColor: "white", justifyContent: 'flex-start' },
            iconView: { flexDirection: 'row' },
            priceView: { flexDirection: 'row', justifyContent: 'flex-start', width: 0.9*w },
            icon: { color: '#DCA239', marginHorizontal: 0 },
            icon2: { color: "#E24444", marginHorizontal: 0 },
            buttonMinPlus: { resizeMode: 'cover', width: w * 0.1, height: w * 0.1, marginHorizontal: 2 * p },
            text: { alignSelf: 'flex-start', color: "#181818", width: w * 0.7 },
            textQty: { alignSelf: 'flex-start', color: "#181818" },
            text2: { alignSelf: 'flex-start', marginLeft: 10 * p, marginVertical: 2 * p, color: "black" },
            text3: { alignSelf: 'flex-start', color: "grey" },
            button: {  color: "white",  borderRadius: 2 * p, minWidth: w * 0.375,  justifyContent: 'center', alignItems: 'center', marginTop:3*p },
            textBasePrice: { marginHorizontal: 0, alignSelf: 'flex-end', color: "#d6b600" },
            textPrice1: { alignSelf: 'flex-start', color: "#181818" },
            textPrice2: { textDecorationLine: 'line-through', textDecorationColor: "#d6b600", color: "#d6b600" },
            textPrice3: { paddingLeft: p, color: "#DF3D3D" },
            discountTag: { position: 'absolute', top: 19, right: 44, zIndex: 999 },
            popView: { width: w, height: h, padding: p },
            vfab: { width: w, position: 'absolute', bottom: 0, backgroundColor: "white", borderTopRightRadius: 3 * p, borderTopLeftRadius: 3 * p },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.productID = this.props.route.params.fID;
        this.dataTableID = this.props.route.params.dataTableID;
        this.restoKey = this.props.route.params.restoKey;
        this.productData = [];
        this.commentData = [''];
        this.checkPullData = false;
        this.Alert = [2];
        this.pickCount = [];
        this.AlertCount = 0;
        this.buttondisabled = false;
        this.state = { quantity: 1, value: false }
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: "Add Choosen Menu",
            headerBackTitle: "Back",
        });
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }

    checkAPIBatchStatusAllDone() {
        this.checkPullData = true;
        SGDialogBox.hideDialogBox(this.dbID2, true);
        this.forceUpdate();

    }
    async _onRefreshAllItem() {
 
        // this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
        this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting')); 
        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this), (()=>{ this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));}).bind(this));
        this.baseAddAPIParallel('getRestoHomeProfile', (async (v1) => { return VRestoProfileAPI.getRestoHomeProfile(v1) }).bind(this,this.restoKey), ((v) => {
            this.profileResto = v 
        }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID2, true)}));
        this.baseAddAPIParallel('searchOrderMenuProductDetailVisitor', (async (v1) => { return tbVOrderMenuAPI.searchOrderMenuProductDetailVisitor(v1) }).bind(this,this.productID), ((v) => {
            this.productData = v 
            this._pickdataInitialize();
            }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID2, true)}));
        this.baseRunAPIParallel();       
    }

    _pickdataInitialize() {
        for (let index = 0; index < this.productData[0].fGroupOfCustomize.length; index++) {
            this.pickCount[index] = 0;
            this.Alert[index] = 2;
        }
    }

    _onMinusPress() {
        if (this.state.quantity > 1) {
            this.state.quantity = this.state.quantity - 1;
            this.commentData.pop('');
            this.forceUpdate()
        }
    }

    _onAddPress() {
        this.state.quantity = this.state.quantity + 1;
        this.commentData.push('');
        this.forceUpdate()
    }

   _onCheckPress(data, i) {
        if (data.fSelect == 'N') {
            data.fSelect = 'Y';
            this.pickCount[i]++;
        } else {
            data.fSelect = 'N';
            this.pickCount[i]--;
        }

        if (this.pickCount[i] > this.productData[0].fGroupOfCustomize[i].fMax) {
            if (this.Alert[i] === 2) {
                this.AlertCount++;
            }

            if (this.Alert[i] === 1 || this.Alert[i] === 2) {
                this.Alert[i] = 0;
            }
        } else if (this.pickCount[i] < this.productData[0].fGroupOfCustomize[i].fMin) {
            if (this.Alert[i] === 2) {
                this.AlertCount++;
            }

            if (this.Alert[i] === 0 || this.Alert[i] === 2) {
                this.Alert[i] = 1;
            }
        } else {
            if (this.Alert[i] === 0 || this.Alert[i] === 1) {
                this.Alert[i] = 2;
                this.AlertCount--;
            }
        }
        if (this.AlertCount === 0) {
            this.buttondisabled = false;
        } else {
            this.buttondisabled = true;
        }
        this.forceUpdate();
    }

    _onInputValue(v, index) {
        this.commentData[index] = v
    }

    _countTotalGroupTotal() {
        var totalGroupPrice = 0;
        if (this.productData[0].productfDiscountPrice === this.productData[0].productfPrice) {
            totalGroupPrice = totalGroupPrice + this.productData[0].productfPrice * this.state.quantity;
        } else {
            totalGroupPrice = totalGroupPrice + this.productData[0].productfDiscountPrice * this.state.quantity;
        }
        if (this.productData[0].fGroupOfCustomize[0] != null) {
            for (var i = 0; i < this.productData[0].fGroupOfCustomize.length; i++) {
                for(var j=0; j< this.productData[0].fGroupOfCustomize[i].fCustomizeJSON.length;j++){
                    if (this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fSelect == 'Y') {
                        if (this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fDiscountPrice === this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fPrice) {
                            totalGroupPrice = totalGroupPrice + (this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fPrice * this.state.quantity)
                        }
                    else {
                        totalGroupPrice = totalGroupPrice + (this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fDiscountPrice * this.state.quantity)
                    }
                }
                }
               
            }
        }
        return totalGroupPrice
    }

    _countSubTotal() {
        var subTotal = 0;
        if (this.productData[0].productfDiscountPrice === this.productData[0].productfPrice) {
            subTotal = subTotal + this.productData[0].productfPrice;
        } else {
            subTotal = subTotal + this.productData[0].productfDiscountPrice;
        }
        if (this.productData[0].fGroupOfCustomize[0] != null) {
            for (var i = 0; i < this.productData[0].fGroupOfCustomize.length; i++) {
                for(var j=0; j< this.productData[0].fGroupOfCustomize[i].fCustomizeJSON.length;j++){
                    if (this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fSelect == 'Y') {
                        if (this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fDiscountPrice === this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fPrice) {
                            subTotal = subTotal + this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fPrice
                        }
                        else {
                            subTotal = subTotal + this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fDiscountPrice
                        }
                    }
                }
            }
        }
        return subTotal
    }

    _onGetSelectCustomize() {
        var tempCustomizeData = []
        if (this.productData[0].fGroupOfCustomize[0] != null) {
            for (var i = 0; i < this.productData[0].fGroupOfCustomize.length; i++) {
                for (let j = 0; j < this.productData[0].fGroupOfCustomize[i].fCustomizeJSON.length; j++) {        
                    if (this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j].fSelect == 'Y') {
                        tempCustomizeData.push(this.productData[0].fGroupOfCustomize[i].fCustomizeJSON[j])
                    }
                }
            }
        }
        return (tempCustomizeData);
    }

    _onGetSelectCustomizeKey() {
        var customizationJSON = this._onGetSelectCustomize();
        var customizeKey = [];
        if (this.productData[0].fGroupOfCustomize[0] != null) {
            if (customizationJSON.length !== 0) {
                for (var i = 0; i < customizationJSON.length; i++) {
                    customizeKey.push(customizationJSON[i].fID)
                }
                return customizeKey;
            }
            else return customizeKey
        }
    }

    _onGetSelectCustomizeKey() {
        var customizationJSON = this._onGetSelectCustomize();
        var customizeKey = [];
        console.log(this.productData[0]);
        if (this.productData[0].fGroupOfCustomize[0] != null) {
            if (customizationJSON.length !== 0) {
                for (var i = 0; i < customizationJSON.length; i++) {
                    customizeKey.push(customizationJSON[i].fID)
                }
                return customizeKey;
            }
            else return customizeKey
        }
    }
    
    async _onAddItem() {
        var productGroupTotal = this._countTotalGroupTotal();
        var productsubTotal = this._countSubTotal();
        var customizationJSON = this._onGetSelectCustomize();
        var selectedCustomize = this._onGetSelectCustomizeKey();
        var data = {
            OrderTableKey: this.dataTableID,
            fStoreKey: this.restoKey,
            fGroupTotal: productGroupTotal,
            fproductSubTotal: productsubTotal,
            fOrderCount: this.state.quantity,
            fProductJSON: this.productData,
            commentData: this.commentData,
            fCustomizationKey: selectedCustomize,
            fCustomizationJSON: customizationJSON
        };
        try {
            this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Processing"))
            await tbVOrderMenuAPI.addOrderItemVisitor(data)
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate('addChoosenOrderMenuScreen.alertOrderSuccessText'), SGLocalize.translate("AlertMessage.OK"), () => { SGHelperNavigation.navigatePop(this.props.navigation); this.props.route.params.callback(), true })
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGHelperErrorHandling.Handling(error,this._onMandatory.bind(this,data))
        }
    }


    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var language = (this._language).toUpperCase();
      
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'ProductDetailScreenRootView'} style={style.v1}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                {this.checkPullData == true ?
                    <View style={style.v1}>
                        <ScrollView accessible={true} accessibilityLabel={'ProductDetailScreenScrollView'} style={{ flex: 1, backgroundColor: 'white', marginBottom: 15 * p }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }}>

                            {/* {this.productData[0].productfDiscountPrice !== this.productData[0].productfPrice && <DiscountTag accessible={true} accessibilityLabel={'ClothToBuyCardDiscountTag'} normalPrice={this.productData[0].productfPrice} promoPrice={this.productData[0].productfDiscountPrice} style={style.discountTag}></DiscountTag>} */}

                            <Image accessible={true} accessibilityLabel={'ProductDetailScreenProductImage'} source={{ uri: this.productData[0]["productfContent" + language].fImageJSON[0][this.imageSetting].uri }} style={style.v2} ></Image>


                            <View accessible={true} accessibilityLabel={'ProductDetailScreenContainerView2'} style={style.v4}>
                                <View style={style.v4_1}>
                                    <Text accessible={true} accessibilityLabel={'ProductDetailScreenProductName'} preset={Text.preset.h4B} style={style.text}>{this.productData[0]["productfContent" + language].fProductName}</Text>
                                    {this.productData[0].fRecommendationChef === 'Y' ?
                                        (<View accessible={true} accessibilityLabel={'ProductDetailScreenIconCRView'} style={style.iconView}>
                                            {this.productData[0].fRecommendationChef === 'Y' ? (<Icon accessible={true} accessibilityLabel={'ProductDetailScreenIconChefHat'} style={style.icon} name={Icon.Icon.chefHat} preset={Icon.preset.h4}></Icon>) : (null)}

                                            <View accessible={true} accessibilityLabel={'ProductDetailScreenCRSpicyLevelView'}>
                                                {this.productData[0].fSpicyLevel === 'SL1' ? (<Icon accessible={true} accessibilityLabel={'ProductDetailScreenCRChilli1'} style={style.icon} name={Icon.Icon.chilli1} preset={Icon.preset.h4}></Icon>) : (null)}
                                                {this.productData[0].fSpicyLevel === 'SL2' ? (<Icon accessible={true} accessibilityLabel={'ProductDetailScreenCRChilli2'} style={style.icon} name={Icon.Icon.chilli2} preset={Icon.preset.h4}></Icon>) : (null)}
                                                {this.productData[0].fSpicyLevel === 'SL3' ? (<Icon accessible={true} accessibilityLabel={'ProductDetailScreenCRChilli3'} style={style.icon} name={Icon.Icon.chilli3} preset={Icon.preset.h4}></Icon>) : (null)}
                                            </View>

                                        </View>) :
                                        (<View accessible={true} accessibilityLabel={'ProductDetailScreenIconView'} style={style.iconView}>
                                            <View accessible={true} accessibilityLabel={'ProductDetailScreenSpicyLevelView'}>
                                                {this.productData[0].fSpicyLevel === 'SL1' ? (<Icon accessible={true} accessibilityLabel={'ProductDetailScreenChilli1'} style={style.icon} name={Icon.Icon.chilli1} preset={Icon.preset.h4}></Icon>) : (null)}
                                                {this.productData[0].fSpicyLevel === 'SL2' ? (<Icon accessible={true} accessibilityLabel={'ProductDetailScreenChilli2'} style={style.icon} name={Icon.Icon.chilli2} preset={Icon.preset.h4}></Icon>) : (null)}
                                                {this.productData[0].fSpicyLevel === 'SL3' ? (<Icon accessible={true} accessibilityLabel={'ProductDetailScreenChilli3'} style={style.icon} name={Icon.Icon.chilli3} preset={Icon.preset.h4}></Icon>) : (null)}
                                            </View>

                                        </View>)}
                                </View>
                                <Text accessible={true} accessibilityLabel={'ProductDetailScreenShortDesc'} preset={Text.preset.h7} numberOfLines={2} style={style.text3}>{this.productData[0]["productfContent" + language].fShortDescription}</Text>
                            </View>

                            <View accessible={true} accessibilityLabel={'ProductDetailScreenContainerView'} style={style.v3}>
                                {this.productData[0].productfDiscountPrice !== this.productData[0].productfPrice ?
                                    <View accessible={true} accessibilityLabel={'ProductDetailScreenPriceView'} style={style.priceView}>
                                        <Text accessible={true} accessibilityLabel={'ProductDetailScreenPriceText'} style={style.textPrice2} preset={Text.preset.h5B}>{this.currency} {SGHelperType.addThousandSeparator((this.productData[0].productfPrice).toString())}</Text>
                                        <Text accessible={true} accessibilityLabel={'ProductDetailScreenDiscountPriceText'} style={style.textPrice3} preset={Text.preset.h5B}>{this.currency} {SGHelperType.addThousandSeparator((this.productData[0].productfDiscountPrice).toString())}</Text>
                                    </View> :
                                    (<Text accessible={true} accessibilityLabel={'ProductDetailScreenPriceText2'} style={style.textBasePrice} preset={Text.preset.h4B}>{this.currency} {SGHelperType.addThousandSeparator((this.productData[0].productfPrice).toString())}</Text>)}
                            </View>

                            <View style={style.v11}>
                                {
                                    this.productData[0].fGroupOfCustomize[0] != null &&
                                    this.productData[0].fGroupOfCustomize.map((data, index) => {
                                        return (
                                            <View style={style.v11}>
                                                <View style={style.v12}>
                                                    <Text preset={Text.preset.h5B}>{data.fLabel}</Text>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View>
                                                            <Text preset={Text.preset.h6B}>Min</Text>
                                                            <Text preset={Text.preset.h6}>{data.fMin}</Text>
                                                        </View>
                                                        <View>
                                                            <Text preset={Text.preset.h6B}>Max</Text>
                                                            <Text preset={Text.preset.h6}>{data.fMax}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={style.line} />
                                                <View hidden={this.Alert[index] === 2 ? true : false} style={{ width: w, paddingVertical: p, backgroundColor: '#ffcc00' }}>
                                                    <Text preset={Text.preset.h6B} style={{ color: '#cc3300' }} >
                                                        {
                                                            this.Alert[index] === 0
                                                                ?
                                                                ('Max: ' + data.fMax)
                                                                :
                                                                ('Min: ' + data.fMin)
                                                        }
                                                    </Text>
                                                </View>
                                                {
                                                    data.fCustomizeJSON.map((customize, i) => {
                                                        return (
                                                            <View accessible={true} accessibilityLabel={'ProductDetailScreenGUIDView'} key={SGHelperType.getGUID()} style={style.v6}>
                                                                <View accessible={true} accessibilityLabel={'ProductDetailScreenCustomizeView'} style={style.v6_1}>
                                                                    {customize.isAvailable === 'Y' &&
                                                                        <Image accessible={true} accessibilityLabel={'ProductDetailScreenCustomizeImage'} source={{ uri: customize["fContent" + language].fImageJSON[0][this.imageSetting].uri }} style={style.v7} resizeMode="contain"></Image>
                                                                    }
                                                                    {customize.isAvailable === 'N' &&
                                                                        <Image accessible={true} accessibilityLabel={'ProductDetailScreenCustomizeImage'} source={{ uri: customize["fContent" + language].fImageJSON[0][this.imageSetting].uri }} style={style.v7} resizeMode="contain">
                                                                            <View style={style.v7_overlay}>
                                                                                <Image accessible={true} accessibilityLabel={'ProductDetailScreenCustomizeImageNotAvailable'} source={{ uri: image.notAvailableLogo[this.imageSetting].url }} style={style.v7_notAvailable} resizeMode="contain"></Image>
                                                                            </View>
                                                                        </Image>
                                                                    }
                                                                    <View accessible={true} accessibilityLabel={'ProductDetailScreenCustomizeTextView'}>
                                                                        <Text accessible={true} accessibilityLabel={'ProductDetailScreenCustomizeName'} preset={Text.preset.h6B} style={style.text} >{customize["fCustomizeName" + language]}</Text>
                                                                        {customize.fDiscountPrice !== customize.fPrice ?
                                                                            <View accessible={true} accessibilityLabel={'ProductDetailScreenCustomizePriceView'} style={style.priceView}>
                                                                                <Text accessible={true} accessibilityLabel={'ProductDetailScreenCustomizePriceText'} style={style.textPrice2} preset={Text.preset.h6}>{this.currency} {SGHelperType.addThousandSeparator((customize.fPrice).toString())}</Text>
                                                                                <Text accessible={true} accessibilityLabel={'ProductDetailScreenCustomizeDiscountPriceText'} style={style.textPrice3} preset={Text.preset.h6}>{this.currency} {SGHelperType.addThousandSeparator((customize.fDiscountPrice).toString())}</Text>
                                                                            </View>
                                                                            :
                                                                            (<Text accessible={true} accessibilityLabel={'ProductDetailScreenCustomizePriceText2'} style={style.textPrice1} preset={Text.preset.h6}>{this.currency} {SGHelperType.addThousandSeparator((customize.fPrice).toString())}</Text>)}
                                                                    </View>
                                                                </View>
                                                                {customize.isAvailable === 'Y' &&
                                                                    <CheckBox accessible={true} accessibilityLabel={'ProductDetailScreenCheckBox'} textPreset={Text.preset.h3} shadow onValueChange={this._onCheckPress.bind(this, customize, index)} value={customize.fSelect === 'Y' ? true : false} style={style.checkBox} ></CheckBox>
                                                                }
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </View>

                            <View accessible={true} accessibilityLabel={'ProductDetailScreenButtonView'} style={style.v5}>
                                <TouchableOpacity onPress={this._onMinusPress.bind(this)}>
                                    <View style={style.v9} shadow>
                                        <Icon accessible={true} accessibilityLabel={'ProductDetailScreenMinus'} style={style.icon} name={Icon.Icon.minusCircle} preset={Icon.preset.h5}></Icon>
                                    </View>
                                </TouchableOpacity>
                                <View accessible={true} accessibilityLabel={'ProductDetailScreenQuantityView'} style={style.v5_1}>
                                    <Text accessible={true} accessibilityLabel={'ProductDetailScreenQuantityText'} preset={Text.preset.h5B} style={style.textQty}>{this.state.quantity}</Text>
                                </View>
                                <TouchableOpacity onPress={this._onAddPress.bind(this)} >
                                    <View style={style.v9} shadow>
                                        <Icon accessible={true} accessibilityLabel={'ProductDetailScreenPlus'} style={style.icon} name={Icon.Icon.plusCircle} preset={Icon.preset.h5}></Icon>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {
                                this.commentData.map((data, index) => {
                                    return (
                                        <SGFormTextInput style={{ color: 'black' }} maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'ProductDetailScreenTextInput'} key={SGHelperType.getGUID()} dataType={TextInput.dataType.text} label={SGLocalize.translate('addChoosenOrderMenuScreen.LabelItem') + ' ' + (index + 1)} placeholder={SGLocalize.translate('addChoosenOrderMenuScreen.NotePlaceholder')} onValueChange={(v) => this._onInputValue(v, index)} value={this.commentData[index]} />
                                    )
                                })
                            }
                             <Button disabled={this.buttondisabled} preset={Button.preset.green} accessible={true} accessibilityLabel={'ProductDetailScreenButtonAdd'} style={style.button} textPreset={Text.preset.h6B} onPress={this._onAddItem.bind(this)} label={SGLocalize.translate('addChoosenOrderMenuScreen.LabelButtonAdd')}></Button>
                            <View style={{ height: 0.2 * w }} />
                        </ScrollView>
                    </View>
                    : <View style={{ flex: 1 }}></View>}
            </RootView>
        );
    }
}

