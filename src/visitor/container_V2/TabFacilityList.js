

import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGIconText as IconText, SGIcon as Icon, SGText as Text, SGScrollView as ScrollView, SGPicker as Picker, SGTouchableOpacity as TouchableOpacity, SGImage as Image, SGFlatList as FlatList } from '../../core/control';
import { StyleSheet, Animated } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import { ParkingListHeader } from '../container_V2/ParkingListHeader';
import { ParkingAreaCard } from '../container_V2/ParkingAreaCard';
import { MallFacilityListCard } from '../container_V2/MallFacilityListCard';
import { FullFacilityCard } from '../container_V2/FullFacilityCard';
import {SGHelperWindow} from '../../core/helper'
import { tbLookupDAO } from '../db/tbLookupDAO';

export class TabFacilityList extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this.whp;
        var barWidth = w * 0.495;
        return StyleSheet.create({
            mainView1: { width: w, height: '100%', flexWrap: 'wrap', flexDirection: 'row', backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'flex-start' },
            vScrollView: { width: barWidth, height: '100%', alignItems: 'flex-end', paddingVertical: p * 2, borderRightWidth: w * 0.001, backgroundColor: 'rgba(38,38,38,0.95)', borderTopRightRadius: 5 * p, position: 'absolute' },
            tabIconButton: { width: barWidth - p * 4, marginHorizontal: 0, flexDirection: 'row', justifyContent: 'flex-start' },
            categoryImageContainer:  { width: w * 0.18 + p * 2, height: w * 0.18 + p * 2, marginRight: p },
            facilityCategoryImageActive:  { width: w * 0.18, height: w * 0.18, resizeMode: 'cover', borderRadius: p * 4 },
            facilityCategoryImageInActive:{ width: w * 0.18, height: w * 0.18, resizeMode: 'cover', backgroundColor: '#8A8A8A', borderRadius: p * 4 },
            categoryNameContainer: { width: w * 0.22, height: w * 0.22 + p * 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' },
            facilityNameText: { color: '#FFFFFF', maxWidth: w * 0.22 - p * 2, textAlign: 'center' },
            hideShowTabBtn: { width: w * 0.08, height: w * 0.35, resizeMode: 'cover', backgroundColor: 'transparent' },
            containerView1: { width: w, padding: p,height:h },
            // hideTabButtonView: { backgroundColor: '#fc2702', width: w * 0.05, height: w * 0.05, borderRadius: w },
            hideTabButtonIcon: { color: "white", },
            throwWHPContent: { width: w, height: h, padding: p },
            throwWHPParkingArea: { width: w * 0.97, height: h, padding: p },
            v2: { flex: 1, width: w, justifyContent: 'flex-start', width: w },
            text1: { textAlign: 'center', marginTop: w * 0.01, color: '#DCDCDC' },
            headerStoreList: { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', width: w, borderBottomWidth: p * 0.6, borderColor: '#E2E2E2' },
            filterBox: { justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#FAFAFA', marginTop: w * 0.011, width: (w - 2 * p) / 4, height: w * 0.05, borderWidth: w * 0.002, borderRadius: 6, shadowOpacity: 0.03 },
            // textFilterBox: { fontSize: w * 0.03 },
            picker: { width: w * 0.315 },
            contentView: { flex: 1, width: w },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(true);
        this.title = props.title;

        this.categoryList = this.props.facilityCategoryData;
        this.countFacilityData = this.props.facilityCategoryData;
        this.parkingTypeList = tbLookupDAO.getSpecificLookupByGroup('ParkingType');
        this.floorList = this.props.mallFloorData;
        this.dataParking = this.props.parkingListData;

        this.state = { pages: this.categoryList.data, selected: this.categoryList.data[0].key, selectedIndex: 0, showBar: true, selectedParking: 'default',flatListRender:0 }
        this.filteredFloorList = [];
        this.filteredParkingTypeList = [];
        this._updateFloorOptions(this.state.selectedIndex);
        this._updateParkingOptions();
        this._showBar = true;
        this._animBarX = new Animated.Value(1);
        this.language = this.props.language;
        this.ParkingAreaRef = React.createRef();
    }

    _updateFloorOptions(index){
        this.selectedFloor = "DefaultAll";
        var _arrTemp = [];
        console.log('_updateFloorOptions')
        console.log(this.countFacilityData);
        var _facilityList = this.countFacilityData.resultConstructFacilityList[index];
        for(var i=0;i<_facilityList.length;i++){
            console.log(_facilityList[i]);
            if(_arrTemp.indexOf(_facilityList[i].floorKey)===-1){
                _arrTemp.push(_facilityList[i].floorKey);
            }            
        }
        this.filteredFloorList = [];
        for(var i=0;i<this.floorList.data.length;i++){
            if(this.floorList.data[i].key==='DefaultAll' || _arrTemp.indexOf(this.floorList.data[i].key)!==-1){
                this.filteredFloorList.push(this.floorList.data[i]);
            }
        }
    }

    _updateParkingOptions(index){
        this.selectedParking = "default";
        var _arrTemp = [];
        var _parkingList = this.dataParking.data;
        console.log('westlife');
        console.log(_parkingList);
        console.log(this.parkingTypeList);
        for(var i=0;i<_parkingList.length;i++){
            var data = _parkingList[i]
            if (data.fDisabled !== 0) {
                if(_arrTemp.indexOf('pt3')===-1){ _arrTemp.push('pt3'); }
            }
            if (data.fPublic !== 0) {
                if(_arrTemp.indexOf('pt1')===-1){ _arrTemp.push('pt1'); }
            }
            if (data.fLadies !== 0) {
                if(_arrTemp.indexOf('pt2')===-1){ _arrTemp.push('pt2'); }
            }
            if (data.fValet !== 0) {
                if(_arrTemp.indexOf('pt4')===-1){ _arrTemp.push('pt4'); }
            }
            if (data.fGold !== 0) {
                if(_arrTemp.indexOf('pt5')===-1){ _arrTemp.push('pt5'); }
            }
            if (data.fVIP !== 0) {
                if(_arrTemp.indexOf('pt6')===-1){ _arrTemp.push('pt6'); }
            }
            if (data.fChargingStation !== 0) {
                if(_arrTemp.indexOf('pt7')===-1){ _arrTemp.push('pt7'); }
            }
        }
        this.filteredParkingTypeList = [];
        for(var i=0;i<this.parkingTypeList.length;i++){
            if(this.parkingTypeList[i].fValueKey==='default' || _arrTemp.indexOf(this.parkingTypeList[i].fValueKey)!==-1){
                this.filteredParkingTypeList.push(this.parkingTypeList[i]);
            }
        }
    }

    _filterFloor(selectedFloor, contentFloor) {
        var isCorrectFloor = (selectedFloor==='DefaultAll'?true:false);
        for (var i = 0; i < contentFloor.length; i++) {
            if (selectedFloor === contentFloor[i].id) {
                isCorrectFloor = true;
                break;
            }
        }
        return (isCorrectFloor);
    }

    _updateSelectedFloor(selectedFloor) {
        this.selectedFloor = selectedFloor;
        this.forceUpdate();
    }

    _onIconPress(selectedKey, index) {
        this.setState({ selected: selectedKey, selectedIndex: index })
        this._updateFloorOptions(index);
        if(this.countFacilityData.resultConstructFacilityList[index].length === 1){
            this.props.addViewFacility(this.countFacilityData.resultConstructFacilityList[index][0].key, this.countFacilityData.resultConstructFacilityList[index][0].buildingKey);
        }
        this.toggleBar();
    }

    toggleBar() {
        if(this._showBar){ this.hideBar();} 
        else{ this.showBar();}
        this._showBar = !this._showBar;
        this.forceUpdate();
    }

    hideBar(){
        this.baseControlCreateAnimation(this._animBarX,1,0,300,()=>{})
    }

    showBar(){
        this.baseControlCreateAnimation(this._animBarX,0,1,300,()=>{})
    }

    changeParkingFilter(v) {
        this.setState({ selectedParking: v })
    }

    acceptedParking(data) {
        if (this.state.selectedParking === 'default') { return true; }
        else if (this.state.selectedParking === 'pt3' && data.fDisabled !== 0) { return true; }
        else if (this.state.selectedParking === 'pt1' && data.fPublic !== 0) { return true; }
        else if (this.state.selectedParking === 'pt2' && data.fLadies !== 0) { return true; }
        else if (this.state.selectedParking === 'pt4' && data.fValet !== 0) { return true; }
        else if (this.state.selectedParking === 'pt5' && data.fGold !== 0) { return true; }
        else if (this.state.selectedParking === 'pt6' && data.fVIP !== 0) { return true; }
        else if (this.state.selectedParking === 'pt7' && data.fChargingStation !== 0) { return true; }
        return false;
    }

    refreshParkingListData()
    {
        this.setState(prevState => ({flatListRender:  prevState.flatListRender + 1}))
        this.ParkingAreaRef.current.forceUpdate();
        console.log('refreshParkingListData_YOHANES');
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var x = this.categoryList.data[this.state.selectedIndex];
        var index = this.state.selectedIndex
        return (
            <View accessible={true} accessibilityLabel={'TabFacilityListRootView'} style={style.mainView1}>

                <View accessible={true} accessibilityLabel={'TabFacilityListView2'} style={style.v2}>
                    <View style={style.contentView}>
                        { 
                            // parking area
                            (x.key === 'FC1') &&
                            <View accessible={true} accessibilityLabel={'TabFacilityListParkingView'} key={x.key} style={{ flex:1, width: '100%', marginHorizontal: 0, color: 'red', alignItems: 'flex-end', justifyContent:'flex-start' }}>
                                <ParkingListHeader accessible={true} accessibilityLabel={'TabFacilityListParkingHeader'} language={this.language} lastUpdated={this.props.lastUpdated} selectedParking={this.state.selectedParking} parkingTypeData={this.filteredParkingTypeList} changeParkingFilter={this.changeParkingFilter.bind(this)} acceptStyle={style.throwWHPContent}></ParkingListHeader>
                                <FlatList ref={this.ParkingAreaRef} accessible={true} accessibilityLabel={'TabFacilityListParkingList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'flex-end' }} data={this.dataParking.data} extraData={this.state.flatListRender} renderItem={({ item }) => {
                                    return (
                                        this.acceptedParking(item) === true ?
                                            (<ParkingAreaCard  ref={this.ParkingAreaRef} accessible={true} accessibilityLabel={'TabFacilityListParkingAreaCard'} contentKey={this.props.contentKey} language={this.language} imageSetting={this.props.imageSetting} text1={SGLocalize.translate('parkingAreaCard.text1')} navigator={this.props.navigator} data={item} acceptStyle={style.throwWHPParkingArea}></ParkingAreaCard>)
                                            :
                                            (null)
                                    );
                                }} keyExtractor={item => item.key}>
                                </FlatList>
                            </View>
                        }
                        {
                            (x.key !== 'FC1') &&                                
                            <View accessible={true} accessibilityLabel={'TabFacilityListContainerView'} key={x.key}>
                                <View   accessible={true} accessibilityLabel={'TabFacilityListHeaderView'} style={this.style.headerStoreList}>
                                    <Picker ref={ this.FacilityFloorRef} accessible={true} accessibilityLabel={'TabFacilityListOptionPicker'} shadowIntensity={0.8} textPreset={Text.preset.titleH4} mandatory single language={this.language.toUpperCase()} style={style.picker} optionList={this.filteredFloorList} value={this.selectedFloor} onValueChange={(v) => { this._updateSelectedFloor(v) }} />
                                </View>
                                {
                                    (this.countFacilityData.resultConstructFacilityList[index].length > 1) ?
                                        (
                                            <FlatList ref={this.FacilityListRef} accessible={true} accessibilityLabel={'TabFacilityListDataList'} showsVerticalScrollIndicator={false} data={this.countFacilityData.resultConstructFacilityList[index]} renderItem={({ item }) => {
                                                return (
                                                    (this.selectedFloor === item.floorKey || this.selectedFloor==='DefaultAll') ?
                                                    (<MallFacilityListCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountFacility+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'TabFacilityListMallFacilityCard'} currentUserData={this.props.currentUserData} language={this.language} dataFacility={item} navigator={this.props.navigator} imageSetting={this.props.imageSetting} likeText={SGLocalize.translate("SeeAllFavoritesStoreScreen.likeText")} locationText={SGLocalize.translate("SeeAllFavoritesStoreScreen.locationText")} contentKey={item.key} facilityName={item['fContentFacility' + this.language.toUpperCase()].fFacilityName} facilityCategory={item.facilityCategoryKey} floorLocation={item['fFloorName' + this.language.toUpperCase()]} placeName={item['fContentBuilding' + this.language.toUpperCase()].fBuildingName} placeImage={item['fContentBuilding' + this.language.toUpperCase()].fImageJSON[0][this.props.imageSetting].uri} facilityLocationDesc={item['fContentFacility' + this.language.toUpperCase()].fLocation} contentImage={item['fContentFacility' + this.language.toUpperCase()].fImageJSON[0][this.props.imageSetting].uri} contentImageShareButton={item['fContentFacility' + this.language.toUpperCase()].fImageJSON[0].thumbnailLow.uri} contentLiked={item.fLikeCountFacility} like={item.fUserLikedThis} shareMessage={item['fContentFacility' + this.language.toUpperCase()].fFacilityName} targetKey={item.buildingKey} canComment={item.fCanComment} style={style.containerView1}></MallFacilityListCard>)
                                                    :
                                                    (null)
                                                )
                                            }} keyExtractor={item => item.key}>
                                            </FlatList>)
                                        :
                                        (
                                            <ScrollView ref={this.FacilityListRef}>
                                                {
                                                    this.countFacilityData.resultConstructFacilityList[index].length > 0 ?
                                                        (<FullFacilityCard accessible={true} accessibilityLabel={'TabFacilityListFullFacilityCard'} currentUserData={this.props.currentUserData} language={this.language} dataFacility={this.countFacilityData.resultConstructFacilityList[index][0]} navigator={this.props.navigator} imageSetting={this.props.imageSetting} likeText={SGLocalize.translate("SeeAllFavoritesStoreScreen.likeText")} locationText={SGLocalize.translate("SeeAllFavoritesStoreScreen.locationText")} style={style.containerView1}></FullFacilityCard>
                                                        ) : (null)
                                                }
                                            </ScrollView>
                                        )
                                }
                            </View>
                        }
                    </View>
                    <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                    <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                    
                </View>
                <Animated.View accessible={true} accessibilityLabel={'TabFacilityListView1'} style={[style.vScrollView, {transform: [{ translateX: this._animBarX.interpolate({ inputRange: [0, 1], outputRange: [-w*0.495, 0] }) }]}]}>
                    <ScrollView accessible={true} accessibilityLabel={'TabFacilityListScrollView'} showsVerticalScrollIndicator={false} style={{ flex: 1 }} ref={this.scrollView}>
                        {
                            this.categoryList.data.map((x, index) => {
                                return (
                                    <TouchableOpacity key={x.key} onPress={this._onIconPress.bind(this, x.key, index)}>
                                        <View accessible={true} accessibilityLabel={'TabFacilityListInActiveView'} style={style.tabIconButton}>
                                            <View accessible={true} style={style.categoryImageContainer}>
                                                <IconText accessible={true} accessibilityLabel={'TabFacilityListInActiveIconText'} text={x.title} preset={IconText.preset.w6} style={this.state.selectedIndex === index ? style.facilityCategoryImageActive : style.facilityCategoryImageInActive} onPress={this._onIconPress.bind(this, x.key, index)} />
                                            </View>
                                            <View accessible={true} style={style.categoryNameContainer}>
                                                <Text accessible={true} accessibilityLabel={'TabFacilityListInActiveText'} preset={this.state.selected === x.key ? Text.preset.titleH4_5B : Text.preset.titleH4_5} numberOfLines={3} style={style.facilityNameText}>{x.title}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                    <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                    <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                   
                </Animated.View>
                <Animated.View accessible={true} accessibilityLabel={'TabFacilityListBottomView'} shadow style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', transform: [{ translateX: this._animBarX.interpolate({ inputRange: [0, 1], outputRange: [0, w*0.495] })}] }} >
                    <TouchableOpacity onPress={this.toggleBar.bind(this)}>
                        <View style={{width:w*0.09-p*1.5,height:w*0.22,backgroundColor:'rgba(38,38,38,0.95)',borderTopRightRadius: 3 * p, borderBottomRightRadius: 3 * p}}>
                            <Icon name={this._showBar?Icon.Icon.arrowLeft:Icon.Icon.arrowRight} preset={Icon.preset.h1} style={{ color: 'white', marginLeft:-p }}></Icon>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }
}
