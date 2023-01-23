import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from "../../core/container/SGBaseContainer";
import { SGView as View, SGText as Text, SGIcon as Icon, SGImage as Image } from "../../core/control";
import { SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';
import { VisitorHelper } from '../helper/VisitorHelper';

export default class WaiterHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w, justifyContent: 'center', backgroundColor: 'white' },
            v2: { width: w - 2 * p, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 * p },
            v3: { flexDirection: 'row', marginHorizontal: p },
            v4: { width: w, flexDirection: 'row', paddingVertical: 4 * p, justifyContent: 'flex-end', backgroundColor: 'white' },
            text: { color: '#181818', },
            text2: { color: '#181818', marginHorizontal: 4 * p },
            icon: { width: w * 0.042, height: w * 0.042, resizeMode: 'contain', backgroundColor: 'transparent' },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataStore = this.props.dataStore;
        var language = this.props.language.toUpperCase();
        var priceTotal = this.props.priceTotal;
        var orderTime = SGHelperType.formatTime(SGHelperType.convertNewDate(data[0].fOrderTime), language);
        return (
            <View accessible={true} accessibilityLabel={'WaiterHeaderRootView'} style={style.v1}>
                <Text accessible={true} accessibilityLabel={'WaiterHeaderOrderName'} preset={Text.preset.titleH2B} style={style.text}>{data[0].fOrderName}</Text>
                <View accessible={true} accessibilityLabel={'WaiterHeaderContentView'} style={style.v2}>
                    <View accessible={true} accessibilityLabel={'WaiterHeaderTableView'} style={style.v3}>
                        <Image accessible={true} accessibilityLabel={'WaiterHeaderTableIconImage'} source={{ uri: image.tableIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                        <Text accessible={true} accessibilityLabel={'WaiterHeaderTableText'} preset={Text.preset.titleH4B} style={style.text}>{SGLocalize.translate('orderListScreen.LabelTable')} {data[0].fTableNumber}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'WaiterHeaderOrderTimeView'} style={style.v3}>
                        <Image accessible={true} accessibilityLabel={'WaiterHeaderTimeIconImage'} source={{ uri: image.timeIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                        <Text accessible={true} accessibilityLabel={'WaiterHeaderOrderTimeText'} preset={Text.preset.titleH4B} style={style.text}>{orderTime}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'WaiterHeaderKeyView'} style={style.v3}>
                        <Image accessible={true} accessibilityLabel={'WaiterHeaderKeyIconImage'} source={{ uri: image.keyIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                        <Text accessible={true} accessibilityLabel={'WaiterHeaderKeyText'} preset={Text.preset.titleH4B} style={style.text}>{data[0].fTableKey}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'WaiterHeaderPeopleView'} style={style.v3}>
                        <Image accessible={true} accessibilityLabel={'WaiterHeaderPeopleIconImage'} source={{ uri: image.peopleIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                        <Text accessible={true} accessibilityLabel={'WaiterHeaderNumbPersonText'} preset={Text.preset.titleH4B} style={style.text}>{data[0].fNumberOfPerson}</Text>
                    </View>
                </View>
                <View accessible={true} accessibilityLabel={'WaiterHeaderPriceView'} style={style.v4}>
                    <Text accessible={true} accessibilityLabel={'WaiterHeaderTotalPriceText'} preset={Text.preset.titleH3B} style={style.text2}>{SGLocalize.translate('orderListScreen.LabelTotal')}: {dataStore.fCurrency} {SGHelperType.addThousandSeparator((priceTotal).toString())}</Text>
                </View>
            </View>
        );
    }
}
