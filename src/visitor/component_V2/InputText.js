import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGTextInput as Input, SGText as Text } from '../../core/control';


export class InputText extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w - 8 * p, justifyContent: 'flex-start' },
            vtextinput1: { alignItems: 'flex-start', width: w - 8 * p, padding: p, borderBottomWidth: w * 0.002, },
            vtextinput2: { alignItems: 'flex-start', width: w - 8 * p, padding: p, borderWidth: w * 0.002, },
            textinput: { width: w - 8 * p, fontSize: w * 0.045, padding: p, }
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }

    _onValueChangeHandler(value) {
        if (this.props.onValueChange) {
            this.props.onValueChange(value)
        }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'InputTextRootView'} style={style.v1}>
                <Text accessible={true} accessibilityLabel={'InputTextTitle'} header={style.title}>{this.props.title}</Text>
                <View accessible={true} accessibilityLabel={'InputTextView'} style={(this.props.type === 'box') ? (style.vtextinput2) : (style.vtextinput1)}>
                    <Input accessible={true} accessibilityLabel={'InputTextInput'} secureTextEntry={this.props.secureTextEntry ? this.props.secureTextEntry : false} editable={this.props.editable ? this.props.editable : true} onEndEditing={this.props.onEndEditing ? this.props.onEndEditing : false} style={style.textinput} onChangeText={(value) => { this._onValueChangeHandler(value) }} multiline={this.props.multiline ? this.props.multiline : false} placeholder={this.props.placeholder} numberOfLines={this.props.numberOfLines ? this.props.numberOfLines : 1} keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'} value={this.props.value} />
                </View>
            </View>
        );
    }
}
