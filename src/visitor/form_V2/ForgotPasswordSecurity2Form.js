import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGTextInput as TextInput } from '../../core/control';
import {SGHelperGlobalVar, SGHelperType} from '../../core/helper';


export class ForgotPasswordSecurity2Form extends SGBaseForm {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { padding: p },
            throwWHP: { width: w, height: h, padding: p },
            inputView1: { flex: null, marginTop: w * 0.03, backgroundColor: 'white', width: (w - 2 * p) * 0.8, height: w * 0.15, borderRadius: 3 * p, borderWidth: p * 0.02, },
            input1: { color: '#7a7a7a', paddingHorizontal: p * 2, fontSize: w * 0.0375 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.userData);
    }

    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        var userData = this.props.userData;

        return (
            <View accessible={true} accessibilityLabel={'ForgotPasswordSecurity2FormRootView'} style={style.mainView1}>
                <TextInput maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'ForgotPasswordSecurity2FormTextInput'} shadow dataType={TextInput.dataType.text} onChangeText={(v) => { this.setData('fQuestionAnswer', v) }} placeholder={this.props.placeholder} textStyle={style.input1} style={style.inputView1} />
            </View>
        );
    }
}
