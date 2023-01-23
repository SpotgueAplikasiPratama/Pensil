/**
 * Version 1.2.0
 * 1. Yohanes March 29 2021
 * - add Error Handling
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGRootView as RootView, SGView as View, SGText as Text, SGTabView as TabView, SGButton as Button, SGActivityIndicator as ActivityIndicator, SGFlatList as FlatList } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { AddLocationAskAliceSearchBar } from '../../component_V2/AddLocationAskAliceSearchBar';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { AliceAddLocationCard } from '../../container_V2/AliceAddLocationCard';
import { VAliceResultAPI } from '../../api/VAliceResultAPI';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import {askAliceLastLocationData, askAliceLastLocationSelectedDAO} from '../../db/askAliceLastLocationSelectedDAO';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';

export class AddLocationAskAliceScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            listContainer: { width: w, height: h, backgroundColor: '#D6D6D6', paddingBottom: p * 7.5 },
            btnContainer: { position: 'absolute', bottom: p * 5 },
            button:{width:w*0.3,height:w*0.1},
        });
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }

    _setSearchKeyword(value) {
        this.searchKeyword.searchKeyword = value;
        this.forceUpdate();
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    checkAPIBatchStatusAllDone() {
        this.alreadyMount = true;
        this.forceUpdate()  
    }
    
    async _onRefreshAllItem() {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');

        console.log('testing run')
        this.status ={
            getBuildingMatrix:false,
            getDataPlace:false
        }
        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this),()=>{},false);

        this.baseAddAPIParallel('getLocationFilter', (async (v) => { return VFilterOptionsAPI.getLocationFilter(v); }).bind(this,this.Language), ((v) => {
            this._buildingMatrix = v;
        }).bind(this), null);
        

        if (this.searchKeyword.searchKeyword === '') {
            console.log(this._sortData)
            this.baseAddAPIParallel('getBuildingListCard', (async (v1,v2,v3,v4) => { return VAliceResultAPI.getBuildingListCard(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword.searchKeyword, this._filterData, this._sortData), ((v) => {
                this.dataPlace = v;
            }).bind(this), null);
        
        }
        else {
            this.baseAddAPIParallel('getBuildingListCardWithSearch', (async (v1,v2,v3,v4) => { return VAliceResultAPI.getBuildingListCardWithSearch(v1,v2,v3,v4); }).bind(this,this.Language, this.searchKeyword.searchKeyword, this._filterDataSearch, this._sortDataSearch), ((v) => {
                this.dataPlace = v;
            }).bind(this), null);
        }
        this.baseRunAPIParallel();

    }

    _onSelectedCard(key, nameID, nameEN, nameCN) {
        this.selectedPlace = { key: key, placeNameID: nameID, placeNameEN: nameEN, placeNameCN: nameCN };
        this.forceUpdate();
    }

    async _onApply() {
        var aliceLastLocation = await askAliceLastLocationSelectedDAO.getAliceLocation();
        if(aliceLastLocation.length ==0){
            await askAliceLastLocationSelectedDAO.addAliceLocation(this.selectedPlace,this.currentUser);
        }else{
            await askAliceLastLocationSelectedDAO.updateAliceLocation(aliceLastLocation[0],this.selectedPlace,this.currentUser);
        }

        var aliceLocation = await askAliceLastLocationSelectedDAO.getAliceLocation();
        SGHelperGlobalVar.setVar('GlobalLastSelectedPlace', aliceLocation[0].selectedPlace);
        
        SGHelperNavigation.goBack(this.props.navigation);
        
    }

    async _setFilter(dataFilter) {
        this._filterData = dataFilter;
        await this._onRefreshAllItem(true); 
    }

    async _setSort(dataSort) {
            this._sortData = dataSort; 
            if(this.searchKeyword.searchKeyword !== ''){
                this._sortDataSearch = dataSort;
                await this._onRefreshAllItem(true);    
            }else{
                await this._onRefreshAllItem(true);  
            }   
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        var { w, h, p } = this.WHP;
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.dataPlace = []
        this.searchKeyword = {searchKeyword:''};
        this.selectedPlace = SGHelperGlobalVar.getVar('GlobalLastSelectedPlace');
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this._filterData = filterDAO.getPlaceFilterData();
        this._sortData = sortDAO.getAlicePlaceNoSearchSortData(this.Language.toUpperCase());
        this._filterDataSearch = filterDAO.getPlaceFilterData();
        this._sortDataSearch = sortDAO.getAlicePlaceSearchSortData(this.Language.toUpperCase());
        this._buildingMatrix = [];
        this.alreadyMount = false;
        this.counterBatch1=0
        this.errorBatch1 = []
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'AskAliceAddLocationRoot'} style={style.mainContainer}>
                
                <AddLocationAskAliceSearchBar accessible={true} accessibilityLabel={'AddFavoritesScreenSearchBarPlace'} language={this.Language} searchKeyword={this.searchKeyword}  onRefreshAllItem={this._onRefreshAllItem.bind(this)} sortData={this.searchKeyword.searchKeyword !== '' ? (this._sortDataSearch) : (this._sortData)} onApplySort={ this._setSort.bind(this) } onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this.searchKeyword.searchKeyword !== '' ? this._filterDataSearch : this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => {  this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.throwWHP}></AddLocationAskAliceSearchBar>
                <RibbonHeader title={SGLocalize.translate("AddLocationAskAliceScreen.screenTitle")} ></RibbonHeader>
                {this.alreadyMount ?
                    this.dataPlace.length !== 0 ?
                        (<FlatList accessible={true} accessibilityLabel={'AskAliceLocationList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start' }} data={this.dataPlace} renderItem={({ item }) => {
                            return (
                                <AliceAddLocationCard data={item} selectedPlace={this.selectedPlace} language={this.Language} onSelectedCard={this._onSelectedCard.bind(this)} smallMode navigator={this.props.navigation} imageSetting={this.imageSetting} footer={false} likeText={SGLocalize.translate("SeeAllFavoritesPlaceScreen.likeText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesPlaceScreen.lastVisitedText")} likeIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.likeIconLabel")} notificationIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.notificationIconLabel")} favoriteIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.favoriteIconLabel")} contentKey={item.fID} style={style.throwWHP}></AliceAddLocationCard>
                            );
                        }} keyExtractor={item => item.fID}>
                        </FlatList>)
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                } 
                <View accessible={true} style={style.btnContainer}>
                    <Button  style={style.button} accessible={true} accessibilityLabel={'AskAliceAddLocationApplyButton'} preset={Button.preset.red} label={SGLocalize.translate("AddLocationAskAliceScreen.applyButtonText")} onPress={() => { this._onApply() }}></Button>
                </View>
            </RootView>
        );
    }
}
