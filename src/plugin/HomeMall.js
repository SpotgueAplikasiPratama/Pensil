import React from 'react';
import Core from '../core/core';
import Card from './plugin1/component/Card';

export default class HomeMall extends Core.Control.SGBaseContainer {
  createStyleSheet = (whp) => {
    var { w, h, p } = whp;
    return Core.StyleSheet.create({
      mainContainer: {width: w, backgroundColor: '#FFFFFF', paddingTop: this.props.borderTop ? p * 2 : 0, paddingBottom: this.props.borderBottom ? p * 3 : 0, borderColor: '#E7E7E7', borderTopWidth: 0, borderBottomWidth: this.props.borderBottom ? w * 0.006 : 0},
      header: {width: w * 0.96, backgroundColor: '#FFFFFF',  flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'},
      heading: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginVertical:this.props.marginText ? 4*p : 2*p},
      headingText: {maxWidth: w * 0.75, color: '#000000', marginVertical: 0, alignSelf: 'center'},
      description: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginBottom:2*p},
      descriptionText: {color: '#7D7D7D', marginVertical: 0},
      seeMoreHeadingText: {color: '#63AEE0'},
      seeMoreDescriptionText: {color: '#63AEE0'},
      sliderContainer: {width: w, height: w * 1.1 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0},
      sliderImage: {width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: 0},
    });
  }

  constructor(props, context, ...args) {
    const {SGHelperGlobalVar} = Core.Helper;
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
    this.oneLineSeeMore = false,
    this.twoLine = false;
  }




async componentDidMount() {
  // await this._SearchBuildingHighlightLoyaltyCardSlider();
  // this._unsubscribe = this.props.navigation.addListener('focus', async (res) => {
  //     await this._SearchBuildingHighlightLoyaltyCardSlider();
  //     // this.getAllGlobalVar('dataBuilding');
  // });
  this.forceUpdate()

}



// _dataLoadDone() {
//   this.alreadyMount=true
//   this.forceUpdate();
// }



// async _SearchBuildingHighlightLoyaltyCardSlider() {
//   const { SGHelperGlobalVar, SGHelperAPICall, SGHelperErrorHandling } = Core.Helper;
//   this.baseRunSingleAPIWithRedoOption('SearchBuildingHighlightLoyaltyCardSlider', (async (v1) => { return tbVHomeMallAPI.SearchBuildingHighlightLoyaltyCardSlider(v1) }).bind(this, this.fBuildingKey), ((v) => {
//         this.cardSlider = v;
//         Core.log('artinya saya jalan');
//         // Core.log(JSON.stringify(this.loyaltyBlockUnblockDetail.fMemberKey))
//         this.alreadyMount=true
//         this.forceUpdate(); 
//         // Core.log('saya slider')
//         // Core.log(JSON.stringify(this.cardSlider))
//     }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
//   }

  render() {
    var style = this.style;
    var { w, h, p } = this.screenWHP;
    const { SGRootView,SGPicker,SGImagePicker,SGDatePicker,SGTouchableOpacity,SGImage,SGTextInput ,SGButton, SGScrollView, SGTabView, SGViewPager, SGText, SGView, SGPopView,SGIcon,SGFlatList } = Core.Control;
    const { SGFormFilePicker, SGFormImagePicker, SGFormTextInput, SGFormPicker, SGFormDatePicker, SGFormTimePicker, SGFormMapPicker, SGFormButton, SGFormSwitch } =Core.Form;
    const {SGHelperNavigation} = Core.Helper;
    var data = this.props.data;
    this.oneLineSeeMore = this.props.oneLineSeeMore;
    this.twoLine = this.props.twoLine;
    var language = this._language.toUpperCase()
    return (
    <SGView>
        <SGView accessible={true} accessibilityLabel={'LoyaltyHeader'} style={style.header}>
          <SGView accessible={true} accessibilityLabel={'LoyaltyHeading'} style={style.heading}>
              <SGText accessible={true} preset={SGText.preset.heading4B} style={style.headingText}>{this.props.titleHeading}</SGText>
              {this.oneLineSeeMore ?
                  (<SGTouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.props.seeMoreScreen, { title: this.props.seeMoreTitle, contentKey: this.props.contentKey,contentData: this.props.contentData, buildingName: this.props.buildingName })}>
                      <SGText accessible={true} accessibilityLabel={'LoyaltySliderSeeMore'} preset={SGText.preset.heading8B} style={style.seeMoreHeadingText}>{this.props.seeMoreLabel}</SGText>
                  </SGTouchableOpacity>)
              :
                  (null)
              }
          </SGView>
          {this.twoLine ?
            (<SGView accessible={true} accessibilityLabel={'LoyaltyDescription'} style={style.description}>
                <SGText accessible={true} preset={SGText.preset.heading6} style={style.descriptionText}>{this.props.title}</SGText>
                <SGTouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.props.seeMoreScreen, { title: this.props.seeMoreTitle, contentKey: this.props.contentKey,contentData: this.props.contentData, buildingName: this.props.buildingName })}>
                    <SGText accessible={true} accessibilityLabel={'LoyaltySliderSeeMore'} preset={SGText.preset.heading8B} style={style.seeMoreDescriptionText}>{this.props.seeMoreLabel}</SGText>
                </SGTouchableOpacity>
            </SGView>)
          :
            (null)
          }
        </SGView>
           
        <SGViewPager pageIndicatorStyle={{position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center'}} style={style.sliderContainer} accessible={true} accessibilityLabel={'StoreProfileLocationViewPager'} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'}>
          {(data).map((x, index) => {
              return (
                <SGTouchableOpacity key={x.fID} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: x.fID, buildingName: this.props.buildingName, buildingKey:this.props.contentKey  }) }}>
                  <Card data={x} datalang = {language} imset={this.props.imageSetting}/>
                </SGTouchableOpacity>
              )
          })}
        </SGViewPager>
    </SGView>    
    );
  }
}