import React from "react";
import Core from '../../../core/core';
import CustomizationData from '../../model/CustomizationData';
import CustomizationCRUDCard from '../card/CustomizationCRUDCard';
import CustomizationCRUDForm from '../form/CustomizationCRUDForm';


export default class CustomizationCRUDList extends Core.Control.SGBaseContainer {
    createStyleSheet = (whp) => {
        const { StyleSheet, } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w, padding: p, borderRadius: p, borderColor: 'rgb(150,150,150)', borderWidth: p / 4, justifyContent: 'flex-start', },
            v2: { width: w - 2 * p, padding: 0, marginBottom: p, flexDirection: 'row', justifyContent: 'space-between' },
            v3: { flexDirection: 'row', justifyContent: 'flex-end' },
            v4: { width: w - 2 * p, padding: 0, justifyContent: 'flex-start', },
            sv1: { width: w - 2 * p, maxHeight: w, },
            c1: { width: w - 2 * p, padding: p },
            c1_1: { width: 0.5*w - 2 * p, padding: p },
            c2: { width: w - 2 * p, padding: p },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this._style = this.createStyleSheet(this._whp);
        this.state = { mode: 'list', data: this.props.dataList, tempData: new CustomizationData() };
        this.SV1 = React.createRef();
    }
    findDataIndex(id) {
        var data = this.state.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i].GUID === id) {
                return i;
            }
        }
        return -1;
    }
    onAddPress() {
        this.setState({ mode: 'add', tempData: new CustomizationData() });
    }
    onCardPress(args) {
        var data = this.state.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i].GUID === args[0]) {
                this.setState({ mode: (this.props.readonly ? 'view' : 'edit'), tempData: data[i].cloneData() });
                return
            }
        }
    }
    onDeletePress(args) {
        var index = this.findDataIndex(args[0]);
        if (index !== -1) {
            var data = this.state.data;
            data.splice(index, 1);
        }
        this.setState({ data: data });
    }
    onSaveAddPress() {
        var data = this.state.data;
        data.push(this.state.tempData);
        this.setState({ mode: 'list', data: data, });
        this.SV1.current.scrollToEnd();
    }
    onSaveEditPress() {
        var tempData = this.state.tempData;
        var index = this.findDataIndex(tempData.GUID);
        if (index !== -1) {
            var data = this.state.data;
            data[index] = this.state.tempData;
        }
        this.setState({ mode: 'list', data: data, });
    }
    onBackPress() {
        this.setState({ mode: 'list' });
    }
    render() {
        const { SGView, SGScrollView, SGText, SGIcon, SGButton } = Core.Control;
        var { w, h, p } = this._whp;
        var style = this._style;
        var data = this.state.data;
        var mode = this.state.mode;
        var ro = this.props.readonly;
        return (
            <SGView style={style.v1}>
                <SGView style={style.v2}>
                    <SGText >Customization Options</SGText>
                    <SGView style={style.v3}>
                        <SGIcon name={SGIcon.Icon.add} style={(mode === 'list' && !ro ? {} : { fontSize: 0.01 })} onPress={this.onAddPress.bind(this)} />
                        <SGIcon name={SGIcon.Icon.back} style={((mode === 'add' || mode === 'edit' || mode === 'view') ? {} : { fontSize: 0.01 })} onPress={this.onBackPress.bind(this)} />
                        <SGIcon name={SGIcon.Icon.save} style={(mode === 'add' && !ro ? {} : { fontSize: 0.01 })} onPress={this.onSaveAddPress.bind(this)} />
                        <SGIcon name={SGIcon.Icon.save} style={(mode === 'edit' && !ro ? {} : { fontSize: 0.01 })} onPress={this.onSaveEditPress.bind(this)} />
                    </SGView>
                </SGView>
                <SGView style={mode === 'list' ? {} : { height: 0 }}>
                    <SGScrollView ref={this.SV1} style={style.sv1} contentContainerStyle={style.v4} showsVerticalScrollIndicator={false}>
                        {
                            data.map((d) => {
                                return (
                                    <CustomizationCRUDCard key={d.id} readonly={ro} style={style.c1} data={d} onPress={this.onCardPress.bind(this, [d.GUID])} onDelete={ro ? () => { } : this.onDeletePress.bind(this, [d.GUID])} />
                                );
                            })
                        }
                    </SGScrollView>
                </SGView>
                <SGView hidden={(mode === 'add' || mode === 'view' || mode === 'edit') ? false : true}>
                    <CustomizationCRUDForm readonly={ro} style={style.c2} data={this.state.tempData} />
                </SGView>               
            </SGView>
        );
    }
}