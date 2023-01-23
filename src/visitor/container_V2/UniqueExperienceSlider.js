import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGViewPager as ViewPager, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGImagePicker } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import {SGHelperType} from '../../core/helper';

export class UniqueExperienceSlider extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, backgroundColor: '#FFFFFF', paddingBottom: this.props.borderBottom ? p * 4 : 0, borderColor: '#E7E7E7', borderTopWidth: 0, borderBottomWidth: this.props.borderBottom ? w * 0.006 : 0},
            header: {width: w * 0.96, backgroundColor: '#FFFFFF', marginVertical: p, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'},
            heading: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginVertical:2*p},
            headingText: {maxWidth: w * 0.96, color: '#000000', marginVertical: 0, alignSelf: 'center'},
            seeMoreHeadingText: {color: '#63AEE0'},
            seeMoreDescriptionText: {color: '#63AEE0'},
            sliderContainer: {width: w, height: w * 1.1 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0},
            sliderImage: {width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: 0},
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
        this.seeMore = false;
        this.noImage = true;
        this._checkImageData(this.props.data);
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
        var data = this.props.data;
        this.seeMore = this.props.seeMore;

        return (
            this.noImage !== true &&
            <View accessible={true} accessibilityLabel={'UniqueExperienceSliderRootView'} style={style.mainContainer}>
                <View accessible={true} style={style.header}>
                    <View accessible={true} accessibilityLabel={'UniqueExperienceSliderHeaderView'} style={style.heading}>
                        <Text accessible={true} preset={Text.preset.titleH2B} style={style.headingText}>{this.props.titleHeading}</Text>
                    </View>
                </View>
                <ViewPager accessible={true} accessibilityLabel={'UniqueExperienceSliderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                    {
                        data.map((x) => {
                            var { img, txt } = this.getImageContentAlignment(x.textPosition);
                            return (
                                <TouchableOpacity key={x.key}>
                                    {x[this.props.imageSetting].uri !== SGHelperType.getSystemParamsValue('DefaultImage') &&
                                    <Image accessible={true} accessibilityLabel={'HighlightSummaryImage'}  style={{...style.sliderImage,...img}} source={{ uri: x[this.props.imageSetting].uri }}>
                                        {x.text !== '' ?
                                            <Text accessible={true} accessibilityLabel={'HighlightSummaryDescText'} preset={Text.preset.titleH4B} style={[style.textDesc, { ...txt }]}>{x.text}</Text>
                                            :
                                        (null)}
                                    </Image>
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                </ViewPager>
            </View>
        );
    }
}
