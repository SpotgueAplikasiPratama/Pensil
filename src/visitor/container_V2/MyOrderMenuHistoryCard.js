import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { SGHelperType,SGHelperNavigation } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';
import { VisitorHelper } from '../helper/VisitorHelper';

export class MyOrderMenuHistoryCard extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView: { alignItems: 'flex-start', flexDirection: 'row', marginVertical: w * 0.01, width: w-2*p, height: w * 0.35, borderRadius: w * 0.01, borderWidth: 0.5, borderColor: '#000000', },
            containerView1: { justifyContent: 'center', width: (w - 2 * p) * 0.93 * 3.5 / 10, height: w * 0.35 },
            containerView2: { width: (w - 2 * p) * 0.93 * 6.5 / 10, height: w * 0.35 },
            containerView2Top: { width: (w - 2 * p) * 0.93 * 6.5 / 10, height: w * 0.125, alignSelf: 'flex-end', alignItems: 'flex-start', },
            containerView2Bottom: { width: (w - 2 * p) * 0.93 * 6.5 / 10, height: w * 0.175, flexDirection: 'row', alignItems: 'flex-start', },
            containerView2_1: { justifyContent: 'flex-start', width: (w - 2 * p) * 0.93 * 6.5 / 10 * 0.5, alignItems: 'flex-start' },
            contentView: { justifyContent: 'flex-start', flexDirection: 'row', width: (w - 2 * p) * 0.93 * 6.5 / 10 * 0.5, },
            logoImage: { width: w * 0.28, height: w * 0.28 },
            text1: { color: '#000000' },
            text2: { color: '#000000' },
            icon: { width: w * 0.042, height: w * 0.042, resizeMode: 'contain', backgroundColor: 'transparent' },
            contentView2: { alignItems: 'flex-start', justifyContent: 'flex-start' },
            totalSpendLabel: { color: 'white', marginHorizontal: 0, marginRight: p },
            totalPriceView: { flexDirection: 'row', backgroundColor: '#212121', position: 'absolute', bottom: 0, right: 0, width: w * 0.375, height: w * 0.07, borderBottomRightRadius: 2 * p, borderTopLeftRadius: 2 * p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);

        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }

    onImageTenantPress(){
        var data = this.props.data;
        if(data.fType == 'resto'){
            SGHelperNavigation.navigate(this.props.navigator,'RestoHome', {contentKey:data.fStoreKey })
        }else if(data.fType == 'store'){
            SGHelperNavigation.navigate(this.props.navigator,'StoreHome', {contentKey:data.fStoreKey })
        }
    }


    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var language = this.props.language.toUpperCase();
        var userData = this.props.userData;
        var imageSetting = this.props.imageSetting;
        return (
            <TouchableOpacity onPress={this.props.onHistoryPress.bind(this, data)}>
                <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardRootView'} style={style.mainView}>
                    <TouchableOpacity accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardLogoView'} style={style.containerView1} onPress={()=>{this.onImageTenantPress()}}>
                        <Image accessible={true} accessibilityLabel={'MyOrderMenuActiveCardLogoImage'} source={{ uri: data['fStoreContent' + language].fStoreImageJSON[0][imageSetting].uri }} style={style.logoImage}></Image>
                    </TouchableOpacity>
                    <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardContainerView'} style={style.containerView2}>
                        <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTopView'} style={style.containerView2Top}>
                            <Text accessible={true} accessibilityLabel={'MyOrderMenuActiveCardRestoName'} preset={Text.preset.titleH2B} style={style.text1}>{data['fStoreName' + language]}</Text>
                            <Text accessible={true} accessibilityLabel={'MyOrderMenuActiveCardPlaceName'} preset={Text.preset.titleH4_5B} style={{ ...style.text1, marginTop: -p }}>{data['fBuildingName' + language]}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardBottomView'} style={style.containerView2Bottom}>
                            <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardBottomContainerView1'} style={style.containerView2_1}>
                                <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardDtaeView'} style={style.contentView}>
                                    <Image accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardDateIconImage'} source={{ uri: image.dateIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                                    <Text accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardDateText'} preset={Text.preset.titleH5B} style={style.text2}>{SGHelperType.formatDate(SGHelperType.convertNewDate(data.fOrderDate), language)}</Text>
                                </View>
                                <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTimeView'} style={style.contentView}>
                                    <Image accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTimeIconImage'} source={{ uri: image.timeIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                                    <Text accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTimeText'} preset={Text.preset.titleH5B} style={style.text2}>{SGHelperType.formatTime(SGHelperType.convertNewDate(data.fOrderTime), language)}</Text>
                                </View>
                                <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTableView'} style={style.contentView}>
                                    <Image accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTableIconImage'} source={{ uri: image.tableIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                                    <Text accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTableText'} preset={Text.preset.titleH5B} style={style.text2}>{SGLocalize.translate('tabOrderMenu.LabelTable')} {data.fTableNumber}</Text>
                                </View>
                            </View>
                            <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardBottomContainerView2'} style={style.containerView2_1}>
                                <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardPersonView'} style={style.contentView}>
                                    <Image accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardPeopleIconImage'} source={{ uri: image.peopleIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                                    <Text accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardNumbPerson'} preset={Text.preset.titleH5B} style={style.text2}>{data.fNumberOfPerson} {SGLocalize.translate('tabOrderMenu.LabelPerson')}</Text>
                                </View>
                                <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardKeyView'} style={style.contentView}>
                                    <Image accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardKeyIconImage'} source={{ uri: image.keyIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                                    <Text accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardKeyText'} preset={Text.preset.titleH5B} style={style.text2}>{data.fTableKey}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTotalPriceView'} style={style.totalPriceView}>
                        <Text accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTotalSpendText'} preset={Text.preset.titleH4B} style={style.totalSpendLabel}>{SGLocalize.translate('tabOrderMenu.LabelTotal')}:</Text>
                        <Text accessible={true} accessibilityLabel={'MyOrderMenuHistoryCardTotalPriceText'} preset={Text.preset.titleH4B} style={style.totalSpendLabel}>{this.props.currency} {VisitorHelper._showPriceText(data.fTotalPrice, data.fCurrency)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
