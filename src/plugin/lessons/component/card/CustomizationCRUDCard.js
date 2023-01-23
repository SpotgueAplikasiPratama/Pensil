import React from "react";
import Core from '../../../core/core';

export default class CustomizationCRUDCard extends Core.Form.SGBaseForm {
    createStyleSheet(propStyle) {
        const { StyleSheet } = Core;
        if (this._strStyle !== JSON.stringify(propStyle)) {
            this._strStyle = JSON.stringify(propStyle);
            this._whp = { w: propStyle.width, h: propStyle.height, p: propStyle.padding }
            var { w, h, p } = this._whp;
            this._style = StyleSheet.create({
                v1: { width: w, padding: p, borderRadius: p, borderColor: 'rgb(150,150,150)', borderWidth: 1, marginBottom: p, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
                v2: { width: (w - 2 * p) * 0.92, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
                v3: { width: (w - 2 * p) * 0.72, paddingHorizontal: p, padding: 0, justifyContent: 'flex-start', alignItems: 'flex-start' },
                v4: { width: (w - 2 * p) * 0.08, height: (w - 2 * p) * 0.2, padding: 0, justifyContent: 'space-between', alignItems: 'flex-end' },
                t1: { fontSize: w * 0.035, fontWeight: 'bold' },
                t2: { fontSize: w * 0.035, },
                img1: { width: (w - 2 * p) * 0.2, height: (w - 2 * p) * 0.2, },
            });
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.createStyleSheet(this.props.style);
        this.initData(this.props.data);
    }
    render() {
        const { SGHelperType } = Core.Helper;
        const { SGTouchableOpacity, SGImage, SGView, SGText,SGIcon } = Core.Control;
        this.initData(this.props.data);
        this.createStyleSheet(this.props.style);
        var { w, h, p } = this._whp;
        var style = this._style;
        var data = this._data;
        var ro = this.props.readonly;
        console.log(data);
        return (
            <SGView style={(data.active ? style.v1 : { ...style.v1, opacity: 0.5 })}>
                <SGTouchableOpacity onPress={this.props.onPress}>
                    <SGView style={style.v2}>
                        <SGImage style={style.img1} source={{ uri: this.getData('imageURL') }} resizeMode='contain' />
                        <SGView style={style.v3}>
                            <SGText preset={SGText.preset.h7B}>{this.getData('title')}</SGText>
                            <SGText preset={SGText.preset.h7} numberOfLines={2}>{this.getData('desc')}</SGText>
                            <SGText style={style.t1}>{'Rp. ' + SGHelperType.addThousandSeparator(this.getData('price').toString())}</SGText>
                        </SGView>
                    </SGView>
                </SGTouchableOpacity>
                <SGView style={style.v4}>
                    <SGIcon name={data.active ? SGIcon.Icon.eye : SGIcon.Icon.eyeOff} onPress={ro ? () => { } : () => { this.setData('active', !this.getData('active')); this.forceUpdate() }} />
                    <SGIcon name={SGIcon.Icon.delete} style={(data.id === '' ? {} : { fontSize: 0.01 })} onPress={this.props.onDelete} />
                </SGView>
            </SGView>
        );
    }
}





