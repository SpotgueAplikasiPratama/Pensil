/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGRootView as RootView, SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGScrollView as ScrollView, SGViewPager as ViewPager, SGActivityIndicator as ActivityIndicator, SGWebView as WebView } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { FacilityDetailHeader } from '../../container_V2/FacilityDetailHeader';
import { LocationTag } from '../../component_V2/LocationTag';
import { VFacilityDetailAPI } from '../../api/VFacilityDetailAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';

export class FacilityDetailScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            scrollView: { backgroundColor: '#FFFFFF' },
            facilityNameText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4, marginTop: p * 5 },
            likedText: { color: '#A7A7A7', alignSelf: 'flex-start', marginHorizontal: p * 4, marginBottom: p * 2 },
            tag: { width: w * 0.93 },
            descriptionContainer: { width: w * 0.93, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 2 },
            descriptionText: { color: '#000000', textAlign: 'justify', alignSelf: 'flex-start' },
            webView: { width: '100%', height: w * 2 }
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
        try {
            this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
            this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
            this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
            this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
            this.baseRunSingleAPIWithRedoOption('getFacilityDetail', (async (v1) => { return VFacilityDetailAPI.getFacilityDetail(v1) }).bind(this,this.props.route.params.contentKey), (async(v) => {
                this.data = v //await VFacilityDetailAPI.getFacilityDetail(this.props.route.params.contentKey);
                this.dataContent = this.data['fContentFacility' + this.Language.toUpperCase()];
                this.dataContentFooter = this.data['fContentBuilding' + this.Language.toUpperCase()];
                if (this.alreadyMount === false) {
                    var jsonInput = { fID: '', fContentType: 'Facility', fContentKey: this.data.key, fTargetKey: this.data.buildingKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
                    await this._addUserView(jsonInput)
                }
                this.alreadyMount = true;
                this.forceUpdate();
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        } catch (error) {
            SGHelperErrorHandling.Handling(this._onRefreshAllItem.bind(this))
        }
        
    }
    async _addUserView(jsonInput){
        try {
            await tbVUserViewAPI.addUserView(jsonInput);
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addUserView.bind(this,jsonInput),null,false)
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: false,
            headerBackTitle: 'Back',
        });
        this.alreadyMount = false;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.contentKey = this.props.route.params.contentKey;
    }

    _getLikeResource(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentFacilityID = data.fContentFacilityID;
        var contentFacilityEN = data.fContentFacilityEN;
        var contentFacilityCN = data.fContentFacilityCN;
        return (
            { fContentType: 'Facility', fContentKey: data.key, fText1: { id: contentFacilityID.fFacilityName, en: contentFacilityEN.fFacilityName, cn: contentFacilityCN.fFacilityName }, fText2: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fText3: { id: contentFacilityID.fLongDescription, en: contentFacilityEN.fLongDescription, cn: contentFacilityCN.fLongDescription }, fImageID: contentFacilityID.fImageJSON, fImageEN: contentFacilityEN.fImageJSON, fImageCN: contentFacilityCN.fImageJSON, fTargetKey: data.buildingKey }
        )
    }

    _getCommentResource(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentFacilityID = data.fContentFacilityID;
        var contentFacilityEN = data.fContentFacilityEN;
        var contentFacilityCN = data.fContentFacilityCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'Facility', fContentKey: data.key,
                fContentName: { id: contentFacilityID.fFacilityName, en: contentFacilityEN.fFacilityName, cn: contentFacilityCN.fFacilityName },
                fContentText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText2: { id: contentFacilityID.fLongDescription, en: contentFacilityEN.fLongDescription, cn: contentFacilityCN.fLongDescription },
                fContentImage: { id: contentFacilityID.fImageJSON, en: contentFacilityEN.fImageJSON, cn: contentFacilityCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentFacilityID.fFacilityName, en: contentFacilityEN.fFacilityName, cn: contentFacilityCN.fFacilityName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.buildingKey
            }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        // console.log(this.data)
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'FacilityDetailScreenRootView'} style={style.mainContainer}>
                {
                    this.alreadyMount ?
                        this.data ?
                            <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'FacilityDetailScreenScrollView'} style={style.scrollView} contentContainerStyle={style.scrollView} showsVerticalScrollIndicator={false}>
                                <Text accessible={true} accessibilityLabel={'FacilityDetailScreenContentName'} preset={Text.preset.titleH1B} style={style.facilityNameText}>{this.dataContent.fFacilityName}</Text>
                                <Text accessible={true} accessibilityLabel={'FacilityDetailScreenLikeCount'} preset={Text.preset.titleH4B} style={style.likedText}>{this.data.fLikeCountFacility} {SGLocalize.translate('globalText.likeCountText')}</Text>
                                <FacilityDetailHeader onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountFacility+=c; this.forceUpdate();}).bind(this,this.data)} accessible={true} accessibilityLabel={'FacilityDetailScreenHeader'} imageSetting={this.imageSetting} language={this.Language} likePackage={this._getLikeResource(this.data)} commentPackage={this._getCommentResource(this.data)} footerName={this.dataContentFooter.fBuildingName} footerLogo={this.dataContentFooter.fImageJSON[0][this.imageSetting].uri} footerLikedCount={this.data.fLikeCountBuilding} imageSlider={this.dataContent.fImageJSON} isUserLikeThis={this.data.fUserLikedThis} contentKey={this.data.key} buildingKey={this.data.buildingKey} navigator={this.props.navigation} city={this.data.location} shareMessage={this.data['fContentFacility' + this.Language.toUpperCase()].fFacilityName} targetKey={this.data.buildingKey} canComment={this.data.fCanComment} style={style.throwWHP}></FacilityDetailHeader>
                                <LocationTag accessible={true} accessibilityLabel={'FacilityDetailScreenLocationTag'} style={style.tag} floorLocation={this.data['fFloorName' + this.Language.toUpperCase()]} locationHint={this.dataContent['fLocation']}></LocationTag>
                                <View accessible={true} accessibilityLabel={'FacilityDetailScreenContentView'} style={style.descriptionContainer}>
                                    {this.dataContent.fTypeDetail === 'longdescription' ?
                                        (<Text accessible={true} accessibilityLabel={'FacilityDetailScreenDescText'} preset={Text.preset.titleH3} style={style.descriptionText}>{this.dataContent.fLongDescription}</Text>)
                                        :
                                        (null)
                                    }
                                    {this.dataContent.fTypeDetail === 'url' && this.dataContent.fURL !== '' ?
                                        <View style={{width:w-16*p,height:h}}> 
                                            <WebView accessible={true} accessibilityLabel={'FacilityDetailUrl'} style={{flex:1,backgroundColor:'white'}} source={{  uri: this.dataContent.fURL }}></WebView>
                                        </View>
                                       
                                        :
                                        (null)
                                    }
                                    {this.dataContent.fTypeDetail === 'html' && this.dataContent.fHTML !== '' ?
                                        <View style={{width:w-16*p,height:h}}> 
                                            <WebView accessible={true} accessibilityLabel={'FacilityDetailUrl'} style={{flex:1,backgroundColor:'white'}} source={{ html: this.dataContent.fHTML  }}></WebView>
                                        </View>
                                        :
                                        (null)
                                    }
                                </View>
                            </ScrollView>
                            :
                            (null)
                        :
                        (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                </Animated.View>
                {/* <BottomNavigationContainer accessible={true} accessibilityLabel={'FacilityDetailScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer> */}
            </RootView>
        );
    }
}
