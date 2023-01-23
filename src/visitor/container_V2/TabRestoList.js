/*
* Version 1.2.0
* Leon, 4 May 2021
  - Fix Like, Fix Favorite, Fix Notification
*/
import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGIconText as IconText, SGIcon as Icon, SGText as Text, SGScrollView as ScrollView, SGPicker as Picker, SGTouchableOpacity as TouchableOpacity, SGFlatList as FlatList } from '../../core/control';
import { StyleSheet, Animated } from 'react-native';
import { MallRestoListCard } from '../container_V2/MallRestoListCard';
import { SGLocalize } from '../locales/SGLocalize';
import idJSON from '../locales/id.json';
import enJSON from '../locales/en.json';
import cnJSON from '../locales/cn.json';
import { tbLookupDAO } from '../db/tbLookupDAO';
import {SGHelperWindow,SGHelperGlobalVar} from '../../core/helper'

export class TabRestoList extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this.whp;
        var barWidth = w * 0.495;
        return StyleSheet.create({
            mainView1: { width: w, height: '100%', flexWrap: 'wrap', flexDirection: 'row', backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'flex-start' },
            vScrollView: { width: barWidth, height: '100%', alignItems: 'flex-end', paddingVertical: p * 2, borderRightWidth: w * 0.001, backgroundColor: 'rgba(38,38,38,0.95)', borderTopRightRadius: 5 * p, position: 'absolute' },
            tabIconButton: { width: barWidth - p * 4, marginHorizontal: 0, flexDirection: 'row', justifyContent: 'flex-start' },
            categoryImageContainer:  { width: w * 0.18 + p * 2, height: w * 0.18 + p * 2, marginRight: p },
            restoCategoryImageActive: { width: w * 0.18, height: w * 0.18, resizeMode: 'cover', borderRadius: p * 4 },
            restoCategoryImageInActive: { width: w * 0.18, height: w * 0.18, resizeMode: 'cover', backgroundColor: '#8A8A8A', borderRadius: p * 4 },
            categoryNameContainer: { width: w * 0.22, height: w * 0.22 + p * 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' },
            facilityNameText: { color: '#FFFFFF', maxWidth: w * 0.22 - p * 2, textAlign: 'center' },
            containerView1: { width: w, padding: p, },
            v2: { flex: 1, width: w, justifyContent: 'flex-start', width: w },
            text1: { textAlign: 'center', marginTop: w * 0.01, color: '#DCDCDC' },
            headerStoreList: { justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', width: w, borderBottomWidth: p * 0.6, borderColor: '#E2E2E2' },
            filterBox: { justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#FAFAFA', marginTop: w * 0.011, width: (w - 2 * p) / 4, height: w * 0.05, borderWidth: w * 0.002, borderRadius: 6, shadowOpacity: 0.03 },
            picker: { width: w * 0.315,marginLeft:2*p },
            contentView: { flex: 1, width: w },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(true);
        this.title = props.title;

        this.categoryList = this.props.restoCategoryData;
        this.dataResto = this.props.restoCategoryData;
        this.restoCuisineList = this.props.restoCuisineData;
        this.floorList = this.props.mallFloorData;
        this.state = { pages: this.categoryList.data, selected: this.categoryList.data[0].key, selectedIndex: 0}
        this.filteredFloorList = [];
        this.filteredCuisineList = [];
        this._updateFloorOptions(this.state.selectedIndex);
        this.flatListRef = React.createRef();
        this._updateCuisineOptions(this.state.selectedIndex);
        this._showBar = true;
        this._animBarX = new Animated.Value(1);
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }
    _updateFloorOptions(index){
        this.selectedFloor = "DefaultAll";
        var _arrTemp = [];
        var _restoList = this.dataResto.resultConstructRestoList[index];
        for(var i=0;i<_restoList.length;i++){
            for(var j=0;j<_restoList[i].floor.length;j++){
                if(_arrTemp.indexOf(_restoList[i].floor[j].id)===-1){
                    _arrTemp.push(_restoList[i].floor[j].id);
                }            
            }
        }
        this.filteredFloorList = [];
        for(var i=0;i<this.floorList.data.length;i++){
            if(this.floorList.data[i].key==='DefaultAll' || _arrTemp.indexOf(this.floorList.data[i].key)!==-1){
                this.filteredFloorList.push(this.floorList.data[i]);
            }
        }
    }
    _updateCuisineOptions(index){
        this.selectedCuisine = "DefaultAll";
        var _arrTemp = [];
        var _restoList = this.dataResto.resultConstructRestoList[index];
        for(var i=0;i<_restoList.length;i++){
            if(_arrTemp.indexOf(_restoList[i].fCuisine)===-1){
                _arrTemp.push(_restoList[i].fCuisine);
            }            
        }
        this.filteredCuisineList = [];
        for(var i=0;i<this.restoCuisineList.data.length;i++){
            if(this.restoCuisineList.data[i].key==='DefaultAll' || _arrTemp.indexOf(this.restoCuisineList.data[i].key)!==-1){
                this.filteredCuisineList.push(this.restoCuisineList.data[i]);
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

    _updateSelectedCuisine(selectedCuisine) {
        this.selectedCuisine = selectedCuisine;
        this.forceUpdate();
    }

    _onIconPress(selectedKey, index) {
        this.setState({ selected: selectedKey, selectedIndex: index })
        this._updateFloorOptions(index);
        this._updateCuisineOptions(index);
        this.flatListRef.current.scrollToIndex({index: 0})
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

    _getLikeResource(data) {
        var contentRestoID = data.fContentID;
        var contentRestoEN = data.fContentEN;
        var contentRestoCN = data.fContentCN;
        return (
            { fContentType: 'Resto', fContentKey: data.key, fText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText2: { id: idJSON.restoCategory[tbLookupDAO.getLookUpValue(data.restoCategoryKey)], en: enJSON.restoCategory[tbLookupDAO.getLookUpValue(data.restoCategoryKey)], cn: cnJSON.restoCategory[tbLookupDAO.getLookUpValue(data.restoCategoryKey)] }, fText3: { id: this.props.placeContentData.fContentID.fBuildingName, en: this.props.placeContentData.fContentEN.fBuildingName, cn: this.props.placeContentData.fContentCN.fBuildingName }, fImageID: contentRestoID.fStoreImageJSON, fImageEN: contentRestoEN.fStoreImageJSON, fImageCN: contentRestoCN.fStoreImageJSON, fTargetKey: data.key }
        )
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var x = this.dataResto.resultConstructRestoList[this.state.selectedIndex];
        var index = this.state.selectedIndex;
        return (
            <View accessible={true} accessibilityLabel={'TabRestoListRootView'} style={style.mainView1}>
                <View accessible={true} accessibilityLabel={'TabRestoListView2'} style={style.v2}>
                    <View accessible={true} accessibilityLabel={'TabRestoListHeader'} style={this.style.headerStoreList}>
                        <Picker accessible={true} accessibilityLabel={'TabRestoListCuisinePicker'} shadowIntensity={0.2} textPreset={Text.preset.titleH4}  mandatory single language={(this.props.language).toUpperCase()} style={style.picker}  optionList={this.filteredCuisineList} value={this.selectedCuisine} onValueChange={(v) => { this._updateSelectedCuisine(v) }} />
                        <Picker accessible={true} accessibilityLabel={'TabRestoListFloorPicker'} shadowIntensity={0.2} textPreset={Text.preset.titleH4} mandatory single language={(this.props.language).toUpperCase()} style={style.picker}  optionList={this.filteredFloorList} value={this.selectedFloor} onValueChange={(v) => { this._updateSelectedFloor(v) }} />
                    </View>
                    <View>
                        <View style={style.contentView} >
                            <FlatList ref={this.flatListRef} accessible={true} accessibilityLabel={'TabRestoListLItemist'} key={x.key} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'flex-end' }} data={this.dataResto.resultConstructRestoList[index]} renderItem={({ item }) => {
                                return (
                                        (this._filterFloor(this.selectedFloor, item.floor) ?
                                            (this.selectedCuisine === 'DefaultAll' || this.selectedCuisine === item.fCuisine ?
                                                (<MallRestoListCard onNotification={((item, s)=>{ item.fUserNotificationThis = s; this.forceUpdate();}).bind(this, item)} onFavorite={((item, s)=>{ item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, item)} onLike={((item, s,c)=>{ item.fUserLikedThis = s; item.fLikeCountStore+=c; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'TabRestoListMallRestoCard'} likePackage={this._getLikeResource(item)} language={this.props.language} navigator={this.props.navigator} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SeeAllFavoritesStoreScreen.likeText")} locationText={SGLocalize.translate("SeeAllFavoritesStoreScreen.locationText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesStoreScreen.lastVisitedText")} key={item.key} contentKey={item.key} restoName={item['fContent' + this.props.language.toUpperCase()].fStoreName} restoCategory={item.restoCategoryKey} restoCuisine={item.fCuisine} restoFloor={item.floor} lastVisited={item.lastVisited} likeCount={item.fLikeCountStore} isUserLikedThis={item.fUserLikedThis} contentImage={item['fContent' + this.props.language.toUpperCase()].fStoreImageJSON[0][this.props.imageSetting].uri} notification={item.fUserNotificationThis} favorite={item.fUserFavoriteThis} isHalal={SGLocalize.translate("isHalal." + item.isHalal)} style={style.containerView1}></MallRestoListCard>)
                                                : (null)
                                            )
                                            : (null)
                                        )
                                );
                            }} keyExtractor={item => item.key}>
                            </FlatList>
                        </View>
                        <View style={{width:w,height:w*0.3,backgroundColor:'transparent'}}></View>
                    </View> 
                </View>
                <Animated.View accessible={true} accessibilityLabel={'TabRestoListView1'} style={[style.vScrollView, {transform: [{ translateX: this._animBarX.interpolate({ inputRange: [0, 1], outputRange: [-w*0.495, 0] }) }]}]}>
                    <ScrollView  accessible={true} accessibilityLabel={'TabRestoListScrollView'} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        {
                            this.categoryList.data.map((x, index) => {
                                return (
                                    <TouchableOpacity key={x.key} onPress={this._onIconPress.bind(this, x.key, index)}>
                                        <View accessible={true} accessibilityLabel={'TabRestoListActiveView'} style={style.tabIconButton}>
                                            <View accessible={true} style={style.categoryImageContainer}>
                                                <IconText accessible={true} accessibilityLabel={'TabRestoListActiveIconText'} text={x.title} preset={IconText.preset.w6} style={this.state.selectedIndex === index ? style.restoCategoryImageActive : style.restoCategoryImageInActive} onPress={this._onIconPress.bind(this, x.key, index)} />
                                            </View>
                                            <View accessible={true} style={style.categoryNameContainer}>
                                                <Text accessible={true} accessibilityLabel={'TabRestoListActiveText'} preset={this.state.selected === x.key ? Text.preset.titleH4_5B : Text.preset.titleH4_5} numberOfLines={3} style={style.facilityNameText}>{x.title}</Text>
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
                <Animated.View accessible={true} accessibilityLabel={'TabRestoListBottomView'} shadow style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', transform: [{ translateX: this._animBarX.interpolate({ inputRange: [0, 1], outputRange: [0, w*0.495] })}]}} >
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
