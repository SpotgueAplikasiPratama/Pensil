import React from 'react';
import Core from '../../../core/core';
import { SGLocalize } from '../../../visitor/locales/SGLocalize';

export default class PointHistoryRedeem extends Core.Control.SGBaseContainer {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      mainContainer: { width: w, backgroundColor: this.props.history ? '#FFFFFF' : '#FFFFFF', paddingVertical: p, flexDirection: 'row', justifyContent: 'flex-start', borderColor: '#E9E9E9', borderBottomWidth: w * 0.005 },
      rewardImage: { width: w * 0.4, height: w * 0.3, alignSelf: 'center', marginBottom: 0, borderRadius: 0, borderTopLeftRadius: p * 3, borderTopRightRadius: p * 3,resizeMode:'contain',backgroundColor:'transparent',borderTopColor:'transparent' },
      rewardValidDate: { width: w * 0.42, height: w * 0.065, marginLeft: 0, paddingLeft: 0, backgroundColor: '#191919', borderTopRightRadius: p * 3, borderBottomRightRadius: p * 3,position:'absolute',bottom:10 },
      validDateText: { color: '#FFFFFF', alignSelf: 'flex-start' },
      rightContainer: { width: w * 0.6, height: w * 0.3, paddingHorizontal: 0, marginHorizontal: 0, backgroundColor: '#FFFFFF', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
      rewardNameText: { color: '#000000', marginBottom: p * 2 },
      descriptionText: { color: '#979797', marginBottom: p * 4 },

    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP)
    console.log(this.props.imageSetting)
    // this.pointData = new PointCardModel();
  }

  componentWillUnmount() {
    if (!this._previousOrientationLandscape) {     
      Core.Helper.SGHelperWindow.lockPortrait();
    }
  }

  render() {
    const {SGText,SGRootView, SGTextInput, SGView,SGTouchableOpacity,SGImage } = Core.Control;
    const {SGHelperType} = Core.Helper
    var { w, h, p } = this.screenWHP;
    var style = this.style;
    var imageSetting = this.props.imageSetting
    var data = this.props.data;

    return (
      <SGView style={style.mainContainer}>
        <SGImage source={{uri: data['fReward'+(this._language.toUpperCase())].fImageJSON[0][imageSetting].uri}} style={style.rewardImage}></SGImage>
        <SGView style={style.rightContainer}>
            <SGText numberOfLines={2} style={style.rewardNameText} preset={SGText.preset.titleH2B}>{data['fReward'+(this._language.toUpperCase())].fRewardName}</SGText>
            <SGText numberOfLines={2} style={style.descriptionText} preset={SGText.preset.titleH4_5B}>{data.fRedeemPoint} {SGLocalize.translate('Loyalty.PointText')}</SGText>
        </SGView>

        <SGView accessible={true} style={style.rewardValidDate}>
          <SGText accessible={true} style={style.validDateText} preset={SGText.preset.titleH4}>{SGLocalize.translate('Loyalty.RedeemText')} {SGHelperType.formatDateTime(SGHelperType.convertNewDate(data.fRedeemDate))}</SGText>
        </SGView>
      </SGView>
    );
  }
}