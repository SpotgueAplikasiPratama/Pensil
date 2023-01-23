import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperType, SGHelperGlobalVar } from '../../core/helper';
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGImage as Image, SGIcon as Icon, SGPopView, SGViewPager as ViewPager } from '../../core/control';
import { SGLocalize } from '../locales/SGLocalize';
export class AuctionParticipantWinnerCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            main: {width: w*0.93,backgroundColor: 'white', borderBottomWidth: p*0.3, marginVertical: p,},
            v1: {width: w*0.93, flexDirection: 'row', justifyContent: 'center', paddingVertical: p*2},
            v1_3: { marginLeft: p*2, alignItems: 'flex-start'},
            imageUser: { width: w * 0.2, height: w *0.2, borderRadius: 2 * p, resizeMode: 'cover' },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var imageSetting = this.props.imageSetting;
        // console.log(data);
        return (
            <View style={style.main} accessible={true} accessibilityLabel={'AuctionParticipantCardRootView'}>
                <View style={style.v1}> 
                    <View accessible={true} accessibilityLabel={'AuctionParticipantCardTextView'}>
                        <Image accessible={true} accessibilityLabel={'AuctionParticipantCardImage'} style={style.imageUser} source={{ uri: data.fProfileImageJSON[0]['thumbnail' + imageSetting.charAt(0).toUpperCase() + imageSetting.slice(1)].uri }}></Image>
                    </View>
                    <View accessible={true} accessibilityLabel={'AuctionParticipantCardTextView'} style={style.v1_3}>
                        <Text accessible={true} accessibilityLabel={'AuctionParticipantCardEndDate'} preset={Text.preset.h6}  numberOfLines={1}>{data.fName}</Text>
                        <Text accessible={true} accessibilityLabel={'AuctionParticipantCardStartDate'} preset={Text.preset.h5B}  numberOfLines={1}>{this.currency} {SGHelperType.addThousandSeparator((data.fBidPrice.toFixed(0)).toString())}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
