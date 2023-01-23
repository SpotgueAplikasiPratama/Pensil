import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification } from '../component_V2/CardIconButton';
import { LastVisitedTag } from '../component_V2/LastVisitedTag';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperGlobalVar, SGHelperNavigation } from '../../core/helper';

export class MiniAddStoreCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 0, marginVertical: 2 * p, width: w * 0.95, justifyContent: 'flex-start', alignItems: 'flex-start', padding: p, paddingVertical: 0, marginBottom: 2 * p, borderTopLeftRadius: 3 * p, borderBottomLeftRadius: 3 * p, borderWidth: 0.75, borderColor: '#D3D3D3', },
            throwWHP: { width: w, height: h, padding: p },
            containerView1: { marginTop: 1 * p, width: w * 0.3, paddingVertical: 0, paddingHorizontal: p, marginHorizontal: 0, paddingTop: p },
            containerView2: { marginTop: 1 * p, alignItems: 'flex-start', flex: 1, justifyContent: 'flex-start', marginBottom: p, paddingHorizontal: p, paddingVertical: 0, marginHorizontal: 0, },
            image: { width: (w - 2 * p) * 0.210, height: (w - 2 * p) * 0.210, resizeMode: 'cover', backgroundColor: 'white' },
            text1: { color: '#909090', },
            textStoreName: { color: '#606060', marginTop: p * 2, maxWidth: w * 0.7, marginVertical: 0, marginBottom: 0.5 * p },
            textTypeAndLocation: { color: '#7a7a7a', marginVertical: 0.2 * p, maxWidth: w * 0.7 },
            iconButtonView: { marginVertical: 0, paddingVertical: 0, flex: 1, justifyContent: 'flex-end' },
            iconButtonContainer: { flexDirection: 'row', marginBottom: 2 * p, },
            iconFoot: { backgroundColor: '#0b76dd', padding: 0, borderRadius: w, width: w * 0.04, height: w * 0.04 },
            lastVisitedView: { marginLeft: p, flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 1.5 * p },
            lastVisitedText: { color: '#93c6e1', marginVertical: 0.2 * p, maxWidth: w * 0.9 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.showFooter = this.props.hideFooter ? true : false;
    }

    render() {
        this.whp = { w: this.props.style.width, h: this.props.style.height, p: this.props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        var style = this.style;
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'StoreHome')}>
                <View accessible={true} accessibilityLabel={'MiniAddStoreCardRootView'} style={style.mainView1}>
                    <View accessible={true} accessibilityLabel={'MiniAddStoreCardTopView'} style={style.containerView1}>
                        <Image accessible={true} accessibilityLabel={'MiniAddStoreCardImage'} shadow style={style.image} source={{ uri: this.props.contentImage }}></Image>
                        <Text accessible={true} accessibilityLabel={'MiniAddStoreCardText'} preset={Text.preset.h11} style={style.text1}>{this.props.liked} {this.props.likeText}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'MiniAddStoreCardTextView'} style={style.containerView2}>
                        <Text accessible={true} accessibilityLabel={'MiniAddStoreCardName'} preset={Text.preset.h7B} numberOfLines={1} style={style.textStoreName}>{this.props.storeName ? (this.props.storeName).toUpperCase() : ''}</Text>
                        <Text accessible={true} accessibilityLabel={'MiniAddStoreCardCategory'} preset={Text.preset.h9B} numberOfLines={1} style={style.textTypeAndLocation}>{this.props.storeCategory}</Text>
                        <Text accessible={true} accessibilityLabel={'MiniAddStoreCardPlaceName'} preset={Text.preset.h9B} numberOfLines={1} style={style.textTypeAndLocation}>{this.props.placeName} {this.props.placeLocation}</Text>
                        <View accessible={true} accessibilityLabel={'MiniAddStoreCardButtonView'} style={style.iconButtonView}>
                            <View accessible={true} accessibilityLabel={'MiniAddStoreCardIconButtonView'} style={style.iconButtonContainer}>
                                {/* <CardIconButtonLike onIconPressed={this.props.onLike} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType='Store' contentKey={this.props.contentKey} active={this.props.like} type={'like'} textPreset={Text.preset.h11} style={style.throwWHP}></CardIconButtonLike>
                                <CardIconButtonNotification onIconPressed={this.props.onNotification}  navigator={this.props.navigator} contentType='Store' contentKey={this.props.contentKey} active={this.props.notification} type={'notification'} textPreset={Text.preset.h11} style={style.throwWHP}></CardIconButtonNotification>
                                <CardIconButtonFavorite onIconPressed={this.props.onFavorite} navigator={this.props.navigator} contentType='Store' contentKey={this.props.contentKey} active={this.props.favorite} type={'favorite'} textPreset={Text.preset.h11} style={style.throwWHP}></CardIconButtonFavorite> */}
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
