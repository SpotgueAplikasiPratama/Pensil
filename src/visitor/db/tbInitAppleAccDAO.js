// import { RealmDB, tbInitAppleAcc as tbInitAppleAccRealm } from './RealmDB';
import { SGHelperType, SGHelperDB } from '../../core/helper';
import { SGBaseModel } from '../../core/model/SGBaseModel';

export class tbInitAppleAccDAO {
    // static addInitAppleAcc(x) {
    //     try {
    //         RealmDB.getRealm().write(() => {
    //             var y = SGHelperType.copyRealmObject(x, tbInitAppleAccRealm);
    //             RealmDB.getRealm().create('tbInitAppleAcc', y);
    //         });
    //     } catch (e) {
    //         console.log("addInitAppleAcc Error:  " + error);
    //     }
    // }
    
    // static updateInitAppleAcc(data) {
    //     try {
    //         RealmDB.getRealm().write(() => {
    //             RealmDB.getRealm().create('tbInitAppleAcc', data, true);
    //         });
    //     } catch (error) {
    //         console.log("updateInitAppleAcc Error: " + error);
    //     }
       
    // }
    // static deleteInitAppleAcc(userAppleID){
    //     try {
    //         RealmDB.getRealm().write(() => {
    //             var deletedID =  RealmDB.getRealm().objects('tbInitAppleAcc').filtered('fAppleUserID = "'+ userAppleID +'"')[0];
    //             var deletedJSON = SGHelperType.copyRealmObject(deletedID, tbInitAppleAccRealm);
    //             // console.log(deletedID)
    //             console.log(deletedID)
    //             RealmDB.getRealm().delete(deletedID)
    //         });
    //     } catch (error) {
    //         console.log("deleteInitAppleAcc Error: " + error);
    //     }
    // }

    // static getInitAppleAcc() {
    //     var tempData = RealmDB.getRealm().objects('tbInitAppleAcc')
    //     var accData = [];
    //     for (var i = 0; i < tempData.length; i++) {
    //         // var acceptJSON = { key: tempData[i].key, screen: tempData[i].screen, data: JSON.parse(tempData[i].data) };
    //         var acceptJSON = SGHelperType.copyRealmObject(tempData[i], tbInitAppleAccRealm);
    //         accData.push(acceptJSON);
    //     }
    //     return (accData);
    // }
    //---------------------MMKV-------------------------
    static async getInitAppleAcc() {
        try {
            return await SGHelperDB._get("tbInitAppleAccDAO");
        } catch (error) {
            console.error("getInitAppleAcc Error: " +error)
        }
       
    }
    static async deleteInitAppleAcc(userAppleID){   
        try {
            var condition = [
                {name:'fAppleUserID',op:"=",value:userAppleID}
            ]
            return await SGHelperDB._delete("tbInitAppleAccDAO",condition);
        } catch (error) {
            console.error("deleteInitAppleAcc Error: " +error)
        }
    }
    static async updateInitAppleAcc(data) {
        try {
           return await SGHelperDB._update("tbInitAppleAccDAO",data)
        } catch (error) {
            console.error("updateInitAppleAcc Error: " +error)
        }
       
    }
    static async addInitAppleAcc(x) {
        try {
            await SGHelperDB._insert(x)

        } catch (e) {
            console.log("addInitAppleAcc Error:  " + error);
        }
    }
}

export class tbInitAppleAccData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fEmail: '', fName: '', fAppleUserID: ''};
    }
    constructor(ori, cur, changeList) {
        super(tbCommentData, ori ? ori : tbCommentData.getBlankJSON(), cur, changeList);
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fEmail(val) { this._setValue('fEmail', val); } get fEmail() { return this._getValue('fEmail'); }
    set fName(val) { this._setValue('fName', val); } get fName() { return this._getValue('fName'); }
    set fAppleUserID(val) { this._setValue('fAppleUserID', val); } get fAppleUserID() { return this._getValue('fAppleUserID'); }
   
}
