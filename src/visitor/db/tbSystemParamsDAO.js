// import { RealmDB, tbSystemParamsData as tbSystemParamsRealm } from './RealmDB';
import { SGHelperType, SGHelperDB } from '../../core/helper';
import { SGBaseModel } from '../../core/model/SGBaseModel';

export class tbSystemParamsDAO {
    // static addSystemParams(x) {
    //     try {
    //         RealmDB.getRealm().write(() => {
    //             var y = SGHelperType.copyJSON(x);
    //             y.fID = SGHelperType.getGUID();
    //             y.fValue = x.fValue
    //             y.fActive = 'Y';
    //             y.fCreatedBy = y.fID;
    //             y.fCreatedDate = new Date();
    //             y.fLastModifiedBy = y.fID;
    //             y.fLastModifiedDate = new Date();
    //             console.log(y)
    //             // console.log('add success')
    //             // console.log(y);
    //             RealmDB.getRealm().create('tbSystemParamsData', y);
    //         });
    //     } catch (e) {
    //         console.log('e')
    //         console.log("Error on creation: " + e);
    //     }
    // }
    // static getSystemParamsWithArrFilter(arrFilter, arrSort) {
    //     var filter = SGHelperDB.constructFilter(arrFilter);
    //     var sort = SGHelperDB.constructSort(arrSort);
    //     var dataJSON = new tbSystemParamsData().getCurrentJSON()
    //     var searchedData = RealmDB.getRealm().objects('tbSystemParamsData').filtered(filter.strQuery, ...filter.arrParam).sorted(sort);
    //     for (var i = 0; i < searchedData.length; i++) {
    //         var dataJSON = SGHelperType.copyRealmObject(searchedData[i], tbSystemParamsRealm);
    //         if (dataJSON.fValue !== '') {
    //             try {
    //                 dataJSON.fValue = JSON.parse(dataJSON.fValue);
    //             } catch (error) {
    //                 dataJSON.fValue = dataJSON.fValue
    //             }
               
    //         }
    //     }
    //     return (dataJSON);
    // }
    static async getUserAliceVoiceSetting(){

        var getUserAliceVoiceSettingArr = [
            { name: 'fParams', operator: '=', value: 'userAliceVoiceSetting' },
            { name: 'fActive', operator: '=', value: 'Y' }
        ]
        return await tbSystemParamsDAO.getSystemParamsWithArrFilter(getUserAliceVoiceSettingArr,[]);

    }

    static async getUserDataToken(){
        var getUserTokenArr = [
            { name: 'fParams', operator: '=', value: 'userTokenData' },
            { name: 'fActive', operator: '=', value: 'Y' }
        ]
        return await tbSystemParamsDAO.getSystemParamsWithArrFilter(getUserTokenArr,[]);
    }

    static async getUserDataSetting(){
        var getUserDataSettingArr = [
            { name: 'fParams', operator: '=', value: 'userDataSetting' },
            { name: 'fActive', operator: '=', value: 'Y' }
        ]
        return await tbSystemParamsDAO.getSystemParamsWithArrFilter(getUserDataSettingArr,[]);
    }
    static cleanAllDataRealm() {
        try {
            // var arrUserDataSetting = [
            //     { name: 'fParams', operator: '=', value: 'userDataSetting' }
            // ]
            // var arrUserAlice = [
            //     { name: 'fParams', operator: '=', value: 'userAliceVoiceSetting' }
            // ]
            // var arrUserToken = [
            //     { name: 'fParams', operator: '=', value: 'userTokenData' }
            // ]
            // var arrSort = [
            //     { name: 'fLastModifiedDate', descending: false,  selected: true },
            // ]
            // var sort = SGHelperDB.constructSort(arrSort);
            // var filterUserDataSetting = SGHelperDB.constructFilter(arrUserDataSetting);
            // var filterUserAlice = SGHelperDB.constructFilter(arrUserAlice);
            // var filterUserUserToken = SGHelperDB.constructFilter(arrUserToken);
            // var dataUserDataSetting = RealmDB.getRealm().objects('tbSystemParamsData').filtered(filterUserDataSetting.strQuery, ...filterUserDataSetting.arrParam).sorted(sort);
            // var dataUserDataAlice = RealmDB.getRealm().objects('tbSystemParamsData').filtered(filterUserAlice.strQuery, ...filterUserAlice.arrParam).sorted(sort);
            // var dataUserToken = RealmDB.getRealm().objects('tbSystemParamsData').filtered(filterUserUserToken.strQuery, ...filterUserUserToken.arrParam).sorted(sort);
            // RealmDB.getRealm().write(() => {
            //     for(var i=0;i<dataUserDataSetting.length;i++){
            //         if(i!=dataUserDataSetting.length-1)RealmDB.getRealm().delete(dataUserDataSetting[i])
            //     }
            //     for(var j=0;j<dataUserDataAlice.length;j++){
            //         if(j!=dataUserDataAlice.length-1)RealmDB.getRealm().delete(dataUserDataAlice[j])
            //     }
            //     for(var k=0;k<dataUserToken.length;k++){
            //         if(k!=dataUserToken.length-1)RealmDB.getRealm().delete(dataUserToken[k])
            //     }
             
            // });
        } catch (error) {
            console.log("Error tbSystemParamsDAO.cleanAllDataRealm: "+ error)
        }
    }
    // static consoleAllData() {
    //     try {
            
