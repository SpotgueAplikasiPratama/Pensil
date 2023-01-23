import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image,SGTouchableOpacity as TouchableOpacity } from "../../core/control";
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperStyle, SGHelperWindow } from '../../core/helper';

export class IconArrayOfLinks extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        return StyleSheet.create({
            mainContainer:{width:w-10*p,},
            vView2:{flexDirection:'row',justifyContent:'flex-start'},
            icon: { width: w * 0.1, height: w * 0.1, resizeMode: 'contain', backgroundColor: 'transparent', marginVertical: 0 },
            title:{alignSelf:'flex-start'}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
    }
    render() {
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.style);
        var style = this.style;
        var data = this.props.data;
        return(
            <TouchableOpacity style={style.mainContainer} onPress={this.props.onIconArrayPress.bind(this)}>
                {/* <Text preset={Text.preset.h6B} style={style.title}>{data.arrContent.title}</Text> */}
                <View style={style.vView2}>
                  <Image accessible={true} accessibilityLabel={'IconArrayOfLinksImage'} source={{ uri: this.props.arrImage }} style={style.icon}></Image>
                  <Text preset={Text.preset.titleH3} numberOfLines={2}>{data.arrName}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

