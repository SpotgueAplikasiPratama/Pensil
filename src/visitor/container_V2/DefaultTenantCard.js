import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification } from '../component_V2/CardIconButton';
import { LastVisitedTag } from '../component_V2/LastVisitedTag';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';
import { VisitorHelper } from '../helper/VisitorHelper';

export class DefaultTenantCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, padding: p, backgroundColor: '#FFFFFF', overflow: 'visible',  marginVertical: p, borderRadius: 0,borderBottomWidth:p*0.1,borderBottomColor:'grey'},
            topContainer: {flexDirection: 'row', justifyContent: 'flex-start'},
            leftContainer: {width: w * 0.3,marginLeft:3*p},
            image: {width: (w - p * 2) * 0.275, height: (w - p * 2) * 0.275, resizeMode: 'cover', borderRadius: p * 3},
            likeText: {color: '#A9A9A9'},
            centerContainer: {flex:1, height: w * 0.36, paddingLeft: p, paddingTop: p * 2, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', overflow: 'visible'},
            restoDetailsContainer: {flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'},
            restoNameText: {color: '#000000', marginTop: 0},
            categoryNameText: {color: '#989898', marginTop: 0},
            typeAndLocationText: {color: '#989898', marginTop: 0,alignSelf:'flex-start'},
            shortDescText: {color: '#A7A7A7', marginVertical: p * 2, maxWidth: w * 0.45},
            iconContainer: {flexDirection: 'row'},
            rightContainer: {width: w * 0.2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'},
            tagIcon: {width: w * 0.09, height: w * 0.115},
            tagText: {color: '#000000'},
            bottomContainer: { width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.003, flexDirection: 'row', justifyContent: 'flex-start' },
            bottomLeftContainer: {width: w * 0.2, paddingLeft: p * 2, marginVertical: p * 1.5},
            mallThumbnail: {width: (w - p * 2) * 0.14, height: (w - p * 2) * 0.14, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: 0},
            bottomRightContainer: {width: w * 0.5, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0},
            mallNameText: {color: '#3E3E3E', marginTop: 0},
            mallLocationText: {color: '#989898', marginTop: p},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
        this.imageSetting = this.props.imageSetting;
        this.data = this.props.data;
    }

    _constructFloorString() {
        var str = '';
        for (var i = 0; i < this.data.floor.length; i++) {
            if (i === this.data.floor.length - 1) { str = str + this.data.floor[i]['fFloorName' + this._language.toUpperCase()] }
            else {
                str = str + this.data.floor[i]['fFloorName' + (this._language).toUpperCase()] + ', '
            }
        }
        return (str);
    }

    _navigateScreen(){
            // type 1 == waiting list
            if(this.props.type == 1){
                if(this.data.fType == 'resto'){
                    this.props.hidePopView();
                    SGHelperNavigation.navigatePush(this.props.navigator, 'RestoWaitingList', { restoKey: this.data.fID })
                }
                else{
                    this.props.hidePopView();
                    SGHelperNavigation.navigatePush(this.props.navigator, 'StoreWaitingList', { storeKey: this.data.fID })
                }
            }
            if(this.props.type == 2){
                if(this.data.fType == 'resto'){
                    this.props.hidePopView();
                    SGHelperNavigation.navigatePush(this.props.navigator, 'RestoReservation', { restoKey: this.data.fID })
                }
                else{
                    this.props.hidePopView();
                    SGHelperNavigation.navigatePush(this.props.navigator, 'StoreReservation', { storeKey: this.data.fID })
                }
            }
            if(this.props.type == 3){
                if(this.data.fType == 'resto'){
                    this.props.hidePopView();
                    SGHelperNavigation.navigatePush(this.props.navigator, 'RestoHome', { contentKey: this.data.fID,movetoOrderMenu:true })
                }
                else{
                    this.props.hidePopView();
                    SGHelperNavigation.navigatePush(this.props.navigator, 'StoreHome', { contentKey: this.data.fID })
                }
            }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var floorString = this._constructFloorString();
        // console.log(this.data);
        return (
            <TouchableOpacity onPress={() => {this._navigateScreen()}}>
              
                <View accessible={true} accessibilityLabel={'DefaultTenantCardRootView'} style={style.mainContainer}>
                    <View accessible={true} style={style.topContainer}>
                        <View accessible={true} accessibilityLabel={'DefaultTenantCardContentView'} style={style.leftContainer}>
                            <Image accessible={true} accessibilityLabel={'DefaultTenantCardContentImage'} style={style.image} source={{ uri: this.data['fContent'+this._language.toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri }}></Image>
                            <Text accessible={true} accessibilityLabel={'DefaultRestoCarContentLike'} preset={Text.preset.h10} style={style.text1}>{this.data.fTotalLikeStore} {SGLocalize.translate('SearchResultStoreProductScreen.likeText')}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'DefaultTenantCardContainerView2'} style={style.centerContainer}>
                            <View accessible={true} style={style.restoDetailsContainer}>
                                <Text accessible={true} accessibilityLabel={'DefaultTenantCardRestoName'} preset={Text.preset.h6B} numberOfLines={1} style={style.restoNameText}>{this.data['fStoreName'+this._language.toUpperCase()]}</Text>
                                { this.data.fType == 'resto' ?
                                <View> 
                                    <Text accessible={true} accessibilityLabel={'DefaultTenantCardRestoCategory'} preset={Text.preset.h8B} numberOfLines={1} style={style.categoryNameText}>{VisitorHelper.getLocalizeDataFromLookUp('RestoCategory',this.data.storeCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',this.data.restoCuisine,this._language)}</Text>
                                    <Text accessible={true} accessibilityLabel={'DefaultTenantCardRestoPreference'} preset={Text.preset.h8B} numberOfLines={1} style={style.typeAndLocationText}>{SGLocalize.translate("isHalal." + this.data.isHalal)} {SGLocalize.translate("isVegetarian." + this.data.isVegetarian)}</Text>
                                </View>
                                :
                                <Text accessible={true} accessibilityLabel={'DefaultTenantCardStoreCategory'} preset={Text.preset.h8B} numberOfLines={1} style={style.categoryNameText}>{VisitorHelper.getLocalizeDataFromLookUp('StoreCategory',this.data.storeCategory,this._language)}</Text>    
                                }
                                <Text accessible={true} accessibilityLabel={'DefaultStoreCardStoreLocation'} preset={Text.preset.h8} numberOfLines={1} style={style.typeAndLocationText}>{SGLocalize.translate("SearchResultStoreScreen.locationText")} {floorString} {this.data['fContent'+this._language.toUpperCase()].fLocation}</Text>
                            </View>
                            <View accessible={true} accessibilityLabel={'DefaultTenantCardIconButtonView'} style={style.iconContainer}>
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'DefaultTenantCardIconLike'} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType={this.data.fType  =='resto' ? 'Resto':'Store'} contentKey={this.data.fID} active={this.data.fUserLikedThis} type={'like'} style={style.throwWHP}></CardIconButtonLike>
                                <CardIconButtonNotification onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'DefaultTenantCardIconComment'} navigator={this.props.navigator} contentType={this.data.fType  =='resto' ? 'Resto':'Store'} contentKey={this.data.fID} active={this.data.fUserNotificationThis} type={'notification'} style={style.throwWHP}></CardIconButtonNotification>
                                <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'DefaultTenantCardIconShare'} navigator={this.props.navigator} contentType={this.data.fType  =='resto' ? 'Resto':'Store'} contentKey={this.data.fID} active={this.data.fUserFavoriteThis} type={'favorite'} style={style.throwWHP}></CardIconButtonFavorite>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