    //         var searchedData = RealmDB.getRealm().objects('tbSystemParamsData')
    //         var arr=[]
    //         for (var i = 0; i < searchedData.length; i++) {
    //             var dataJSON = SGHelperType.copyRealmObject(searchedData[i], tbSystemParamsRealm);
    //             arr.push(dataJSON)
    //         }
    //         console.log(arr)
    //     } catch (error) {
    //         console.log("Error tbSystemParamsDAO.consoleAllData: "+ error)
    //     }
      
       
       
    // }

    // static updateUserDataToken(currentToken, newToken) {
    //     try {
    //         RealmDB.getRealm().write(() => {
    //             currentToken.fValue = JSON.stringify(newToken);
    //             currentToken.fLastModifiedBy = currentToken.fCreatedBy;
    //             currentToken.fLastModifiedDate = new Date();
    //             RealmDB.getRealm().create('tbSystemParamsData', currentToken, true);
    //         });
    //     } catch (error) {
    //         console.log("Error tbSystemParamsDAO.updateUserDataToken: "+ error)
    //     }
        
    // }

    // static updateUserAliceVoiceSetting(currentDataJSON, newValue) {
    //     try {
    //         RealmDB.getRealm().write(() => {
    //             currentDataJSON.fValue = newValue;
    //             currentDataJSON.fLastModifiedBy = currentDataJSON.fCreatedBy;
    //             currentDataJSON.fLastModifiedDate = new Date();
    //             console.log(currentDataJSON);
    //             RealmDB.getRealm().create('tbSystemParamsData', currentDataJSON, true);
    //         });
    //     } catch (error) {
    //         console.log("Error tbSystemParamsDAO.updateUserAliceVoiceSetting: "+ error)
    //     }
       
    // }

    // static updateUserDataSetting(oldUserDataSetting, newData) {
    //     try {
    //         RealmDB.getRealm().write(() => {
    //             oldUserDataSetting.fValue = JSON.stringify(newData);
    //             oldUserDataSetting.fLastModifiedBy = oldUserDataSetting.fCreatedBy;
    //             oldUserDataSetting.fLastModifiedDate = new Date();
    //             RealmDB.getRealm().create('tbSystemParamsData', oldUserDataSetting, true);
    //         });
    //     } catch (error) {
    //         console.log("Error tbSystemParamsDAO.updateUserDataSetting: "+ error)
    //     }
     
    // }

    // static updateLogout(currentToken, currentUserData) {
    //     try {
    //         RealmDB.getRealm().write(() => {
    //             currentToken.fValue = '';
    //             currentToken.fActive = 'N';
    //             currentToken.fLastModifiedBy = currentToken.fCreatedBy;
    //             currentToken.fLastModifiedDate = new Date();
    //             RealmDB.getRealm().create('tbSystemParamsData', currentToken, true);
    //         });
    //         RealmDB.getRealm().write(() => {
    //             currentUserData.fValue = '';
    //             currentUserData.fLastModifiedBy = currentToken.fCreatedBy;
    //             currentUserData.fLastModifiedDate = new Date();
    //             RealmDB.getRealm().create('tbSystemParamsData', currentUserData, true);
    //         });
    //     } catch (error) {
    //         console.log("Error tbSystemParamsDAO.updateLogout: "+ error)
    //     }
     
