import React from 'react';
import {SGTouchableOpacity as TouchableOpacity} from '../SGTouchableOpacity';
import {SGView as View} from '../SGView';

// const React = require('react');
// const ReactNative = require('react-native');
// const {
//   TouchableOpacity,
//   View,
// } = ReactNative;

const Button = (props) => {
  return <TouchableOpacity {...props}>
    {props.children}
  </TouchableOpacity>;
};

module.exports = Button;
