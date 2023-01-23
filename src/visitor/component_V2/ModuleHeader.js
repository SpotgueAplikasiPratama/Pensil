import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGImage as Image, SGText as Text } from '../../core/control';
import image from '../asset/image';
import { SGHelperGlobalVar } from '../../core/helper';
export class ModuleHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w / 2, flexDirection: 'row', justifyContent: 'flex-end', padding: p, },
            searchBar: { backgroundColor: 'white', width: (w - 2 * p) * 0.100 * 7.083, height: (w - 2 * p) * 0.100, resizeMode: 'stretch' },
            searchView1: { borderWidth: w * 0.0015, width: (w - 2 * p) * 0.6, borderRadius: w * 0.1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 * p },
            searchView2: { width: (w - 2 * p) * 0.3, flexDirection: 'row', justifyContent: 'space-evenly' },
            icon: { backgroundColor: 'transparent', width: w * 0.065, height: w * 0.065, resizeMode: 'stretch' },
            iconSearch: { marginLeft: w * 0.015, borderRightWidth: w * 0.01, borderColor: '#696969', color: 'black' },
            textSearch: { marginLeft: w * 0.03, alignSelf: 'flex-start', color: '#7a7a7a' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;

        return (
            <View accessible={true} accessibilityLabel={'ModuleHeaderRootView'} style={style.mainView1}>
                <TouchableOpacity onPress={this.props.onNotificationPress}>
                    <Image accessible={true} accessibilityLabel={'ModuleHeaderNotificationIcon'} source={{ uri: image.notificationIcon[this.imageSetting].url }} style={style.icon}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onInboxPress}>
                    <Image accessible={true} accessibilityLabel={'ModuleHeaderInboxIcon'} source={{ uri: image.inboxIcon[this.imageSetting].url }} style={style.icon}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onProfilePress}>
                    <Image accessible={true} accessibilityLabel={'ModuleHeaderProfileIcon'} source={{ uri: image.profileIcon[this.imageSetting].url }} style={style.icon}></Image>
                </TouchableOpacity>
            </View>
        );
    }
}
