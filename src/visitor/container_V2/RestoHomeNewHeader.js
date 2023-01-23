import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGDialogBox as DialogBox, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGIconButton as IconButton } from '../../core/control';
import { StyleSheet, Linking, Animated } from 'react-native';
import { SGLocalize } from "../locales/SGLocalize";
import { CardIconButton,CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { CheckInButton } from '../component_V2/CheckInButton';
import { CheckOutButton } from '../component_V2/CheckOutButton';
import { CheckOutButtonSmall } from '../component_V2/CheckoutButtonSmall';
import { CheckInButtonSmall } from '../component_V2/CheckInButtonSmall';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperStyle,SGHelperErrorHandling } from '../../core/helper';
import { VisitorHelper } from '../helper/VisitorHelper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import idJSON from '../locales/id.json';
import enJSON from '../locales/en.json';
import cnJSON from '../locales/cn.json';
import image from '../asset/image';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';

export class RestoHomeNewHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'},
            coverImageContainer: { width: w, backgroundColor: '#FFFFFF', marginTop: p * 8.5, justifyContent: 'center', alignItems: 'center' },
            coverImage: { width: w, height: w * 0.47, resizeMode: 'cover', borderRadius: 0 },
            coverOverlay: { width: w, height: w * 0.47, backgroundColor: '#000000', opacity: 0.3 },
            // tenatDetailContainer: { width: w, backgroundColor: '#FFFFFF', paddingVertical: 0, paddingHorizontal: p * 4, paddingTop: w * 0.13, justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'center' },
            nameText: { color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0, marginBottom: p },
            shortDescText: { color: SGHelperStyle.color.SGText.TextGrey, marginVertical: 0, marginBottom: p },
            categoryText: { color: SGHelperStyle.color.SGText.TextGrey, marginVertical: 0, marginBottom: p },
            foodPreferenceText: { color: SGHelperStyle.color.SGText.TextGrey, marginVertical: 0, marginBottom: p },
            // bottomTenatDetailContainer: { width: w - p * 6, flexDirection: 'row', justifyContent: 'space-between' },
            placeNameText: { color: SGHelperStyle.color.SGText.TextGrey, marginVertical: 0, marginBottom: p, alignSelf: 'flex-start' },
            // iconContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
            iconButton: { width: w,height: w, padding: p },
            thumbnailContainer: { marginLeft: p * 4, backgroundColor: 'transparent', position: 'absolute',top: w * 0.375},
            thumbnailImage: {width: w * 0.28, height: w * 0.28, resizeMode: 'contain',borderRadius:4*p,elevation:1 },
            checkInOutBtnContainer: { width: w - p * 4, height: w * 0.22, backgroundColor: 'transparent', justifyContent: 'flex-end',alignItems:'flex-end', position: 'absolute', top: w * 0.425,right:w*0.02 },
            placeDetailContainer: { width: w, paddingTop: 12*p, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: p * 4 },
            leftContainer: { width: w-4*p, flexWrap: 'wrap' ,flexDirection:'row',  justifyContent: 'flex-start', alignItems: 'flex-start' },
            leftContainer1: {width: w-2*p,flexDirection:'row',justifyContent:'flex-start',marginVertical:p},
            vLastVisited:{position:'absolute',right:2,bottom:-20},
            lastVisitText: { color: SGHelperStyle.color.SGText.TextGrey},
            arrowUp:{width:w,alignItems:'center'},
            iconwhatsapp:{ width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent' },
            //new Header
            // imageHeaderContainerNew: { width: w, backgroundColor: '#FFFFFF', marginTop: p * 2.5, justifyContent: 'center', alignItems: 'center'  },
            // placeCoverImageNew: { width: w, height: w * 0.13, resizeMode: 'cover', borderRadius:0 },
            // overlayNew:{width: w, height: w * 0.39, backgroundColor: '#000000', opacity: 0.3},
            // placeThumbnailImageNew: { width: w * 0.23, height: w * 0.23, resizeMode: 'cover',borderRadius:4*p},
            // checkInOutBtnContainerNew: { width: w - p * 4, height: w * 0.16, backgroundColor: 'transparent', justifyContent: 'flex-end',alignItems:'flex-end', position: 'absolute', top: w * 0.34,right:w*0.02 },
            // lastVisitTextNew: { color: '#A2A2A2',paddingRight:2*p},
            // placeDetailContainerNew: { position:'absolute', width: w, paddingTop: 28*p,flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end',  },
            // thumbnailContainerNew: { marginLeft: p * 3, backgroundColor: 'transparent', position: 'absolute', top: w * 0.26 + 11*p },
            // arrowDownNew:{alignSelf:'center',height:w*0.14, marginBottom:-p, width:w*0.1, alignItems:'center', justifyContent:'flex-end', backgroundColor:'transparent'},
            // vViewContent:{width:w,height:w*0.25},
            // placeNameTextNew: { position:'absolute',bottom:30,left:20},
            // typeLocationTextNew: { position:'absolute',bottom:10,left:20},
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

    _getLikeResource(data) {
        var contentRestoID = data.fContentID;
        var contentRestoEN = data.fContentEN;
        var contentRestoCN = data.fContentCN;

        return (
            { fContentType: 'Resto', fContentKey: data.restoKey, fText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText2: { id: idJSON.restoCategory[tbLookupDAO.getLookUpValue(data.restoCategory)], en: enJSON.restoCategory[tbLookupDAO.getLookUpValue(data.restoCategory)], cn: cnJSON.restoCategory[tbLookupDAO.getLookUpValue(data.restoCategory)] }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentRestoID.fStoreImageJSON, fImageEN: contentRestoEN.fStoreImageJSON, fImageCN: contentRestoCN.fStoreImageJSON, fTargetKey: data.restoKey }
        )
    }

    _getCommentResource(data) {
        var contentRestoID = data.fContentID;
        var contentRestoEN = data.fContentEN;
        var contentRestoCN = data.fContentCN;

        return (
            {
                fUserImage: this.props.currentUserData.fProfileImageJSON, fContentType: 'Resto', fContentKey: data.restoKey,
                fContentName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText1: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                fContentText2: { id: contentRestoID.fShortDescription, en: contentRestoEN.fShortDescription, cn: contentRestoCN.fShortDescription },
                fContentImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetKey: data.restoKey
            }
        )
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
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: dataHeader.restoKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
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
        var shareParams = {MallName:data['fBuildingName' + this.props.language.toUpperCase()] , StorestoName:(dataContent.fStoreName).toUpperCase() }
        
        console.log('isAlreadyCheckIn')
        console.log(isAlreadyCheckIn);
        return (
            <View >
                <View accessible={true} style={style.mainContainer}>
                    <Animated.View style={{marginTop: this._animW.interpolate({ inputRange: [0, 1], outputRange: [-11*p,0] })}}>
                        <Animated.View accessible={true} style={[style.coverImageContainer, { overflow: 'hidden', height: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [w * 0.49, w * 0.28] }) : w * 0.49 }]}>
                            <Image accessible={true} accessibilityLabel={'RestoHomeHeaderRootImage'} style={style.coverImage} source={{ uri: dataContent.fStoreBackgroundImageJSON[0][this.props.imageSetting].uri }}>
                                <View accessible={true} accessibilityLabel={'RestoHomeHeaderOverlayView'} style={style.coverOverlay}></View>
                            </Image>
                        </Animated.View>
                    </Animated.View>

                    <Animated.View accessible={true} style={[style.placeDetailContainer,{paddingTop:this._animW.interpolate({ inputRange: [0, 1], outputRange: [data.lastVisited !== null ?9*p:4*p,12*p] }),marginBottom:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-3*p,0] }) }]}>
                        <View accessible={true} style={style.leftContainer}>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'RestoHomeHeaderNameText'} preset={Text.preset.titleH1B} style={style.nameText} numberOfLines={1} >{(dataContent.fStoreName).toUpperCase()}</Text>
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'RestoHomeHeaderShortDesc'} preset={Text.preset.titleH3} style={style.shortDescText} numberOfLines={2}>{dataContent.fShortDescription}</Text>
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'RestoHomeHeaderRestoCategory'} preset={Text.preset.titleH4} style={style.categoryText} numberOfLines={1}>{VisitorHelper.getLocalizeDataFromLookUp('RestoCategory',data.restoCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',data.restoCuisine,this._language)}</Text>
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'RestoHomeHeaderHalalText'} preset={Text.preset.titleH4} style={style.foodPreferenceText} numberOfLines={1}>{SGLocalize.translate('isHalal.' + data.isHalal)} {SGLocalize.translate('isVegetarian.' + data.isVegetarian)}</Text>
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'RestoHomeHeaderPlaceName'} preset={Text.preset.titleH4} style={style.placeNameText} numberOfLines={2}>{data['fBuildingName' + this.props.language.toUpperCase()]}, {VisitorHelper.getLocalizeDataFromLookUp('City',data.city,this._language)}, {this._constructFloorString(data.floor)}</Text>
                            </Animated.View>

                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w-8*p)*0.3, 0]}),}}></Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w-8*p)*0.7, w-8*p] }), }}>                               
                                <View style={style.leftContainer1}>
                                        <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'RestoHomeHeaderFavoritesIcon'} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} active={data.fUserFavoriteThis} type={'favorite'} style={style.iconButton}></CardIconButtonFavorite>
                                        <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'RestoHomeHeaderLikeIcon'} likePackage={this._getLikeResource(data)} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} active={data.fUserLikedThis} type={'like'} style={style.iconButton} likeTenantGetReward={this.props.likeTenantGetReward}></CardIconButtonLike>
                                        <CardIconButtonComment accessible={true} accessibilityLabel={'RestoHomeHeaderCommentIcon'} commentPackage={this._getCommentResource(data)} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} canComment={data.fCanComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                                        <CardIconButtonShare shareParams = {shareParams} img={dataContent.fStoreImageJSON[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'RestoHomeHeaderShareIcon'} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} shareMessage={dataContent.fShareMessage} targetKey={data.restoKey} type={'share'} style={style.iconButton} ></CardIconButtonShare>
                                        <CardIconButtonNotification onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'RestoHomeHeaderNotificationIcon'} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} active={data.fUserNotificationThis} type={'notification'} style={style.iconButton}></CardIconButtonNotification>
                                        {(fullData.whatsapp !== '' && fullData.whatsapp!== '–' && fullData.whatsapp !== ' ' && fullData.whatsapp !== '-') &&
                                        <TouchableOpacity onPress={() => {this.whatsappEnjoyer(fullData.whatsapp)}}>
                                            
                                                <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'}  source={{ uri: image.iconWhatsapp[this.props.imageSetting].url }} style={style.iconwhatsapp}></Image>
                                            
                                        </TouchableOpacity>
                                        } 
                                </View>
                            </Animated.View>
                        </View>
                    </Animated.View>
                    
                    {!this.props.noCheckButton &&
                    <Animated.View accessible={true} style={[style.checkInOutBtnContainer,{marginRight:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-7*p, 0] }), top:this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.425-14*p, w * 0.425] })}, { transform: [{scale:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0.85,1] })},{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>
                        {isAlreadyCheckIn === true ?
                            (<CheckOutButton accessible={true} accessibilityLabel={'RestoHomeHeaderCheckInButton'} navigator={this.props.navigator} refreshCheckOut={this.props.refreshCheckOut} contentType='Resto' checkInData={this.props.checkInData} contentKey={data.restoKey}></CheckOutButton>)
                            :
                            (<CheckInButton accessible={true} accessibilityLabel={'RestoHomeHeaderCheckOutButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Resto' contentKey={data.restoKey} checkInReward={this.props.checkInReward}></CheckInButton>)
                        }
                        <View style={style.vLastVisited}>                    
                            {data.lastVisited !== null &&
                                    <Text accessible={true} accessibilityLabel={'RestoHomeHeaderLastVisitedText'} preset={Text.preset.titleH6} style={style.lastVisitText}>{(SGLocalize.translate("globalText.lastVisitedText"))} {VisitorHelper._decideDayText(data.lastVisited)}</Text>
                            }
                        </View>
                    </Animated.View>
                    }
                    <Animated.View accessible={true} style={[style.thumbnailContainer,{marginLeft:this._animW.interpolate({ inputRange: [0, 1], outputRange: [1*p, 4*p] }), top:this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.26 + 11 * p-3.5*p, w * 0.26 + 11 * p] })}, { transform: [{scale: this._animW.interpolate({ inputRange: [0, 1], outputRange: [0.85,1] })},{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>
                        <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: data.restoKey }) }} shadow>
                            <Image accessible={true} accessibilityLabel={'RestoHomeHeaderLogoImage'} style={style.thumbnailImage} source={{ uri: dataContent.fStoreImageJSON[0][this.props.imageSetting].uri }}></Image>
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity onPress={this._changeHeader.bind(this)} style={style.arrowUp}>
                            <Icon name={this.state.show?Icon.Icon.arrowUp:Icon.Icon.arrowDown} preset={Icon.preset.h3}></Icon>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}
