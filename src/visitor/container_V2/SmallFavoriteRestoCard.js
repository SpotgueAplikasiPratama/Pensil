import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonFavorite } from '../component_V2/CardIconButton';
import { LastVisitedTag } from '../component_V2/LastVisitedTag';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import { VisitorHelper } from '../helper/VisitorHelper';

export class SmallFavoriteRestoCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, backgroundColor: '#FFFFFF', paddingHorizontal: p * 2.5, paddingVertical: p * 2, flexDirection: 'row', justifyContent: 'flex-start', borderColor: '#E6E6E6', borderTopWidth: 0.0025 * w, borderBottomWidth: 0.0025 * w},
            image: {width: w * 0.218, height: w * 0.218, resizeMode: 'cover', backgroundColor: '#FFFFFF'},
            rightContainer: {width: w * 0.55, backgroundColor: '#FFFFFF', marginLeft: p * 2, flexDirection: 'row', justifyContent: 'space-between'},
            detail: {justifyContent: 'flex-start', alignItems: 'flex-start'},
            nameText: {color: '#000000'},
            typeAndLocationText: {color: '#989898', marginBottom: p },
            descriptionText: {color: '#000000'},
            favorited: {width: w * 0.1, height: w * 0.218},
            icon: { width: w * 1.5, height: w * 1.5, padding: 0 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        this.data = this.props.data;
        this.dataContent = this.props.dataContent;

        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'RestoHome', { contentKey: this.props.contentKey })}>
                <View accessible={true} accessibilityLabel={'SmallFavoriteRestoCardRootView'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'SmallFavoriteRestoCardContainerView1'} style={style.leftContainer}>
                        <Image accessible={true} accessibilityLabel={'SmallFavoriteRestoCardContentImage'} style={style.image} source={{ uri: this.dataContent.fStoreImageJSON[0][this.props.imageSetting].uri }}></Image>
                    </View>
                    <View accessible={true} accessibilityLabel={'SmallFavoriteRestoCardContainerView2'} style={style.rightContainer}>
                        <View accessible={true} style={style.detail}>
                            <Text accessible={true} accessibilityLabel={'SmallFavoriteRestoCardRestoName'} preset={Text.preset.titleH3B} numberOfLines={1} style={style.nameText}>{(this.dataContent.fStoreName.toUpperCase())}</Text>
                            <Text accessible={true} accessibilityLabel={'SmallFavoriteRestoCardPlaceName'} preset={Text.preset.titleH5B} numberOfLines={1} style={style.typeAndLocationText}>{this.props.placeName}, {VisitorHelper.getLocalizeDataFromLookUp('City',this.props.city,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'SmallFavoriteRestoCardDesc'} preset={Text.preset.titleH6} numberOfLines={2} style={style.descriptionText}>{this.dataContent.fShortDescription}</Text>
                        </View>
                    </View>
                    <View accessible={true} accessibilityLabel={'SmallFavoriteRestoCardIconView'} style={style.favorited}>
                        <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'SmallFavoriteRestoCardIconFavButton'} hideText navigator={this.props.navigator} contentType='Resto' contentKey={this.props.contentKey} active={this.props.isUserFavoriteThis} type={'favorite'} style={style.icon}></CardIconButtonFavorite>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
