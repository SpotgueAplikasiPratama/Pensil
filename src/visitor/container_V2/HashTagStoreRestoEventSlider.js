/*
* Version 1.2.0
* Leon, 4 May 2021
  - Fix Like
*/
import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View } from '../../core/control';
import { StyleSheet } from 'react-native';
import { ProductSliderMixCardAndroidTV } from './ProductSliderMixCardAndroidTV';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation } from '../../core/helper';

export class HashTagStoreRestoEventSlider extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: w * 0.7 , alignSelf: 'center', marginTop: 2 * p },
            sliderHeader: { width: w, paddingLeft: p , paddingRight: p * 2, flexDirection: 'row', alignItems: 'center',marginBottom:0 },
            categoryNameText: { color: '#000000', marginVertical: 2*p },
            description: { width: w, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', maxWidth: w * 0.945 },
            descriptionText: { color: '#7D7D7D', marginTop: 0, marginBottom: 0 },
            seeMoreText: { color: '#63AEE0', marginVertical: 0 },
            sliderContainer: { width: w, padding: 0, paddingLeft: 0 , marginBottom: 0 },
            cardSlider: { width: w, height: h, padding: p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.scrollViewRef = React.createRef()
        this.svWidth = 0
        this.svHeight= 0
        this.moveTo ="right"
        this.position=0
        this.intervalMoving = 0
    }
    componentDidMount(){
        this.interval= setInterval(() => {
              this._onMoveScrollView()
         }, 3000);
     }
     componentWillUnmount(){
         clearInterval(this.interval);
     }
     _onMoveScrollView(){
         if(this.svWidth!==0){
             if(this.moveTo==="right"){
                 this.position = this.position+this.intervalMoving
                 if(this.position>=this.svWidth){
                    //  this.position=this.svWidth
                    //  this.moveTo = "left"
                     this.position=0
                     // if(this.moveTo+this.intervalMoving>=)
                 } 
             }
            //  else{
            //      this.position = this.position-this.intervalMoving
            //      if(this.position<=0){
            //          this.position=0
            //          this.moveTo = "right"
            //      } 
            //  }
             if(this.scrollViewRef){
                 this.scrollViewRef.current.scrollTo({ x: this.position, y: 0, animated: true })
             }
             
         }
     }
     _initScrollViewDimension(w,h,data){
        this.svWidth=w-(this.whp.w*0.3985*2)
        this.svHeight=h
        this.intervalMoving=this.whp.w*0.3985

    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        return (
            <View accessible={true} accessibilityLabel={'RestoMenuSliderRootView'} style={style.mainContainer}>
                <View accessible={true} accessibilityLabel={'RestoMenuSliderHeaderView'} style={style.sliderHeader}>
                    <Text accessible={true} accessibilityLabel={'RestoMenuSliderTitle'} preset={Text.preset.heading10B} style={style.categoryNameText}>{this.props.type ==1 ? SGLocalize.translate('mallHomeScreen.SecretSaleText'): this.props.hashTag}</Text>
                </View>
                <ScrollView ref={this.scrollViewRef} onContentSizeChange={(width, height) => {this._initScrollViewDimension(width, height,data)}} accessible={true} accessibilityLabel={'RestoMenuSliderScrollView'} showsHorizontalScrollIndicator={false} style={style.sliderContainer} horizontal>
                    {
                        data.map((x, index) => {
                            return (
                            <ProductSliderMixCardAndroidTV accessible={true} accessibilityLabel={'RestoMenuSliderCard'}  language={this.props.language} imageSetting={this.props.imageSetting} key={x.key+x.storeKey} data={x} currency={this.props.currency} style={style.throwWHP} type={this.props.type}></ProductSliderMixCardAndroidTV>)  
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}
