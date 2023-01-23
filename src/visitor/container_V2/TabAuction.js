import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import {  SGFlatList as FlatList,SGView as View, SGScrollView as ScrollView, SGText as Text, SGTouchableOpacity as TouchableOpacity,SGActivityIndicator } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation,SGHelperGlobalVar,SGHelperType  } from '../../core/helper';
import { EmptyDetailView } from './EmptyDetailView';
import {MyAuctionCard} from './MyAuctionCard';

export class TabAuction extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, justifyContent: 'flex-start',alignItems:'flex-start',flex:1 },
            throwWHP: { width: w, height: h, padding: p },
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
        this.state = { active1: true, active2: false,refreshFlatListData : false,refreshFlatListHistory:false  }
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

    _onCardActivePress(data) {
        SGHelperNavigation.navigatePush(this.props.navigator, 'AuctionDetail', { contentKey: data.auctionfID})
    }

    _onCardHistoryPress(data) {
        SGHelperNavigation.navigatePush(this.props.navigator, 'AuctionDetail', { contentKey: data.auctionfID });
    }



    _renderSomething1(data, loadData,loadingData,refreshData) {
        var { w, h, p } = this.whp;
        var style = this.style
        return (

            <View accessible={true} accessibilityLabel={'TabMyOrderMenuActOrderListView'} style={{ justifyContent: 'flex-start',alignItems:'flex-start'}}>
                
            {
               
                data.length !== 0 ?
                <View> 
                    <FlatList refreshing={this.state.refreshFlatListData} onRefresh={refreshData} accessible={true} accessibilityLabel={'FlatListOrderMenu'} data={data}  contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }}  renderItem={({ item, index }) => {
                        return (
                            <MyAuctionCard valid key={item.auctionfID} accessible={true} accessibilityLabel={'TabAuctionActive'} imageSetting={this.imageSetting} screen='' navigator={this.props.navigator} data={item} language={this.props.language} userData={this.props.userData} style={this.style.containerView1} onCardPress={this._onCardActivePress.bind(this, item)}   >
                            </MyAuctionCard>

                        );
                    }}
                        keyExtractor={item => item.fID}
                        onEndReached={loadData}
                        onEndReachedThreshold={SGHelperType.getThreshold()}
                        ListFooterComponent={()=>{
                            if(loadingData)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width: w,height:h*0.05}}></SGActivityIndicator>
                            else return null
                    }}
                        >
                    </FlatList>
                    <View style={{width:w,height:w*0.3,backgroundColor:'transparent'}}></View>
                </View>
                :
                (<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>)
            }
        </View>
        )
    }


    _renderSomething2(data,loadDataHistory,loadingDataHistory,refreshDataHistory) {
        var { w, h, p } = this.whp;
        var style = this.style
        return (

            <View accessible={true} accessibilityLabel={'TabMyOrderMenuHistOrderListView'} style={{ justifyContent: 'flex-start',alignItems:'flex-start'}}>
                
            {
               
                data.length !== 0 ?
                <View> 
                    <FlatList refreshing={this.state.refreshFlatListHistory} onRefresh={refreshDataHistory} accessible={true} accessibilityLabel={'FlatListRewardHistory'} data={data}  contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }}  renderItem={({ item, index }) => {
                        return (
                            <MyAuctionCard valid={false} key={item.auctionfID} accessible={true} accessibilityLabel={'TabAuctionActive'} imageSetting={this.imageSetting} screen='' navigator={this.props.navigator} data={item} language={this.props.language} userData={this.props.userData} style={this.style.containerView1} onCardPress={this._onCardHistoryPress.bind(this, item)}   >
                            </MyAuctionCard>

                        );
                    }}
                        keyExtractor={item => item.fID}
                        onEndReached={loadDataHistory}
                        onEndReachedThreshold={SGHelperType.getThreshold()}
                        ListFooterComponent={()=>{
                            if(loadingDataHistory)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width: w,height:h*0.05}}></SGActivityIndicator>
                            else return null
                    }}
                        >
                    </FlatList>
                    <View style={{width:w,height:w*0.3,backgroundColor:'transparent'}}></View>
                </View>
                :
                (<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>)
            }
        </View>
        )
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var dataActive = this.props.auctionData;
        var dataHistory = this.props.auctionDataHistory;
        var loadData = this.props.loadData;
        var loadDataHistory = this.props.loadDataHistory;
        var loadingData = this.props.loadingData;
        var loadingDataHistory = this.props.loadingDataHistory;
        var refreshData = this.props.refreshData;
        var refreshDataHistory = this.props.refreshDataHistory;

        return (
            <View accessible={true} accessibilityLabel={'TabMyOrderMenuRootView'} style={style.mainView1}>
                <View accessible={true} accessibilityLabel={'TabMyOrderMenu2ndTabView'} style={style.secondTabView}>
                    {this.state.active1 ? (<TouchableOpacity>
                        <View accessible={true} accessibilityLabel={'TabMyOrderMenuActOMView'} style={style.secondTabActive}>
                            <Text accessible={true} accessibilityLabel={'TabMyOrderMenuActOM'} preset={Text.preset.titleH3B} style={style.textActive}>{SGLocalize.translate('tabOrderMenu.Active')}</Text>
                        </View></TouchableOpacity>) : <TouchableOpacity onPress={() => this.onIconPress("1")} >
                            <View accessible={true} accessibilityLabel={'TabMyOrderMenuInActOMView'} style={style.secondTabInactive}>
                                <Text accessible={true} accessibilityLabel={'TabMyOrderMenuInActOM'} preset={Text.preset.titleH3} style={style.textInactive}>{SGLocalize.translate('tabOrderMenu.Active')}</Text>
                            </View></TouchableOpacity>}
                    {this.state.active2 ? (<TouchableOpacity>
                        <View accessible={true} accessibilityLabel={'TabMyOrderMenuHistActOMView'} style={style.secondTabActive}>
                            <Text accessible={true} accessibilityLabel={'TabMyOrderMenuHistActOM'} preset={Text.preset.titleH3B} style={style.textActive}>{SGLocalize.translate('tabOrderMenu.History')}</Text>
                        </View></TouchableOpacity>) : <TouchableOpacity onPress={() => this.onIconPress("2")} >
                            <View accessible={true} accessibilityLabel={'TabMyOrderMenuHistInActOMView'} style={style.secondTabInactive}>
                                <Text accessible={true} accessibilityLabel={'TabMyOrderMenuHistInActOM'} preset={Text.preset.titleH3} style={style.textInactive}>{SGLocalize.translate('tabOrderMenu.History')}</Text>
                            </View></TouchableOpacity>}
                </View>
                <View accessible={true} accessibilityLabel={'TabMyOrderMenuData'} style={style.v2}>
                    {this.state.active1 ? this._renderSomething1(dataActive,loadData,loadingData,refreshData) : null}
                    {this.state.active2 ? this._renderSomething2(dataHistory,loadDataHistory,loadingDataHistory,refreshDataHistory) : null}
                </View>
            </View>
        );
    }
}
