import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGImage as Image } from '../../core/control';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Fontisto';
import { SGHelperNavigation, SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';

export class MyWaitingListHistoryCard extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView: { alignItems: 'flex-start', flexDirection: 'row', marginVertical: w * 0.01, width: w-2*p, height: w * 0.35, borderRadius: w * 0.01, borderWidth: 0.5, borderColor: '#000000', },
            containerView1: { justifyContent: 'center', width: (w - 2 * p) * 0.93 * 3.5 / 10, height: w * 0.35 },
            containerView2: { width: (w - 2 * p) * 0.93 * 6.5 / 10, height: w * 0.35 },
            containerView2Top: { width: (w - 2 * p) * 0.93 * 6.5 / 10, height: w * 0.1, alignSelf: 'flex-end', alignItems: 'flex-start', },
            containerView2Mid: { width: (w - 2 * p) * 0.93 * 6.5 / 10, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', },
            containerView2Bottom: { width: (w - 2 * p) * 0.93 * 6.5 / 10, height: w * 0.125, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
            containerView2_1: { flexDirection: 'row', justifyContent: 'space-evenly', width: (w - 2 * p) * 0.725, },
            containerView2_2: { flexDirection: 'row', justifyContent: 'flex-start', width: (w - 2 * p) * 0.725, },
            containerView2_2_1: { justifyContent: 'flex-start', width: (w - 2 * p) * 0.725 * 0.5, },
            contentView: { justifyContent: 'flex-start', flexDirection: 'row', },
            logoImage: { width: w * 0.28, height: w * 0.28 },
            text: { fontSize: w * 0.04, marginVertical: w * 0.02 },
            textStatus: { color: this.props.data.fStatus === 'waiting' ? 'orange' : this.props.data.fStatus === 'done' ? '#59E812' : '#D30300' },
            text1: { color: '#000000' },
            text2: { color: '#000000' },
            text3: { fontSize: w * 0.035, marginTop: w * 0.01, marginBottom: w * 0.005 },
            queueNumber: { width: w * 0.3, height: w * 0.15, backgroundColor: 'yellow', borderRadius: w * 0.03 },
            icon: { width: w * 0.042, height: w * 0.042, resizeMode: 'contain', backgroundColor: 'transparent' },
            contentView2: { alignItems: 'flex-start', justifyContent: 'flex-start' },
            textNumber: { fontSize: w * 0.08, },
            button: { width: w * 0.33, height: w * 0.08, borderRadius: p, backgroundColor: '#00A274', justifyContent: 'center', alignItems: 'center' }
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
        var language = (this.props.language).toUpperCase();
        var userData = this.props.userData;
        var imageSetting = this.props.imageSetting;
        console.log(data);
        return (
            <TouchableOpacity onPress={this.props.onCardPress.bind(this, data)}>
                <View accessible={true} accessibilityLabel={'MyWaitingListHistoryCardRootView'} style={style.mainView}>
                    <TouchableOpacity accessible={true} accessibilityLabel={'MyWaitingListHistoryCardLogoView'} style={style.containerView1} onPress={()=>{this.onImageTenantPress()}}>
                        <Image accessible={true} accessibilityLabel={'MyWaitingListHistoryCardLogoImage'} source={{ uri: data['fStoreContent' + language].fStoreImageJSON[0][imageSetting].uri }} style={style.logoImage}></Image>
                    </TouchableOpacity>
                    <View accessible={true} accessibilityLabel={'MyWaitingListHistoryCardContainerView'} style={style.containerView2}>
                        <View accessible={true} accessibilityLabel={'MyWaitingListHistoryCardTopView'} style={style.containerView2Top}>
                            <Text accessible={true} accessibilityLabel={'MyWaitingListHistoryCardRestoName'} preset={Text.preset.titleH2B} style={style.text1} numberOfLines={1}>{data['fStoreName' + language]}</Text>
                            <Text accessible={true} accessibilityLabel={'MyWaitingListHistoryCardPlaceName'} preset={Text.preset.titleH4_5B} style={{ ...style.text1, marginTop: -p }}>{data['fBuildingName' + language]}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'MyWaitingListHistoryCardMidView'} style={style.containerView2Mid}>
                            <View accessible={true} accessibilityLabel={'MyWaitingListHistoryCardDateView'} style={style.contentView}>
                                <Image accessible={true} accessibilityLabel={'MyWaitingListHistoryCardDateIconImage'} source={{ uri: image.dateIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                                <Text accessible={true} accessibilityLabel={'MyWaitingListHistoryCardDateText'} preset={Text.preset.titleH5B} style={style.text2}>{SGHelperType.formatDate(SGHelperType.convertNewDate(data.fBookDateTime), language)}</Text>
                            </View>
                            <View accessible={true} accessibilityLabel={'MyWaitingListHistoryCardTimeView'} style={style.contentView}>
                                <Image accessible={true} accessibilityLabel={'MyWaitingListHistoryCardTimeIconImage'} source={{ uri: image.timeIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                                <Text accessible={true} accessibilityLabel={'MyWaitingListHistoryCardTimeText'} preset={Text.preset.titleH5B} style={style.text2}>{SGHelperType.formatTime(SGHelperType.convertNewDate(data.fBookDateTime), language)}</Text>
                            </View>
                            <View accessible={true} accessibilityLabel={'MyWaitingListHistoryCardPersonView'} style={style.contentView}>
                                <Image accessible={true} accessibilityLabel={'MyWaitingListHistoryCardPeopleIconImage'} source={{ uri: image.peopleIcon[this.props.imageSetting].url }} style={style.icon}></Image>
                                <Text accessible={true} accessibilityLabel={'MyWaitingListHistoryCardNumbPerson'} preset={Text.preset.titleH5B} style={style.text2}>{data.fNumberOfPerson} {SGLocalize.translate('tabWaitingList.LabelPerson')}</Text>
                            </View>
                        </View>
                        <View accessible={true} accessibilityLabel={'MyWaitingListHistoryCardBottomView'} style={style.containerView2Bottom}>
                            <Text accessible={true} accessibilityLabel={'MyWaitingListHistoryCardStatus'} preset={Text.preset.titleH3B} style={style.textStatus}>{data.fStatus.toUpperCase()}</Text>
                        </View>
                    </View>
                    <View accessible={true} accessibilityLabel={'MyWaitingListHistoryCardOverLay'} style={style.overlay} />
                </View>
            </TouchableOpacity>
        );
    }
}
