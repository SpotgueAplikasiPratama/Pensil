/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity,SGIcon as Icon } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { tbVUserSearchHistoryAPI } from '../../api/tbVUserSearchHistoryAPI';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { tbVUserSearchHistoryDAO, tbUserSearchHistoryData } from '../../db/tbVUserSearchHistoryDAO';

export class SearchStartScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: {width: w, height: h, padding: p},
            mainView1: {width:w, backgroundColor: 'white', justifyContent: 'flex-start' },
            containerView1: { width: w, height: h, padding: p },
            contentView: { marginHorizontal: -1 * p, width: w, marginTop: - 2 * p },
            ribbon: { width: w * 0.3 },
            contentHeader: { paddingBottom: 0, height: w * 0.15, flexDirection: 'row', width: w, marginHorizontal: -1 * p, justifyContent: 'space-between', alignItems: 'center' },
            contentView1: { marginHorizontal: -1 * p, flexDirection: 'row', width: w, height: w * 0.15, justifyContent: 'space-between', borderBottomWidth: p * 0.1, borderColor: '#cccccc' },
            text: { color: '#606060', marginHorizontal: 2 * p },
            text1: { fontSize: w * 0.05, opacity: 0.6, marginLeft: 1 * p },
            text2: { marginRight: 1 * p, color: '#63aee0' },
            sv1_2: { width: w, flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
            deleteIcon: { width: 8*p, height: w * 0.05 },
            ClearAll :{alignSelf:'flex-end',paddingRight:2*p}
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

    async _onRefreshAllItem() {
        // try {
            this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
            this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');

            this.baseRunSingleAPIWithRedoOption('getUserSearchHistory', (async () => {  return tbVUserSearchHistoryAPI.getUserSearchHistory() }).bind(this), ((v) => {           
                this.searchHistoryData = v //await tbVUserSearchHistoryAPI.getUserSearchHistory();
                this.isAlreadyMount = true;
                this.forceUpdate();
            }).bind(this), (()=>{   this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        // } catch (error) {
        //     SGHelperErrorHandling.Handling(this,this._onRefreshAllItem.bind(this))
        // }

    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.isAlreadyMount = false;
        this.searchKeyword = '';
        this.searchHistoryData = [];
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.counterBatch=0
        this.errorBatch = []
    }

    async _clearAllSearchHistory() {
        try {
            await tbVUserSearchHistoryAPI.clearAllUserSearchHistory();
            this._onRefreshAllItem();
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._clearAllSearchHistory.bind(this))
        }

    }

   

    async _deleteSelectedSearchHistory(key) {
        try {
            console.log(key);
            await tbVUserSearchHistoryAPI.deleteSelectedUserSearchHistory(key);

            this._onRefreshAllItem();
            
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._deleteSelectedSearchHistory.bind(this))
        }
        //should remove first then run query deleted selected
 
    }

    async _selectRecentSearchHistory(keyword) {
        try {
            var dataModel = new tbUserSearchHistoryData();
            var blankJSONModel = dataModel.getCurrentJSON();
            blankJSONModel.fKeyword = keyword;
            blankJSONModel.fLanguage = this.Language.toUpperCase();
            blankJSONModel.fID = null;
            blankJSONModel.fUserKey = this.props.currentUser;
            await tbVUserSearchHistoryAPI.addUserSearchHistory(blankJSONModel);
            this.searchKeyword = keyword;
            SGHelperNavigation.navigatePopPush(this.props.navigation, 'SearchAll', { searchKeyword: this.searchKeyword })
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._selectRecentSearchHistory.bind(this))
        }

    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchStratScreenRootView'} style={style.mainView1}>
                {this.isAlreadyMount ? 
                (<View>
            <View accessible={true} accessibilityLabel={'SearchStratScreenContentView1'} style={style.contentView}>
                    <View accessible={true} accessibilityLabel={'SearchStratScreenContentHeaderView'} style={style.contentHeader}>
                        <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("SearchStartScreen.screenTitle")}></RibbonHeader>
                    </View>
                    {this.searchHistoryData.length !== 0 ? 
                    (<TouchableOpacity onPress={() => this._clearAllSearchHistory()} style={style.ClearAll}>
                    <Text accessible={true} accessibilityLabel={'SearchStratScreenClearAllText'} preset={Text.preset.titleH3} style={style.text2}>{SGLocalize.translate("SearchStartScreen.clearAll")}</Text>
            </TouchableOpacity>)
            :
            (null)
                }     
                </View>
                {this.searchHistoryData.length !== 0 ?
                    (<View accessible={true} accessibilityLabel={'SearchStratScreenContentView2'} style={style.sv1_2}>
                        <FlatList accessible={true} accessibilityLabel={'SearchStratScreenScrollView'} showsVerticalScrollIndicator={false} contentContainerStyle={style.sv1_2} data={this.searchHistoryData} renderItem={({ item }) => {
                            return (
                                <View>
                                    {
                                    item.fActive === 'Y' ?
                                        (<TouchableOpacity onPress={() => { this._selectRecentSearchHistory(item.fKeyword) }}>
                                            <View accessible={true} accessibilityLabel={'SearchStratScreenTextIconView'} style={style.contentView1}>
                                                <Text accessible={true} accessibilityLabel={'SearchStratScreenText'} preset={Text.preset.titleH3B} style={style.text}>{item.fKeyword}</Text>
                                                <Icon accessible={true} accessibilityLabel={'SearchStratScreenCloseIcon'} name={Icon.Icon.close} style={style.deleteIcon} preset={Icon.preset.h3} onPress={() => this._deleteSelectedSearchHistory(item.fID)}></Icon>
                                            </View>
                                        </TouchableOpacity>)
                                    :
                                        (null)
                                    }
                                </View>
                            );
                        }} keyExtractor={item => item.fID}>
                        </FlatList>
                    </View>)
                :
                    (null)     
                }
                <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                </View>)
            :
            (null)}
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <SimpleSearchBar accessible={true} accessibilityLabel={'SearchStratScreenSimpleSearchBar'} imageSetting={this.imageSetting} searchKeyword={this.searchKeyword} currentUser={this.currentUser} language={this.Language} navigator={this.props.navigation} placeholder={SGLocalize.translate("SearchStartScreen.searchPlaceholder")} style={this.style.containerView1}></SimpleSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}