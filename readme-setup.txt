1. error di react-native-gesture-handler
[!] Invalid `Podfile` file: 
[!] Invalid `RNGestureHandler.podspec` file: undefined method `exists?' for File:Class.

GH : 
a. open /node_modules/react-native-gesture-handler/RNGestureHandler.podspec
b. replace exists with exist
isUserApp = File.exists?(File.join(__dir__, "..", "..", "node_modules", "react-native", "package.json"))
    with
isUserApp = File.exist?(File.join(__dir__, "..", "..", "node_modules", "react-native", "package.json"))

2. error di react-native-reanimated
Invalid `RNReanimated.podspec` file: [react-native-reanimated] Multiple versions of Reanimated were detected.

GH : if there are multiple, can remove
     not sure what to fix, just try pod install again
     running this may also help
     cd ios && pod update

3.  error saat run 
 ERROR  Invariant Violation: ViewPropTypes has been removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'., js engine: hermes

GH : ada penggunaan ViewPropTypes di beberapa node_modules
a. react-native-camera
RNCamera.js
// before
import {
  findNodeHandle,
  Platform,
  NativeModules,
  ViewPropTypes,
  requireNativeComponent,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
// after : 
import {
  findNodeHandle,
  Platform,
  NativeModules,
  //ViewPropTypes,
  requireNativeComponent,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types'

b. react-native-snap-carousel
carousel\Carousel.js
//before:
import { Animated, Easing, FlatList, I18nManager, Platform, ScrollView, View, ViewPropTypes } from 'react-native';

//after:
import { Animated, Easing, FlatList, I18nManager, Platform, ScrollView, View, } from 'react-native';
import {ViewPropTypes, } from 'deprecated-react-native-prop-types'

pagination\PaginationDot.js
//before :
import { View, Animated, Easing, TouchableOpacity, ViewPropTypes } from 'react-native';
//after :
import { View, Animated, Easing, TouchableOpacity,  } from 'react-native';
import {ViewPropTypes, } from 'deprecated-react-native-prop-types'

pagination\Pagination.js
//before:
import { I18nManager, Platform, View, ViewPropTypes } from 'react-native';
//after:
import { I18nManager, Platform, View,  } from 'react-native';
import {ViewPropTypes, } from 'deprecated-react-native-prop-types'

parallaximage\ParallaxImage.js
//before:
import { View, ViewPropTypes, Image, Animated, Easing, ActivityIndicator, findNodeHandle } from 'react-native';
//after:
import { View, Image, Animated, Easing, ActivityIndicator, findNodeHandle } from 'react-native';
import {ViewPropTypes, } from 'deprecated-react-native-prop-types'
