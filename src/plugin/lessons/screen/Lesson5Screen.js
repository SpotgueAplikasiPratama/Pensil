import React from 'react';
import Core from '../../core/core';


export default class Lesson5Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
    });
  }

  constructor(props, context, ...args) {
    Core.log('constructor');
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
  }

  UNSAFE_componentWillMount() {
    Core.log('componentWillMount');
  }

  componentDidMount() {
    Core.log('componentDidlMount');
    alert('Selesai loading :)');
  }

  componentWillUnmount() {
    Core.log('componentWillUnmount');
  }

  /**
   * test calling force update
   */
  onButtonPress() {
    Core.log('ForceUpdate')
    this.forceUpdate();
  }

  render() {
    const { SGView, SGButton,SGRootView } = Core.Control;
    const { SGHelperNavigation, } = Core.Helper;
    Core.log('render')
    var style = this.style;
    return (
      <SGRootView>
        <SGView style={style.v1} >
          <SGButton label='Force Update' onPress={this.onButtonPress.bind(this)} />
          <SGButton label='Go To Lesson 2' onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Lesson2Screen') }} />
        </SGView>
      </SGRootView>
    );
  }
}