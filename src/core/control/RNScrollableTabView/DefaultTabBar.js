const React = require('react');
//const { ViewPropTypes } = 
const ReactNative = require('react-native');
import {ViewPropTypes, TextPropTypes} from 'deprecated-react-native-prop-types'
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const {
  StyleSheet,
  Text,
  View,
  Animated,
} = ReactNative;
import { SGText } from '../SGText';
import { SGHelperStyle } from '../../helper';
import Button from './Button';

const DefaultTabBar = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    tabBarStyle: ViewPropTypes.style,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: TextPropTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    //    const fontWeight = isTabActive ? 'bold' : 'normal';

    return <Button
      style={{ flex: 1, }}
      key={name.label}
      accessible={true}
      accessibilityLabel={name.label}
      accessibilityTraits='button'
      onPress={name.disabled ? () => { } : () => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle,]}>
        <SGText preset={isTabActive ? this.props.activeTextPreset : this.props.inactiveTextPreset} style={[{ color: textColor, opacity: name.disabled ? SGHelperStyle.opacity.disabled : 1.0 }, textStyle,]}>
          {name.label}
        </SGText>
      </View>
    </Button>;
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    });
    return (
      <View style={[styles.tabs, this.props.tabBarStyle, this.props.style,]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [
                { translateX },
              ]
            },
            this.props.underlineStyle,
          ]}
        />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});

module.exports = DefaultTabBar;
