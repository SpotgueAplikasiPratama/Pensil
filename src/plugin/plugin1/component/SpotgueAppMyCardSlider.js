import React from 'react';
import Core from '../../../core/core';
import Card from './Card';
import MyTranslator from '../../lessons/locale/MyTranslator';
import { SGLocalize } from '../../../visitor/locales/SGLocalize';

export default class SpotgueAppMyCardSlider extends Core.Control.SGBaseContainer {

    createStyleSheet = (whp) => {
        const { StyleSheet, } = Core;
        var { w, h, p } = this.screenWHP;
        return StyleSheet.create({
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, overflow: 'visible' },
            v2: {width: w, justifyContent: 'flex-start'},
            v3: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom:0*p},
            vView: { alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius: 10, borderWidth:1,borderColor:'grey'},
            vView2: { alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth:1,borderColor:'grey'},

            header: {width: w * 0.96, backgroundColor: '#FFFFFF', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'},
            heading: {width: w * 0.96, alignItems: 'flex-start', justifyContent: 'space-between', marginTop:2*p, marginBottom: 1*p},
            textTitle: { color: '#000000', marginVertical: 0, marginHorizontal: 0 },
            descriptionText: {color: '#7D7D7D', marginVertical: 0},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.screenWHP);
        this._darkMode = false;
        this.alreadyMount = false;
        this.cardData = this.props.data
        this.imset = this.props.imageSetting
        this.language = this._language.toUpperCase();
    }


    render() {
        const { SGView, SGTouchableOpacity, SGText, SGViewPager, SGImage} = Core.Control;
        const { SGHelperNavigation, SGHelperType } = Core.Helper;
        var style = this.style;
        var { w, h, p } = this.screenWHP;
        this.language = this._language.toUpperCase();
        this.cardData = this.props.data
        console.log(this.cardData)
        console.log('kartu loyalty')
        return (
        this.cardData.length > 0 &&
        <SGView style = {style.v2}>
            <SGView accessible={true} accessibilityLabel={'PlaceEventHeader'} style={style.header}>
                <SGView style={style.heading}>
                    <SGText style={style.textTitle} preset={SGText.preset.titleH2B}> {MyTranslator.tr('SpotgueAppMyCard.MyCard')}</SGText>
                </SGView>
                <SGView style = {style.v3}>
                    <SGText accessible={true} preset={SGText.preset.titleH3} style={style.descriptionText}>{SGLocalize.translate("HomeScreen.FavoritePlaceEventTitle")}</SGText>
                    <SGTouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllFavoriteMyCardList') }}>
                        <SGText accessible={true} accessibilityLabel={'PlaceEventSliderSeeMore'} preset={SGText.preset.titleH4B} style={{color: '#63AEE0'}}>{MyTranslator.tr('SpotgueAppMyCard.SeeMore')}</SGText>
                    </SGTouchableOpacity>
                </SGView>
            </SGView>

            <SGView style = {{width: w, justifyContent:'flex-start'}}>
                <SGViewPager style={{width:w, height:0.6*w}} accessible={true} accessibilityLabel={'StoreProfileLocationViewPager'} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{position: 'absolute', bottom: -p, flexDirection:'row', alignSelf:'center'}}>
                    {(this.cardData).map((x, index) => {
                        return (
                            <SGView style={{justifyContent: 'flex-start', marginTop: p}} accessible={true} key={x.fID}>
                                <SGTouchableOpacity style={{alignItems:'center'}} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'CardDetail', { fID: x.fID, fTargetType: x.fTargetType, fBuildingKey: x.fBuildingKey, fBuildingName: x.fBuildingNameID }) }}>
                                    <Card data={x} datalang={this.language} imset={this.imset} />
                                </SGTouchableOpacity>                        
                            </SGView>
                        )
                    })}
                </SGViewPager>
            </SGView>
        </SGView>
        );
      }
}