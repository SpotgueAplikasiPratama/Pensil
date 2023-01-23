/*
* 1. Leon 12 Apr 2021
* - add ErrorHandling
*/
import React from "react";
import { StyleSheet, Animated } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGScrollView as ScrollView, SGTabView as TabView, SGRootView, SGPicker as Picker, SGFlatList as FlatList, SGButton as Button, SGPopView, SGImage as Image, SGActivityIndicator as ActivityIndicator, } from "../../../core/control";
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { ReferralHistoryCard } from '../../container_V2/ReferralHistoryCard';
import { CarouselRewardCard } from '../../container_V2/CarouselRewardCard';
import { tbVReferralCodeAPI } from '../../api/tbVReferralCodeAPI';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { RibbonHeader } from '../../component_V2/RibbonHeader';

export class ReferralHistoryScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, justifyContent: 'flex-start', backgroundColor: '#FFFFFF', paddingVertical: 0 },
            myReferralHeader: { width: w - 12 * p, flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 4 * p },
            pointBox: { width: w - 12 * p, padding: 4 * p, borderRadius: 2 * p, backgroundColor: '#191919', },
            pointContainer: { width: w - 12 * p, flexDirection: 'row', backgroundColor: '#191919', },
            pointSubContainer: { width: (w - 12 * p) * 0.5 },
            textPoint: { color: '#FFFFFF' },
            point: { color: '#FFFFFF' },
            buttonHistory: { borderColor: 'white', borderRadius: 2 * p, width: w * 0.8, marginTop: 2 * p, borderWidth: p * 1 / 2, paddingVertical: 1.5 * p, paddingHorizontal: p },
            redeemTextTitle: { alignSelf: 'flex-start', marginLeft: 6 * p, marginTop: 8 * p, marginBottom: 4 * p }
        });
    };

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }

    async _onRefreshAllItem() {
        // try {
            this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
            this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
            this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
            this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');

            this.baseRunSingleAPIWithRedoOption('getReferralList', (async () => { return tbVReferralCodeAPI.getReferralList() }).bind(this), ((v) => {           
                this.data = v// await tbVReferralCodeAPI.getReferralList();
                this.alreadyMount = true;
                this.forceUpdate();
            }).bind(this), (()=>{ this.setState({loadingLikeResto:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        // } catch (error) {
        //     SGHelperErrorHandling.Handling(error,this._onRefreshAllItem.bind(this))
        // }

    }

   
    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.state = { active1: true, active2: false, active3: false, active4: false, active5: false, active6: false, active7: false, active8: false, active9: false, active10: false }
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.data = [];
        this.alreadyMount = false;
    }

    async _onTradePress(data) {
        try {
            await tbVReferralCodeAPI.tradeReferralPoint(data.fID, data.fType);
            await this._onRefreshAllItem();
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._onTradePress.bind(this,data))
        }

    }

    _renderItem = ({ item, index }) => {
        return (
            <CarouselRewardCard accessible={true} accessibilityLabel={'StoreHomeScreenCarouselProductCard'} currency={this.currentUserCurrency} navigator={this.props.navigation} contentKey={item.key} data={item} onTradePress={this._onTradePress.bind(this, item)} language={this.Language} imageSetting={this.imageSetting} style={this.style.throwWHP}></CarouselRewardCard>
        );
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var n = this.props.navigation;
        console.log('a')
        return (
            <SGRootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'ReferralHistoryScreenRootView'} style={style.mainContainer}>
                {this.alreadyMount ?
                    <View>
                        <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("ReferralHistoryScreen.screenTitle")} ribbonWidth={0.65}></RibbonHeader>
                        {this.data.length !== 0 ?
                            <FlatList accessible={true} accessibilityLabel={'SeeAllFavoritesPlaceScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, justifyContent: 'flex-start', alignItems: 'center', paddingBottom: SGHelperWindow.getFooterHeight() + SGHelperWindow.getHeaderHeight() }} data={this.data} renderItem={({ item }) => {
                                return (
                                    <ReferralHistoryCard accessible={true} accessibilityLabel={'SeeAllFavoritesPlaceScreenDefPlaceCard'} language={this.Language} navigator={this.props.navigation} data={item} imageSetting={this.imageSetting} key={item.fID} style={style.throwWHP}></ReferralHistoryCard>
                                );
                            }} keyExtractor={item => item.fID} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                            </FlatList>
                            
                            :
                            <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>}
                        <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                        <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                    </View>
                    
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                </Animated.View>
                <BottomNavigationContainer accessible={true} accessibilityLabel={'HomeScreenBottomNav'} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </SGRootView>
        );
    }
}