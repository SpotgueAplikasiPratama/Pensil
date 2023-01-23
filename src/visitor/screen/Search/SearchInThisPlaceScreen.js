/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 * Verision 1.2.0
 *  1. Leon, 4 May 2021
  - Fix Like, Fix Favorite, Fix Notification
 */
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGScrollView as ScrollView, SGView as View, SGRootView as RootView, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
import { DefaultStoreCard } from '../../container_V2/DefaultStoreCard';
import { DefaultRestoCard } from '../../container_V2/DefaultRestoCard';
import { DefaultPlaceEventCard } from '../../container_V2/DefaultPlaceEventCard';
import { DefaultStorePromoCard } from '../../container_V2/DefaultStorePromoCard';
import { DefaultRestoPromoCard } from '../../container_V2/DefaultRestoPromoCard';
import { SGBaseContainer } from '../../../core/container/SGBaseContainer';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow ,SGHelperErrorHandling} from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { VSearchInThisPlaceAPI } from '../../api/VSearchInThisPlaceAPI';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { tbLookupDAO } from '../../db/tbLookupDAO'
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { DefaultStoreProductCard } from '../../container_V2/DefaultStoreProductCard';
import { DefaultRestoMenuCard } from '../../container_V2/DefaultRestoMenuCard';
import { sortDAO } from '../../db/sortDAO';
import { VisitorHelper } from '../../helper/VisitorHelper';

