import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton } from '../component_V2/CardIconButton';
import { LastVisitedTag } from '../component_V2/LastVisitedTag';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';

export class ReferralHistoryCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', paddingHorizontal: p * 2.5, paddingVertical: p * 2, flexDirection: 'row', justifyContent: 'flex-start', marginVertical: p * 0.5,borderBottomWidth: 1, borderBottomColor: 'rgb(169,169,169)', marginBottom: 2 },
            image: { width: w * 0.218, height: w * 0.218, resizeMode: 'cover', backgroundColor: '#FFFFFF' },
            rightContainer: { width: w * 0.68, backgroundColor: '#FFFFFF', marginLeft: p * 2, flexDirection: 'row', justifyContent: 'space-between' },
            detail: { justifyContent: 'flex-start', alignItems: 'flex-start' },
            nameText: { color: '#000000' },
            typeAndLocationText: { color: '#989898', marginBottom: p },
            lastCheckInText: { color: '#000000' },
            lastVisited: { width: w * 0.2, height: w * 0.218, backgroundColor: '#FFFFFF' },
            tagIcon: { width: w * 0.085, height: w * 0.105 },
            tagText: { color: '#000000' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.data = this.props.data;
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        this.data = this.props.data;
        // this.dataContent = this.data['fContent' + this.props.language.toUpperCase()];

        return (
            <View accessible={true} accessibilityLabel={'ReferralHistoryCardRootView'} style={style.mainContainer}>
                <View accessible={true} accessibilityLabel={'ReferralHistoryCardImageView'} style={style.leftContainer}>
                    <Image accessible={true} accessibilityLabel={'ReferralHistoryCardImage'} style={style.image} source={{ uri: this.data.fProfileImageJSON[0][this.props.imageSetting].uri }}></Image>
                </View>
                <View accessible={true} style={style.rightContainer}>
                    <View accessible={true} style={style.detail}>
                        <Text accessible={true} accessibilityLabel={'ReferralHistoryCardPlaceName'} preset={Text.preset.heading5B} numberOfLines={1} style={style.nameText}>{this.data.fName}</Text>
                        <Text accessible={true} accessibilityLabel={'StoreCheckInHistoryCardLastCI'} preset={Text.preset.heading7B} numberOfLines={1} style={style.typeAndLocationText}> {SGLocalize.translate("ReferralHistoryScreen.dateText")} {SGHelperType.formatDate(this.data.fRedeemDate, (this.props.language).toUpperCase())}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

// import React from 'react';
// import { SGBaseContainer } from '../../core/container/SGBaseContainer';
// import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
// import { StyleSheet } from 'react-native';
// import { CardIconButton } from '../component_V2/CardIconButton';
// import { LastVisitedTag } from '../component_V2/LastVisitedTag';
// import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';
// import { tbLookupDAO } from '../db/tbLookupDAO';
// import { SGLocalize } from '../locales/SGLocalize';

// export class ReferralHistoryCard extends SGBaseContainer {
//     createStyleSheet = (whp) => {
//         var { w, h, p } = whp;
//         return StyleSheet.create({
//             mainContainer: { width: w, padding: p, backgroundColor: '#FFFFFF', overflow: 'visible', flexDirection: 'row', justifyContent: 'flex-start', marginVertical: this.props.slider ? 0 : p, paddingHorizontal: p * 3 },
//             leftContainer: { width: w * 0.3 },
//             image: { width: (w - p * 2) * 0.2, height: (w - p * 2) * 0.2, backgroundColor: 'transparent', resizeMode: 'cover', borderRadius: p * 3 },
//             likeText: { color: '#A9A9A9' },
//             centerContainer: { width: w * 0.44, height: w * 0.335, marginTop: p, marginBottom: p, paddingLeft: p, paddingTop: p * 2, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', overflow: 'visible' },
//             mallDetailsContainer: { height: w * 0.23, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' },
//             placeNameText: { color: '#000000', marginTop: 0, marginBottom: p * 1.5 },
//             typeAndLocationText: { color: '#989898', marginTop: 0, marginBottom: p * 1 },
//             shortDescText: { color: '#A5A5A5', marginVertical: p * 2, maxWidth: w * 0.45 },
//             iconContainer: { flexDirection: 'row' },
//             icon: { width: w, height: h, padding: p },
//             rightContainer: { width: w * 0.2, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
//             tagIcon: { width: w * 0.09, height: w * 0.115 },
//             tagText: { color: '#000000' }
//         });
//     }

//     constructor(props, context, ...args) {
//         super(props, context, ...args);
//         this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
//         this.style = this.createStyleSheet(this.whp);
//         this.title = props.title;
//     }

//     render() {
//         var { w, h, p } = this.whp;
//         var style = this.style;
//         var data = this.props.data;
//         return (
//             <View accessible={true} accessibilityLabel={'ReferralHistoryCardRootView'} style={style.mainContainer}>
//                 <View accessible={true} accessibilityLabel={'ReferralHistoryCardContainerView1'} style={style.leftContainer}>
//                     <Image accessible={true} accessibilityLabel={'ReferralHistoryCardContentImage'} shadow style={style.image} source={{ uri: data.fProfileImageJSON[0][this.props.imageSetting].uri }}></Image>
//                 </View>
//                 <View accessible={true} accessibilityLabel={'ReferralHistoryCardContainerView2'} style={style.centerContainer}>
//                     <View accessible={true} style={style.mallDetailsContainer}>
//                         <Text accessible={true} accessibilityLabel={'ReferralHistoryCardPlaceName'} preset={Text.preset.h6B} numberOfLines={2} style={style.placeNameText}>{data.fName}</Text>
//                         <Text accessible={true} accessibilityLabel={'ReferralHistoryCardPlaceCategory'} preset={Text.preset.h8_1B} numberOfLines={1} style={style.typeAndLocationText}>{data.fRedeemDate}</Text>
//                     </View>
//                 </View>
//             </View>
//         );
//     }
// }
