import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity,SGDialogBox } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton } from '../component_V2/CardIconButton';
import { DateTag } from '../component_V2/DateTag';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';

export class LoyaltyRewardCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', overflow: 'visible', marginHorizontal: 0, marginVertical: this.props.slider ? 0 : p, justifyContent: 'flex-start', padding: p, borderRadius: 0 },
            topContainer: { width: w * 0.9, marginTop: p * 0.5, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            eventImage: { width: w * 0.9, height: w * 0.9 * 9 / 16, borderRadius: p * 2, alignSelf: 'center' },
            eventNameText: { color: '#000000' },
            totalAvailable: { width: w * 0.9, justifyContent: 'space-between', alignItems: 'flex-start' },
            totalAvilable: { color: '#63AEE0', marginTop: p * 2,alignSelf:'flex-end' },
            tradePoint:{color:'green',alignSelf:'flex-end'},
            iconContainer: { flexDirection: 'row' },
            bottomContainer: { width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.003, flexDirection: 'row', justifyContent: 'flex-start' },
            bottomLeftContainer: { width: w * 0.15, marginLeft: w * 0.1, marginVertical: p * 1.5 },
            mallThumbnail: { width: (w - p * 2) * 0.14, height: (w - p * 2) * 0.14, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: 0 },
            bottomCenterContainer: { width: w * 0.4, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0 },
            mallNameText: { color: '#3E3E3E' },
            typeAndLocationText: { color: '#989898' },
            bottomRightContainer: { width: w * 0.45 },
            dateTag: {}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.data = this.props.data;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.dataContentReward = this.data['fContent' + this._language.toUpperCase()];
        this.dataContentFooter = this.data['fContentType' + this._language.toUpperCase()];
        
    }

    _onCardPress(){
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else{
            SGHelperNavigation.navigatePush(this.props.navigator, 'LoyaltyRewardDetailScreen', { contentKey: this.data.fID, fType: this.data.fType, dataLoyalty:this.props.dataLoyalty, hideButton: this.props.hideButton})
        }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        this.data=this.props.data
        return (
            <TouchableOpacity onPress={() => {this._onCardPress()}}>
                <View accessible={true} accessibilityLabel={'DefaultReferralRewardCardRootView'} style={style.mainContainer}>
                    <View accessible={true} style={style.topContainer}>
                        <Image accessible={true} accessibilityLabel={'DefaultReferralRewardCardContentImage'} source={{ uri: this.dataContentReward.fImageJSON[0][this.props.imageSetting].uri }} style={style.eventImage}></Image>
                        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardEventName'} numberOfLines={2} preset={Text.preset.titleH2B} style={style.eventNameText}>{this.dataContentReward.fRewardName}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardEventName'} numberOfLines={2} preset={Text.preset.titleH4} style={style.eventNameText}>{this.dataContentReward.fShortDescription}</Text>
                        </View>
                        <View accessible={true} style={style.totalAvailable}>
                            <Text accessible={true} accessibilityLabel={'TradePoint'} preset={Text.preset.titleH4B} style={style.tradePoint}>{SGLocalize.translate('CarouselRewardCard.referralPriceLabel',{count:this.data.fLoyaltyPoint})}</Text>
                            
                            <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCarContentLike'} preset={Text.preset.titleH4B} style={style.totalAvilable}>{SGLocalize.translate('MyReferralScreen.totalAvailable')} {this.data.totalAvailable}</Text>
                        </View>
                    </View>
                    {this.data.fType === 'building' ?
                      <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'MallHome', { contentKey: this.data.fTargetKey }) }}>
                        <View accessible={true} accessibilityLabel={'DefaultReferralRewardCardContainerView2'} style={style.bottomContainer}>
                            <View accessible={true} style={style.bottomLeftContainer}>
                                <Image accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterImage'} source={{ uri: this.dataContentFooter.fImageJSON[0][this.props.imageSetting].uri }} style={style.mallThumbnail}></Image>
                            </View>
                            <View accessible={true} style={style.bottomCenterContainer}>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterName'} numberOfLines={1} preset={Text.preset.titleH4B} style={style.mallNameText}>{this.dataContentReward.fTargetName}</Text>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterLocation'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('BuildingCategory',this.data.fTypeCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('City',this.data.fCity,this._language)}</Text>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterLike'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{this.data.fLikeCountType} {SGLocalize.translate('globalText.likeCountText')}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>
                        :
                        (null)}
                    {this.data.fType === 'store' ?
                     <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'StoreHome', { contentKey: this.data.fTargetKey }) }}>
                        <View accessible={true} accessibilityLabel={'DefaultReferralRewardCardContainerView2'} style={style.bottomContainer}>
                            <View accessible={true} style={style.bottomLeftContainer}>
                                <Image accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterImage'} source={{ uri: this.dataContentFooter.fStoreImageJSON[0][this.props.imageSetting].uri }} style={style.mallThumbnail}></Image>
                            </View>
                            <View accessible={true} style={style.bottomCenterContainer}>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterName'} numberOfLines={1} preset={Text.preset.titleH4B} style={style.mallNameText}>{this.dataContentReward.fTenantName}</Text>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterLocation'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('StoreCategory',this.data.fTypeCategory,this._language)}</Text>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterLocation'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{this.data['fBuildingName' + this._language.toUpperCase()]}</Text>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterLike'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{this.data.fLikeCountType} {SGLocalize.translate('globalText.likeCountText')}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>
                        :
                        (null)}
                    {this.data.fType === 'resto' ?
                     <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'RestoHome', { contentKey: this.data.fTargetKey }) }}>
                        <View accessible={true} accessibilityLabel={'DefaultReferralRewardCardContainerView2'} style={style.bottomContainer}>
                            <View accessible={true} style={style.bottomLeftContainer}>
                                <Image accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterImage'} source={{ uri: this.dataContentFooter.fStoreImageJSON[0][this.props.imageSetting].uri }} style={style.mallThumbnail}></Image>
                            </View>
                            <View accessible={true} style={style.bottomCenterContainer}>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterName'} numberOfLines={1} preset={Text.preset.titleH4B} style={style.mallNameText}>{this.dataContentReward.fTenantName}</Text>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterLocation'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('RestoCategory',this.data.fTypeCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',this.data.fCuisine,this._language)}</Text>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterLocation'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{this.data['fBuildingName' + this.props.language.toUpperCase()]}</Text>
                                <Text accessible={true} accessibilityLabel={'DefaultReferralRewardCardFooterLike'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{this.data.fLikeCountType} {SGLocalize.translate('globalText.likeCountText')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                        :
                        (null)}

                </View>
                <View style={{height:2*p,backgroundColor: '#E6E6E6'}}></View>
            </TouchableOpacity>
        );
    }
}
