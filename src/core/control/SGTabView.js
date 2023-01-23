/**
 * wrap rn-scrollable tab view with certain additional behavior
 * 1. default style
 * 2. scrollableTabBar : true|false
 * 3. useImage : true|false (the tabLabel prop is the URL)
 * 4. tabBarActiveTextPreset : SGText.preset...
 * 5. tabBarInactiveTextPreset : SGText.preset...
 * Built in options using props:
 * 1. scrollWithoutAnimation : {true|false}
 * 2. initialPage : {number}
 * 3. locked : {true|false}
 * 4. tabBarPosition : {overlayTop|overlayBottom|top|bottom}
 * 5. tabBarStyle
 * 6. tabBarActiveTextColor
 * 7. tabBarInactiveTextColor
 * 8. tabBarTextStyle
 * 9. tabBarUnderlineStyle
 * 10. style
 * Built in events
 * 1. onChangeTab(e)
 * 2. onScroll(e)
 * Built in function
 * 1. goToPage(i)
 */

import React from 'react';
import { SGText } from './SGText';
import { StyleSheet } from 'react-native';
import { SGBaseControl } from './SGBaseControl';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, ImageTabBar, ScrollableImageTabBar } from './RNScrollableTabView';
import { SGHelperStyle } from '../helper/SGHelperStyle';
import { SGHelperType } from '../helper/SGHelperType';

export class SGTabView extends SGBaseControl {
    createStyleSheet() {
        var { w, h, p } = this._screenWHPNoHeader;
        this._style = StyleSheet.create({
            tbView: { width: '100%', backgroundColor: SGHelperStyle.color.SGTabView.BGWhite, justifyContent: 'flex-start', },
            tbText: {},
            tbLine: { backgroundColor: SGHelperStyle.color.SGTabView.ULBlack },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.createStyleSheet();
        this.TV = React.createRef();
    }

    goToPage(v) {
        this.TV.current.goToPage(v);
    }

    goToPageLabel(v){
        
        var index = -1;
        var childrenArr = React.Children.map(this.props.children, (child) => child);
        for(var i =0;i<childrenArr.length;i++){
            if(childrenArr[i].props.tabLabel===v){ index = i; break;}
        }
        if(index!==-1){this.goToPage(index);}        
    }
    render() {
        var myProps = [];
        myProps = SGHelperStyle.addStyleProps(this.props, this._style.tbView);
        myProps.renderTabBar = myProps.useImage ? (myProps.scrollableTabBar ? () => <ScrollableImageTabBar /> : () => <ImageTabBar />) : (myProps.scrollableTabBar ? () => <ScrollableTabBar /> : () => <DefaultTabBar />);
        myProps.tabBarActiveTextPreset = myProps.tabBarActiveTextPreset ? myProps.tabBarActiveTextPreset : SGText.preset.titleH2B;
        myProps.tabBarInactiveTextPreset = myProps.tabBarInactiveTextPreset ? myProps.tabBarInactiveTextPreset : SGText.preset.titleH2;
        // console.log(myProps.tabBarInactiveTextPreset);
        myProps.locked = SGHelperType.isDefined(this.props.locked) ? this.props.locked : true;
        myProps.tabBarStyle = { backgroundColor: SGHelperStyle.color.SGTabView.TBWhite, borderColor: SGHelperStyle.color.SGTabView.Border, ...myProps.tabBarStyle };
        myProps.tabBarBorderColor = myProps.tabBarBorderColor ? myProps.tabBarBorderColor : SGHelperStyle.color.SGTabView.Border;
        myProps.tabBarActiveTextColor = myProps.tabBarActiveTextColor ? myProps.tabBarActiveTextColor : SGHelperStyle.color.SGTabView.TextBlack;
        myProps.tabBarInactiveTextColor = myProps.tabBarInactiveTextColor ? myProps.tabBarInactiveTextColor : SGHelperStyle.color.SGTabView.TextGrey;
        myProps.tabBarTextStyle = SGHelperStyle.prependStyle(myProps.tabBarTextStyle, this._style.tbText);
        myProps.tabBarUnderlineStyle = SGHelperStyle.prependStyle(myProps.tabBarUnderlineStyle, this._style.tbLine);
        myProps.keyboardShouldPersistTaps = SGHelperType.isDefined(this.props.keyboardShouldPersistTaps) ? this.props.keyboardShouldPersistTaps : 'handled';
        if (this.props.hidden) {
            myProps.style = { width: 0, height: 0, margin: 0, overflow: 'hidden' }
        }
        return (
            !this.props.hidden &&
            <ScrollableTabView accessible={true} accessibilityLabel={'SGTabViewScrollableTabView'} ref={this.TV} {...myProps} />
        );
    }
}
