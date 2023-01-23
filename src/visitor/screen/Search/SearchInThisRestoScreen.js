/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGScrollView as ScrollView, SGView as View, SGRootView as RootView, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
import { DefaultRestoMenuCard } from '../../container_V2/DefaultRestoMenuCard';
import { DefaultRestoPromoCard } from '../../container_V2/DefaultRestoPromoCard';
import { SGBaseContainer } from '../../../core/container/SGBaseContainer';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { VSearchInThisRestoAPI } from '../../api/VSearchInThisRestoAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
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
                <Text style={style.headText} preset={Text.preset.titleH2B}>{this.props.title}</Text>
                <View accessible={true} style={{ alignSelf: 'flex-end', marginRight: p * 3 }}>
                    <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { searchKeyword: this.props.searchKeyword, restoKey: this.props.restoKey })}>
                        <Text accessible={true} accessibilityLabel={'ContentHeaderHeaderText'} preset={Text.preset.titleH4B} style={style.seeMoreText}>{SGLocalize.translate("SearchAllScreen.headerText1")}  {SGLocalize.translate("SearchAllScreen.headerText2")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export class SearchInThisRestoScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#E6E6E6' },
            scrollViewContainer: { width: w },
            scrollViewContainerContent: { padding:p, width: w, backgroundColor: '#E6E6E6', justifyContent: 'flex-start' },
            restoPromoSliderContainer: { width: w, height: w * 1.014, backgroundColor: 'transparent' },
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
        this.restoKey = this.props.route.params.restoKey;

        this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

        this.baseAddAPIParallel('getSearchAllRestoPromoInRestoSlider', (async (v1,v2,v3,v4) => { return VSearchInThisRestoAPI.getSearchAllRestoPromoInRestoSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.restoKey, this._sortDataRestoPromo), ((v) => {
            this.dataRestoPromo = v;
        }).bind(this),  null);

        this.baseAddAPIParallel('getSearchAllRestoProductInRestoSlider', (async (v1,v2,v3,v4) => { return VSearchInThisRestoAPI.getSearchAllRestoProductInRestoSlider(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword, this.restoKey, this._sortDataRestoMenu), ((v) => {
            this.dataRestoMenu = v;
        }).bind(this),  null);

        this.baseRunAPIParallel()

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
        this.restoKey = this.props.route.params.restoKey;
        this._sortDataRestoPromo = sortDAO.getRestoPromoSearchInRestoSortData(this.Language.toUpperCase());
        this._sortDataRestoMenu = sortDAO.getRestoMenuSearchInRestoSortData(this.Language.toUpperCase());
        this.dataRestoPromo = [];
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
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchAllScreenRootView'} style={style.mainContainer}>
                {this.alreadyMount ?
                    this.dataRestoPromo.length !== 0 || this.dataRestoMenu.length !== 0 ?
                        (<ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'SearchAllScreenScrollView'} style={style.scrollViewContainer} showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollViewContainerContent}>
                            {this.dataRestoPromo.length !== 0 ?
                                (<View style={{ marginBottom: p * 1.3 }}>
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderStorePromo'} navigator={this.props.navigation} screen={'SearchResultInThisRestoRestoPromo'} restoKey={this.restoKey} title={SGLocalize.translate("SearchAllScreen.restoPromoTitle")} count={this.dataRestoPromo.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllRestoPromoSliderViewPager'} style={style.restoPromoSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataRestoPromo.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultRestoPromoCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountRestoPromo+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SearchAllScreenDefRestoPromoCard'} commentPackage={this._getCommentResourceRestoPromo(x)} likePackage={this._getLikeResourceRestoPromo(x)} navigator={this.props.navigation} likeText={SGLocalize.translate("SeeAllFavoritesRestoPromoScreen.likeText")} key={x.key} contentKey={x.key} eventName={x['fEventName' + (this.Language).toUpperCase()]} restoName={x['fRestoName' + (this.Language).toUpperCase()]} restoCategory={x.restoCategory} restoCuisine={x.restoCuisine} location={x.fCity} placeName={x['fBuildingName' + (this.Language).toUpperCase()]} contentImage={x['fContentRestoPromo' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={x['fContentRestoPromo' + (this.Language).toUpperCase()].fImageJSON[0].thumbnailLow.uri} image={x['fContentResto' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} contentLikeCount={x.fLikeCountRestoPromo} footerLikeCount={x.fLikeCountResto} like={x.fUserLikedThis} startDate={x.startDate} endDate={x.endDate} shareMessage={x['fContentRestoPromo' + this.Language.toUpperCase()].fShareMessage} targetKey={x.restoKey} canComment={x.fCanComment} style={style.containerView1}></DefaultRestoPromoCard>
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
                                    <ContentHeader accessible={true} accessibilityLabel={'SearchAllScreenContentHeaderRestoMenu'} navigator={this.props.navigation} screen={'SearchResultInThisRestoRestoMenu'} restoKey={this.restoKey} title={SGLocalize.translate("SearchAllScreen.restoMenuTitle")} count={this.dataRestoMenu.length} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} style={style.throwWHP}></ContentHeader>
                                    <ViewPager accessible={true} accessibilityLabel={'SearchAllRestoMenuSliderViewPager'} style={style.restoMenuSliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                                        {
                                            this.dataRestoMenu.map((x) => {
                                                return (
                                                    <View style={{ justifyContent: 'flex-start' }}>
                                                        <DefaultRestoMenuCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this,x)} slider accessible={true} accessibilityLabel={'SearchAllScreenDefRestoMenuCard'} likePackage={this._getLikeResourceRestoMenu(x)} commentPackage={this._getCommentResourceRestoMenu(x)} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SearchResultRestoMenuScreen.likeText")} key={x.productKey} contentKey={x.productKey} menuName={x['fContentProduct' + this.Language.toUpperCase()].fProductName} normalPrice={x.fCNormalPrice} promoPrice={x.fCPromoPrice} contentImage={x['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={x['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0].thumbnailLow.uri} restoKey={x.restoKey} fCurrency={x.fCurrency} restoName={x['fContentResto' + this.Language.toUpperCase()].fStoreName} restoCategory={x.restoCategory} restoCuisine={x.restoCuisine} footerLikeCount={x.fLikeCountResto} placeName={x['fBuildingName' + this.Language.toUpperCase()]} footerImage={x['fContentResto' + this.Language.toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} location={x.fCity} contentLikeCount={x.fLikeCountProduct} like={x.fUserLikedThis} shareMessage={x['fContentProduct' + this.Language.toUpperCase()].fShareMessage} targetKey={x.restoKey} canComment={x.fCanComment} style={style.containerView1}></DefaultRestoMenuCard>
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
                    <SimpleSearchBar accessible={true} accessibilityLabel={'SearchAllScreenSimpleSearchBar'} screen={'SearchInThisResto'} restoKey={this.restoKey} imageSetting={this.imageSetting} language={this.Language} searchKeyword={this.searchKeyword} navigator={this.props.navigation} placeholder='' style={this.style.containerView1}></SimpleSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}