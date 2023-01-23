/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView as View, SGText as Text, SGScrollView as ScrollView, SGRootView as RootView, SGImage as Image, SGFlatList as FlatList, SGIcon as Icon } from '../../../core/control';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import MenuCategoryList from '../../container_V2/MenuCategoryList';
import SmallProductOrderMenuCard from '../../container_V2/SmallProductOrderMenuCard';
import { FABMenuList } from '../../component_V2/FABMenuList';
import { tbVOrderMenuAPI } from '../../api/tbVOrderMenuAPI';
import { VRestoProfileAPI } from '../../api/VRestoProfileAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';


export class OrderMenuListScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        w = w;
        return StyleSheet.create({
            v1: { flex: 1, backgroundColor: "white",width:w },
            v2: { height: w * 0.13, width: w, backgroundColor: 'white' },
            v3: { width: w, height: w * 0.1, flexDirection: 'row', backgroundColor: 'white', justifyContent: 'flex-start', paddingLeft: 5 * p },
            v3_1: { flexDirection: 'row', paddingLeft: 2 * p },
            icon: { color: "#FBB833", marginHorizontal: 0 },
            icon2: { color: '#E24444', marginVertical: 0 },
            vThrowWHP: { width: w, padding: p },
            containerView1: { width: w, height: w * 0.3, resizeMode: 'cover', borderRadius: 0, marginVertical: 0, backgroundColor: "white", justifyContent: 'flex-start' },
            vButton: { position: 'absolute', bottom: w * 0.05, flexDirection: 'row', width: w },
            vfab: { width: w, flex: 1, position: 'absolute', bottom: 0, justifyContent: 'center' },
            fab: { width: w, padding: p },
            ribbonHeader: { marginTop: -p, marginBottom: -2 * p },
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
        this.state = { selectedCategoryIndex: 0 };
        this.dataTableID = this.props.route.params.fID;
        this.restoKey = this.props.route.params.restoKey;
        this.dataCategory = [];
        this.tempProduct = [];
        this.dataProduct = [];
        this.total = [];
        this.doneRenderData = false;
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: false,
            headerBackTitle: "Back",
        });
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }
    async _callBackForceUpdate() {
        await this._onRefreshAllItem();
    }
    checkAPIBatchStatusAllDone() {
        this.doneRenderData = true;
        this._renderCategoryFirstIndex();
        this.forceUpdate();

    }
    async _onRefreshAllItem() {
        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

        this.baseAddAPIParallel('getRestoHomeProfile', (async (v1) => {   return VRestoProfileAPI.getRestoHomeProfile(v1) }).bind(this,this.restoKey), ((v) => {
            this.profileResto = v 
        }).bind(this), null); 
        this.baseAddAPIParallel('searchCategoryMenuTabVisitor', (async (v1) => {return tbVOrderMenuAPI.searchCategoryMenuTabVisitor(v1) }).bind(this,this.restoKey), ((v) => {
            this.dataCategory = v 
        }).bind(this), null);  
        this.baseAddAPIParallel('searchProductListVisitor', (async (v1) => {return tbVOrderMenuAPI.searchProductListVisitor(v1) }).bind(this,this.restoKey), ((v) => {
            this.tempProduct = v 
        }).bind(this), null); 
        this.baseAddAPIParallel('SearchTotalOrderVisitor', (async (v1) => {return tbVOrderMenuAPI.SearchTotalOrderVisitor(v1) }).bind(this,this.dataTableID), ((v) => {
            this.total = v 
            console.log(this.total);
            console.log(this.total.length)
        }).bind(this), null);
        this.baseRunAPIParallel();    
 
    }

    _renderCategoryFirstIndex() {
        this.dataCategorySelected = this.dataCategory[this.state.selectedCategoryIndex].fID;
        this.dataProduct = [];
        var flags = [];
        for (var i = 0; i < this.tempProduct.length; i++) {
            if (this.tempProduct[i].categoryID == this.dataCategorySelected) {
                if (flags[this.tempProduct[i].fID]) continue;
                flags[this.tempProduct[i].fID] = true;
                this.dataProduct.push(this.tempProduct[i]);
            }
        }
    }

    _onCategoryPress(data, index) {
        this.state.selectedCategoryIndex = index;
        this.dataProduct = [];
        var flags = [];
        for (var i = 0; i < this.tempProduct.length; i++) {
            if (this.tempProduct[i].categoryID == data.fID) {
                if (flags[this.tempProduct[i].fID]) continue;
                flags[this.tempProduct[i].fID] = true;
                this.dataProduct.push(this.tempProduct[i]);
            }
        }
        this.forceUpdate();
    }

    _onProductPress(data) {
        SGHelperNavigation.navigatePush(this.props.navigation, "AddChoosenOrder", { fID: data, dataTableID: this.dataTableID, restoKey: this.restoKey, callback: this._callBackForceUpdate.bind(this) });
    }

    _onFABMenuListPress() {
        SGHelperNavigation.navigatePop(this.props.navigation, { fID: this.dataTableID, restoKey: this.restoKey });
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        console.log(this.dataTableID);
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'OrderMenuListScreenRootView'} style={style.v1}>

                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <RibbonHeader style={style.ribbonHeader} goldTheme borderTopOff imageSetting={this.imageSetting} title={SGLocalize.translate('orderMenuListScreen.ListMenu')} ribbonWidth={0.35}></RibbonHeader>

                <Image accessible={true} accessibilityLabel={'MenuListScreenImage'} style={style.containerView1} source={{ uri: this.doneRenderData === true ? this.profileResto['fContent' + this._language.toUpperCase()].fStoreBackgroundImageJSON[0][this.imageSetting].uri : '' }}></Image>
                {this.doneRenderData === true ?
                    <View style={style.v1}>
                        <View accessible={true} accessibilityLabel={'MenuListScreenMenuCatView'} style={style.v2}>
                            <FlatList accessible={true} accessibilityLabel={'MenuListScreenMenuCatList'} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} horizontal showsHorizontalScrollIndicator={false} data={this.dataCategory} renderItem={({ item, index }) => {
                                return (
                                    <MenuCategoryList accessible={true} accessibilityLabel={'MenuListScreenMenuCatItem'} selected={this.state.selectedCategoryIndex === index ? true : false} style={style.vThrowWHP} data={item} language={this._language} onPress={this._onCategoryPress.bind(this, item, index)}></MenuCategoryList>
                                );
                            }} keyExtractor={item => item.fID}>
                            </FlatList>
                        </View>
                        {this.dataCategory.length !== 0 &&
                            <View style={style.v3}>
                                <View style={style.v3_1}>
                                    <Icon accessible={true} accessibilityLabel={'MenuListScreenCardCRIcon'} name={Icon.Icon.chefHat} preset={Icon.preset.h5} style={style.icon}></Icon>
                                    <Text preset={Text.preset.h7B} style={style.text}>{SGLocalize.translate('orderMenuListScreen.RecommendationText')}</Text>
                                </View>
                                <View style={style.v3_1}>
                                    <Icon accessible={true} accessibilityLabel={'MenuListScreenCardCRIcon'} name={Icon.Icon.chilli1} preset={Icon.preset.h5} style={style.icon2}></Icon>
                                    <Text preset={Text.preset.h7B} style={style.text}>{SGLocalize.translate('orderMenuListScreen.SpicyText')}</Text>
                                </View>
                            </View>
                        }
                        <FlatList accessible={true} accessibilityLabel={'MenuListScreenProductOMList'} style={{ flex: 1 }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'flex-start' }} data={this.dataProduct} renderItem={({ item }) => {
                            return (
                                <SmallProductOrderMenuCard accessible={true} accessibilityLabel={'MenuListScreenProductOMCard'} style={style.vThrowWHP} dataStore={this.profileResto} imageSetting={this.imageSetting} data={item} language={this._language} onPress={this._onProductPress.bind(this, item.fID)}></SmallProductOrderMenuCard>
                            );
                        }} keyExtractor={item => item.fID}>
                        </FlatList>
                        <View style={{width:w,height:w*0.1,backgroundColor:'transparent'}}></View>
                    </View>
                    : <View style={{ flex: 1 }}></View>}
                <View accessible={true} accessibilityLabel={'OrderMenuListScreenFABView'} style={style.vfab}>
                    <FABMenuList accessible={true} accessibilityLabel={'OrderMenuListScreenFABMenuList'} style={style.fab} onPress={this._onFABMenuListPress.bind(this)} total={this.total.length != 0 ? this.total[0].totalOrder : 0}></FABMenuList>
                </View>
            </RootView>
        );
    }
}
