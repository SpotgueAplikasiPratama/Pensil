import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGViewPager as ViewPager, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGImagePicker } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import {SGHelperType} from '../../core/helper';

export class HighlightSummary extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, paddingTop: this.props.borderTop ? p * 2 : 0, paddingBottom: this.props.borderBottom ? p * 3 : 0,borderColor: '#E7E7E7',borderBottomWidth: this.props.borderBottom ? w * 0.006 : 0},
            sliderHeader: { width: w, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginTop:3*p,marginBottom:2*p},
            textTitle: { maxWidth: w, color: '#000000', marginLeft: p * 4 },
            sliderView1: { width: w, height: w *1.1 * 9 / 16, backgroundColor: '#FFFFFF', marginTop:-5*p, },
            image: { alignSelf: 'center', width: w, height: w * 9 / 16, resizeMode: 'cover', marginVertical: 0, marginHorizontal: 0, borderRadius: 0 },
            textView1: { backgroundColor: 'rgba(255,255,255,0.5)', width: w, alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: w * 0.4 },
            textDesc: { overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.75)', color: 'white', paddingHorizontal: 3 * p, paddingVertical: 2 * p, borderRadius: 2 * p }
        });
    }

    getImageContentAlignment(textPos) {
        switch (textPos) {
            case SGImagePicker.textPos.topLeft:
                return ({ img: { justifyContent: 'flex-start', alignItems: 'flex-start' }, txt: { textAlign: 'left' } });
                break;
            case SGImagePicker.textPos.topMid:
                return ({ img: { justifyContent: 'flex-start', alignItems: 'center' }, txt: { textAlign: 'center' } });
                break;
            case SGImagePicker.textPos.topRight:
                return ({ img: { justifyContent: 'flex-start', alignItems: 'flex-end' }, txt: { textAlign: 'right' } });
                break;
            case SGImagePicker.textPos.centerLeft:
                return ({ img: { justifyContent: 'center', alignItems: 'flex-start' }, txt: { textAlign: 'left' } });
                break;
            case SGImagePicker.textPos.centerMid:
                return ({ img: { justifyContent: 'center', alignItems: 'center' }, txt: { textAlign: 'center' } });
                break;
            case SGImagePicker.textPos.centerRight:
                return ({ img: { justifyContent: 'center', alignItems: 'flex-end' }, txt: { textAlign: 'right' } });
                break;
            case SGImagePicker.textPos.bottomLeft:
                return ({ img: { justifyContent: 'flex-end', alignItems: 'flex-start' }, txt: { textAlign: 'left' } });
                break;
            case SGImagePicker.textPos.bottomMid:
                return ({ img: { justifyContent: 'flex-end', alignItems: 'center' }, txt: { textAlign: 'center' } });
                break;
            case SGImagePicker.textPos.bottomRight:
                return ({ img: { justifyContent: 'flex-end', alignItems: 'flex-end' }, txt: { textAlign: 'right' } });
                break;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;
        this.noImage = true;
        this._checkImageData(this.props.mallSummaryData);
    }

    _checkImageData(data){
        if(data[0][this.props.imageSetting].uri !== SGHelperType.getSystemParamsValue('DefaultImage')){
            console.log('masuk')
            this.noImage=false;
            // this.forceUpdate();
        }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.mallSummaryData;
        return (
            this.noImage !== true &&
            <View accessible={true} accessibilityLabel={'HighlightSummaryRootView'} style={style.mainView1} >
                <View accessible={true} accessibilityLabel={'HighlightSummarySliderHeaderView'} style={style.sliderHeader}>
                    <Text accessible={true} accessibilityLabel={'HighlightSummaryTitleText'} preset={Text.preset.titleH2B} style={style.textTitle}>{SGLocalize.translate("highlightSummary.title")}</Text>
                </View>
                
                <ViewPager accessible={true} accessibilityLabel={'HighlightSummaryViewPager'} style={style.sliderView1} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }} >
                    {
                        data.map((x) => {
                            var { img, txt } = this.getImageContentAlignment(x.textPosition);
                            return (
                                x[this.props.imageSetting].uri !== SGHelperType.getSystemParamsValue('DefaultImage') &&
                                <View key={x.id} style={{padding:0, margin:0}}>
                                    <Image accessible={true} accessibilityLabel={'HighlightSummaryImage'} style={{...style.image,...img}} source={{ uri: x[this.props.imageSetting].uri }}>
                                        {x.text !== '' ?
                                                <Text accessible={true} accessibilityLabel={'HighlightSummaryDescText'} preset={Text.preset.titleH4B} style={[style.textDesc, { ...txt }]}>{x.text}</Text>
                                            :
                                            (null)}
                                    </Image>
                                    
                                </View>
                            )
                        })
                    }   
                </ViewPager>
            </View>
        );
    }
}
