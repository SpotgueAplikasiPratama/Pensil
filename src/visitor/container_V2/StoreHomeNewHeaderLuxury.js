import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGDialogBox as DialogBox, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, } from '../../core/control';
import { StyleSheet, Linking, Animated, StatusBar } from 'react-native';
import { SGLocalize } from "../locales/SGLocalize";
import { CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { CheckInButton } from '../component_V2/CheckInButton';
import { CheckOutButton } from '../component_V2/CheckOutButton';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow,SGHelperErrorHandling } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';
import idJSON from '../locales/id.json';
import enJSON from '../locales/en.json';
import cnJSON from '../locales/cn.json';
import image from '../asset/image';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';

export class StoreHomeNewHeaderLuxury extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { backgroundColor:'transparent', width: w, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            imageHeaderContainer: {paddingVertical:0, paddingHorizontal:0, width: w, backgroundColor: 'transparent', marginTop: 0, justifyContent: 'flex-start', alignItems: 'center' },
            placeCoverImage: {padding:0, marginVertical:0, marginHorizontal:0,width: w, height: '100%', resizeMode: 'cover', borderRadius: 0, justifyContent:'flex-start'},
            overlay: {padding:0, width: w, height: w, backgroundColor: 'rgba(0,0,0,0)', opacity: 1, justifyContent:'space-between'},
            thumbnailContainer: { marginLeft: p * 4, backgroundColor: 'transparent', position: 'absolute', top: w * 0.375 },
            placeThumbnailImage: { width: w * 0.28, height: w * 0.28, resizeMode: 'cover',borderRadius:4*p, elevation:1},
            checkInOutBtnContainer: { width: w - p * 4, height: w * 0.22, backgroundColor: 'transparent', justifyContent:    'flex-end',alignItems:'flex-end', position: 'absolute', top: w * 0.425,right:w*0.02 },
            placeDetailContainer: { width: w, paddingTop: 12*p, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: p * 4 },
            leftContainer: { backgroundColor:'transparent',width: w-4*p,flexWrap: 'wrap' ,flexDirection:'row',  justifyContent: 'flex-start', alignItems: 'flex-start' },
            leftContainer1: {backgroundColor:'transparent',width: w-4*p,flexDirection:'row',justifyContent:'flex-start',marginVertical:p},
            placeNameText: { color: 'white', marginTop:3*p},
            shortDescText: { color: 'white',  marginVertical: 0, marginBottom: p },
            typeLocationText: { color: 'white',  marginVertical: p },
            vLastVisited:{position:'absolute',right:2,bottom:-20},
            lastVisitText: { color: 'white', paddingRight:2*p},
            containerView1: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', },
            containerView2: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-evenly', marginBottom: 1.5 * p, borderRadius: p },
            containerView2_1: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start', width: w, },
            iconButton: { width: w, height: w, padding: p },
            arrowUp:{width:w,alignItems:'center'},
            iconwhatsapp:{ width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;
        this.state={show:true}
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
        this._animW = new Animated.Value(1);
        setTimeout((() => { if(this.state.show){this._changeHeader();} }).bind(this), SGHelperType.getSysParamsValueToInt('HeaderInterval'));
    }

