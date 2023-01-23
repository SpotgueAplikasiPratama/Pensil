import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize'
import { SGHelperNavigation,SGHelperType } from '../../core/helper'

export class RewardCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: this.props.history ? '#FFFFFF' : '#FFFFFF', paddingVertical: p, flexDirection: 'row', justifyContent: 'flex-start', borderColor: '#E9E9E9', borderBottomWidth: w * 0.005 },
            leftContainer: { width: w * 0.4, paddingHorizontal: 0, marginHorizontal: 0, backgroundColor: '#FFFFFF', alignItems: 'flex-start', alignContent: 'flex-start' },
            rewardImage: { width: w * 0.4, height: w * 0.3, alignSelf: 'center', marginBottom: 0, borderRadius: 0, borderTopLeftRadius: p * 3, borderTopRightRadius: p * 3,resizeMode:'contain',backgroundColor:'transparent',borderTopColor:'transparent' },
            rewardValidDate: { width: w * 0.42, height: w * 0.065, marginLeft: 0, paddingLeft: 0, backgroundColor: '#191919', borderTopRightRadius: p * 3, borderBottomRightRadius: p * 3,position:'absolute',bottom:10 },
            validDateText: { color: '#FFFFFF', alignSelf: 'flex-start' },
            rightContainer: { width: w * 0.6, height: w * 0.3, paddingHorizontal: 0, marginHorizontal: 0, backgroundColor: '#FFFFFF', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
            rewardNameText: { color: '#000000', marginBottom: p * 2 },
            descriptionText: { color: '#979797', marginBottom: p * 4 },
            mallNameText: { color: '#000000' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;
        this.expiredDate=''
    }

    expiredReward(){
       var data = this.props.data;
       if(SGHelperType.convertNewDate(data.fExpiredUseDate) > SGHelperType.convertNewDate(data.fExpiredDefinedDate)){
        this.expiredDate = data.fExpiredDefinedDate
       }else{
        this.expiredDate = data.fExpiredUseDate
       }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var language = (this.props.language).toUpperCase();
        var imageSetting = this.props.imageSetting
        this.expiredReward();
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'RewardDetail', { contentKey: data.fID, callback: this.props.callBackForceUpdate, fType: data.fType })} >
                <View accessible={true} accessibilityLabel={'RewardCardRootView'} style={style.mainContainer}>
                    <Image accessible={true} accessibilityLabel={'RewardCardImageReward'} source={{ uri: data['fReward' + language].fImageJSON[0][imageSetting].uri }} style={style.rewardImage}></Image>
                    <View accessible={true} accessibilityLabel={'RewardCardTextView'} style={style.rightContainer}>
                        <Text accessible={true} accessibilityLabel={'RewardCardRewardName'} numberOfLines={2} style={style.rewardNameText} preset={Text.preset.titleH2B}>{data['fReward' + language].fRewardName}</Text>
                        <Text accessible={true} accessibilityLabel={'RewardCardTenantName'} numberOfLines={2} style={style.descriptionText} preset={Text.preset.titleH4_5B}>{data['fReward' + language].fShortDescription}</Text>
                        <Text accessible={true} accessibilityLabel={'RewardCardShortDesc'} numberOfLines={1} style={style.mallNameText} preset={Text.preset.titleH4B}>{data['fReward' + language].fTenantName !== '' ? data['fReward' + language].fTenantName + ',' + data['fReward' + language].fTargetName : data['fReward' + language].fTargetName}</Text>
                    </View>
                </View>
               
                <View accessible={true} style={style.rewardValidDate}>
                    <Text accessible={true} style={style.validDateText} preset={Text.preset.titleH4}>{this.props.valid? SGLocalize.translate('ActiveRewardCard.Valid')+ ' ' + SGHelperType.formatDateMonthNum(SGHelperType.convertNewDate(this.expiredDate), language): data.fExpiredStatus =='Y'? SGLocalize.translate('ActiveRewardCard.expired') +' '+ SGHelperType.formatDate(SGHelperType.convertNewDate(this.expiredDate), language): SGLocalize.translate('ActiveRewardCard.usedOn') +' '+ SGHelperType.formatDate(SGHelperType.convertNewDate(data.fUsedDate), language)} </Text>
                </View>
                
            </TouchableOpacity>

        );
    }
}
