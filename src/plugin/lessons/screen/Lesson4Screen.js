import React from 'react';
import Core from '../../core/core';

export default class Lesson4Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
    });
  }

  /**
   * Fungsi untuk menghitung perkalian dua bilangan
   * @param {*} a : bilangan pertama
   * @param {*} b : bilangan kedua
   * @returns 
   */
  kali(a, b) {
    return a * b;
  }
  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    this._toVar = -1;
    this._iVar = -1;
    this._flag = false;
    var c = this.kali(3, 7);
  }

  /**
   * test using simplify if
   */
  onButton1Press() {
    var a = 5;
    var b = (a === 5 ? 'lima' : 'bukan lima');
    /*
        var b;
        if(a===5){
            b='lima';
        } else {
            b='bukan lima';
        }
    */
    Core.log(b);
  }

  /**
   * create custom function
   */
  onButton2Press() {
    Core.log(this.kali(3, 4));
    var c = (a, b) => { return a * b; }
    Core.log(c(3, 4));
    var d = this.kali;
    Core.log(d(3, 4));
  }

  /**
   * using setTimeOut
   */
  onButton3Press() {
    this._toVar = setTimeout(
      () => { Core.log('berhasil') }
    , 2000);
  }

  /**
   * using clearTimeout
   */
  onButton4Press() {
    if (this._toVar !== -1) {
      clearTimeout(this._toVar);
      this._toVar = -1;
    }
  }

  /**
   * using setInterval
   */
  onButton5Press() {
    if (this._iVar === -1) {
      this._iVar = setInterval(() => { Core.log(new Date()) }, 1000);
    }
  }

  /**
   * using clearInterval
   */
  onButton6Press() {
    if (this._iVar !== -1) {
      clearInterval(this._iVar)
      this._iVar = -1;
    }
  }

  /**
   * test changing flag hide or show component
   */
  onButton7Press() {
    this._flag = !this._flag;
    Core.log(this._flag);
    //this.forceUpdate();
  }

  /**
   * test calling force update
   */
  onButton8Press() {
    this.forceUpdate();
  }

  render() {
    Core.log('render');
    const { SGView, SGButton, SGText, SGRootView } = Core.Control;
    var style = this.style;
    return (
      <SGRootView>
        <SGView style={style.v1} >
          {
            this._flag &&
            <SGText>Aku Ada Jika Flag nilainya true</SGText>
          }
          <SGButton label='1' onPress={this.onButton1Press.bind(this)} />
          <SGButton label='2' onPress={this.onButton2Press.bind(this)} />
          <SGButton label='3' onPress={this.onButton3Press.bind(this)} />
          <SGButton label='4' onPress={this.onButton4Press.bind(this)} />
          <SGButton label='5' onPress={this.onButton5Press.bind(this)} />
          <SGButton label='6' onPress={this.onButton6Press.bind(this)} />
          <SGButton label='7' onPress={this.onButton7Press.bind(this)} />
          <SGButton label='8' onPress={this.onButton8Press.bind(this)} />
        </SGView>
      </SGRootView>
    );
  }
}