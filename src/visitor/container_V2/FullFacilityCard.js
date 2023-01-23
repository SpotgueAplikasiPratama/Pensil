import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGWebView as WebView } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from "../locales/SGLocalize";
import { FacilityDetailHeader } from '../container_V2/FacilityDetailHeader';
import { LocationTag } from '../component_V2/LocationTag';
import { WebViewRender } from '../component_V2/WebViewRender';

export class FullFacilityCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            scrollView: { backgroundColor: '#FFFFFF' },
            facilityNameText: { color: '#000000', alignSelf: 'flex-start', marginHorizontal: p * 4, marginTop: p * 5 },
            likedText: { color: '#A7A7A7', alignSelf: 'flex-start', marginHorizontal: p * 4, marginBottom: p * 2 },
            tag: { width: w * 0.93 },
            descriptionContainer: { width: w * 0.93, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', marginVertical: p * 2 },
            descriptionText: { color: '#000000', textAlign: 'justify', alignSelf: 'flex-start', marginTop: p * 3 },
        });
    }

    _getLikeResource(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentFacilityID = data.fContentFacilityID;
        var contentFacilityEN = data.fContentFacilityEN;
        var contentFacilityCN = data.fContentFacilityCN;
        return (
            { fContentType: 'Facility', fContentKey: data.key, fText1: { id: contentFacilityID.fFacilityName, en: contentFacilityEN.fFacilityName, cn: contentFacilityCN.fFacilityName }, fText2: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fText3: { id: contentFacilityID.fLongDescription, en: contentFacilityEN.fLongDescription, cn: contentFacilityCN.fLongDescription }, fImageID: contentFacilityID.fImageJSON, fImageEN: contentFacilityEN.fImageJSON, fImageCN: contentFacilityCN.fImageJSON, fTargetKey: data.buildingKey }
        )
    }

    _getCommentResource(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentFacilityID = data.fContentFacilityID;
        var contentFacilityEN = data.fContentFacilityEN;
        var contentFacilityCN = data.fContentFacilityCN;
        return (
            {
                fUserImage: this.props.currentUserData.fProfileImageJSON, fContentType: 'Facility', fContentKey: data.key,
                fContentName: { id: contentFacilityID.fFacilityName, en: contentFacilityEN.fFacilityName, cn: contentFacilityCN.fFacilityName },
                fContentText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText2: { id: contentFacilityID.fLongDescription, en: contentFacilityEN.fLongDescription, cn: contentFacilityCN.fLongDescription },
                fContentImage: { id: contentFacilityID.fImageJSON, en: contentFacilityEN.fImageJSON, cn: contentFacilityCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentFacilityID.fFacilityName, en: contentFacilityEN.fFacilityName, cn: contentFacilityCN.fFacilityName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.buildingKey
            }
        )
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.dataFacility = this.props.dataFacility;
    }
    render() {
        this.whp = { w: this.props.style.width, h: this.props.style.height, p: this.props.style.padding }
        var {w,h,p} = this.whp
        this.style = this.createStyleSheet(this.whp);
        var style = this.style;
        var dataFacility = this.dataFacility;
        console.log(dataFacility);
        return (
            <View accessible={true} accessibilityLabel={'FullFacilityCardRootView'} style={style.mainContainer}>
                <Text accessible={true} accessibilityLabel={'FullFacilityCardTitleText'} preset={Text.preset.titleH2B} style={style.facilityNameText} numberOfLines={1}>{(dataFacility['fContentFacility' + this.props.language.toUpperCase()].fFacilityName).toUpperCase()}</Text>
                <Text accessible={true} accessibilityLabel={'FullFacilityCardLikeText'} preset={Text.preset.titleH4_5B} style={style.likedText}>{dataFacility.fLikeCountFacility} {SGLocalize.translate('globalText.likeCountText')}</Text>
                <FacilityDetailHeader onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountFacility+=c; this.forceUpdate();}).bind(this,dataFacility)} accessible={true} accessibilityLabel={'FullFacilityCardHeader'} imageSetting={this.props.imageSetting} language={this.props.language} likePackage={this._getLikeResource(dataFacility)} commentPackage={this._getCommentResource(dataFacility)} footerName={dataFacility['fContentBuilding' + this.props.language.toUpperCase()].fBuildingName} footerLogo={dataFacility['fContentBuilding' + this.props.language.toUpperCase()].fImageJSON[0][this.props.imageSetting].uri} footerLikedCount={dataFacility.fLikeCountBuilding} imageSlider={dataFacility['fContentFacility' + this.props.language.toUpperCase()].fImageJSON} isUserLikeThis={dataFacility.fUserLikedThis} contentKey={dataFacility.key} buildingKey={dataFacility.buildingKey} navigator={this.props.navigator} shareMessage={dataFacility['fContentFacility' + this.props.language.toUpperCase()].fFacilityName} targetKey={dataFacility.buildingKey} canComment={dataFacility.fCanComment} city={dataFacility.location} style={style.throwWHP} fullScreen={false}></FacilityDetailHeader>
                {dataFacility['fContentFacility' + this.props.language.toUpperCase()].fTypeDetail === 'longdescription' ?
                    (<View accessible={true} accessibilityLabel={'FullFacilityCardContentView'} style={style.descriptionContainer}>
                        <LocationTag accessible={true} accessibilityLabel={'FullFacilityCardFloorLocation'} style={style.tag} floorLocation={dataFacility['fFloorName' + this.props.language.toUpperCase()]} locationHint={dataFacility['fContentFacility' + this.props.language.toUpperCase()].fLocation} leftMode></LocationTag>
                        <Text accessible={true} accessibilityLabel={'FullFacilityCardDescText'} preset={Text.preset.titleH3} style={style.descriptionText}>{dataFacility['fContentFacility' + this.props.language.toUpperCase()].fLongDescription}</Text>
                    </View>)
                    :
                    (null)
                }
                {dataFacility['fContentFacility' + this.props.language.toUpperCase()].fTypeDetail === 'url' &&
                    (
                        <View accessible={true} accessibilityLabel={'FullFacilityCardContentView'} style={style.descriptionContainer}>
                            <LocationTag accessible={true} accessibilityLabel={'FullFacilityCardFloorLocation'} style={style.tag} floorLocation={dataFacility['fFloorName' + this.props.language.toUpperCase()]} locationHint={dataFacility['fContentFacility' + this.props.language.toUpperCase()].fLocation} leftMode></LocationTag>
                            { dataFacility['fContentFacility' + this.props.language.toUpperCase()].fURL !== '' ?
                            <View style={{width:w,height:h}}> 
                                <WebViewRender data={dataFacility['fContentFacility' + this.props.language.toUpperCase()].fURL} style={style.throwWHP} fType='url'></WebViewRender>
                            </View>
                            :
                            (null)
                            }
                        </View>)
                    
                }
                {dataFacility['fContentFacility' + this.props.language.toUpperCase()].fTypeDetail === 'html' &&
                   
                    
                    <View accessible={true} accessibilityLabel={'FullFacilityCardContentView'} style={style.descriptionContainer}>
                        <LocationTag accessible={true} accessibilityLabel={'FullFacilityCardFloorLocation'} style={style.tag} floorLocation={dataFacility['fFloorName' + this.props.language.toUpperCase()]} locationHint={dataFacility['fContentFacility' + this.props.language.toUpperCase()].fLocation} leftMode></LocationTag>
                        { dataFacility['fContentFacility' + this.props.language.toUpperCase()].fHTML !== '' ?
                            <View style={{width:w,height:h}}> 
                                <WebViewRender data={dataFacility['fContentFacility' + this.props.language.toUpperCase()].fHTML} style={style.throwWHP} fType='html'></WebViewRender>
                            </View>
                         :
                         (null)
                        }
                    </View>
                   
                }
            </View>
        );
    }
}
