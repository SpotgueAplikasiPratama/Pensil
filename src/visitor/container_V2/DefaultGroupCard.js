import React from 'react';
import { Dimensions } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGImage as Image,SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation } from '../../core/helper';

export class DefaultGroupCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { backgroundColor:'white',width:w * 0.29,marginHorizontal: 1.5* p,  marginBottom: 4 * p, justifyContent: 'center',  borderRadius: 2 * p, paddingTop: 2 * p, paddingBottom: 4 * p },
            image: { width: w / 3 - 10 * p , height:  w / 3 - 10 * p, borderRadius:2*p, backgroundColor:'transparent', marginBottom: 0 },
            text1: { marginTop:3 * p, color:'#555354' },
            text2: {  marginTop: 2 * p,marginHorizontal: 2 * p,color:'#555354', alignSelf:'center'}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.showFooter = this.props.hideFooter ? true : false;
    }

   

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var language = this.props.language.toUpperCase();
        var data = this.props.data
        var imageSetting = this.props.imageSetting;

        return (
            
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator,this.props.type === 'resto'? 'SearchResultGroupResto' : 'SearchResultGroupStore', { groupTenantKey: data.key })}>
                <View accessible={true} accessibilityLabel={'DefaultGroupCardRootView'} shadow shadowIntensity={0.6} style={style.mainContainer}>
                    <Image style={style.image} source={{ uri: data['fContent' + language].fImageJSON[0]['thumbnail' + imageSetting.charAt(0).toUpperCase() + imageSetting.slice(1)].uri }}></Image>
                    <Text accessible={true} accessibilityLabel={'DefaultGroupCardName'} preset={Text.preset.titleH2B} style={style.text1} numberOfLines={2}>{data["fContent" + language].fGroupName}</Text>
                        <Text accessible={true} accessibilityLabel={'DefaultGroupCardShortDesc'} preset={Text.preset.titleH4_5} style={style.text2} numberOfLines={3}>{data["fContent" + language].fShortDescription}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