    _getLikeResource(data) {
        var contentStoreID = data.fContentID;
        var contentStoreEN = data.fContentEN;
        var contentStoreCN = data.fContentCN;
        return (
            {
                fContentType: 'Store', fContentKey: data.storeKey, fText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText2: { id: idJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], en: enJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], cn: cnJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)] }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentStoreID.fStoreImageJSON, fImageEN: contentStoreEN.fStoreImageJSON, fImageCN: contentStoreCN.fStoreImageJSON, fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON }, fTargetKey: data.storeKey
            }
        )
    }

    _getCommentResource(data) {
        var contentStoreID = data.fContentID;
        var contentStoreEN = data.fContentEN;
        var contentStoreCN = data.fContentCN;

        return (
            {
                fUserImage: this.props.currentUserData.fProfileImageJSON, fContentType: 'Store', fContentKey: data.storeKey,
                fContentName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText1: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                fContentText2: { id: contentStoreID.fShortDescription, en: contentStoreEN.fShortDescription, cn: contentStoreCN.fShortDescription },
                fContentImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.storeKey
            }
        )
    }

    _constructFloorString(floorData) {
        var str = '';
        for (var i = 0; i < floorData.length; i++) {
            if (i === floorData.length - 1) { str = str + floorData[i]['fFloorName' + this.props.language.toUpperCase()] }
            else {
                str = str + floorData[i]['fFloorName' + (this.props.language).toUpperCase()] + ', '
            }
        }
        return (str);
    }
    _changeHeader() {
        if (this.state.show) { this.hideHeader(); }
        else { this.showHeader(); }
        this.setState({ show: !this.state.show });
    }

    hideHeader() {
        this.baseControlCreateAnimation(this._animW, 1, 0, 500, () => { this.forceUpdate();});
    }
    showHeader() {
        this.baseControlCreateAnimation(this._animW, 0, 1, 500, () => { this.forceUpdate();});
    }

    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        if(valid){
        Linking.canOpenURL(url
        ).then(supported => {
            if ((SGHelperType.left(url, 8) != 'https://')) {
                Linking.openURL('https://' + url);
            } else {
                Linking.openURL(url);
            }
        });
        }else{
            DialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };

    whatsappEnjoyer(data){
        try{
            console.log(data);
            var checkTrueData = true;

            // cek nomor whatsapp depanny ap
            if(data[0] == '+') var trueData = data.replace('+62','');
            else if (data[0] == '0') var trueData = data.replace('0','');
            else if (data[0] == '6') var trueData = data.replace('62','');
            else {
                var trueData = data;
                checkTrueData = false;
            }

            // Buat android yg gada replaceAll
            if (typeof String.prototype.replaceAll == "undefined") {  
                String.prototype.replaceAll = function(match, replace) {  
                    return this.replace(new RegExp(match, 'g'), () => replace);  
                }  
            }

            // kalo format nomor whatsapp bener
            if(checkTrueData){
                trueData = trueData.replaceAll('-','');
                trueData = trueData.replaceAll(' ','');
                trueData = trueData.replaceAll('–','');
            }

            // this.handleLink.bind(this, this.data.whatsapp);
            this.handleLink('https://wa.me/62'+trueData);
            console.log(trueData);
            dataHeader = this.props.headerData;
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: dataHeader.storeKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)
        } catch {
            console.log('WHATSAPP NOT FOUND KEKW');
        }
        
    }

    _addUserClick(jsonInput){
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }
    

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.headerData;
        var fullData = this.props.fullData;
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        var isAlreadyCheckIn = this.props.isAlreadyCheckIn;
        var shareParams = {MallName:data['fBuildingName' + this.props.language.toUpperCase()] , StorestoName:(dataContent.fStoreName).toUpperCase()}
        return (
            
            <View >
                    <StatusBar translucent={true} backgroundColor={'transparent'} statusBarStyle={'light-content'}/>
                    <View accessible={true} style={style.mainContainer}>
                        <Animated.View style={{padding:0, justifyContent:'flex-start',}}>
                            <Animated.View accessible={true} style={[style.imageHeaderContainer, {height: this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.45 + SGHelperWindow.getStatusBarHeight(), w] })}]}>
                                <Image accessible={true} accessibilityLabel={'StoreHomeHeaderBackgroundImage'} style={style.placeCoverImage} source={{ uri: dataContent.fStoreBackgroundImageJSON[0][this.props.imageSetting].uri }}>
                                    <Animated.View accessible={true} accessibilityLabel={'MallHomeHeaderOverlayView'} style={[style.overlay,{paddingVertical:0,marginVertical:0, height: '100%'} ]}>
                                        <Animated.Image source={require('../../core/asset/image/mall_top.png')} resizeMode={'stretch'} style={{position:'absolute',top:0, marginLeft:0, marginTop:-p, backgroundColor:'transparent',borderRadius:0, width:w, height:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w * 0.45 + SGHelperWindow.getStatusBarHeight())*0.35, w*0.35] }) }}></Animated.Image>
                                        <Animated.Image source={require('../../core/asset/image/mall_top.png')} resizeMode={'stretch'} style={{opacity:0.7, position:'absolute',top:0, marginLeft:0, marginTop:-p, backgroundColor:'transparent',borderRadius:0, width:w, height:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w * 0.45 + SGHelperWindow.getStatusBarHeight())*0.35, w*0.35] }) }}></Animated.Image>
                                        <Animated.Image source={require('../../core/asset/image/mall_bottom.png')} resizeMode={'stretch'} style={{position:'absolute',bottom:0, marginLeft:0, marginBottom:0, backgroundColor:'transparent',borderRadius:0, width:w, height:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w * 0.45 + SGHelperWindow.getStatusBarHeight())*0.55, w*0.6] }) }}></Animated.Image>
                                        <Animated.Image source={require('../../core/asset/image/mall_bottom.png')} resizeMode={'stretch'} style={{opacity:0.7,position:'absolute',bottom:0, marginLeft:0, marginBottom:0, backgroundColor:'transparent',borderRadius:0, width:w, height:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w * 0.45 + SGHelperWindow.getStatusBarHeight())*0.55, w*0.6] }) }}></Animated.Image>
                                    </Animated.View>
                                </Image>
                            </Animated.View>
                        </Animated.View>
                    
                        <Animated.View accessible={true} style={[style.placeDetailContainer,{marginTop:p*5,marginTop:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-29*p,-w*0.59]}), paddingTop:this._animW.interpolate({ inputRange: [0, 1], outputRange: [data.lastVisited !== null ?9*p:4*p,12*p] }),marginBottom:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-3*p,0] }) }]}>
                            <View accessible={true} style={style.leftContainer}>
                                <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                    <Text accessible={true} accessibilityLabel={'StoreHomeHeaderStoreName'} preset={Text.preset.titleH1B} style={style.placeNameText} numberOfLines={1} >{(dataContent.fStoreName).toUpperCase()}</Text>
                                </Animated.View>

                                <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                    <Text accessible={true} accessibilityLabel={'StoreHomeHeaderShortDesc'} preset={Text.preset.titleH3B} style={style.shortDescText} numberOfLines={1}>{dataContent.fShortDescription}</Text>
                                </Animated.View>

                                <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                    <Text accessible={true} accessibilityLabel={'StoreHomeHeaderStoreCategory'} preset={Text.preset.titleH3_5} style={style.typeLocationText} numberOfLines={1}>{VisitorHelper.getLocalizeDataFromLookUp('StoreCategory',data.storeCategory,this._language)}</Text>
                                </Animated.View>

                                <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                    <Text accessible={true} accessibilityLabel={'StoreHomeHeaderPlaceName'} preset={Text.preset.titleH3_5} style={style.typeLocationText} numberOfLines={1}>{data['fBuildingName' + this.props.language.toUpperCase()]}, {VisitorHelper.getLocalizeDataFromLookUp('City',data.city,this._language)}, {this._constructFloorString(data.floor)}</Text>
                                </Animated.View>

                                <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w-8*p)*0.3, 0]}),}}></Animated.View>
                                <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w-8*p)*0.7, w-8*p] }), }}>                               
                                    <View style={style.leftContainer1}>
                                        <CardIconButtonFavorite luxury onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'StoreHomeHeaderFavoritesIcon'} textColor='white' navigator={this.props.navigator} contentType='Store' contentKey={data.storeKey} active={data.fUserFavoriteThis} type={'favorite'} style={style.iconButton}></CardIconButtonFavorite>
                                        <CardIconButtonLike luxury onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'StoreHomeHeaderLikeIcon'} likePackage={this._getLikeResource(data)} textColor='white' navigator={this.props.navigator} contentType='Store' contentKey={data.storeKey} active={data.fUserLikedThis} type={'like'} style={style.iconButton} likeTenantGetReward={this.props.likeTenantGetReward}></CardIconButtonLike>
                                        <CardIconButtonComment luxury accessible={true} accessibilityLabel={'StoreHomeHeaderCommentIcon'} commentPackage={this._getCommentResource(data)} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.storeKey} canComment={data.fCanComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                                        <CardIconButtonShare luxury shareParams={shareParams} img={dataContent.fStoreImageJSON[0][this.props.imageSetting].uri} accessible={true} accessibilityLabel={'StoreHomeHeaderShareIcon'} textColor='white' navigator={this.props.navigator} contentType='Store' contentKey={data.storeKey} shareMessage={dataContent.fShareMessage} targetKey={data.storeKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                                        <CardIconButtonNotification luxury onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'StoreHomeHeaderNotificationIcon'} textColor='white' navigator={this.props.navigator} contentType='Store' contentKey={data.storeKey} active={data.fUserNotificationThis} type={'notification'} style={style.iconButton}></CardIconButtonNotification>
                                        {(fullData.whatsapp !== '' && fullData.whatsapp!== '–' && fullData.whatsapp !== ' ' && fullData.whatsapp !== '-')&&
                                            <TouchableOpacity onPress={() => {this.whatsappEnjoyer(fullData.whatsapp)}}>
                                                
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'}  source={{ uri: image.iconWhatsapp[this.props.imageSetting].url }} style={style.iconwhatsapp}></Image>
                                                
                                            </TouchableOpacity>
                                        } 
                                    </View>
                                </Animated.View>
                            </View>
                        </Animated.View>

                        {!this.props.noCheckButton &&
                            <Animated.View accessible={true} style={[style.checkInOutBtnContainer,{marginRight:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-7*p, 0] }), top:this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.36 -17*p+ SGHelperWindow.getStatusBarHeight(), w * 0.37 -5*p + SGHelperWindow.getStatusBarHeight()] })} , { transform: [{scale:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0.85,1] })},{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>
                                {isAlreadyCheckIn === true ?
                                    (<CheckOutButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckOutButton'} navigator={this.props.navigator} refreshCheckOut={this.props.refreshCheckOut} contentType='Store' contentKey={data.storeKey} ></CheckOutButton>)
                                    :
                                    (<CheckInButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckInButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Store' contentKey={data.storeKey} checkInReward={this.props.checkInReward} ></CheckInButton>)
                                }
                                <View style={style.vLastVisited}>                    
                                    {data.lastVisited !== null &&
                                        <Text accessible={true} preset={Text.preset.titleH6B} style={style.lastVisitText}>{(SGLocalize.translate("globalText.lastVisitedText"))} {VisitorHelper._decideDayText(data.lastVisited)}</Text>
                                    }
                                </View>
                            </Animated.View>
                        }
                        <Animated.View accessible={true} style={[style.thumbnailContainer,{marginLeft:this._animW.interpolate({ inputRange: [0, 1], outputRange: [1*p, 4*p] }), top:this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.195 + 11 * p - 6*p+ SGHelperWindow.getStatusBarHeight(), w * 0.205 + 11 * p+ SGHelperWindow.getStatusBarHeight()] })} , { transform: [{scale: this._animW.interpolate({ inputRange: [0, 1], outputRange: [0.85,1] })},{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>
                            <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: data.storeKey }) }} shadow>
                                <Image accessible={true} accessibilityLabel={'StoreHomeHeaderLogoImage'}  style={style.placeThumbnailImage} source={{ uri: dataContent.fStoreImageJSON[0][this.props.imageSetting].uri }}></Image>
                            </TouchableOpacity>
                        </Animated.View>
                        
                        <TouchableOpacity onPress={this._changeHeader.bind(this)} style={style.arrowUp}>
                            <Icon name={this.state.show?Icon.Icon.arrowUp:Icon.Icon.arrowDown} preset={Icon.preset.h3} style={{color: 'white', }}></Icon>
                        </TouchableOpacity>
                    </View>

            </View>
                  
        )
    }
}
