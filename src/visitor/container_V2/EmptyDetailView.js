import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';

export class EmptyDetailView extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, justifyContent: 'center',alignItems:'center', flex: 1,marginTop:this.props.style.marginTop?this.props.style.marginTop:0, },
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
            <View accessible={true} accessibilityLabel={'FacilityDetailHeaderRootView'} style={style.mainContainer}>
                <Text>{this.props.text}</Text>
            </View>

        );
    }
}
