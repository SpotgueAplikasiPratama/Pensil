import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGFlatList as FlatList,SGView as View, SGScrollView as ScrollView, SGText as Text, SGTouchableOpacity as TouchableOpacity,SGActivityIndicator } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperGlobalVar,SGHelperType, SGHelperNavigation } from '../../core/helper';
import { RewardCard } from '../container_V2/RewardCard';
import { EmptyDetailView } from './EmptyDetailView';
import { SearchBarNoBack } from '../component_V2/SearchBarNoBack';

export class TabMyRewardList extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, justifyContent: 'flex-start',alignItems:'flex-start',flex:1 },
            throwWHP: { width: w, height: h, padding: p,marginTop:h*0.3 },
            containerView1: { width: w, padding: p, backgroundColor: 'white' },
            sv1_2: { justifyContent: 'flex-start', alignItems: 'center' },
            v2: { justifyContent: 'flex-start' },
            secondTabActive: { marginVertical: 2 * p, backgroundColor: 'black', width: w * 0.45, height: w * 0.07, borderWidth: w * 0.002, borderColor: '#A3A3A3', borderRadius: p },
            secondTabInactive: { marginVertical: 2 * p, backgroundColor: 'white', width: w * 0.45, height: w * 0.07, borderWidth: w * 0.002, borderColor: '#A3A3A3', borderRadius: p },
            secondTabView: { paddingVertical: w * 0.02, width: w, justifyContent: 'space-evenly', flexDirection: 'row', },
            textActive: { color: 'white' },
            textInactive: { color: '#444444' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.state = { active1: true, active2: false,refreshFlatListData : false,refreshFlatListHistory:false }
        this.onIconPress = this.onIconPress.bind(this);
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
    }

    onIconPress(active) {
        this.setState({ active1: false, active2: false })
        if (active === "1") this.setState({ active1: true })
        if (active === "2") this.setState({ active2: true })
    }

    async _setSortActive(dataSort) {
        var sortData = this.props.sortData
        var refresh = this.props.refreshData
        sortData = dataSort;
        await refresh(true);
    }

    async _setFilterActive(dataFilter) {
        var filterData = this.props.filterData
        var refresh = this.props.refreshData
        filterData = dataFilter;
        await refresh();
    }


    _renderSomething1(data, refreshData,loadData,loadingData, searchKeyword) {
        var { w, h, p } = this.whp;
        var style = this.style
        return (
            <View accessible={true} accessibilityLabel={'TabMyRewardListActWaitingListView'} style={{ justifyContent: 'flex-start',alignItems:'flex-start'}}>
                <View> 
                    <SearchBarNoBack accessible={true} accessibilityLabel={'SearchResultPlaceScreenFullSearchBar'} searchKeyword={searchKeyword} language={this.props.language}  sortData={this.props.sortData} onApplySort={(v) => { this._setSortActive(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'Filter', { filterData: this.props.filterData, onApplyFilter: (v) => { this._setFilterActive(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigator} imageSetting={this.imageSetting} style={this.style.containerView1} refresh={refreshData}></SearchBarNoBack>
                    <FlatList refreshing={this.state.refreshFlatListData} onRefresh={refreshData} accessible={true} accessibilityLabel={'FlatListReward'} data={data}  contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} style={{flex:1,width:w}} renderItem={({ item, index }) => {
                        return (
                            <RewardCard accessible={true} accessibilityLabel={'MyRewardsScreenActiveCard'} valid imageSetting={ this.imageSetting} callBackForceUpdate={this.props.callback} style={this.style.containerView1} language={this.props.language} navigator={this.props.navigator} data={item} fType={item.fType}></RewardCard>
                        );
                    }}
                    keyExtractor={item => item.fID}
                    onEndReached={loadData}
                    onEndReachedThreshold={SGHelperType.getThreshold()}
                    ListFooterComponent={()=>{
                        if(loadingData)return (
                            <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width: w,height:h*0.05}}></SGActivityIndicator>
                        )
                        else return null
                        
                    }}
                    ListEmptyComponent={()=>{
                        return <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                    }}
                    >
                    </FlatList>
                    <View style={{width:w,height:w*0.3,backgroundColor:'transparent'}}></View>
                </View>
            </View>
        )
    }

    _renderSomething2( data,refreshDataHistory,loadDataHistory,loadingDataHistory) {
        var { w, h, p } = this.whp;
        var style = this.style
        return (

        <View accessible={true} accessibilityLabel={'TabMyRewardListHistWaitingListView'} style={{ justifyContent: 'flex-start',alignItems:'flex-start'}}>       
            <View> 
                <FlatList refreshing={this.state.refreshFlatListHistory} onRefresh={refreshDataHistory} accessible={true} accessibilityLabel={'FlatListRewardHistory'} data={data}  contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} renderItem={({ item, index }) => {
                    return (
                        <RewardCard accessible={true} accessibilityLabel={'MyRewardsScreenHistoryCard'} imageSetting={ this.imageSetting} callBackForceUpdate={this.props.callback} language={this.props.language} navigator={this.props.navigator} data={item} style={this.style.containerView1} fType={item.fType} ></RewardCard>

                    );
                }}
                    keyExtractor={item => item.fID}
                    onEndReached={loadDataHistory}
                    onEndReachedThreshold={SGHelperType.getThreshold()}
                    ListFooterComponent={()=>{
                        if(loadingDataHistory)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width: w,height:h*0.05}}></SGActivityIndicator>
                        else return null
                    }}
                    ListEmptyComponent={()=>{
                        return <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                    }}
                    >
                </FlatList>
                <View style={{width:w,height:w*0.3,backgroundColor:'transparent'}}></View>
            </View>
        </View>
        )
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var dataActive = this.props.myRewardActive;
        var dataHistory = this.props.myRewardHistory;
        var refreshData = this.props.refreshData;
        var refreshDataHistory = this.props.refreshDataHistory;
        var loadData = this.props.loadData;
        var loadDataHistory = this.props.loadDataHistory;
        var loadingData = this.props.loadingData;
        var loadingDataHistory = this.props.loadingDataHistory;
        var searchKeyword = this.props.searchKeyword;
        console.log(dataHistory);
        console.log(this.props.searchKeyword)
        console.log('search keyword di list')
        
        return (
            <View accessible={true} accessibilityLabel={'TabMyRewardListRootView'} style={style.mainView1}>
                <View accessible={true} accessibilityLabel={'TabMyRewardList2ndTabView'} style={style.secondTabView}>
                    {this.state.active1 ? (<TouchableOpacity>
                        <View accessible={true} accessibilityLabel={'TabMyRewardListActWLView'} style={style.secondTabActive}>
                            <Text accessible={true} accessibilityLabel={'TabMyRewardListActWL'} preset={Text.preset.titleH3B} style={style.textActive}>{SGLocalize.translate('MyRewardsScreen.Active')}</Text>
                        </View></TouchableOpacity>) : <TouchableOpacity onPress={() => this.onIconPress("1")} >
                            <View accessible={true} accessibilityLabel={'TabMyRewardListInActWLView'} style={style.secondTabInactive}>
                                <Text accessible={true} accessibilityLabel={'TabMyRewardListInActWL'} preset={Text.preset.titleH3} style={style.textInactive}>{SGLocalize.translate('MyRewardsScreen.Active')}</Text>
                            </View></TouchableOpacity>}
                    {this.state.active2 ? (<TouchableOpacity>
                        <View accessible={true} accessibilityLabel={'TabMyRewardListHistActWLView'} style={style.secondTabActive}>
                            <Text accessible={true} accessibilityLabel={'TabMyRewardListHistActWL'} preset={Text.preset.titleH3B} style={style.textActive}>{SGLocalize.translate('MyRewardsScreen.History')}</Text>
                        </View></TouchableOpacity>) : <TouchableOpacity onPress={() => this.onIconPress("2")} >
                            <View accessible={true} accessibilityLabel={'TabMyRewardListHistInActWLView'} style={style.secondTabInactive}>
                                <Text accessible={true} accessibilityLabel={'TabMyRewardListHistInActWL'} preset={Text.preset.titleH3} style={style.textInactive}>{SGLocalize.translate('MyRewardsScreen.History')}</Text>
                            </View></TouchableOpacity>}
                </View>

                
                <View accessible={true} accessibilityLabel={'TabMyRewardListData'} style={style.v2}>
                    {this.state.active1 ? this._renderSomething1(dataActive,refreshData,loadData,loadingData, searchKeyword) : null} 
                    {this.state.active2 ? this._renderSomething2(dataHistory,refreshDataHistory,loadDataHistory,loadingDataHistory) : null}
                </View>
            </View>
        );
    }
}
