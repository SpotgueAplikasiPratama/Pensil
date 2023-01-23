import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { SGHelperType,SGHelperNavigation } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';

export class MyAuctionCard extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView: {alignItems: 'flex-start', flexDirection: 'row', marginVertical: w * 0.01, width: w-p, height: w * 0.35, borderBottomWidth: 0.5, borderColor: '#000000', },
            containerView1: { justifyContent: 'center', width: w * 0.4, height: w * 0.35 },
            containerView2: {flex:1, height: w * 0.35 },
            logoImage: { width: w * 0.4, height: w * 0.28,resizeMode:'cover' },
            auctionValidDate: { width: w * 0.42, height: w * 0.065, marginLeft: 0, paddingLeft: 0, backgroundColor: '#191919', borderTopRightRadius: p * 3, borderBottomRightRadius: p * 3,position:'absolute',bottom:p },
            validDateText: { color: '#FFFFFF', alignSelf: 'flex-start' },
            text:{alignSelf:'flex-start',paddingLeft:2*p},
            textActive:{alignSelf:'flex-start',paddingLeft:2*p,color:'orange'},
            textInActive:{alignSelf:'flex-start',paddingLeft:2*p,color:'red'}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);

        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var language = this.props.language.toUpperCase();
        var userData = this.props.userData;
        var imageSetting = this.props.imageSetting;

        console.log(data);
        return (
            <TouchableOpacity onPress={this.props.onCardPress.bind(this, data)}>
                <View accessible={true} accessibilityLabel={'MyAuctionActiveCardRootView'} style={style.mainView}>
                  
                    <Image accessible={true} accessibilityLabel={'MyAuctionActiveCardLogoImage'} source={{ uri: data['fContent' + language].fImageJSON[0][imageSetting].uri }} style={style.logoImage}></Image>

                    <View accessible={true} accessibilityLabel={'MyAuctionActiveCardContainerView'} style={style.containerView2}>
                            <Text accessible={true} accessibilityLabel={'MyAuctionActiveCardRestoName'} preset={Text.preset.titleH2B} style={style.text} >{data['fAuctionName' + language]}</Text>
                            <Text accessible={true} accessibilityLabel={'MyAuctionActiveCardShortDesc'} preset={Text.preset.titleH4_5B} style={style.text}>{data['fStoreName' + language]}, {data['fBuildingName' + language]}</Text>
                            <Text accessible={true} accessibilityLabel={'MyAuctionActiveCardShortDesc'} preset={Text.preset.titleH6} style={style.text} numberOfLines={2}>{data['fContent' + language].fShortDescription}</Text>
                            <Text accessible={true} accessibilityLabel={'MyAuctionActiveCardShortDesc'} preset={Text.preset.titleH1B} style={data.fActive =='Y'?style.textActive:style.textInActive}>{data.fActive =='Y' ? SGLocalize.translate('AuctionCard.Open') +' ('+ data.totalBid +' '+SGLocalize.translate('AuctionCard.BidText')+')':SGLocalize.translate('AuctionCard.Close')}</Text>
                    </View>
                </View>
                <View accessible={true} style={style.auctionValidDate}>
                    <Text accessible={true} style={style.validDateText} preset={Text.preset.titleH4}>{this.props.valid?SGLocalize.translate('AuctionCard.Valid')+ ' ' + SGHelperType.formatDate(SGHelperType.convertNewDate(data.fEndDate), language):SGLocalize.translate('AuctionCard.Expired') +' '+ SGHelperType.formatDate(SGHelperType.convertNewDate(data.fEndDate), language)}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