    // }
    static async addSystemParams(x) {
        try {
           
            var y = SGHelperType.copyJSON(x);
            y.fID = SGHelperType.getGUID();
            y.fValue = x.fValue
            y.fActive = 'Y';
            y.fCreatedBy = y.fID;
            y.fCreatedDate = new Date();
            y.fLastModifiedBy = y.fID;
            y.fLastModifiedDate = new Date();
            console.log(y)
            await SGHelperDB._insert("tbSystemParamsData",y)

        } catch (e) {
            console.log('e')
            console.error("Error on creation: " + e);
   
        }
    }
    static async getSystemParamsWithArrFilter(arrFilter, arrSort) {

        var dataJSON = await SGHelperDB._get("tbSystemParamsData",arrFilter)
        var dataTemp = (dataJSON.length!==0 ? dataJSON[0] : new tbSystemParamsData().getCurrentJSON());
        try {
            dataTemp.fValue = JSON.parse(dataTemp.fValue)
        } catch (error) {
        }
        return dataTemp
    }
    static async consoleAllData() {
        try {
        
            console.log(await SGHelperDB._get("tbSystemParamsData"))
        } catch (error) {
            console.log("Error tbSystemParamsDAO.consoleAllData: "+ error)
        }
      
       
       
    }
    static async updateUserDataToken(currentToken, newToken) {
        try {
            currentToken.fValue = JSON.stringify(newToken);
            currentToken.fLastModifiedBy = currentToken.fCreatedBy;
            currentToken.fLastModifiedDate = new Date();
            await SGHelperDB._update("tbSystemParamsData",currentToken); 
        } catch (error) {
            console.log("Error tbSystemParamsDAO.updateUserDataToken: "+ error)
        }
        
    }
    static async updateUserAliceVoiceSetting(currentDataJSON, newValue) {
        try {
            currentDataJSON.fValue = newValue;
            currentDataJSON.fLastModifiedBy = currentDataJSON.fCreatedBy;
            currentDataJSON.fLastModifiedDate = new Date();
            console.log(currentDataJSON);
            await SGHelperDB._update("tbSystemParamsData",currentDataJSON); 
        } catch (error) {
            console.log("Error tbSystemParamsDAO.updateUserAliceVoiceSetting: "+ error)
        }
       
    }
    static async updateUserDataSetting(oldUserDataSetting, newData) {
        try {
            oldUserDataSetting.fValue = JSON.stringify(newData);
            oldUserDataSetting.fLastModifiedBy = oldUserDataSetting.fCreatedBy;
            oldUserDataSetting.fLastModifiedDate = new Date();
            await SGHelperDB._update("tbSystemParamsData",oldUserDataSetting); 
        } catch (error) {
            console.log("Error tbSystemParamsDAO.updateUserDataSetting: "+ error)
        }
     
    }
    static async updateLogout(currentToken, currentUserData) {
        try {
            currentToken.fValue = '';
            currentToken.fLastModifiedBy = currentToken.fCreatedBy;
            currentToken.fLastModifiedDate = new Date();
            var res =await SGHelperDB._update("tbSystemParamsData",currentToken); 
            currentUserData.fValue = '';
            currentUserData.fLastModifiedBy = currentToken.fCreatedBy;
            currentUserData.fLastModifiedDate = new Date();
            if(res)SGHelperDB._update("tbSystemParamsData",currentUserData); 
        } catch (error) {
            console.log("Error tbSystemParamsDAO.updateLogout: "+ error)
        }
     
    }
 
}

export class tbSystemParamsData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fParams: '', fValue: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() };
    }
    constructor(ori, cur, changeList) {
        super(tbSystemParamsData, ori ? ori : tbSystemParamsData.getBlankJSON(), cur, changeList);
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fParams(val) { this._setValue('fParams', val); } get fParams() { return this._getValue('fParams'); }
    set fValue(val) { this._setValue('fValue', val); } get fValue() { return this._getValue('fValue'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
}