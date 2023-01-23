/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGScrollView as ScrollView, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
import { DefaultStoreProductCard } from '../../container_V2/DefaultStoreProductCard';
import { DefaultStorePromoCard } from '../../container_V2/DefaultStorePromoCard';
import { SGBaseContainer } from '../../../core/container/SGBaseContainer';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow ,SGHelperErrorHandling} from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { VSearchInThisStoreAPI } from '../../api/VSearchInThisStoreAPI';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { sortDAO } from '../../db/sortDAO';

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
                <Text accessible={true} style={style.headText} preset={Text.preset.titleH2B}>{this.props.title}</Text>
                <View accessible={true} style={{ alignSelf: 'flex-end', marginRight: p * 3 }}>
                    <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { searchKeyword: this.props.searchKeyword, storeKey: this.props.storeKey })}>
                        <Text accessible={true} accessibilityLabel={'ContentHeaderHeaderText'} preset={Text.preset.titleH4B} style={style.seeMoreText}>{SGLocalize.translate("SearchAllScreen.headerText1")} {SGLocalize.translate("SearchAllScreen.headerText2")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export class SearchInThisStoreScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#E6E6E6' },
            scrollViewContainer: { width: w },
            scrollViewContainerContent: { padding:p ,width: w, backgroundColor: '#E6E6E6', justifyContent: 'flex-start' },
            storePromoSliderContainer: { width: w, height: w * 1.02, backgroundColor: 'transparent' },
            storeProductSliderContainer: { width: w, height: w * 0.64, backgroundColor: 'transparent' },
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
        this.alreadyMount = true;
        this.forceUpdate();
    }

    async _onRefreshAllItem() {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');

        this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));
       
        this.baseAddAPIParallel('getSearchAllStorePromoInStoreSlider', (async (v1,v2,v3,v4) => { return VSearchInThisStoreAPI.getSearchAllStorePromoInStoreSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.storeKey, this._sortDataStorePromo), ((v) => {
            this.dataStorePromo = v;
        }).bind(this),  null);

        this.baseAddAPIParallel('getSearchAllStoreProductInStoreSlider', (async (v1,v2,v3,v4) => { return VSearchInThisStoreAPI.getSearchAllStoreProductInStoreSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.storeKey, this._sortDataStoreProduct), ((v) => {
            this.dataStoreProduct = v;
            console.log('search all store product')
            console.log(v);
        }).bind(this),  null);
        this.baseRunAPIParallel();
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

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.searchKeyword = this.props.route.params.searchKeyword;
        this.storeKey = this.props.route.params.storeKey;
        this._sortDataStorePromo = sortDAO.getStorePromoSearchInStoreSortData();
        this._sortDataStoreProduct = sortDAO.getStoreProductSearchInStoreSortData();
        this.dataStorePromo = [];
        this.dataStoreProduct = [];
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.props.navigation.setOptions({
            headerShown: false
        });
        this.alreadyMount = false;
        this.counterBatch=0
        this.errorBatch = []
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        console.log('search in this store screen')
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchAllScreenRootView'} style={style.mainContainer}>
                {this.alreadyMount ?
                    this.dataStorePromo.length !== 0 || this.dataStoreProduct.length !== 0 ?
                        (<ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'SearchAllScreenScrollView'} style={style.scrollViewContainer} showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollViewContainerContent}>
                            {this.dataStorePromo.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderStorePromo'} navigator={this.props.navigation} screen={'SearchResultInThisStoreStorePromo'} storeKey={this.storeKey} title={SGLocalize.translate("SearchAllScreen.storePromoTitle")} count={this.dataStorePromo.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllStorePromoSliderViewPager'} style={style.storePromoSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataStorePromo.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultStorePromoCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountStorePromo+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SearchAllScreenDefStorePromoCard'} likePackage={this._getLikeResourceStorePromo(x)} commentPackage={this._getCommentResourceStorePromo(x)} navigator={this.props.navigation} likeText={SGLocalize.translate("SearchResultStorePromoScreen.likeText")} key={x.key} contentKey={x.key} eventName={x['fEventName' + (this.Language).toUpperCase()]} storeName={x['fStoreName' + (this.Language).toUpperCase()]} shareMessage={x['fContentStorePromo' + this.Language.toUpperCase()].fShareMessage} storeCategory={x.storeCategory} location={x.fCity} placeName={x['fBuildingName' + (this.Language).toUpperCase()]} contentImage={x['fContentStorePromo' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={x['fContentStorePromo' + (this.Language).toUpperCase()].fImageJSON[0].thumbnailLow.uri} image={x['fContentStore' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} contentLikeCount={x.fLikeCountStorePromo} footerLikeCount={x.fLikeCountStore} like={x.fUserLikedThis} startDate={x.startDate} endDate={x.endDate} canComment={x.fCanComment} style={style.containerView1}></DefaultStorePromoCard>
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
                            {this.dataStoreProduct.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderStoreProduct'} navigator={this.props.navigation} screen={'SearchResultInThisStoreStoreProduct'} storeKey={this.storeKey} title={SGLocalize.translate("SearchAllScreen.storeProductTitle")} count={this.dataStoreProduct.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllStoreProductSliderViewPager'} style={style.storeProductSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataStoreProduct.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultStoreProductCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SearchAllScreenDefStoreProductCard'} likePackage={this._getLikeResourceStoreProduct(x)} commentPackage={this._getCommentResourceStoreProduct(x)} navigator={this.props.navigation} imageSetting={this.imageSetting} footer={false} likeText={SGLocalize.translate("SearchResultStoreProductScreen.likeText")} key={x.productKey} contentKey={x.productKey} productName={x['fContentProduct' + this.Language.toUpperCase()].fProductName} normalPrice={x.fCNormalPrice} promoPrice={x.fCPromoPrice} storeKey={x.storeKey} fCurrency={x.fCurrency} storeName={x['fContentStore' + this.Language.toUpperCase()].fStoreName} storeCategory={x.storeCategory} footerLikeCount={x.fLikeCountStore} footerImage={x['fContentStore' + this.Language.toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} placeName={x['fBuildingName' + this.Language.toUpperCase()]} city={x.fCity} contentLikeCount={x.fLikeCountProduct} contentImage={x['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={x['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0].thumbnailLow.uri} like={x.fUserLikedThis} shareMessage={x['fContentProduct' + this.Language.toUpperCase()].fShareMessage} targetKey={x.storeKey} canComment={x.fCanComment} style={style.containerView1}></DefaultStoreProductCard>
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
                    <SimpleSearchBar accessible={true} accessibilityLabel={'SearchAllScreenSimpleSearchBar'} imageSetting={this.imageSetting} language={this.Language} storeKey={this.storeKey} searchKeyword={this.searchKeyword} navigator={this.props.navigation} placeholder='' style={this.style.containerView1}></SimpleSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}