import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGTextInput as TextInput, SGPicker as Picker, SGText as Text, SGTabView as TabView } from '../../core/control';
import { SGFormTextInput as FormTextInput } from '../../core/form'
import { SGHelperType } from '../../core/helper/SGHelperType';


export class SignUpFormWithEmail extends SGBaseForm {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { marginVertical: 4 * p },
            // shadowOffset: { height: 10, width: -10 }
            inputView1: { flex: null, backgroundColor: 'white', width: (w - 2 * p) * 0.4, height: w * 0.15, borderRadius: 3 * p, borderWidth: p * 0.02 },
            textInput: {width: (w - 2 * p) * 0.8, height: w * 0.112, marginBottom: p * 4},
            input1: { color: '#7a7a7a', marginHorizontal: 0, fontSize: w * 0.0375 },
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

    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'SignUpFormWithEmailRootView'} style={style.mainView1}>
                <TextInput maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'SignUpFormWithEmailEmailPhoneTextInput'} dataType={TextInput.dataType.email} onValueChange={(v) => { this.setData('fEmail', v) }} value={this.getData('fEmail')} placeholder={'email@address.com'} style={style.textInput} textStyle={style.input1} />
            </View>
        );
    }
}