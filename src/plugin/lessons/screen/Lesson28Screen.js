import React from 'react';
import { SGView, SGText, } from '../../core/control';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';
import Realm from 'realm';
import {SGHelperType} from '../../core/helper';

export class StudentData { }
StudentData.schema = {
    name: 'StudentData',
    primaryKey: 'Key',
    properties: {
        Key: 'string',
        Name: 'string',
        Age: 'int',
        Class: 'string',
    }
}

export class Lesson28Screen extends SGBaseScreen {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._realm = [];
        this._realm[0] = new Realm({ path: 'db1.realm', schema: [StudentData] });
        this._data1 = this._realm[0].objects('StudentData');
        this.state = { filter1: '', dummy: 0 }
    }
    componentWillUnmount() {
        this._realm[0].close();
    }
    refreshStudent() {
        if (this.state.filter1 !== '') {
            this._data1 = this._realm[0].objects('StudentData').filtered(this._filter1);
        } else {
            this._data1 = this._realm[0].objects('StudentData');
        }
        this.setState({ dummy: this.state.dummy + 1 });
    }

    addStudent() {
        try {
            this._realm[0].write(() => {
                this._realm[0].create('StudentData', { Key: SGHelperType.getGUID(), Name: 'Gerry', Age: 37, Class: '2001' });
                this._realm[0].create('StudentData', { Key: SGHelperType.getGUID(), Name: 'Melvin', Age: 20, Class: '2016' });
                this._realm[0].create('StudentData', { Key: SGHelperType.getGUID(), Name: 'Yohanes', Age: 21, Class: '2016' });
                this._realm[0].create('StudentData', { Key: SGHelperType.getGUID(), Name: 'Victor', Age: 21, Class: '2016' });
            });
            this.refreshStudent();
        } catch (e) {
            console.log("Error on creation: " + e);
        }
    }
    deleteStudent() {
        try {
            this._realm[0].write(() => {
                var d = this._realm[0].objects('StudentData').filtered('Class = "2016"');
                this._realm[0].delete(d);
            });
            this.refreshStudent();
        } catch (e) {
            console.log("Error on deletion: " + e);
        }
    }
    editStudent() {
        try {
            this._realm[0].write(() => {
                var d = this._realm[0].objects('StudentData').filtered('Class = "2001"');
                d.map((dt) => {
                    dt.Name = 'Hasang Gerry';
                })
            });
            this.refreshStudent();
        } catch (e) {
            console.log("Error on edit: " + e);
        }
    }
    allStudent() {
        this._data1 = this._realm[0].objects('StudentData');
        this.setState({ filter1: '' });
    }
    filterStudent() {
        var str = 'Age = 21';
        this._data1 = this._realm[0].objects('StudentData').filtered(str);
        this.setState({ filter1: str });
    }
    clearStudent() {
        try {
            this._realm[0].write(() => {
                var d = this._realm[0].objects('StudentData');
                this._realm[0].delete(d);
            });
            this.refreshStudent();
        } catch (e) {
            console.log("Error on clear: " + e);
        }
    }
    render() {
        var data1 = this._data1;
        // var data2 = this._data2;
        return (
            <SGView>
                <SGText>Data Student</SGText>
                <SGView style={{ width: 350, justifyContent: 'space-around', flexDirection: 'row' }}>
                    <SGText onPress={this.addStudent.bind(this)}>Add </SGText>
                    <SGText onPress={this.editStudent.bind(this)}>Edit </SGText>
                    <SGText onPress={this.deleteStudent.bind(this)}>Del </SGText>
                    <SGText onPress={this.filterStudent.bind(this)}>Filter </SGText>
                    <SGText onPress={this.allStudent.bind(this)}>All </SGText>
                    <SGText onPress={this.clearStudent.bind(this)}>Clear </SGText>
                </SGView>
                {
                    data1.map((d) => {
                        return (
                            <SGText key={d.Key} >{'Name: ' + d.Name + ', Age: ' + d.Age + ', Class:' + d.Class}</SGText>
                        );
                    })
                }
            </SGView>
        )
    }
}