import React from 'react';
import Core from '../../core/core';

export default class Lesson2Screen extends Core.Screen.SGBaseScreen {
  createStyleSheet = (whp) => {
    var { w, h, p } = whp;
    return Core.StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', alignSelf:'center', width: w, height: h, overflow: 'visible' },
      to1: { marginBottom: 10 },
      t1: { color: 'blue' },
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
  }

  render() {
    const { SGView, SGTouchableOpacity, SGText, SGRootView } = Core.Control;
    const { SGHelperNavigation, SGHelperType } = Core.Helper;
    var style = this.style;
    return (
      <SGRootView>
        <SGView style={style.v1} >
          {
            SGHelperType.isDefined(this.props.route.params) &&
            <SGText>
              {'params:' + this.props.route.params.message}
            </SGText>
          }
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { if (SGHelperNavigation.canGoBack(this.props.navigation)) { SGHelperNavigation.goBack(this.props.navigation) } else { alert('Can not go back!') } }} >
            <SGText style={style.t1} >1. Back to previous screen</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson2Screen') }} >
            <SGText style={style.t1} >2. Navigate Push Lesson #2 Screen</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigateReset(this.props.navigation, 'Lesson2Screen') }} >
            <SGText style={style.t1} >3. Navigate Reset Lesson #2 Screen</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson2Screen', { message: 'UserID:asda23-12dffff-21313ffff' }) }} >
            <SGText style={style.t1} >4. Navigate with Params to Lesson #2 Screen</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'HomeScreen') }} >
            <SGText style={style.t1} >5. Navigate Push to Home</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigateReset(this.props.navigation, 'HomeScreen') }} >
            <SGText style={style.t1} >6. Navigate Reset to Home</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity style={style.to1} activeOpacity={0.75} onPress={() => { SGHelperNavigation.navigatePopPush(this.props.navigation, 'HomeScreen') }} >
            <SGText style={style.t1} >7. Navigate Pop to Home</SGText>
          </SGTouchableOpacity>
        </SGView>
      </SGRootView>
    );
  }
}