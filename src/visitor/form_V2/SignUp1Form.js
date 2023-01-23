import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGTextInput as TextInput, SGPicker as Picker, SGText as Text, SGTabView as TabView } from '../../core/control';
import { SGFormTextInput as FormTextInput, SGFormTextInput } from '../../core/form'
import { SGHelperType } from '../../core/helper/SGHelperType';


export class SignUp1Form extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { padding: 4 * p, marginTop: w * 0.07 },
            // shadowOffset: { height: 10, width: -10 }
            inputView1: { flex: null, backgroundColor: 'white', width: (w - 2 * p) * 0.4, height: w * 0.15, borderRadius: 3 * p, borderWidth: p * 0.02 },
            input1: { color: '#7a7a7a', marginHorizontal: w * 0.05, fontSize: w * 0.0375 },
            tabBarTextStyle: { color: '#606060' },
            tabBarStyle: { borderColor: '#c5c4bc', width: w * 0.4, borderBottomWidth: 0.0015 * w },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.userData);
    }

    // onValueChangeCheck(v) {
    //     if (SGHelperType.isEmail(v)) {
    //         this.setData('fPhoneNumber', '');

    //     }
    //     if (SGHelperType.isPhone(v)) {
    //         this.setData('fEmail', '');
    //         this.setData('fPhoneNumber', v);
    //     }
    // }

    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        var userData = this.props.userData;
        return (
            <View accessible={true} accessibilityLabel={'SignUp1FormRootView'} style={style.mainView1}>
                <FormTextInput maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'SignUp1FormEmailPhoneTextInput'} preset={SGFormTextInput.preset.v1} shadow dataType={TextInput.dataType.email} onValueChange={(v) => { this.setData('fEmail', v) }} value={this.getData('fEmail')} placeholder={'email@address.com'} textStyle={style.input1} />
            </View>
        );
    }
}