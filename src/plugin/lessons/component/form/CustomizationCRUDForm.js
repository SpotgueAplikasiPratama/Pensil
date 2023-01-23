import React from "react";
import Core from '../../../core/core';

export default class CustomizationCRUDForm extends Core.Form.SGBaseForm {
    initStyleSheet(propStyle) {
        const { StyleSheet, } = Core;
        if (this._strStyle !== JSON.stringify(propStyle)) {
            this._strStyle = JSON.stringify(propStyle);
            this._whp = { w: propStyle.width, h: propStyle.height, p: propStyle.padding }
            var { w, h, p } = this._whp;
            this._style = StyleSheet.create({
                v1: { width: w, padding: p, borderRadius: p, borderColor: 'rgb(150,150,150)', borderWidth: 1, alignItems: 'flex-start', },
                v2: { width: w - 2 * p, flexDirection: 'row', justifyContent: 'space-between' },
                t1: { marginBottom: 0, },
                ti1: { width: w - 2 * p, color: 'rgb(100,100,100)', padding: p, borderColor: 'rgb(150,150,150)', borderBottomWidth: 1, marginBottom: p },
                i1: { width: (w - 2 * p), height: (w - 2 * p) / 2 },
            });
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.initData(this.props.data);
        this.initStyleSheet(this.props.style);
    }
    render() {
        const {SGView, SGText, SGTextInput, SGSwitch, SGImage} = Core.Control;
        this.initData(this.props.data);
        this.initStyleSheet(this.props.style);
        var { w, h, p } = this._whp;
        var style = this._style;
        var data = this._data;
        var ro = this.props.readonly;
        var language = "en";
        return (
            <SGView style={this.props.style.height ? style.v1 : { ...style.v1, height: this.props.style.height }}>
                <SGText style={style.t1}>Title</SGText>
                <SGTextInput style={style.ti1} dataType={SGTextInput.dataType.text } disabled={ro} placeholder='enter title' value={this.getData('title')} onChangeText={(v) => { this.setData('title', v) }} />
                <SGText style={style.t1}>Description</SGText>
                <SGTextInput style={style.ti1} dataType={SGTextInput.dataType.multiline} disabled={ro} placeholder='enter description' value={this.getData('desc')} onChangeText={(v) => { this.setData('desc', v) }} />
                <SGText style={style.t1}>Price</SGText>
                <SGTextInput style={style.ti1} dataType={SGTextInput.dataType.currency}  disabled={ro} placeholder='enter price' value={this.getData('price').toString()} onChangeText={(v) => { this.setData('price', Number(v)) }} />
                <SGText style={style.t1}>ImageURL</SGText>
                <SGTextInput style={style.ti1} dataType={SGTextInput.dataType.url}  disabled={ro} placeholder='enter image URL' value={this.getData('imageURL')} onChangeText={(v) => { this.setData('imageURL', v) }} />
                <SGView style={style.v2}>
                    <SGText style={style.t1}>Active</SGText>
                    <SGSwitch
                        trackColor={{ false: "#505050", true: "green" }}
                        thumbColor={"white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(v) => { this.setData('active', v) }}
                        value={this.getData('active')}
                        disabled={ro}
                    />
                </SGView>
                <SGImage style={style.i1} source={{ uri: data.imageURL }} resizeMode='contain' />
            </SGView>
        );
    }
}