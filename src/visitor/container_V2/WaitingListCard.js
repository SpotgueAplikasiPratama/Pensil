import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon } from '../../core/control';
import { SGHelperType } from '../../core/helper'
import { SGLocalize } from '../locales/SGLocalize';
export class WaitingListCard extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w, flexDirection: 'row', alignItems: 'center', borderBottomWidth: p * 0.3, borderTopWidth: p * 0.3, borderTopColor: "#E4E4E4", borderBottomColor: "#E4E4E4", backgroundColor: "white", paddingVertical: 2 * p },
            image: { width: w * 0.175, height: w * 0.175, borderRadius: w, },
            v3: { marginLeft: 2 * p, width: w * 0.4, height: w * 0.24, alignItems: 'flex-start', justifyContent: 'center' },
            v4: { flexDirection: 'row' },
            v5: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' },
            text: { color: 'black', marginTop: 2 * p },
            text2: { color: 'black', marginTop: 2 * p },
            text3: { color: 'green', alignSelf: 'flex-end', paddingRight: 4 * p, marginTop: 2 * p },
            text4: { color: '#FBBB00', alignSelf: 'flex-end', paddingRight: 4 * p, marginTop: 2 * p },
            text5: { color: 'red', alignSelf: 'flex-end', paddingRight: 4 * p, marginTop: 2 * p },
            icon: { color: "white" },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);

        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }

    _checkExpiredCall() {
        var dateNow = Date.parse(SGHelperType.convertNewDate(new Date()));
        var expiredDate = Date.parse(SGHelperType.convertNewDate(this.props.data.fExpiredDate));
        this.resultExpiredTime = (Math.round(expiredDate - dateNow) / 60000).toFixed(0);
        if (this.resultExpiredTime <= 0) this.resultExpiredTime = 0
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var currentUser = this.props.currentUser;
        var number = this.props.number;
        var data = this.props.data;
        var language = this.props.language;
        var imageSetting = this.props.imageSetting;
        var dataSetting = this.props.restoSettingData;
        this._checkExpiredCall();
        return (
            <TouchableOpacity style={style.v1} onPress={this.props.onPress} disabled={data.fCreatedByID === currentUser.fID ? false : true}>
                {data.fCreatedByID === currentUser.fID &&
                    <Image accessible={true} accessibilityLabel={'WaitingListCardImgae'} style={style.image} source={{ uri: currentUser.fProfileImageJSON[0][imageSetting].uri }}></Image>
                }
                <View accessible={true} accessibilityLabel={'WaitingListCardContainerView'} style={style.v3}>
                    <Text accessible={true} accessibilityLabel={'WaitingListCardEmail'} preset={Text.preset.titleH2B} style={style.text2} numberOfLines={1}>{data.fCreatedByID !== currentUser.fID ? "Guest" + ' ' + number : data.fName}</Text>
                    <View accessible={true} accessibilityLabel={'WaitingListCardNumPersonView'} style={style.v4}>
                        <Text accessible={true} accessibilityLabel={'WaitingListCardNumbPerson'} preset={Text.preset.titleH3} style={style.text2}>{data.fNumberOfPerson} {SGLocalize.translate('WaitingListCard.Person')}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'WaitingListCardTimeView'} style={style.v4}>
                        <Text accessible={true} accessibilityLabel={'WaitingListCardTime'} preset={Text.preset.titleH3} style={style.text2}>{SGHelperType.formatTime(SGHelperType.convertNewDate(data.fBookDateTime), language)}</Text>
                    </View>
                </View>
                <View accessible={true} accessibilityLabel={'WaitingListCardCalledView'} style={style.v5}>
                    <Text accessible={true} accessibilityLabel={'WaitingListCardCalledText'} preset={Text.preset.titleH3B} style={data.fStatus !== "called" ? style.text4 : style.text3}>{SGLocalize.translate('WaitingListCard.' + data.fStatus).toUpperCase()}</Text>
                    {dataSetting.fResetWaitingList === "Y" && data.fStatus === "called" &&
                        <Text accessible={true} accessibilityLabel={'WaitingListCardCalledText'} preset={Text.preset.titleH4B} style={data.fStatus !== "called" ? style.text4 : style.text5}>{SGLocalize.translate('WaitingListCard.expireTimeLabel',{expiredTime:this.resultExpiredTime})}</Text>
                    }
                </View>
            </TouchableOpacity>
        );
    }
}
