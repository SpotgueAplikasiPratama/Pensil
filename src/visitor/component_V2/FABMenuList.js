import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGButton as Button } from '../../core/control';
import { SGLocalize } from '../locales/SGLocalize';



export class FABMenuList extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w, alignItems: 'center' },
            v2: { width: w * 0.6, height: w * 0.1, backgroundColor: "grey", borderRadius: w * 0.03, alignItems: 'center', justifyContent: 'center' },
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

        return (
            <View accessible={true} accessibilityLabel={'FABMenuListRootView'} style={style.v1}>
                <Button accessible={true} accessibilityLabel={'FABMenuListCheckOrderButton'} style={style.v2} onPress={this.props.onPress} label={SGLocalize.translate('orderMenuListScreen.buttonCheckOrder') + ' (' + this.props.total + ')'}></Button>
            </View>

        );
    }
}
