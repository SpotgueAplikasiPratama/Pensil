import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification } from '../component_V2/CardIconButton';
import { LastVisitedTag } from '../component_V2/LastVisitedTag';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperGlobalVar, SGHelperNavigation } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';

export class MallRestoListCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', paddingVertical: p * 3, paddingLeft: w * 0.085, paddingRight: p * 2, borderBottomWidth: p * 0.6, borderColor: '#E2E2E2' },
            leftContainer: { width: w * 0.3, paddingVertical: 0, paddingHorizontal: p, marginHorizontal: 0, marginVertical: 0 },
            rightContainer: { width: w * 0.68 - w * 0.085, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0, backgroundColor: '#FFFFFF' },
            facilityImage: { width: w * 0.24, height: w * 0.24, resizeMode: 'cover', backgroundColor: '#FFFFFF',borderRadius:4*p },
            facilityNameText: { color: '#000000', marginBottom: p },
            typeAndLocationText: { color: '#6D6D6D', marginVertical: 0 },
            text1: { color: '#909090', },
            iconButtonView: { marginVertical: 0, paddingVertical: 0, justifyContent: 'flex-end' },
            iconButtonContainer: { flexDirection: 'row', },
            iconFoot: { backgroundColor: '#0b76dd', padding: 0, borderRadius: w, width: w * 0.04, height: w * 0.04 },
            lastVisitedView: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 1 * p },
            lastVisitedText: { color: '#93c6e1', marginVertical: 0.2 * p, maxWidth: w * 0.9 }
        });
    }

    _constructFloorString() {
        var str = '';
        for (var i = 0; i < this.props.restoFloor.length; i++) {
            if (i === this.props.restoFloor.length - 1) { str = str + this.props.restoFloor[i]['fFloorName' + this.props.language.toUpperCase()] }
            else {
                str = str + this.props.restoFloor[i]['fFloorName' + (this.props.language).toUpperCase()] + ', '
            }
        }
        return (str);
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.showFooter = this.props.hideFooter ? true : false;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }
    render() {
        this.whp = { w: this.props.style.width, h: this.props.style.height, p: this.props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        var style = this.style;
        var floorString = this._constructFloorString();

        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'RestoHome', { contentKey: this.props.contentKey })}>
                <View accessible={true} accessibilityLabel={'MallRestoListCardRootView'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'MallRestoListTopView'} style={style.leftContainer}>
                        <Image accessible={true} accessibilityLabel={'MallRestoListCardImage'}  style={style.facilityImage} source={{ uri: this.props.contentImage }}></Image>
                        <Text accessible={true} accessibilityLabel={'MallRestoListCardLikeText'} preset={Text.preset.titleH6} style={style.text1}>{this.props.likeCount} {this.props.likeText}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'MallRestoListCardContainerView'} style={style.rightContainer}>
                        <Text accessible={true} accessibilityLabel={'MallRestoListCardStoreName'} preset={Text.preset.titleH2B} numberOfLines={2} style={style.facilityNameText}>{this.props.restoName ? (this.props.restoName).toUpperCase() : ''}</Text>
                        <Text accessible={true} accessibilityLabel={'MallRestoListCardStoreCategory'} preset={Text.preset.titleH4} numberOfLines={1} style={style.typeAndLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('RestoCategory',this.props.restoCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',this.props.restoCuisine,this._language)}</Text>
                        <Text accessible={true} accessibilityLabel={'MallRestoListCardIsHalal'} preset={Text.preset.titleH4} numberOfLines={1} style={style.typeAndLocationText}>{this.props.isHalal}</Text>
                        <Text accessible={true} accessibilityLabel={'MallRestoListCardStoreLocation'} preset={Text.preset.titleH4} numberOfLines={1} style={style.typeAndLocationText}>{this.props.locationText} {floorString}</Text>
                        <View>
                            {this.props.lastVisited !== null &&
                            <View accessible={true} accessibilityLabel={'MallRestoListCardLastVisitedView'} style={style.lastVisitedView}>
                                <Text accessible={true} accessibilityLabel={'MallRestoListCardLastVisitedText'} preset={Text.preset.titleH5} style={style.typeAndLocationText}>{SGLocalize.translate('globalText.lastVisitedText')} {VisitorHelper._decideDayText(this.props.lastVisited)}</Text>
                            </View>
                            }
                        </View>
                        <View accessible={true} accessibilityLabel={'MallRestoListCardIconButtonView'} style={style.iconButtonView}>
                            <View accessible={true} accessibilityLabel={'MallRestoListCardIconButtonContainerView'} style={style.iconButtonContainer}>
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'MallRestoListCardLikeIcon'} navigator={this.props.navigator} likePackage={this.props.likePackage} contentType='Resto' contentKey={this.props.contentKey} active={this.props.isUserLikedThis} type={'like'} textPreset={Text.preset.titleH6} style={style.throwWHP}></CardIconButtonLike>
                                <CardIconButtonNotification onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'MallRestoListCardNotificationIcon'} navigator={this.props.navigator} contentType='Resto' contentKey={this.props.contentKey} active={this.props.notification} type={'notification'} textPreset={Text.preset.titleH6} style={style.throwWHP}></CardIconButtonNotification>
                                <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'MallRestoListCardFavoriteIcon'} navigator={this.props.navigator} contentType='Resto' contentKey={this.props.contentKey} active={this.props.favorite} type={'favorite'} textPreset={Text.preset.titleH6} style={style.throwWHP}></CardIconButtonFavorite>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
