import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';

export class RewardDetailHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { backgroundColor: '#ededed', marginHorizontal: 2 * p, marginTop: 2 * p, width: w * 0.92, justifyContent: 'flex-start', padding: p, marginBottom: 2 * p, borderRadius: 2 * p },
            sliderView1: { width: w * 0.8, height: w * 0.8 * 9 / 16, padding: p, marginTop: p, backgroundColor: 'transparent', },
            image: { width: w * 0.8, height: w * 0.8 * 9 / 16, backgroundColor: 'transparent' },
            bottomView: { marginHorizontal: 0, marginTop: p, width: w * 0.8, flexDirection: 'row', justifyContent: 'space-between' },
            footerView: { marginHorizontal: 0, width: w * 0.45, justifyContent: 'flex-start', flexDirection: 'row' },
            footerImage: { marginLeft: 0, width: w * 0.12, height: w * 0.12, backgroundColor: 'white', resizeMode: 'cover' },
            footerTextView: { maxWidth: w * 0.33, justifyContent: 'flex-start', alignItems: 'flex-start' },
            textFooterName: { color: '#737373', marginVertical: 0 },
            textFooterContent: { color: '#bebebe', marginTop: 0, },
            textContentLiked: { color: '#bebebe', marginTop: 0.25 * p, marginBottom: 0 },
            iconButtonView: { width: w * 0.35, flexDirection: 'row', justifyContent: 'flex-end' },
            iconButton: { width: w * 0.85, padding: p * 0.85 },
            topContainer: { width: w * 0.8,justifyContent:'space-between', flexDirection:'row' },
            textContainer : { justifyContent:'flex-start', alignItems:'flex-start', marginVertical: p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    _onPress() {
       
        if (this.props.fType === 'building') {
            SGHelperNavigation.navigatePush(this.props.navigator, 'MallHome', { contentKey: this.props.footerKey })
        }
        if (this.props.fType === 'store') {
            SGHelperNavigation.navigatePush(this.props.navigator, 'StoreHome', { contentKey: this.props.footerKey })
        }
        if (this.props.fType === 'resto') {
            SGHelperNavigation.navigatePush(this.props.navigator, 'RestoHome', { contentKey: this.props.footerKey })
        }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var imageSetting = this.props.imageSetting

        return (
            <View accessible={true} accessibilityLabel={'RewardDetailHeaderRootView'} style={style.mainView1}>
                <View style={style.topContainer}>
                <View style={style.textContainer}>
                    <Text preset={Text.preset.titleH4B}>{SGLocalize.translate('RewardDetailScreen.validUntilLabel')}</Text>
                    <Text style={{color:'red'}} preset={Text.preset.titleH3B}>{this.props.validDate}</Text>
                    </View>
                    {this.props.referralRewardStyle ? 
                    (<View style={style.textContainer}>
                        <Text preset={Text.preset.titleH4B}>{SGLocalize.translate('RewardDetailScreen.tradeForLabel')}</Text>
                        <Text style={{color:'green'}} preset={Text.preset.titleH3B}>{this.props.referralPrice} {SGLocalize.translate('RewardDetailScreen.points')}</Text>
                        </View>)
                :
                (null)}
                </View>
                <ViewPager accessible={true} accessibilityLabel={'RewardDetailHeaderViewPager'} style={style.sliderView1} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'}>
                    {
                        (this.props.imageSlider).map((x, index) => {
                            return (
                                <View accessible={true} accessibilityLabel={'RewardDetailHeaderImageView'} key={x.key}>
                                    <Image accessible={true} accessibilityLabel={'RewardDetailHeaderImage'} style={style.image} source={{ uri: x[imageSetting].uri }}></Image>
                                </View>
                            )
                        })
                    }
                </ViewPager>
                <View accessible={true} accessibilityLabel={'RewardDetailHeaderBottomView'} style={style.bottomView}>
                    <TouchableOpacity onPress={() => this._onPress()}>
                        <View accessible={true} accessibilityLabel={'RewardDetailHeaderFooterView'} style={style.footerView}>
                            <Image accessible={true} accessibilityLabel={'RewardDetailHeaderFooterImage'} style={style.footerImage} source={{ uri: this.props.footerLogo[this.props.imageSetting].uri }}></Image>
                            <View accessible={true} accessibilityLabel={'RewardDetailHeaderFooterTextView'} style={style.footerTextView}>
                                <Text accessible={true} accessibilityLabel={'RewardDetailHeaderFooterName'} preset={Text.preset.titleH3B} style={style.textFooterName} >{this.props.footerName}</Text>
                                {this.props.fType === 'building' ?
                                    (<View>
                                        <Text accessible={true} accessibilityLabel={'RewardDetailHeaderFooterLocation'} preset={Text.preset.titleH5B} style={style.textFooterContent}>{VisitorHelper.getLocalizeDataFromLookUp('City',this.props.city,this._language)}</Text>
                                    </View>)
                                    :
                                    (null)}
                                {this.props.fType === 'store' ?
                                    (<View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <Text accessible={true} accessibilityLabel={'RewardDetailHeaderFooterLocation'} preset={Text.preset.titleH5B} style={style.textFooterContent}>{this.props.placeName}</Text>
                                        <Text accessible={true} accessibilityLabel={'RewardDetailHeaderFooterLocation'} preset={Text.preset.titleH5B} style={style.textFooterContent}>{VisitorHelper.getLocalizeDataFromLookUp('StoreCategory',this.props.storeCategory,this._language)}</Text>
                                    </View>)
                                    :
                                    (null)}
                                {this.props.fType === 'resto' ?
                                    (<View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <Text accessible={true} accessibilityLabel={'RewardDetailHeaderFooterLocation'} preset={Text.preset.titleH5B} style={style.textFooterContent}>{this.props.placeName}</Text>
                                        <Text accessible={true} accessibilityLabel={'RewardDetailHeaderFooterLocation'} preset={Text.preset.titleH5B} style={style.textFooterContent}>{VisitorHelper.getLocalizeDataFromLookUp('RestoCategory',this.props.restoCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',this.props.restoCuisine,this._language)}</Text>
                                    </View>)
                                    :
                                    (null)}

                                <Text accessible={true} accessibilityLabel={'RewardDetailHeaderFooterLikeCount'} preset={Text.preset.titleH6B} style={style.textContentLiked}>{this.props.footerLikedCount} {SGLocalize.translate('globalText.likeCountText')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View accessible={true} accessibilityLabel={'RewardDetailHeaderIconButtonView'} style={style.iconButtonView}>
                        {/* <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'RewardDetailHeaderIconButtonLike'} likePackage={this.props.likePackage} textColor='#bebebe' navigator={this.props.navigator} contentType='Reward' contentKey={this.props.contentKey} active={this.props.isUserLikeThis} type={'like'} style={style.iconButton}></CardIconButtonLike> */}
                        <CardIconButtonComment accessible={true} accessibilityLabel={'RewardDetailHeaderIconButtonComment'} commentPackage={this.props.commentPackage} textColor='#bebebe' navigator={this.props.navigator} contentType= {this.props.contentType} contentKey={this.props.contentKey} canComment={this.props.canComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                    </View>
                </View>
            </View>
        );
    }
}
