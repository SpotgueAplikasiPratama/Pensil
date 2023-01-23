import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';
import { DateTag } from '../component_V2/DateTag';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';

export class DefaultSponsorPromoCard extends React.PureComponent {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', overflow: 'visible', marginHorizontal: 0, marginVertical: this.props.slider ? 0 : p, justifyContent: 'flex-start',  },
            topContainer: { width: w * 0.9, marginTop: p * 0.5, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            promoImage: { width: w * 0.9, height: w * 0.9 * 9 / 16, borderRadius: p * 2, alignSelf: 'center' },
            promoNameText: { color: '#000000' },
            likeCountAndIconContainer: { width: w * 0.9, justifyContent: 'flex-end', alignItems: 'flex-end' },
            bottomContainer: { width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.003, flexDirection: 'row', justifyContent: 'center' },
            bottomLeftContainer: { width: w * 0.15, marginLeft: w * 0.1, marginVertical: p * 1.5 },
            storeThumbnail: { width: (w - p * 2) * 0.14, height: (w - p * 2) * 0.14, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: 0 },
            bottomCenterContainer: { width: w * 0.4, marginTop: p, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0 },
            bottomRightContainer: { width: w * 0.45 },
            textFooterName: { color: '#000000', maxWidth: w * 0.6},
            textPatners: { color: '#bebebe', maxWidth: w * 0.6 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.data = this.props.data;
    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        console.log('data')
        console.log(this.data);
        try{
           console.log(this.data['fContent'+this._language.toUpperCase()].fImageJSON[0][this.imageSetting].uri)
        }catch(e){
            console.log(e)
        }
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'SponsorshipDetail', { contentKey: this.data.fID })}>
                <View accessible={true} accessibilityLabel={'DefaultSponsorPromoCardRootView'} style={style.mainContainer}>
                    <View accessible={true} style={style.topContainer}>
                        <Image accessible={true} accessibilityLabel={'DefaultSponsorPromoCardContentImage'} source={{ uri: this.data['fContent'+this._language.toUpperCase()].fImageJSON[0][this.imageSetting].uri }} style={style.promoImage}></Image>
                        <View style={{ height: w * 0.142758 }}>
                            <Text accessible={true} accessibilityLabel={'DefaultSponsorPromoCardEventName'} numberOfLines={2} preset={Text.preset.titleH2B} style={style.promoNameText}>{(this.data['fEventName'+this._language.toUpperCase()]).toUpperCase()}</Text>
                        </View>
                        <View accessible={true} style={style.likeCountAndIconContainer}>
                            <CardIconButtonShare accessible={true} img={this.data['fContent'+this._language.toUpperCase()].fImageJSON[0].thumbnailLow.uri} accessibilityLabel={'DefaultSponsorPromoCardIconShare'} navigator={this.props.navigator} contentType='SponsorEvent' contentKey={this.data.fID} shareMessage={this.data['fContent'+this._language.toUpperCase()].fShareMessage} targetKey={this.data.fProfileSponsorshipKey} type={'share'}></CardIconButtonShare>
                        </View>
                    </View>
                    <View accessible={true} accessibilityLabel={'DefaultSponsorPromoCardContainerView2'} style={style.bottomContainer}>
                        <View accessible={true} style={style.bottomLeftContainer}>
                            <Image accessible={true} accessibilityLabel={'DefaultSponsorPromoCardFooterImage'} source={{ uri: this.data['fProfileContent'+this._language.toUpperCase()].fSponsorImageJSON[0][this.imageSetting].uri }} style={style.storeThumbnail}></Image>
                        </View>
                        <View accessible={true} style={style.bottomCenterContainer}>
                            <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterName'} preset={Text.preset.titleH4B} style={style.textFooterName} numberOfLines={2}>{this.data['fSponsorName'+this._language.toUpperCase()]}</Text>
                            <Text accessible={true} accessibilityLabel={'EventDetailPatnersText'} preset={Text.preset.titleH4_5B} style={style.textPatners} numberOfLines={1}>{SGLocalize.translate('globalText.PatnersText')}</Text>
                           
                        </View>
                        <View accessible={true} style={style.bottomRightContainer}>
                            <DateTag accessible={true} accessibilityLabel={'DefaultSponsorPromoCardDateTag'} style={style.dateTag} startDate={this.data.startDate} endDate={this.data.endDate}></DateTag>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
