/**
 * Wrap react-native viewpager component to add custom page indicator
 * 1. add custom page indicator with default page indicator style
 * 2. hidden true|false
 * 3. noAutoScroll true|false
 */

import React from 'react';
import {Platform} from 'react-native';
import { SGView } from './SGView';
import PagerView from 'react-native-pager-view';
// import ViewPager from '@react-native-community/viewpager';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperStyle , SGHelperType} from '../helper';
import { SGHelperGlobalVar } from '../helper';

export class SGViewPager extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = { page: (this.props.initialPage ? this.props.initialPage : 0) };
        this.vP = React.createRef();
    }
    onPageSelected(e) {
        this.setState({ page: e.nativeEvent.position });
        this.activateAutoScroll();
        if (this.props.onPageSelected) this.props.onPageSelected(e);
    }
    setPageWithoutAnimation(index) {
        this.vP.current.setPageWithoutAnimation(index);
    }
    get current() {
        return this.vP.current;
    }
    activateAutoScroll() {
        if (!this.props.noAutoScroll) {
            this.clearAutoScroll();
            if (this.props.children.length > 1) {
                if(Platform.OS==='android'){
                    this._autoScrollInterval = setInterval(() => { if(!SGHelperGlobalVar.getVar('PauseViewPager')) {this.vP.current.setPage(this.state.page + 1 < this.props.children.length ? this.state.page + 1 : 0)}}, 5000)
                } else {
                    this._autoScrollInterval = setInterval(() => { this.vP.current.setPage(this.state.page + 1 < this.props.children.length ? this.state.page + 1 : 0)}, 5000)
                }
            }
        }
    }
    clearAutoScroll() {
        if (!this.props.noAutoScroll) {
            if (this._autoScrollInterval) {
                clearInterval(this._autoScrollInterval);
                this._autoScrollInterval = null;
            }
        }
    }
    componentDidMount() {
        this.activateAutoScroll();
    }
    componentWillUnmount() {
        this.clearAutoScroll();
    }
    render() {
        var { flex, alignSelf, width, height } = this.props.style;
        var vStyle = { flex, alignSelf, width, height };
        return (
            <SGView accessible={true} accessibilityLabel={'SGViewPagerRootSGView'} hidden={this.props.hidden ? true : false} style={vStyle}>
                <PagerView accessible={true} accessibilityLabel={'SGViewPagerPageSelected'} {...this.props} style={[this.props.style, { width: '100%', height: '100%' }]} showPageIndicator={false} onPageSelected={this.onPageSelected.bind(this)} ref={this.vP}>
                </PagerView>
                <PageIndicator bottom={this.props.bottom} accessible={true} accessibilityLabel={'SGViewPagerPageIndicator'} hidden={this.props.hiddenPageIndicator ? true : false} pageCount={this.props.children.length} currentPage={this.state.page} style={this.props.pageIndicatorStyle} halfWidth={this.props.halfWidth}/>
            </SGView>
        );
    }
}

class PageIndicator extends SGBaseControl {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }
    render() {
        var p = this.screenWHPNoHeader.p;
        p = this.props.halfWidth?p/2:p
        this._pages = [];
        for (var i = 0; i < this.props.pageCount; i++) {
            this._pages.push(i);
        }
        return (
            <SGView accessible={true} accessibilityLabel={'PageIndicatorRootSGView'} hidden={this.props.hidden ? true : false} style={[{ position: 'absolute', bottom: this.props.bottom?this.props.bottom:4 * p, flexDirection: 'row', alignSelf: 'center' }, this.props.style]}>
                {
                    this._pages.map((d) => {
                        return <SGView key={SGHelperType.getGUID()} accessible={true} accessibilityLabel={'PageIndicatorSGView1'} style={{ width: 1.92 * p, height: p * 1.92, margin: p, borderRadius: p * 0.7, backgroundColor: (d === this.props.currentPage ? SGHelperStyle.color.pageIndicatorSelectedColor : SGHelperStyle.color.pageIndicatorNotSelectedColor), borderWidth: 1, borderColor: SGHelperStyle.color.pageIndicatorBorderColor }}></SGView>
                    })
                }
            </SGView>
        )
    }
}
