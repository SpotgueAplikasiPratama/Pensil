import React from 'react';
import { SGIcon, SGTouchableOpacity } from '../../core/control';
import Core from '../../core/core';
import Book from '../model/Book.js';
import tbVPointHistoryAPI from './plugin1/api/tbVPointHistoryAPI';


export default class PointHistoryEarnDetail extends Core.Screen.SGBaseScreen {

    createStyleSheet = (whp) => {
        const { StyleSheet, } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
            v2: { width: w , height: h, backgroundColor: 'white', justifyContent:'flex-start',borderRadius:10},

        });
    }

    constructor(props, context, ...args) {
        console.log('constructor');
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        // this._darkMode = false;
        this.fEarnPointKey = this.props.route.params.fEarnPointKey
        this.fType = this.props.route.params.fType
        Core.log('saya EarnPointKeys')
        Core.log(JSON.stringify(this.fEarnPointKey))
        Core.log('saya fType')
        Core.log(JSON.stringify(this.fType))
        this.dto={fEarnPointKey: this.fEarnPointKey, fType: this.fType}
        this.imset = SGHelperGlobalVar.getVar('GlobalImageSetting')
    }   

    async _onRefreshAllItem(){
        const {SGHelperGlobalVar} = Core.Helper;
        // if(resetPaging){
          Core.log('MASUK PEGING SIH')
          await this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyEarnPointReceiptDetail', (async (v1) => { return tbVPointHistoryAPI.SearchMyLoyaltyEarnPointReceiptDetail(v1) }).bind(this,this.dto), ((v) => {
             this.detail = v;
             Core.log('saya sih detail')
             Core.log(JSON.stringify(this.detail[0].fReceiptImage))
             this.done = true;
             this.forceUpdate()    
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        // Core.log('saya lengthnya si detail dong ')
        // Core.log(this.detail.length)
        // }
      }

      async componentDidMount(){
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
      }

    

    render() {
        console.log('render')
        var style = this.style;
        var { w, h, p } = this.WHP;

        const { SGRootView,SGImage,SGTouchableOpacity,  SGFlatList, SGScrollView, SGTextInput, SGViewPager, SGText, SGView, SGPopView,SGIcon } = Core.Control;
        const { SGFormFilePicker, SGFormImagePicker, SGFormTextInput, SGFormPicker, SGFormDatePicker, SGFormTimePicker, SGFormMapPicker, SGFormButton, SGFormSwitch } =Core.Form;
        const {SGHelperNavigation, SGHelperType} = Core.Helper;
        return (
        <SGRootView>
          <SGView style={style.v2}>
          {/* <SGIcon name={SGIcon.Icon.close} style={{color:'black',alignSelf:'flex-end', marginRight:5}} preset={SGIcon.preset.h2B} onPress={() => { SGPopView.hidePopView(this.pvID7) }}/> */}
          {this.done == true && 
          <SGView style={{width:w,height:h}}>
                <SGViewPager style={{width:w, height:0.3*w, justifyContent:'center'}} accessible={true} accessibilityLabel={'StoreProfileLocationViewPager'} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{position: 'absolute', bottom:-0.5*p, flexDirection:'row', alignSelf:'center'}}>
                                {(this.detail).map((x, index) => {
                                var { w, h, p } = this.screenWHP;
                                        return (
                                            <SGView style={{borderBottomWidth:5,borderBottomLeftRadius:10,borderBottomRightRadius:10}} accessible={true} key={x.fID}>
                                                  <SGView style={{width:'100%', alignItems:'flex-start', marginHorizontal:5*p}}>
                                                  <SGText preset={SGText.preset.h4B}>{x.fStoreNameID}</SGText>
                                                  <SGText preset={SGText.preset.h4}>{x.fReceiptNumber}</SGText>
                                                  <SGView style={{flexDirection:'row',width:'100%', justifyContent:'space-between'}}>
                                                  <SGText preset={SGText.preset.h4}>Rp. {x.fReceiptAmount}.-</SGText>
                                                  <SGText preset={SGText.preset.h4}>{SGHelperType.formatDate(SGHelperType.convertNewDate(x.fReceiptDate),this._language)}</SGText>
                                                  </SGView>  
                                                </SGView>               
                                            </SGView>
                                        )
                                    })}
                            </SGViewPager>
        <SGFlatList style={{alignItems:'center'}}  contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.detail} renderItem={({ item }) => {
                      for(i=0;i<item.fReceiptImage.length;i++)
                      {
                      return (
                        // <SGView>
                              <SGImage style={{width:w*0.9, height:h}}source={{uri:item.fReceiptImage[i][this.imset].uri}}></SGImage>
                        // </SGView>
                          );
                      }
                      }} keyExtractor={item => item.fID}

                    >
          </SGFlatList>

          </SGView>
          }
        
        </SGView>
            </SGRootView>
        );
    }
}