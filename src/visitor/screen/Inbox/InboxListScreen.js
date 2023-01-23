
/**
 * Version 1.2.0
 * 1. Yohanes 29 March 2021
 * - add ErrorHandling
 */
/*
Version 1.2
Adding Paging By Melvin , 29 Maret 2021
*/

import React from 'react';
import { StyleSheet } from 'react-native';
import { SGView as View, SGRootView as RootView, SGScrollView as ScrollView, SGImage as Image, SGText as Text, SGActivityIndicator as ActivityIndicator,SGFlatList as FlatList } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperType,SGHelperWindow ,SGHelperErrorHandling} from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import image from '../../asset/image';
import { tbCCommentAPI } from '../../api/tbCCommentAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { InboxCard } from '../../container_V2/InboxCard';

export class InboxListScreen extends SGBaseScreen {

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'center' },
            containerView1: { width: w, height: h, padding: p },
            groupingHeader: { backgroundColor: '#D3D3D3', padding: p, flexDirection: 'row', width: w, justifyContent: 'space-between' },
            text1: { fontSize: w * 0.04, },
            icon: { fontSize: w * 0.05, },
            sv1_2: { backgroundColor: '#E6E6E6', paddingVertical: p * 0.5, justifyContent: 'center', alignItems: 'center', },
            throwWHP: { width: w, height: h, padding: p },
            noFavView: { flex: 1 },
            sadSmiley: { height: w * 0.325, width: w * 0.325, backgroundColor: 'transparent' },
            textEmpty: { color: '#d8d8d8' }
        });
    }

    async componentDidMount() {
        await this.refreshItem(true);
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.refreshItem();
        });
        this.alreadyMount = true;
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async refreshItem(resetPaging = false) {
        console.log("refreshItem")
        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()
            this.baseRunSingleAPIWithRedoOption('getUserInboxData', (async (v) => { return tbCCommentAPI.getUserInboxData(v) }).bind(this,this.paging), ((v) => {

                this.inboxData =v //await tbCCommentAPI.getUserInboxData(this.paging);
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
                this.pagingCounter = this.inboxData.length
                
                this.setState({ refresh: false });
                this.forceUpdate();
            }).bind(this),  (()=>{this.setState({ refresh: false,stopPulling:false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
        }else{
            this.forceUpdate()
        }     
    }

    async _onLoad(){

        if(!this.state.loading && !this.state.stopPulling){
            console.log("_OnLoad")
            this.setState({loading:true})
            this.paging = this.getPagingData()
            this.baseRunSingleAPIWithRedoOption('getUserInboxData', (async (v) => { return tbCCommentAPI.getUserInboxData(v) }).bind(this,this.paging), ((v) => {
                var resData = v//await tbCCommentAPI.getUserInboxData(this.paging);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.inboxData.push(resData[i])
                    }
                    this.pagingCounter = this.pagingCounter + resData.length
                } else this.setState({stopPulling:true})
                this.setState({loading:false})
            }).bind(this),  (()=>{this.setState({ refresh: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
        }
        
    }

    

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false
        });
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.groupData = [];
        this.inboxData = [];
         // Paging
         this.state = {  refresh: false ,refreshFlatList: false, loading:false, stopPulling:false };
         this.alreadyMount = false;
         this.refresh=false
         this.pagingCounter = 0
    }
    _readComment(data){
        data.fReadCreator='Y'
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var navigator = this.props.navigation;

      
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'InboxListScreenRootView'} style={style.mainContainer}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <RibbonHeader style={style.throwWHP} imageSetting={this.imageSetting} title={SGLocalize.translate("inboxListScreen.title")}></RibbonHeader>
                {this.alreadyMount ?
                    this.inboxData.length ?
                        <FlatList  refreshing={this.state.refreshFlatList} onRefresh={this.refreshItem.bind(this,true)} accessible={true} accessibilityLabel={'SeeAllFavoritesPlaceEventScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, justifyContent: 'flex-start', alignItems: 'center', paddingBottom: SGHelperWindow.getFooterHeight() + SGHelperWindow.getHeaderHeight() }} data={this.inboxData} renderItem={({ item }) => {
                            
                            return (
                                <InboxCard accessible={true} accessibilityLabel={'InboxGroupingInboxCard'} key={item.fID} imageSetting={this.imageSetting} navigator={this.props.navigation} language={this.Language} data={item} style={style.throwWHP} readCommentFake={()=>{this._readComment(item)}}></InboxCard>
                            );
                        }} keyExtractor={item => item.key} 
                        onEndReached={this._onLoad.bind(this)}
                        onEndReachedThreshold={SGHelperType.getThreshold()}
                        ListFooterComponent={()=>{
                            if( this.state.loading)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></ActivityIndicator>
                            else return null
                        }}
                       >
                        </FlatList>
                        :
                        <View accessible={true} accessibilityLabel={'InboxListScreenFavView'} style={style.noFavView}>
                            <Image accessible={true} accessibilityLabel={'InboxListScreenImage'} source={{ uri: image.sadSmiley[this.imageSetting].url }} style={style.sadSmiley}></Image>
                            <Text accessible={true} accessibilityLabel={'InboxListScreenFavEmptyText1'} preset={Text.preset.titleH1B} style={style.textEmpty}>{SGLocalize.translate("inboxListScreen.emptyText1")}</Text>
                            <Text accessible={true} accessibilityLabel={'InboxListScreenFavEmptyText2'} preset={Text.preset.titleH3B} style={style.textEmpty}>{SGLocalize.translate("inboxListScreen.emptyText2")}</Text>
                        </View>
                    :
                    <ActivityIndicator tabLabel={SGLocalize.translate('AddFavoritesScreen.storeTabTitle')} preset={ActivityIndicator.preset.h1} style={{ flex: 5 }}></ActivityIndicator>
                }
                <BottomNavigationContainer accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}