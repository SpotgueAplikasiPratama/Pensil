
/*
 * Version 1.3.0
 * 1. Yohanes 21 May 2021
 * - change NotificationGetByID
 * Version 1.2.0
 * Adding Paging By Melvin , 29 Maret 2021
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
*/

import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGScrollView as ScrollView, SGText as Text, SGActivityIndicator as ActivityIndicator, SGImage as Image, SGFlatList as FlatList } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { tbVNotificationAPI } from '../../api/tbVNotificationAPI'
import { NotificationCard } from '../../container_V2/NotificationCard'
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import image from '../../asset/image';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
export class NotificationScreen extends SGBaseScreen {

    getDataFilter(fUserKey) {
        return ([
            { name: 'fUserKey', operator: '=', value: fUserKey },
        ]);
    }

    getSortData() {
        return ([
            { name: 'fCreatedDate', descending: true, title: 'Newest on top', selected: true, visible: false },
        ]);
    }

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p,marginTop:(h/2)-SGHelperWindow.getHeaderHeight() },
            mainContainer: { width: w, height: h, backgroundColor: 'white' },
            notificationContainer: { width: w, height: h, backgroundColor: '#E0E0E0' },
            dateContainer: { width: w, height: w * 0.095, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 0, paddingLeft: p * 4, paddingRight: 0, marginRight: 0, borderColor: '#E0E0E0', borderTopWidth: p * 1.4, borderBottomWidth: w * 0.003 },
            dateText: { color: '#000000', marginVertical: 0 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: '',
            headerBackTitle: 'Back'
        });
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.arrFilter = this.getDataFilter(this.currentUserData.fID)
        this.arrSort = this.getSortData()
        this.notificationData = []
        this.indexHeader = []

        // Paging
        this.state = {  refresh: false ,refreshFlatList:false, loading:false, stopPulling:false };
        this.alreadyMount = false;
        this.refresh=false
        this.pagingCounter = 0
    }

    async componentDidMount() {
        await this._onRefresh(true)
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefresh()

        });
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    _constructNotification(data){
        if(this.notificationData.length!==0){
            //onLoad
            if(data.length!==0){
                var headerDate =  SGHelperType.formatDate(SGHelperType.convertNewDate(data[0].fCreatedDate), this.language)
                var counter = 0
                var lastIndexLength = this.notificationData.length -1
                for(var i=0;i<data.length;i++){
                    if(SGHelperType.formatDate(SGHelperType.convertNewDate(data[i].fCreatedDate), this.language)==headerDate){
                        this.notificationData.push(data[i])
                    }
                    else {
                        headerDate = SGHelperType.formatDate(SGHelperType.convertNewDate(data[i].fCreatedDate), this.language)
                        counter = counter+1;
                        this.indexHeader.push(counter+i + lastIndexLength)
                        this.notificationData.push({date: headerDate,header:true})
                        this.notificationData.push(data[i])
                    }    
                } 
                this.pagingCounter = this.pagingCounter + data.length
            }  
        }else{
            //onRefresh
            this.indexHeader = [0]
            if(data.length!==0){
                var headerDate =  SGHelperType.formatDate(SGHelperType.convertNewDate(data[0].fCreatedDate), this.language)
                this.notificationData.push( {date: headerDate,header:true})
                this.notificationData.push(data[0])
                var counter = 0;
                for(var i=1;i<data.length;i++){
                    if(SGHelperType.formatDate(SGHelperType.convertNewDate(data[i].fCreatedDate), this.language)==headerDate){
                        this.notificationData.push(data[i])
                    }
                    else {
                        headerDate = SGHelperType.formatDate(SGHelperType.convertNewDate(data[i].fCreatedDate), this.language)
                        counter = counter+1;
                        this.indexHeader.push(counter+i)
                        this.notificationData.push({date: headerDate,header:true})
                        this.notificationData.push(data[i])
                    }    
                } 
                this.pagingCounter = this.pagingCounter + data.length
            }  
            this.alreadyMount=true
           
        }
        this.forceUpdate()
        // if(this.notificationData.length)

    }

    async _onRefresh(resetPaging = false) {
        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()
            this.baseRunSingleAPIWithRedoOption('searchNotificationCard', (async (v1,v2,v3) => { return tbVNotificationAPI.searchNotificationCard(v1,v2,v3) }).bind(this,this.arrFilter, this.arrSort,this.paging), ((v) => {
                this.notificationData = []
                this.indexHeader=[]
                this._constructNotification(v)
                if(v.length<SGHelperType.getPaging()) this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
                this.setState({ refresh: false })
            }).bind(this),  (()=>{  this.setState({ refresh: false ,stopPulling:false}) }),  SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }
   

    async _onLoad(){
        if(!this.state.loading && !this.state.stopPulling){
            this.setState({loading:true})
            this.paging = this.getPagingData()
            console.log(this.paging)
            this.baseRunSingleAPIWithRedoOption('searchNotificationCard', (async (v1,v2,v3) => { return tbVNotificationAPI.searchNotificationCard(v1,v2,v3) }).bind(this,this.arrFilter, this.arrSort,this.paging), ((v) => {
                this._constructNotification(v)
                if(v.length<SGHelperType.getPaging()) this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
                this.setState({loading:false})
             
            }).bind(this), (()=>{  this.setState({loading:false}) }),  SGHelperGlobalVar.getVar("ResponTimes"));
        }    
    }

    async _onCardPress(data) {

        if (data.fRead === "N") {
            data.fRead ="Y"
        }
        this.forceUpdate()
        SGHelperNavigation.navigatePush(this.props.navigation, 'NotificationDetail', { fID: data.fID,fContentType:data.fContentType});
   }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var notificationData = this.notificationData
        var indexHeader = this.indexHeader
        var imageSetting = this.imageSetting
        console.log(SGHelperGlobalVar.getVar("token"))
       return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'NotificationListScreenRootView'} style={style.mainContainer}>
                 <CustomMenuBar btnBack accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                {/* <Animated.View style={{ height: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [0, SGHelperWindow.getHeaderHeight()] }), width: '100%' }} /> */}
                <RibbonHeader style={style.throwWHP} imageSetting={this.imageSetting} title={SGLocalize.translate("notificationScreen.title")}></RibbonHeader>
                <View accessible={true} style={style.notificationContainer}>
                    {this.alreadyMount ?
                        <View>
                            <FlatList accessible={true} style={{flex:1}} accessibilityLabel={'NotificationListScreenItemList'} data={notificationData} removeClippedSubviews={false} stickyHeaderIndices={indexHeader} refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} initialNumToRender={50} renderItem={({ item }) => {
                                if (SGHelperType.isDefined(item.header)) {
                                    return (
                                        <View accessible={true} accessibilityLabel={'NotificationListScreenItemView'} style={style.dateContainer}>
                                            <Text accessible={true} accessibilityLabel={'NotificationListScreenItemText'} key={SGHelperType.getGUID()} preset={Text.preset.titleH3B} style={style.dateText}>{item.date}</Text>
                                        </View>)
                                }
                                else {
                                    return (
                                        <NotificationCard accessible={true} accessibilityLabel={'NotificationListScreenCard'} onCardPress={this._onCardPress.bind(this, item)} key={item.fID} navigator={this.props.navigation} data={item} style={style.throwWHP} language={this._language} imageSetting={imageSetting}></NotificationCard>
                                    )
                                }
                            }} keyExtractor={item => item.fID} 
                            onEndReached={this._onLoad.bind(this)}
                            onEndReachedThreshold={SGHelperType.getThreshold()}
                            ListFooterComponent={()=>{
                                if( this.state.loading)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></ActivityIndicator>
                                else return null
                            }}
                            ListEmptyComponent={()=>{
                                return <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                            }}
                           // scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}
                            >
                            </FlatList>
                             <View style={{width:w,height:w*0.185,backgroundColor:'transparent'}}></View>
                         </View>
                            
                        :
                        <ActivityIndicator tabLabel={SGLocalize.translate('AddFavoritesScreen.storeTabTitle')} preset={ActivityIndicator.preset.h1} style={{ flex: 5 }}></ActivityIndicator>
                    }
                </View>
               
               
                    <BottomNavigationContainer accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}

