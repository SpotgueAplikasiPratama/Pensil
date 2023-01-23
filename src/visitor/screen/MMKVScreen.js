
import React from 'react';
import { StyleSheet,  } from 'react-native';
import { SGRootView, SGButton as Button ,SGText as Text} from '../../core/control';
import { SGHelperDB } from '../../core/helper';

import { SGBaseScreen } from '../../core/screen/SGBaseScreen';
import DeviceInfo from 'react-native-device-info'
export class MMKVScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, backgroundColor: 'white', justifyContent: 'flex-start' },

        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.data=[]
        this.filtering = [
            // {name:'fGender',op:"=", value:'M'},
            // {name:'fAge',op:"=", value:21},
            {name:'fCreatedDate',op:">=", value:new Date()}
            
        ]
    }
    _onSavePress(){
        var value = [
            {
                fID: 'ae22eb8f-ad0e-4167-974d-7bd1ddb188ec',
                fUserName: "Yohanes",
                fEmail: "yohanes2_2@yahoo.com",
                fGender:'M',
                fAge:21,
                fCreatedDate :new Date("Sat May 16 2021 16:56:13 GMT+0700 (Western Indonesia Time)")
            },
            {
                fID: '27bdd0b3-608f-4ba0-8098-b47918129970',
                fUserName: "Yohanes2",
                fEmail: "yohanes2_2@yahoo.com",
                fGender:'M',
                fAge:21,
                fCreatedDate :new Date("Sat May 16 2021 16:56:13 GMT+0700 (Western Indonesia Time)")
            },
            {
                fID: '9762ddfe-88ec-4a4d-ea87-08d8a2668ee3',
                fUserName: "Yohanes3",
                fEmail: "yohanes2_2@yahoo.com",
                fGender:'F',
                fAge:22,
                fCreatedDate :new Date("Wed May 18 2021 16:56:13 GMT+0700 (Western Indonesia Time)")
            }
        ]
        SGHelperDB._insert('User',value)
    }
    async _onDeletePress(){
        SGHelperDB._delete('User')
    }
    async _onGetPress(){
        this.data= await SGHelperDB._get('User',this.filtering)
        console.log(this.data)
    }
    async _onUpdatePress(){
      
        var res = await SGHelperDB._update('User', {
            fID: '9762ddfe-88ec-4a4d-ea87-08d8a2668ee4',
            fUserName: "Yohanes3",
            fEmail: "yohanes2_2@yahoo.com",
            fGender:'M',
            fAge:22,
            fCreatedDate :new Date("Wed May 18 2021 16:56:13 GMT+0700 (Western Indonesia Time)")
        })
        console.log(res)
    }
    async componentDidMount(){

        console.log( await DeviceInfo.isEmulator())
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (

            <SGRootView dummyHeaderBar accessible={true} accessibilityLabel={'StoreHomeScreenRootView'} style={style.mainView1}>
              <Button label ={'Save'} onPress={()=>{this._onSavePress()}}></Button>
              <Button label ={'Delete'} onPress={()=>{this._onDeletePress()}}></Button>
              <Button label ={'Get'} onPress={()=>{this._onGetPress()}}></Button>
              <Button label ={'Update'} onPress={()=>{this._onUpdatePress()}}></Button>
              <Text>{this.data}</Text>
            </SGRootView>
        );
    }
}