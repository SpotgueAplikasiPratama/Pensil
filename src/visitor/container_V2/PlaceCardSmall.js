import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View } from '../../core/control';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';
import { StyleSheet } from 'react-native';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import { VisitorHelper } from '../helper/VisitorHelper';

export class PlaceCardSmall extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainerLux: {backgroundColor: '#FFFFFF', width: (w - (p * 4)) / 2.8, borderRadius: w * 0.05, marginLeft: this.props.index == 0 ? w * 0.03 : w * 0.015 , marginRight: w * 0.015, justifyContent: 'center', alignItems: 'center',borderColor:'rgb(198,128,0)',borderWidth:0.5*p},
            mainContainer: {backgroundColor: '#FFFFFF', width: (w - (p * 4)) / 2.8, borderRadius: w * 0.05, marginLeft: this.props.index == 0 ? w * 0.03 : w * 0.015 , marginRight: w * 0.015, justifyContent: 'center', alignItems: 'center',borderColor:'rgb(198,128,0)'},
            imageContainer: {width: (w - (p * 4)) / 3, height: (w - (p * 4)) / 3, marginTop: 0},
            sliderImage: {width: (w - (p * 4)) / 3, height: (w - (p * 4)) / 3, resizeMode: 'cover', borderRadius: 0, borderTopLeftRadius: w * 0.05, borderTopRightRadius: w * 0.05, borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
            // sliderImage: {width: (w - (p * 4)) / 3, height: (w - (p * 4)) / 3, resizeMode: 'cover', borderRadius: 0, borderTopLeftRadius: w * 0.05, borderTopRightRadius: w * 0.05, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,borderColor:'rgb(198,128,0)',borderWidth:p,},
            
            textContainer: {justifyContent: 'center',paddingVertical: p},
            sliderText: {color: '#3B444B', }
        });
    }

    onCardPress(screen, contentKey) {
        SGHelperNavigation.navigatePush(this.props.navigator, screen, { contentKey: contentKey });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <TouchableOpacity onPress={() => { this.onCardPress(this.props.screen, this.props.contentKey) }}>
                <View accessible={true} accessibilityLabel={'PlaceCardSmallRootView'} shadow shadowIntensity={0.6} style={this.props.luxuryMode =='Y'?style.mainContainerLux : style.mainContainer}>
                    <View accessible={true} accessibilityLabel={''} style={style.imageContainer}>
                        <Image accessible={true} accessibilityLabel={'PlaceCardSmallImage'} style={style.sliderImage} source={{ uri: this.props.image }}></Image>
                    </View>
                    <View accessible={true} accessibilityLabel={'PlaceCardSmallTextView'} style={style.textContainer}>
                        <Text accessible={true} accessibilityLabel={'PlaceCardSmallContentText'} numberOfLines={1} preset={Text.preset.titleH4B} style={style.sliderText}>{this.props.name}</Text>
                        <Text accessible={true} accessibilityLabel={'PlaceCardSmallLocationText'} numberOfLines={1} preset={Text.preset.titleH5} style={style.sliderText}>{VisitorHelper.getLocalizeDataFromLookUp('City',this.props.location,this._language)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
