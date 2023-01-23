import React from 'react';
import { StyleSheet, } from 'react-native';
import { SGRootScrollView, } from '../../core/control';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';
import { CustomizationData} from '../db/CustomizationData';
import {CustomizationCRUDList} from '../container/CustomizationCRUDList';

export class Lesson26Screen extends SGBaseScreen {
    getData() {
        var url = 'https://www.spotgue.com/logo.png';
        return ([
            new CustomizationData({ id: '1', imageURL: url, title: 'Extra large', desc: 'A large bowl portion to satisfy your hunger', price: 10000, active: false, }),
            new CustomizationData({ id: '2', imageURL: url, title: 'Extra Cheese', desc: 'Add extra cheese for cheese lover', price: 5000, active: true }),
            new CustomizationData({ id: '3', imageURL: url, title: 'Extra Chili', desc: 'Add extra chili for those who love it hot', price: 5000, active: true }),
        ]);
    }

    createStyleSheet = (whp) => {
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
        var { w, h, p } = this.WHP;
        var style = this._style;
        var data = this._data;
        return (
            <SGRootScrollView>
                <CustomizationCRUDList readonly={false} dataList={data} style={style.c1} />
            </SGRootScrollView>
        );
    }
}