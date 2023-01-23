import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from "../../core/container/SGBaseContainer";
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity } from "../../core/control";

export default class MenuCategoryList extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { backgroundColor: "white", paddingHorizontal: 3 * p, paddingVertical: 2 * p, borderBottomWidth: p * 0.8, borderBottomColor: '#181818' },
            text: { color: "#181818" },
            v2: { backgroundColor: "white", paddingHorizontal: 3 * p, paddingVertical: 2 * p },
            text2: { color: "#181818" }
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
        var language = (this.props.language).toUpperCase();
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                {this.props.selected ?
                    (<View accessible={true} accessibilityLabel={'MenuCategoryListSelectedRootView'} style={style.v1}>
                        <Text accessible={true} accessibilityLabel={'MenuCategoryListSelectedNameText'} style={style.text} preset={Text.preset.titleH3B}>{data['fCategoryName' + language]}</Text>
                    </View>)
                    :
                    (<View accessible={true} accessibilityLabel={'MenuCategoryListRootView'} style={style.v2}>
                        <Text accessible={true} accessibilityLabel={'MenuCategoryListNameText'} style={style.text2} preset={Text.preset.titleH3}>{data['fCategoryName' + language]}</Text>
                    </View>)}
            </TouchableOpacity>
        );
    }
}
