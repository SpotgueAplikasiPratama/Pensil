import React from 'react';
import { StyleSheet, } from 'react-native';
import { SGRootView, SGScrollView, SGImage, SGTabView, SGFlatList, SGQRImage, SGQRScanner, SGView, SGButton, SGText, SGImagePicker, } from '../../core/control';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';
import { CustomizationData } from '../db/CustomizationData';

export class Lesson27Screen extends SGBaseScreen {
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
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
        });
    }

    constructor(props, context, ...args) {
        console.log('constructor');
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this._darkMode = false;
        this._data = this.getData();
    }

    renderItem(d) {
        var { w, h, p } = this.WHP;
        var v = d.item;
        return (
            <SGView style={{ borderWidth: 1, width: '100%', backgroundColor: 'pink', marginBottom: p }}>
                <SGText>{v.id}</SGText>
                <SGText>{v.title}</SGText>
                <SGText>{v.desc}</SGText>
                <SGImage source={{ uri: v.imageURL }} style={{ width: w * 0.5, height: w * 0.5 }} />
            </SGView>
        )
    }

    render() {
        console.log('render')
        var style = this.style;
        var { w, h, p } = this.WHP;
        return (
            <SGRootView>
                <SGTabView scrollableTabBar tabBarStyle={{ backgroundColor: 'orange' }} >
                    <SGScrollView tabLabel={'SGScrollView'}>
                        {this._data.map((v) => {
                            return (
                                <SGView style={{ borderWidth: 1, width: '100%', backgroundColor: 'pink', marginBottom: p }}>
                                    <SGText>{v.id}</SGText>
                                    <SGText>{v.title}</SGText>
                                    <SGText>{v.desc}</SGText>
                                    <SGImage source={{ uri: v.imageURL }} style={{ width: w * 0.5, height: w * 0.5 }} />
                                </SGView>
                            );
                        })}
                    </SGScrollView>
                    <SGFlatList tabLabel={'SGFlatList'}
                        data={this._data}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={(d) => { return d.id }}
                    />
                </SGTabView>
            </SGRootView>
        );
    }
}