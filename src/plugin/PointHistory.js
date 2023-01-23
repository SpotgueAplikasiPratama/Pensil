import React from 'react';
import Core from '../core/core';
import PointHistoryEarn from './plugin1/component/PointHistoryEarn';
import PointHistoryExpire from './plugin1/component/PointHistoryExpire';
import PointHistoryRedeem from './plugin1/component/PointHistoryRedeem';
import MyTranslator from './lessons/locale/MyTranslator';

export default class PointHistory extends Core.Control.SGBaseContainer {


  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      throwWHP: { width: w, height: h, padding: p },
      v10: {flex: 1, justifyContent:'flex-start'},
    });
  }

  constructor(props, context, ...args) {
    const {SGHelperGlobalVar} = Core.Helper
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
    this.imset = SGHelperGlobalVar.getVar('GlobalImageSetting')
  }

  render() {
    const { SGView, SGText, SGFlatList, SGRootView, SGTabView, SGActivityIndicator} = Core.Control;
    const { SGHelperType, SGHelperWindow, BottomNavigationContainer } = Core.Helper;
    var style = this.style;
    var { w, h, p } = this.screenWHP;
    var language = this._language;
    this.LoyaltyEarnPoint = this.props.LoyaltyEarnPoint
    this.MyLoyaltyRedeemPoint = this.props.MyLoyaltyRedeemPoint
    this.MyLoyaltyExpiredPoint = this.props.MyLoyaltyExpiredPoint
    this.state = this.props.state
    return (
    <SGView style = {{backgroundColor: 'white', flex: 1}}>
        <SGTabView scrollableTabBar={true} onChangeTab={(e) => { this._tabIndex = e.i; this.forceUpdate(); }}>
          <SGView tabLabel={MyTranslator.tr('PointHistory.EarnLabel')} style={style.v10}>
            <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refreshEarn} onRefresh={this.props._onRefreshEarn} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.LoyaltyEarnPoint} renderItem={({ item }) => {
              return (
                this.LoyaltyEarnPoint.length != 0 &&
                  <PointHistoryEarn data = {item} datalang = {language} 
                />  
              );
              }}keyExtractor={item => item.fID}
                onEndReached={this.props._onLoadEarn}
                onEndReachedThreshold={SGHelperType.getThreshold()}
                ListFooterComponent={()=>{
                  if( this.props.state.loadingEarn)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                  else return null
              }}
            ></SGFlatList>
          </SGView>
          
          <SGView tabLabel={MyTranslator.tr('PointHistory.RedeemLabel')} style={style.v10}>
            <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refreshRedeem} onRefresh={this.props._onRefreshRedeem} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.MyLoyaltyRedeemPoint} renderItem={({ item }) => {
                return (
                    this.MyLoyaltyRedeemPoint.length != 0 &&
                    <PointHistoryRedeem data = {item} datalang = {language} imageSetting={this.imset}/>  
                  );
                }}keyExtractor={item => item.fID}
                  onEndReached={this.props._onLoadRedeem}
                  onEndReachedThreshold={SGHelperType.getThreshold()}
                  ListFooterComponent={()=>{
                    if( this.props.state.loadingRedeem)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                    else return null
                }}
              >
            </SGFlatList>
          </SGView>

          <SGView tabLabel={MyTranslator.tr('PointHistory.ExpiredLabel')}  style={style.v10}>
            <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refreshExpire} onRefresh={this.props._onRefreshExpire} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.MyLoyaltyExpiredPoint} renderItem={({ item }) => {
              return (
                  this.MyLoyaltyExpiredPoint.length != 0 &&
                  <PointHistoryExpire data = {item} datalang = {language}/>  
                );
              }}keyExtractor={item => item.fID}
                onEndReached={this.props._onLoadExpire}
                onEndReachedThreshold={SGHelperType.getThreshold()}
                ListFooterComponent={()=>{
                  if( this.props.state.loadingExpire)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                  else return null
              }}
              >
            </SGFlatList>
          </SGView>   
        </SGTabView>
    </SGView>
    );
  }
}