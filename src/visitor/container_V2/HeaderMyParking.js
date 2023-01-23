import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text,SGIconButton as IconButton , SGIcon as Icon,SGPopView, SGPicker as Picker, SGIcon } from '../../core/control';
import { SGLocalize } from '../locales/SGLocalize';

import { SGHelperGlobalVar } from '../../core/helper';


export class HeaderMyParking extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
         
            v2:{flexDirection:'row', marginTop:2*p},
            pv1_2:{borderRadius:5*p},
            iconButtonParking: {marginLeft:w*0.15, backgroundColor: 'rgb(38,38,38)', color: 'white', borderRadius: 5*p},
            picker:{marginLeft:w*0.25,width:w*0.4}
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = this.screenWHPNoHeader
        this.style = this.createStyleSheet(this.whp);
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }
    
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var language = this.props.language
        var mallOptionList = this.props.mallOptionList
        var selectedBuilding=this.props.selectedBuilding
        return (
            <View >
                <View style={style.v2}>
                <Picker accessible={true} accessibilityLabel={'TabRestoListCuisinePicker'} textPreset={Text.preset.h8} single language={language} style={style.picker} optionList={mallOptionList} value={selectedBuilding} onValueChange={(v) => { this.props.refreshHeaderBuildingParkingHighlight(true,v) }} />
                    <IconButton accessible={true} accessibilityLabel={'ParkingListScreenPopCloseIcon'} iconPreset={SGIcon.preset.h4} style={style.iconButtonParking} name={Icon.Icon.close} onPress={()=>{this.props.onHideParkingPopView()}} />
                </View>
            </View>

        );
    }
}

