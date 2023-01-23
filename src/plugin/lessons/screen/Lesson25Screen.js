import React from 'react';
import Core from '../../core/core';
import CustomizationData from '../model/CustomizationData';
import CustomizationCRUDList from '../component/container/CustomizationCRUDList';

export class Lesson25Screen extends Core.Screen.SGBaseScreen {
    getData() {
        var url = 'https://www.spotgue.com/logo.png';
        return ([
            new CustomizationData({ id: '1', imageURL: url, title: 'Extra large', desc: 'A large bowl portion to satisfy your hunger', price: 10000, active: false, }),
            new CustomizationData({ id: '2', imageURL: url, title: 'Extra Cheese', desc: 'Add extra cheese for cheese lover', price: 5000, active: true }),
            new CustomizationData({ id: '3', imageURL: url, title: 'Extra Chili', desc: 'Add extra chili for those who love it hot', price: 5000, active: true }),
        ]);
    }

    createStyleSheet = (whp) => {
        const { StyleSheet, } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w, height: h, },
            c1: { width: (w - 2 * p) * 0.8, padding: p },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._style = this.createStyleSheet(this.WHP);
        this._data = this.getData();
    }
    render() {
        const { SGRootScrollView, } = Core.Control;
        var { w, h, p } = this.WHP;
        var style = this._style;
        return (
            <SGRootScrollView style={{width:w, backgroundColor:'white'}}>
                <CustomizationCRUDList readonly={false} dataList={this._data} style={style.c1} />
            </SGRootScrollView>
        );
    }
}