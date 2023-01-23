import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import {VisitorHelper} from '../helper/VisitorHelper';

export class AliceAddLocationCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            viewFavIcon: { position: 'absolute', bottom: 0, right: 0 },
            checkIcon: { color: '#15BB8F' },
            mainContainer: { width: w, backgroundColor: '#FFFFFF', overflow: 'visible', marginTop: p * 2, borderRadius: p * 3, paddingHorizontal: p * 3, paddingVertical: p * 2, flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'center',borderBottomWidth: 1, borderBottomColor: 'rgb(169,169,169)', marginBottom: 2 },
            leftContainer: { width: w * 0.23, height: w * 0.23 },
            placeImage: { width: (w - (p * 5)) * 0.23, height: (w - (p * 5)) * 0.23, resizeMode: 'cover', backgroundColor: 'transparent' },
            rightContainer: { width: w * 0.6, height: w * 0.23, justifyContent: 'flex-start', alignItems: 'flex-start', overflow: 'visible', marginLeft: p * 2 },
            placeNameText: { color: '#000000' },
            typeAndLocationText: { color: '#626262', marginBottom: p },
            shortDescriptionText: { color: '#A5A5A5' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.data = this.props.data;
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var contentData = this.data['fContent' + this.props.language.toUpperCase()];
        return (
            <TouchableOpacity onPress={() => { this.props.onSelectedCard(this.props.contentKey, this.data.fBuildingNameID, this.data.fBuildingNameEN, this.data.fBuildingNameCN) }}>
                <View accessible={true} accessibilityLabel={'AskAliceAddLocationCardMain'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'AskAliceAddLocationCardSmallView1'} style={style.leftContainer}>
                        <Image accessible={true} accessibilityLabel={'AskAliceAddLocationPlaceLogo'} style={style.placeImage} source={{ uri: contentData.fImageJSON[0][this.props.imageSetting].uri }}></Image>
                    </View>
                    <View accessible={true} accessibilityLabel={'AskAliceAddLocationCardSmallView2'} style={style.rightContainer}>
                        <Text accessible={true} accessibilityLabel={'AskAliceAddLocationPlaceName'} preset={Text.preset.titleH3B} numberOfLines={1} style={style.placeNameText}>{(this.data['fBuildingName' + this.props.language.toUpperCase()]).toUpperCase()}</Text>
                        <Text accessible={true} accessibilityLabel={'AskAliceAddLocationPlaceLocationType'} preset={Text.preset.titleH5B} numberOfLines={1} style={style.typeAndLocationText}> {VisitorHelper.getLocalizeDataFromLookUp('BuildingCategory',this.data.fBuildingType,this.props.language)}, {VisitorHelper.getLocalizeDataFromLookUp('City',this.data.fCity,this.props.language)}</Text>
                        <Text preset={Text.preset.titleH6B} numberOfLines={3} style={style.shortDescriptionText}>{contentData.fShortDescription}</Text>
                    </View>
                    {this.props.selectedPlace.key == this.props.contentKey ?
                        (<Icon accessible={true} accessibilityLabel={'AskAliceAddLocationSelectedIcon'} style={style.checkIcon} preset={Icon.preset.h4} name={Icon.Icon.dialogSuccess}></Icon>) :
                        (null)}
                </View>
            </TouchableOpacity>
        );
    }
}
