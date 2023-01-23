import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager,SGDialogBox  } from '../../core/control';
import { StyleSheet,Linking } from 'react-native';
import { CardIconButton,CardIconButtonComment,CardIconButtonLike,CardIconButtonShare } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType,SGHelperErrorHandling } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { DateTag } from '../component_V2/DateTag';
import { VisitorHelper } from '../helper/VisitorHelper';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';
import image from '../asset/image';

export class EventDetailHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', borderRadius: 0 },
            sliderContainer: { width: w, height: w * 1.2 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0 },
            sliderImage: { width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'flex-start', marginVertical: 0, marginHorizontal: 0, borderRadius: 0, overflow: 'visible' },
            tag: { position: 'absolute', alignSelf: 'flex-start', top: 0, height: w * 0.09, right: 0 },
            bottomContainer: { width: w, flexDirection: 'column', justifyContent: 'flex-start', marginVertical: p * 2 },
            placeAndIconContainer: { width: w * 0.97, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: p,marginVertical:2*p },
            placeContainer: { width: w * 0.55, flexDirection: 'row', justifyContent: 'flex-start' },
            placeThumbnailImage: { width: w * 0.165, height: w * 0.165, backgroundColor: '#FFFFFF', resizeMode: 'cover', borderRadius: p * 100 },
            footerView: { marginHorizontal: 0, width: w * 0.45, justifyContent: 'flex-start', flexDirection: 'row' },
            footerImage: { marginLeft: 0, width: w * 0.12, height: w * 0.12, backgroundColor: 'white', resizeMode: 'cover' },
            footerTextView: {flex:1,justifyContent: 'flex-start', alignItems: 'flex-start' },
            textFooterName: { color: '#000000', maxWidth: w * 0.6},
            textFooterContent: { color: '#bebebe', maxWidth: w * 0.6 },
            textContentLiked: { color: '#bebebe', maxWidth: w * 0.6 },
            iconButtonView: { width: w * 0.45, flexDirection: 'row', justifyContent: 'center' },
            iconButton: { width: w * 0.85, padding: p * 0.85 },
            iconwhatsapp: { width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        if (valid) {
            Linking.canOpenURL(url
            ).then(supported => {
                    if ((SGHelperType.left(url, 8) != 'https://')) {
                        Linking.openURL('https://' + url);
                    } else {
                        Linking.openURL(url);
                    }
            });
        } else {
            SGDialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };

    whatsappEnjoyer(data) {
        try {
            console.log('whatsappenjoyer')
            console.log(data);
            var checkTrueData = true;

            // cek nomor whatsapp depanny ap
            if (data[0] == '+') var trueData = data.replace('+62', '');
            else if (data[0] == '0') var trueData = data.replace('0', '');
            else if (data[0] == '6') var trueData = data.replace('62', '');
            else {
                var trueData = data;
                checkTrueData = false;
            }

            // Buat android yg gada replaceAll
            if (typeof String.prototype.replaceAll == "undefined") {
                String.prototype.replaceAll = function (match, replace) {
                    return this.replace(new RegExp(match, 'g'), () => replace);
                }
            }

            // kalo format nomor whatsapp bener
            if (checkTrueData) {
                trueData = trueData.replaceAll('-', '');
                trueData = trueData.replaceAll(' ', '');
                trueData = trueData.replaceAll('–', '');
            }

            // this.handleLink.bind(this, this.data.whatsapp);
            this.handleLink('https://wa.me/62' + trueData);
            
            dataHeader = this.props.headerData;
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: this.props.buildingKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
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
        var shareParams = { MallName:this.props.footerName, EventName:this.props.eventName, DateStart:SGHelperType.formatDate(this.props.startDate), DateEnd:SGHelperType.formatDate(this.props.endDate)}

        console.log(this.props.footerLocation);
        return (
            <View accessible={true} accessibilityLabel={'EventDetailHeaderRootView'} style={style.mainContainer}>
                <View accessible={true}>
                    <ViewPager accessible={true} accessibilityLabel={'EventDetailHeaderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                        {
                            (this.props.imageSlider).map((x, index) => {
                                return (
                                    <View accessible={true} accessibilityLabel={'EventDetailHeaderImageView'} key={x.id}>
                                        <Image accessible={true} accessibilityLabel={'EventDetailHeaderImage'} style={style.sliderImage} source={{ uri: x[this.props.imageSetting].uri }}></Image>
                                    </View>
                                )
                            })
                        }
                    </ViewPager>
                    <DateTag accessible={true} accessibilityLabel={'PlaceEventDetailScreenDateTag'} style={style.tag} startDate={this.props.startDate} endDate={this.props.endDate} leftMode></DateTag>
                </View>
               
                    <View accessible={true} style={style.placeAndIconContainer}>
                        <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'MallHome', { contentKey: this.props.buildingKey }) }}>
                            <View accessible={true} accessibilityLabel={'EventDetailHeaderFooterView'} style={style.placeContainer}>
                                <Image accessible={true} accessibilityLabel={'EventDetailHeaderFooterLogo'} style={style.placeThumbnailImage} source={{ uri: this.props.footerLogo }}></Image>
                                <View accessible={true} accessibilityLabel={'EventDetailHeaderFooterTextView'} style={style.footerTextView}>
                                    <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterName'} preset={Text.preset.titleH4_5B} style={style.textFooterName} numberOfLines={1}>{this.props.footerName}</Text>
                                    <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterLocation'} hidden={this.props.footerLocation ? false : true} preset={Text.preset.titleH6B} style={style.textFooterContent} numberOfLines={1}>{VisitorHelper.getLocalizeDataFromLookUp('City',this.props.footerLocation,this._language)}</Text>
                                    <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterLikeCount'} preset={Text.preset.titleH6B} style={style.textContentLiked} numberOfLines={1}>{this.props.footerLikedCount} {SGLocalize.translate('globalText.likeCountText')}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View accessible={true} accessibilityLabel={'EventDetailHeaderIconButtonView'} style={style.iconButtonView}>
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'EventDetailHeaderLikeIcon'} likePackage={this.props.likePackage} textColor='#bebebe' navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} active={this.props.isUserLikeThis} type={'like'} style={style.iconButton}></CardIconButtonLike>
                            <CardIconButtonComment accessible={true} accessibilityLabel={'EventDetailHeaderCommentIcon'} commentPackage={this.props.commentPackage} textColor='#bebebe' navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} type={'comment'} canComment={this.props.canComment} style={style.iconButton}></CardIconButtonComment>
                            <CardIconButtonShare shareParams={shareParams} img={this.props.imageSlider[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'EventDetailHeaderShareIcon'} textColor='#bebebe' navigator={this.props.navigator} contentType={'PlaceEvent'} contentKey={this.props.contentKey} shareMessage={this.props.shareMessage} targetKey={this.props.targetKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                            {(this.props.whatsapp !== '' && this.props.whatsapp !== '–' && this.props.whatsapp !== ' ' && this.props.whatsapp !== '-') &&
                                <TouchableOpacity onPress={() => { this.whatsappEnjoyer(this.props.whatsapp) }}>
                                    <Image accessible={true} source={{ uri: image.iconWhatsapp[this.props.imageSetting].url }} style={style.iconwhatsapp}></Image>
                                </TouchableOpacity>
                            }
                        </View>                                                                                                                                                                                                                                                                 
                    </View>
                </View>

        );
    }
}
