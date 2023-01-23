import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGTextInput as TextInput } from '../../core/control';
// import { SGTextInput as TextInput } from '../component_V2/InputText';


export class SignInForm extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { padding: p },
            inputView1: { flex: null, marginVertical: w * 0.03, backgroundColor: 'white', width: (w - 2 * p) * 0.8, height: w * 0.15, borderRadius: 3 * p, borderWidth: p * 0.02, },
            input1: { color: '#7a7a7a', marginHorizontal: w * 0.05, fontSize: w * 0.0375 },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.userData);
    }

    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        var userData = this.props.userData;

        return (
            <View accessible={true} accessibilityLabel={'SignInFormRootView'} style={style.mainView1}>
                <TextInput accessible={true} accessibilityLabel={'SignInFormEmailTextInput'} shadow dataType={TextInput.dataType.email} onChangeText={(v) => { this.setData('fEmail', v) }} value={userData.email} placeholder={this.props.ph1} style={style.inputView1} textStyle={style.input1} />
                <TextInput accessible={true} accessibilityLabel={'SignInFormPasswordTextInput'} shadow dataType={TextInput.dataType.password} onChangeText={(v) => { this.setData('fPassword', v) }} value={userData.password} placeholder={this.props.ph2} style={style.inputView1} textStyle={style.input1} />
            </View>
        );
    }
}