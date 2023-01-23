import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGViewPager as ViewPager, SGImagePicker, SGImage } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation, SGHelperType,SGHelperGlobalVar,SGHelperErrorHandling } from '../../core/helper';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import { VisitorHelper } from '../helper/VisitorHelper';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';

export class WhereToGoCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', marginVertical: 3*p, justifyContent: 'flex-start' },
            sliderContainer: { width: w, height: w * 1.12 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0 },
            sliderImage: {width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: 0},
            descContainer: { position: 'absolute', top: 0, left: 0 },
            descText: { color: 'black', backgroundColor: '#FFFFFF', marginVertical: p * 2, marginHorizontal: p * 2 },
            bottomContainer: { width: w, flexDirection: 'row', justifyContent: 'flex-start' },
            bottomLeftContainer: { width: w * 0.23, paddingLeft: p * 2, marginVertical: p * 1.5 },
            placeThumbnail: { width: (w - p * 2) * 0.18, height: (w - p * 2) * 0.18, resizeMode: 'cover', borderRadius: p * 100, marginBottom: 0 },
            bottomRightContainer: { width: w * 0.5, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0 },
            storeNameText: { color: '#3E3E3E', marginTop: 0 },
            storeLocationText: { color: '#989898', marginTop: 0 },

            containerView2_1: { justifyContent: 'center', width: w * 0.25, height: w * 0.15, },
            containerView2_2: { justifyContent: 'center', alignItems: 'flex-start', flex: 1, height: w * 0.15, },
            sliderView1: { marginVertical: 0, marginHorizontal: 0, width: w - 2 * p, height: w * 0.5, backgroundColor: '#F4F3EF' },
            logo: { borderRadius: w * 1, width: w * 0.125, height: w * 0.125, resizeMode: 'contain', borderColor: '#D3D3D3', borderWidth: 0.3 },
            textView1: { marginVertical: 0, marginHorizontal: 0, backgroundColor: 'rgba(255,255,255,0.5)', },
            text1: { color: '#606060', maxWidth: w * 0.4, },
            text3: { color: '#7a7a7a', maxWidth: w * 0.4, marginRight:0 },
            text4: { color: '#909090', maxWidth: w * 0.4, },
            iconButtonContainer: { flexDirection: 'row', marginHorizontal: 2 * p },
            textDesc: { overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.75)', color: 'white', paddingHorizontal: 3 * p, paddingVertical: 2 * p, borderRadius: 2 * p },
        });
    }

    getImageContentAlignment(textPos) {
        switch (textPos) {
            case SGImagePicker.textPos.topLeft:
                return ({ img: { justifyContent: 'flex-start', alignItems: 'flex-start' }, txt: { textAlign: 'left' } });
                break;
            case SGImagePicker.textPos.topMid:
                return ({ img: { justifyContent: 'flex-start', alignItems: 'center' }, txt: { textAlign: 'center' } });
                break;
            case SGImagePicker.textPos.topRight:
                return ({ img: { justifyContent: 'flex-start', alignItems: 'flex-end' }, txt: { textAlign: 'right' } });
                break;
            case SGImagePicker.textPos.centerLeft:
                return ({ img: { justifyContent: 'center', alignItems: 'flex-start' }, txt: { textAlign: 'left' } });
                break;
            case SGImagePicker.textPos.centerMid:
                return ({ img: { justifyContent: 'center', alignItems: 'center' }, txt: { textAlign: 'center' } });
                break;
            case SGImagePicker.textPos.centerRight:
                return ({ img: { justifyContent: 'center', alignItems: 'flex-end' }, txt: { textAlign: 'right' } });
                break;
            case SGImagePicker.textPos.bottomLeft:
                return ({ img: { justifyContent: 'flex-end', alignItems: 'flex-start' }, txt: { textAlign: 'left' } });
                break;
            case SGImagePicker.textPos.bottomMid:
                return ({ img: { justifyContent: 'flex-end', alignItems: 'center' }, txt: { textAlign: 'center' } });
                break;
            case SGImagePicker.textPos.bottomRight:
                return ({ img: { justifyContent: 'flex-end', alignItems: 'flex-end' }, txt: { textAlign: 'right' } });
                break;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.onPress = 0
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    _onCardClick(){
        console.log('card click')
        var data = this.props.data;
        var jsonInput = { fID: '', fContentType: 'WhereToGoResult',  fTargetKey: data.buildingKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
        this._addUserClick(jsonInput)
        SGHelperNavigation.navigatePush(this.props.navigator, 'MallHome', { contentKey: data.buildingKey })
    }

    _addUserClick(jsonInput){
        console.log('user click');
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }


    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        var shareParams = {MallName:data['fBuildingName'+this.props.language.toUpperCase()]}
       
        return (
            <TouchableOpacity onPress={() => {this._onCardClick()}}>
                <View accessible={true} accessibilityLabel={'WhereToGoCardRootView'} style={style.mainContainer}>
                <ViewPager accessible={true} accessibilityLabel={'WhereToGoCardViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                        {
                            (data.fAllPurpose).map((x) => {
                                var { img, txt } = this.getImageContentAlignment(x.image[0].textPosition);
                                return (
                                    <View key={SGHelperType.getGUID()} accessible={true} style={{ justifyContent: 'flex-start' }}>
                                            <Image style={{...style.sliderImage,...img}} source={{uri:x.image[0].med.uri}}>
                                            {x.image[0].text !== ""&&
                                                 <Text style={ [style.textDesc, { ...txt }] }>{x.image[0].text}</Text>
                                            }
                                            </Image>
                                    </View>
                                )
                            })
                        }
                    </ViewPager>
                    <View accessible={true} accessibilityLabel={'WhereToGoCardContainerView'} style={style.bottomContainer}>
                        <View accessible={true} accessibilityLabel={'WhereToGoCardContainerView2'} style={style.bottomLeftContainer}>
                            <Image accessible={true} accessibilityLabel={'WhereToGoCardImageLogo'} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }} style={style.placeThumbnail}></Image>
                        </View>
                        <View accessible={true} accessibilityLabel={'WhereToGoCardRootView'} style={style.containerView2_2}>
                            <Text accessible={true} accessibilityLabel={'WhereToGoCardBuildingName'} preset={Text.preset.titleH3B} style={style.text1} numberOfLines={1}>{dataContent.fBuildingName}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent:'flex-start'}}>
                            <Text accessible={true} accessibilityLabel={'WhereToGoCardCity'} preset={Text.preset.titleH5} style={style.text3}>{VisitorHelper.getLocalizeDataFromLookUp('BuildingCategory',data.fBuildingType,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'WhereToGoCardCity'} preset={Text.preset.titleH5} style={style.text3}>{VisitorHelper.getLocalizeDataFromLookUp('City',data.fCity,this._language)}</Text>
                            </View>
                            <Text accessible={true} accessibilityLabel={'WhereToGoCardLikeCountBuilding'} preset={Text.preset.titleH5} style={style.text4}>{data.fLikeCountBuilding} {SGLocalize.translate('globalText.likeCountText')}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'WhereToGoCardIconButtonView'} style={style.iconButtonContainer}>
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'WhereToGoCardIconLike'} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType='Place' contentKey={this.props.contentKey} active={data.fUserLikedThis} type={'like'}></CardIconButtonLike>
                            <CardIconButtonComment accessible={true} accessibilityLabel={'WhereToGoCardIconComment'} commentPackage={this.props.commentPackage} navigator={this.props.navigator} contentType='Place' contentKey={this.props.contentKey} canComment={data.fCanComment} data={data} type={'comment'}></CardIconButtonComment>
                            <CardIconButtonShare shareParams={shareParams} img={dataContent.fImageJSON[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'WhereToGoCardIconShare'} shareMessage={dataContent.fShareMessage} targetKey={data.buildingKey} navigator={this.props.navigator} contentType='Place' contentKey={this.props.contentKey} type={'share'}></CardIconButtonShare>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