export class ContentHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 0, borderColor: '#E4E4E4', borderBottomWidth: w * 0.0023 },
            headText: { color: '#000000', marginLeft: p * 4.6 },
            seeMoreText: { color: '#63AEE0' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;

        return (
            <View accessible={true} accessibilityLabel={'ContentHeaderMainView'} style={style.mainContainer}>
                <Text style={style.headText} preset={Text.preset.titleH2B}>{this.props.title}</Text>
                <View accessible={true} style={{ alignSelf: 'flex-end', marginRight: p * 3 }}>
                    <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { searchKeyword: this.props.searchKeyword, buildingKey: this.props.buildingKey })}>
                        <Text accessible={true} accessibilityLabel={'ContentHeaderHeaderText'} preset={Text.preset.titleH4B} style={style.seeMoreText}>{SGLocalize.translate("SearchAllScreen.headerText1")} {SGLocalize.translate("SearchAllScreen.headerText2")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export class SearchInThisPlaceScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#E6E6E6' },
            scrollViewContainer: { width: w },
            scrollViewContainerContent: { padding:p ,width: w, backgroundColor: '#E6E6E6', justifyContent: 'flex-start' },
            storeSliderContainer: { width: w, height: w * 0.608, backgroundColor: 'transparent' },
            restoSliderContainer: { width: w, height: w * 0.6087, backgroundColor: 'transparent' },
            placeEventSliderContainer: { width: w, height: w * 1.014, backgroundColor: 'transparent' },
            storePromoSliderContainer: { width: w, height: w * 1.02, backgroundColor: 'transparent' },
            restoPromoSliderContainer: { width: w, height: w * 1.014, backgroundColor: 'transparent' },
            storeProductSliderContainer: { width: w, height: w * 0.64, backgroundColor: 'transparent' },
            restoMenuSliderContainer: { width: w, height: w * 0.64, backgroundColor: 'transparent' },
            containerView1: { width: w, height: w, padding: p, backgroundColor: 'white' },
        });
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    checkAPIBatchStatusAllDone() {

        this.counterBatch=0
        this.alreadyMount = true;
        this.forceUpdate();

        
    }

    async _onRefreshAllItem() {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

        this.baseAddAPIParallel('getSearchAllStoreInBuildingSlider', (async (v1,v2,v3,v4) => { return VSearchInThisPlaceAPI.getSearchAllStoreInBuildingSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.buildingKey, this._sortDataStore), ((v) => {
            this.dataStore = v;
        }).bind(this),  null);

        this.baseAddAPIParallel('getSearchAllRestoInBuildingSlider', (async (v1,v2,v3,v4) => { return VSearchInThisPlaceAPI.getSearchAllRestoInBuildingSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.buildingKey, this._sortDataResto), ((v) => {
            this.dataResto = v;
        }).bind(this),  null);

        this.baseAddAPIParallel('getSearchAllBuildingEventInBuildingSlider', (async (v1,v2,v3,v4) => { return VSearchInThisPlaceAPI.getSearchAllBuildingEventInBuildingSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.buildingKey, this._sortDataPlaceEvent), ((v) => {
            this.dataPlaceEvent = v;
            console.log(v)
        }).bind(this),  null);

        this.baseAddAPIParallel('getSearchAllStorePromoInBuildingSlider', (async (v1,v2,v3,v4) => { return VSearchInThisPlaceAPI.getSearchAllStorePromoInBuildingSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.buildingKey, this._sortDataStorePromo), ((v) => {
            this.dataStorePromo = v;
        }).bind(this),  null);

        this.baseAddAPIParallel('getSearchAllRestoPromoInBuildingSlider', (async (v1,v2,v3,v4) => { return VSearchInThisPlaceAPI.getSearchAllRestoPromoInBuildingSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.buildingKey, this._sortDataRestoPromo), ((v) => {
            this.dataRestoPromo = v;

        }).bind(this),  null);

        this.baseAddAPIParallel('getSearchAllStoreProductInBuildingSlider', (async (v1,v2,v3,v4) => { return VSearchInThisPlaceAPI.getSearchAllStoreProductInBuildingSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.buildingKey, this._sortDataStoreProduct), ((v) => {
            this.dataStoreProduct = v;
        }).bind(this),  null);

        this.baseAddAPIParallel('getSearchAllRestoMenuInBuildingSlider', (async (v1,v2,v3,v4) => { return VSearchInThisPlaceAPI.getSearchAllRestoMenuInBuildingSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.buildingKey, this._sortDataRestoMenu), ((v) => {
            this.dataRestoMenu = v;
            console.log(v)
        }).bind(this),  null);
        this.baseRunAPIParallel();
    }

    _getLikeResourcePlaceEvent(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentBuildingEventID = data.fContentBuildingEventID;
        var contentBuildingEventEN = data.fContentBuildingEventEN;
        var contentBuildingEventCN = data.fContentBuildingEventCN;
        return (
            { fContentType: 'PlaceEvent', fContentKey: data.key, fText1: { id: contentBuildingEventID.fEventName, en: contentBuildingEventEN.fEventName, cn: contentBuildingEventCN.fEventName }, fText2: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fText3: { id: contentBuildingEventID.fShortDescription, en: contentBuildingEventEN.fShortDescription, cn: contentBuildingEventCN.fShortDescription }, fImageID: contentBuildingEventID.fImageJSON, fImageEN: contentBuildingEventEN.fImageJSON, fImageCN: contentBuildingEventCN.fImageJSON, fTargetKey: data.buildingKey }
        )
    }

    _getLikeResourceStore(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        return (
            { fContentType: 'Store', fContentKey: data.key, fText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText2: { id: idJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], en: enJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], cn: cnJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)] }, fText3: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fImageID: contentStoreID.fStoreImageJSON, fImageEN: contentStoreEN.fStoreImageJSON, fImageCN: contentStoreCN.fStoreImageJSON, fTargetKey: data.key }
        )
    }

    _getLikeResourceStorePromo(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStorePromoID = data.fContentStorePromoID;
        var contentStorePromoEN = data.fContentStorePromoEN;
        var contentStorePromoCN = data.fContentStorePromoCN;
        return (
            { fContentType: 'StorePromo', fContentKey: data.key, fText1: { id: contentStorePromoID.fEventName, en: contentStorePromoEN.fEventName, cn: contentStorePromoCN.fEventName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentStorePromoID.fImageJSON, fImageEN: contentStorePromoEN.fImageJSON, fImageCN: contentStorePromoCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getLikeResourceResto(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        return (
            { fContentType: 'Resto', fContentKey: data.key, fText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText2: { id: data.restoCategory, en: data.restoCategory, cn: data.restoCategory }, fText3: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fImageID: contentRestoID.fStoreImageJSON, fImageEN: contentRestoEN.fStoreImageJSON, fImageCN: contentRestoCN.fStoreImageJSON, fTargetKey: data.key }
        )
    }

    _getLikeResourceRestoPromo(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentRestoPromoID = data.fContentRestoPromoID;
        var contentRestoPromoEN = data.fContentRestoPromoEN;
        var contentRestoPromoCN = data.fContentRestoPromoCN;
        return (
            { fContentType: 'RestoPromo', fContentKey: data.key, fText1: { id: contentRestoPromoID.fEventName, en: contentRestoPromoEN.fEventName, cn: contentRestoPromoCN.fEventName }, fText2: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentRestoPromoID.fImageJSON, fImageEN: contentRestoPromoEN.fImageJSON, fImageCN: contentRestoPromoCN.fImageJSON, fTargetKey: data.restoKey }
        )
    }

    _getLikeResourceStoreProduct(data) {
        // console.log(data);
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStoreProductID = data.fContentProductID;
        var contentStoreProductEN = data.fContentProductEN;
        var contentStoreProductCN = data.fContentProductCN;
        return (
            { fContentType: 'StoreProduct', fContentKey: data.productKey, fText1: { id: contentStoreProductID.fProductName, en: contentStoreProductEN.fProductName, cn: contentStoreProductCN.fProductName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentStoreProductID.fImageJSON, fImageEN: contentStoreProductEN.fImageJSON, fImageCN: contentStoreProductCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getLikeResourceRestoMenu(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentRestoMenuID = data.fContentProductID;
        var contentRestoMenuEN = data.fContentProductEN;
        var contentRestoMenuCN = data.fContentProductCN;
        return (
            { fContentType: 'RestoMenu', fContentKey: data.productKey, fText1: { id: contentRestoMenuID.fProductName, en: contentRestoMenuEN.fProductName, cn: contentRestoMenuCN.fProductName }, fText2: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentRestoMenuID.fImageJSON, fImageEN: contentRestoMenuEN.fImageJSON, fImageCN: contentRestoMenuCN.fImageJSON, fTargetKey: data.restoKey }
        )
    }

    _getCommentResourcePlaceEvent(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentBuildingEventID = data.fContentBuildingEventID;
        var contentBuildingEventEN = data.fContentBuildingEventEN;
        var contentBuildingEventCN = data.fContentBuildingEventCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'PlaceEvent', fContentKey: data.key,
                fContentName: { id: contentBuildingEventID.fEventName, en: contentBuildingEventEN.fEventName, cn: contentBuildingEventCN.fEventName },
                fContentText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText2: { id: contentBuildingEventID.fShortDescription, en: contentBuildingEventEN.fShortDescription, cn: contentBuildingEventCN.fShortDescription },
                fContentImage: { id: contentBuildingEventID.fImageJSON, en: contentBuildingEventEN.fImageJSON, cn: contentBuildingEventCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.buildingKey
            }
        )
    }

    _getCommentResourceStorePromo(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStorePromoID = data.fContentStorePromoID;
        var contentStorePromoEN = data.fContentStorePromoEN;
        var contentStorePromoCN = data.fContentStorePromoCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'StorePromo', fContentKey: data.key,
                fContentName: { id: contentStorePromoID.fEventName, en: contentStorePromoEN.fEventName, cn: contentStorePromoCN.fEventName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentStorePromoID.fShortDescription, en: contentStorePromoEN.fShortDescription, cn: contentStorePromoCN.fShortDescription },
                fContentImage: { id: contentStorePromoID.fImageJSON, en: contentStorePromoEN.fImageJSON, cn: contentStorePromoCN.fImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fImageJSON, en: contentStoreEN.fImageJSON, cn: contentStoreCN.fImageJSON },
                fTargetKey: data.storeKey
            }
        )
    }

    _getCommentResourceRestoPromo(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentRestoPromoID = data.fContentRestoPromoID;
        var contentRestoPromoEN = data.fContentRestoPromoEN;
        var contentRestoPromoCN = data.fContentRestoPromoCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RestoPromo', fContentKey: data.key,
                fContentName: { id: contentRestoPromoID.fEventName, en: contentRestoPromoEN.fEventName, cn: contentRestoPromoCN.fEventName },
                fContentText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText2: { id: contentRestoPromoID.fShortDescription, en: contentRestoPromoEN.fShortDescription, cn: contentRestoPromoCN.fShortDescription },
                fContentImage: { id: contentRestoPromoID.fImageJSON, en: contentRestoPromoEN.fImageJSON, cn: contentRestoPromoCN.fImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentRestoID.fImageJSON, en: contentRestoEN.fImageJSON, cn: contentRestoCN.fImageJSON },
                fTargetKey: data.restoKey
            }
        )
    }

    _getCommentResourceStoreProduct(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStoreProductID = data.fContentProductID;
        var contentStoreProductEN = data.fContentProductEN;
        var contentStoreProductCN = data.fContentProductCN;

        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'StoreProduct', fContentKey: data.productKey,
                fContentName: { id: contentStoreProductID.fProductName, en: contentStoreProductEN.fProductName, cn: contentStoreProductCN.fProductName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                fContentImage: { id: contentStoreProductID.fImageJSON, en: contentStoreProductEN.fImageJSON, cn: contentStoreProductCN.fImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.storeKey
            }
        )
    }

    _getCommentResourceRestoMenu(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentRestoMenuID = data.fContentProductID;
        var contentRestoMenuEN = data.fContentProductEN;
        var contentRestoMenuCN = data.fContentProductCN;

        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RestoMenu', fContentKey: data.productKey,
                fContentName: { id: contentRestoMenuID.fProductName, en: contentRestoMenuEN.fProductName, cn: contentRestoMenuCN.fProductName },
                fContentText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText2: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                fContentImage: { id: contentRestoMenuID.fImageJSON, en: contentRestoMenuEN.fImageJSON, cn: contentRestoMenuCN.fImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetKey: data.restoKey
            }
        )
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.searchKeyword = this.props.route.params.searchKeyword;
        this.buildingKey = this.props.route.params.buildingKey;
        this._sortDataStore = sortDAO.getStoreSearchSortData(this.Language.toUpperCase());
        this._sortDataResto = sortDAO.getRestoSearchSortData(this.Language.toUpperCase());
        this._sortDataPlaceEvent = sortDAO.getPlaceEventSearchSortData(this.Language.toUpperCase());
        this._sortDataStorePromo = sortDAO.getStorePromoSearchSortData(this.Language.toUpperCase());
        this._sortDataRestoPromo = sortDAO.getRestoPromoSearchSortData(this.Language.toUpperCase());
        this._sortDataStoreProduct = sortDAO.getStoreProductSearchSortData();
        this._sortDataRestoMenu = sortDAO.getRestoMenuSearchSortData();
        this.dataStore = [];
        this.dataResto = [];
        this.dataPlaceEvent = [];
        this.dataStorePromo = [];
        this.dataRestoPromo = [];
        this.dataStoreProduct = [];
        this.dataRestoMenu = [];
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.alreadyMount = false;
        this.counterBatch=0
        this.errorBatch = []
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        console.log('abcd')
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchAllScreenRootView'} style={style.mainContainer}>
                {this.alreadyMount ?
                    this.dataStore.length !== 0 || this.dataResto.length !== 0 || this.dataPlaceEvent.length !== 0 || this.dataStorePromo.length !== 0 || this.dataRestoPromo.length !== 0 || this.dataStoreProduct.length !== 0 || this.dataRestoMenu.length !== 0 ?
                        (<ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'SearchAllScreenScrollView'} style={style.scrollViewContainer} showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollViewContainerContent}>
                            {this.dataStore.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderStore'} navigator={this.props.navigation} screen={'SearchResultInThisPlaceStore'} buildingKey={this.buildingKey} title={SGLocalize.translate("SearchAllScreen.storeTitle")} count={this.dataStore.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllStoreSliderViewPager'} style={style.storeSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataStore.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultStoreCard onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,x)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, x)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountStore+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SearchAllScreenDefStoreCard'} likePackage={this._getLikeResourceStore(x)} navigator={this.props.navigation} language={this.Language} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SearchResultStoreScreen.likeText")} locationText={SGLocalize.translate("SearchResultStoreScreen.locationText")} lastVisitedText={SGLocalize.translate("SearchResultStoreScreen.lastVisitedText")} key={x.key} contentKey={x.key} storeName={x['fStoreName' + (this.Language).toUpperCase()]} storeCategory={x.storeCategory} storeLocation={x['fContentStore' + this.Language.toUpperCase()].fLocation} storeFloor={x.floor} placeName={x['fBuildingName' + (this.Language).toUpperCase()]} image={x['fContentBuilding' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} location={x['fContentImage']} lastVisited={x.lastVisited} contentLikeCount={x.fLikeCountStore} footerLikeCount={x.fLikeCountBuilding} contentImage={x['fContentStore' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} city={x.fCity} like={x.fUserLikedThis} notification={x.fUserNotificationThis} favorite={x.fUserFavoriteThis} style={style.containerView1}></DefaultStoreCard>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ViewPager>
                                </View>)
                                :
                                (null)
                            }
                            {this.dataResto.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderResto'} navigator={this.props.navigation} screen={'SearchResultInThisPlaceResto'} buildingKey={this.buildingKey} title={SGLocalize.translate("SearchAllScreen.restoTitle")} count={this.dataResto.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllRestoSliderViewPager'} style={style.restoSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataResto.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultRestoCard onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,x)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, x)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountResto+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SeeAllFavoritesRestoScreenDefPlaceCard'} likePackage={this._getLikeResourceResto(x)} navigator={this.props.navigation} language={this.Language} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SeeAllFavoritesRestoScreen.likeText")} locationText={SGLocalize.translate("SeeAllFavoritesRestoScreen.locationText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesRestoScreen.lastVisitedText")} key={x.key} contentKey={x.key} restoName={x['fRestoName' + (this.Language).toUpperCase()]} restoCategory={x.restoCategory} restoCuisine={x.restoCuisine} isHalal={x.isHalal} isVegetarian={x.isVegetarian} restoLocation={x['fContentResto' + this.Language.toUpperCase()].fLocation} storeFloor={x.floor} placeName={x['fBuildingName' + (this.Language).toUpperCase()]} image={x['fContentBuilding' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} location={x.fCity} lastVisited={x.lastVisited} contentLikeCount={x.fLikeCountResto} footerLikeCount={x.fLikeCountBuilding} contentImage={x['fContentResto' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} city={x.fCity} like={x.fUserLikedThis} notification={x.fUserNotificationThis} favorite={x.fUserFavoriteThis} style={style.containerView1}></DefaultRestoCard>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ViewPager>
                                </View>)
                                :
                                (null)
                            }
                            {this.dataPlaceEvent.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderPlaceEvent'} navigator={this.props.navigation} screen={'SearchResultInThisPlacePlaceEvent'} buildingKey={this.buildingKey} title={SGLocalize.translate("SearchAllScreen.placeEventTitle")} count={this.dataPlaceEvent.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllPlaceEventSliderViewPager'} style={style.placeEventSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataPlaceEvent.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultPlaceEventCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountBuildingEvent+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SeeAllFavoritesPlaceEventScreenDefPlaceEventCard'} commentPackage={this._getCommentResourcePlaceEvent(x)} likePackage={this._getLikeResourcePlaceEvent(x)} navigator={this.props.navigation} likeText={SGLocalize.translate("SeeAllFavoritesPlaceEventScreen.likeText")} key={x.key} contentKey={x.key} eventName={x['fEventName' + (this.Language).toUpperCase()]} location={x.fCity} placeName={x['fBuildingName' + (this.Language).toUpperCase()]} placeCategory={x.fBuildingType} contentImage={x['fContentBuildingEvent' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={x['fContentBuildingEvent' + (this.Language).toUpperCase()].fImageJSON[0].thumbnailLow.uri} image={x['fContentBuilding' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentLikeCount={x.fLikeCountBuildingEvent} footerLikeCount={x.fLikeCountBuilding} like={x.fUserLikedThis} startDate={x.startDate} endDate={x.endDate} shareMessage={x['fContentBuildingEvent' + this.Language.toUpperCase()].fShareMessage} targetKey={x.buildingKey} canComment={x.fCanComment} eventCategory={x.fEventCategory}  style={style.containerView1}></DefaultPlaceEventCard>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ViewPager>
                                </View>)
                                :
                                (null)
                            }
                            {this.dataStorePromo.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderStorePromo'} navigator={this.props.navigation} screen={'SearchResultInThisPlaceStorePromo'} buildingKey={this.buildingKey} title={SGLocalize.translate("SearchAllScreen.storePromoTitle")} count={this.dataStorePromo.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllStorePromoSliderViewPager'} style={style.storePromoSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataStorePromo.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultStorePromoCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountStorePromo+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SearchAllScreenDefStorePromoCard'} likePackage={this._getLikeResourceStorePromo(x)} commentPackage={this._getCommentResourceStorePromo(x)} navigator={this.props.navigation} likeText={SGLocalize.translate("SearchResultStorePromoScreen.likeText")} key={x.key} contentKey={x.key} eventName={x['fEventName' + (this.Language).toUpperCase()]} storeName={x['fStoreName' + (this.Language).toUpperCase()]} storeCategory={x.storeCategory} location={x.fCity} placeName={x['fBuildingName' + (this.Language).toUpperCase()]} contentImage={x['fContentStorePromo' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={x['fContentStorePromo' + (this.Language).toUpperCase()].fImageJSON[0].thumbnailLow.uri} image={x['fContentStore' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} contentLikeCount={x.fLikeCountStorePromo} footerLikeCount={x.fLikeCountStore} like={x.fUserLikedThis} startDate={x.startDate} endDate={x.endDate} shareMessage={x['fContentStorePromo' + this.Language.toUpperCase()].fShareMessage} targetKey={x.storeKey} canComment={x.fCanComment} style={style.containerView1}></DefaultStorePromoCard>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ViewPager>
                                </View>)
                                :
                                (null)
                            }
                            {this.dataRestoPromo.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderStorePromo'} navigator={this.props.navigation} screen={'SearchResultInThisPlaceRestoPromo'} buildingKey={this.buildingKey} title={SGLocalize.translate("SearchAllScreen.restoPromoTitle")} count={this.dataRestoPromo.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllRestoPromoSliderViewPager'} style={style.restoPromoSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataRestoPromo.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultRestoPromoCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountRestoPromo+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SearchAllScreenDefRestoPromoCard'} commentPackage={this._getCommentResourceRestoPromo(x)} likePackage={this._getLikeResourceRestoPromo(x)} navigator={this.props.navigation} likeText={SGLocalize.translate("SeeAllFavoritesRestoPromoScreen.likeText")} key={x.key} contentKey={x.key} eventName={x['fEventName' + (this.Language).toUpperCase()]} restoName={x['fRestoName' + (this.Language).toUpperCase()]} restoCategory={x.restoCategory} restoCuisine={x.restoCuisine} location={x.fCity} placeName={x['fBuildingName' + (this.Language).toUpperCase()]} contentImage={x['fContentRestoPromo' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={x['fContentRestoPromo' + (this.Language).toUpperCase()].fImageJSON[0].thumbnailLow.uri} image={x['fContentResto' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} contentLikeCount={x.fLikeCountRestoPromo} footerLikeCount={x.fLikeCountResto} like={x.fUserLikedThis} startDate={x.startDate} endDate={x.endDate} shareMessage={x['fContentRestoPromo' + this.Language.toUpperCase()].fShareMessage} targetKey={x.restoKey} style={style.containerView1} canComment={x.fCanComment}></DefaultRestoPromoCard>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ViewPager>
                                </View>)
                                :
                                (null)
                            }
                            {this.dataStoreProduct.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderStoreProduct'} navigator={this.props.navigation} screen={'SearchResultInThisPlaceStoreProduct'} buildingKey={this.buildingKey} title={SGLocalize.translate("SearchAllScreen.storeProductTitle")} count={this.dataStoreProduct.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllStoreProductSliderViewPager'} style={style.storeProductSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataStoreProduct.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultStoreProductCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this,x)}  slider accessible={true} accessibilityLabel={'SearchAllScreenDefStoreProductCard'} likePackage={this._getLikeResourceStoreProduct(x)} commentPackage={this._getCommentResourceStoreProduct(x)} navigator={this.props.navigation} imageSetting={this.imageSetting} footer={false} likeText={SGLocalize.translate("SearchResultStoreProductScreen.likeText")} key={x.productKey} contentKey={x.productKey} productName={x['fContentProduct' + this.Language.toUpperCase()].fProductName} normalPrice={x.fCNormalPrice} promoPrice={x.fCPromoPrice} contentImage={x['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={x['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0].thumbnailLow.uri} storeKey={x.storeKey} fCurrency={x.fCurrency} storeName={x['fContentStore' + this.Language.toUpperCase()].fStoreName} storeCategory={x.storeCategory} footerLikeCount={x.fLikeCountStore} footerImage={x['fContentStore' + this.Language.toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} placeName={x['fBuildingName' + this.Language.toUpperCase()]} city={x.fCity} contentLikeCount={x.fLikeCountProduct}  like={x.fUserLikedThis} shareMessage={x['fContentProduct' + this.Language.toUpperCase()].fShareMessage} targetKey={x.storeKey} canComment={x.fCanComment} style={style.containerView1}></DefaultStoreProductCard>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ViewPager>
                                </View>
                                )
                                :
                                (null)
                            }
                            {this.dataRestoMenu.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderRestoMenu'} navigator={this.props.navigation} screen={'SearchResultInThisPlaceRestoMenu'} buildingKey={this.buildingKey} title={SGLocalize.translate("SearchAllScreen.restoMenuTitle")} count={this.dataRestoMenu.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllRestoMenuSliderViewPager'} style={style.restoMenuSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataRestoMenu.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultRestoMenuCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SearchAllScreenDefRestoMenuCard'} likePackage={this._getLikeResourceRestoMenu(x)} commentPackage={this._getCommentResourceRestoMenu(x)} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SearchResultRestoMenuScreen.likeText")} key={x.productKey} contentKey={x.productKey} menuName={x['fContentProduct' + this.Language.toUpperCase()].fProductName} normalPrice={x.fCNormalPrice} promoPrice={x.fCPromoPrice} restoKey={x.restoKey} fCurrency={x.fCurrency} restoName={x['fContentResto' + this.Language.toUpperCase()].fStoreName} restoCategory={x.restoCategory} restoCuisine={x.restoCuisine} footerLikeCount={x.fLikeCountResto} placeName={x['fBuildingName' + this.Language.toUpperCase()]} footerImage={x['fContentResto' + this.Language.toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} location={x.fCity} contentLikeCount={x.fLikeCountProduct} contentImage={x['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={x['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0].thumbnailLow.uri} like={x.fUserLikedThis} shareMessage={x['fContentProduct' + this.Language.toUpperCase()].fShareMessage} targetKey={x.restoKey} canComment={x.fCanComment} style={style.containerView1}></DefaultRestoMenuCard>
                                                    </View>
                                                )
                                            })
                                        }
                                    </ViewPager>
                                </View>
                                )
                                :
                                (null)
                            }
                        </ScrollView>)
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                 {/* <View style={{width:w,height:w*0.15,backgroundColor:'transparent'}}></View> */}
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <SimpleSearchBar accessible={true} accessibilityLabel={'SearchAllScreenSimpleSearchBar'} imageSetting={this.imageSetting} language={this.Language} screen={'SearchInThisPlace'} buildingKey={this.buildingKey}  searchKeyword={this.searchKeyword} navigator={this.props.navigation} placeholder='' style={this.style.containerView1}></SimpleSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}