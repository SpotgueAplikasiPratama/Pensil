/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGRootView as RootView, SGFlatList as FlatList } from '../../../core/control';
import { SGFormSearchFilterSort } from '../../../core/form/SGFormSearchFilterSort';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperGlobalVar, SGHelperType, SGHelperNavigation, SGHelperErrorHandling } from '../../../core/helper';
import { tbCDirectoryDataSpotgueAPI } from '../../api/tbCDirectoryDataSpotgueAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
export class PolicyScreen extends SGBaseScreen {

    getDataFilter(lang) {
        return ([
            { name: 'fVisitor', operator: '=', value: 'Y', visible: false },
            { name: 'fType', operator: '=', value: 'policy', visible: false },
            { name: 'fSearchKey' + lang, operator: 'CONTAINS', value: null, type: 'search', title: "Search for help", visible: true },

        ]);
    }
    getDataSorting(lang) {
        return ([
            { name: 'fTitle' + lang, descending: false, title: "Title", selected: true, visible: false },
        ]);
    }
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { flex: 1, justifyContent: 'flex-start', backgroundColor: "white",width:w },
            v2: { width: w - 2 * p, height: w * 0.12, justifyContent: 'flex-start', flexDirection: 'row', marginTop: 3 * p, borderBottomWidth: p * 0.2, borderColor: "#E4E4E4" },
            v2_1: { width: (w - 2 * p) * 0.9, padding: p, alignItems: 'flex-start' },
            v2_2: { width: (w - 2 * p) * 0.1, padding: p, alignItems: 'flex-end' },
            v3: { width: w, borderBottomWidth: p * 0.2, borderColor: '#E4E4E4' },
            text: { alignSelf: 'flex-start', paddingLeft: 2 * p, marginTop: 3 * p, marginBottom: 3 * p },
            text1: { alignSelf: 'flex-start', paddingLeft: p },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.dataFilter = this.getDataFilter(this._language.toUpperCase());
        this.dataSorting = this.getDataSorting(this._language.toUpperCase());
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state = { filter: this.dataFilter, sorting: this.dataSorting, refresh: false };
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: '' + SGLocalize.translate("ChooseScreenProfile.TextTitlePolicy1") + '',
            headerBackTitle: '' + SGLocalize.translate("ChooseScreenProfile.Back") + '',
        });
    }
    async componentDidMount() {
        await this._onRefresh();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefresh();
        });
    }
    async _callBackForceUpdate() {
        await this._onRefresh();
    }

    async _onRefresh() {
        // try {
            this.baseRunSingleAPIWithRedoOption('searchDirectoryDataSpotgueCard', (async (v1, v2) => { return tbCDirectoryDataSpotgueAPI.searchDirectoryDataSpotgueCard(v1, v2) }).bind(this, this.dataFilter, this.dataSorting), ((v) => {           
                this.setState({ refresh: true })
                this._data = v //await tbCDirectoryDataSpotgueAPI.searchDirectoryDataSpotgueCard(this.dataFilter, this.dataSorting)
                this.setState({ filter: this.dataFilter, refresh: false });
            }).bind(this), null, SGHelperGlobalVar.getVar("ResponTimes"));
        // } catch (error) {
        //     SGHelperErrorHandling.Handling(error,this._onRefresh.bind(this))
        // }finally{
        //     this.setState({ filter: this.dataFilter, refresh: false });
        // }

    }

    _onPress(fID) {
        SGHelperNavigation.navigatePush(this.props.navigation, "DetailPolicyScreen", { fID: fID, language: this._language });
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var language = this._language.toUpperCase();
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'PolicyScreenRootView'} style={style.v1}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>

                <View style={style.v3}>
                    <Text accessible={true} accessibilityLabel={'HelpScreenScreen'} preset={Text.preset.titleH1B} style={style.text}>{SGLocalize.translate('ChooseScreenProfile.HeaderTitlePolicy')}</Text>
                </View>

                <SGFormSearchFilterSort accessible={true} accessibilityLabel={'PolicyScreenSearchFilterSort'} filterData={this.dataFilter} sortData={this.dataSorting} onValueChange={(v) => { this._onRefresh(); }} language={this._language.toUpperCase()}/>
                <FlatList accessible={true} accessibilityLabel={'PolicyScreenList'} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} refreshing={this.state.refresh} onRefresh={this._onRefresh.bind(this)} data={this._data} renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={this._onPress.bind(this, item.fID)}>
                            <View accessible={true} accessibilityLabel={'PolicyScreenItemView'} style={style.v2} >
                                <View accessible={true} accessibilityLabel={'PolicyScreenTextView'} style={style.v2_1}><Text accessible={true} accessibilityLabel={'PolicyScreenItemText'} preset={Text.preset.titleH3}>{item["fTitle" + language]}</Text></View>
                                <View accessible={true} accessibilityLabel={'PolicyScreenIconView'} style={style.v2_2}><Icon accessible={true} accessibilityLabel={'PolicyScreenSquareIcon'} name={Icon.Icon.rightSquare} preset={Icon.preset.h5}></Icon></View>
                            </View>
                        </TouchableOpacity>
                    );
                }} keyExtractor={item => item.fID}>
                </FlatList>
            </RootView>
        );
    }
}