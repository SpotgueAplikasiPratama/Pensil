
import { SGHelperType, SGHelperDB } from '../../core/helper';
import { SGBaseModel } from '../../core/model/SGBaseModel';
export class askAliceLastLocationSelectedDAO {

    // static addAliceLocation(selectedPlace, userID, shareTransaction = false) {
    //     try {
    //         RealmDB.beginTransaction(shareTransaction);
    //         var acceptJSON = {fID:'',fUserKey:'',selectedPlace:'', fCreatedBy: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedDate: new Date(0)}
    //         acceptJSON.fID = SGHelperType.getGUID();
    //         acceptJSON.fUserKey = userID;
    //         acceptJSON.selectedPlace = JSON.stringify(selectedPlace);
    //         acceptJSON.fCreatedBy = userID;
    //         acceptJSON.fCreatedDate = new Date();
    //         acceptJSON.fLastModifiedBy = userID;
    //         acceptJSON.fLastModifiedDate = new Date();
    //         RealmDB.getRealm().create('askAliceLastLocationSelected', acceptJSON);
    //         RealmDB.commitTransaction(shareTransaction);
    //     } catch (e) {
    //         RealmDB.cancelTransaction(shareTransaction);
    //         console.log(e)
    //         throw (e);
    //     }
    // }


    // static updateAliceLocation(data,selectedPlace, userID, shareTransaction = false) {
    //     try {
    //         RealmDB.beginTransaction(shareTransaction);
    //         var updateDataJSON = data;
    //         updateDataJSON.fUserKey = userID;
    //         updateDataJSON.selectedPlace = JSON.stringify(selectedPlace);
    //         updateDataJSON.fCreatedBy = userID;
    //         updateDataJSON.fCreatedDate = new Date();
    //         updateDataJSON.fLastModifiedBy = userID;
    //         updateDataJSON.fLastModifiedDate = new Date();
    //         RealmDB.getRealm().create('askAliceLastLocationSelected', updateDataJSON, true);
    //         RealmDB.commitTransaction(shareTransaction);
    //     } catch (e) {
    //         RealmDB.cancelTransaction(shareTransaction);
    //         console.log(e)
    //         throw (e);
    //     }
    // }


    // static getAliceLocation() {
    //     var tempData = RealmDB.getRealm().objects('askAliceLastLocationSelected');
    //     var data = [];
    //     if(tempData.length !== 0){
    //     var acceptJSON =  SGHelperType.copyRealmObject(tempData[0], askAliceLastLocationRealm);
    //     acceptJSON.selectedPlace = JSON.parse(acceptJSON.selectedPlace);
    //     data.push(acceptJSON)
    //     }
    //     return (data);

    // }

    static async addAliceLocation(selectedPlace, userID) {
        try {
            var acceptJSON = {fID:'',fUserKey:'',selectedPlace:'', fCreatedBy: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedDate: new Date(0)}
            acceptJSON.fID = SGHelperType.getGUID();
            acceptJSON.fUserKey = userID;
            acceptJSON.selectedPlace = JSON.stringify(selectedPlace);
            acceptJSON.fCreatedBy = userID;
            acceptJSON.fCreatedDate = new Date();
            acceptJSON.fLastModifiedBy = userID;
            acceptJSON.fLastModifiedDate = new Date();
            await SGHelperDB._insert('askAliceLastLocationSelected',acceptJSON)
        } catch (e) {
            console.log(e)
        }
    }
    static async updateAliceLocation(data,selectedPlace, userID) {
        try {

            var updateDataJSON = data;
            updateDataJSON.fUserKey = userID;
            updateDataJSON.selectedPlace = JSON.stringify(selectedPlace);
            updateDataJSON.fCreatedBy = userID;
            updateDataJSON.fCreatedDate = new Date();
            updateDataJSON.fLastModifiedBy = userID;
            updateDataJSON.fLastModifiedDate = new Date();
            await SGHelperDB._update('askAliceLastLocationSelected',updateDataJSON)
        } catch (e) {
            console.log(e)
            
        }
    }
    static async getAliceLocation() {
        var data = await SGHelperDB._get('askAliceLastLocationSelected')
        for(var i=0;i<data.length;i++){
            data[i].selectedPlace = JSON.parse(data[i].selectedPlace)
        }
        return (data);
    }

}



export class askAliceLastLocationData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fUserKey:'',selectedPlace:'', fCreatedBy: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedDate: new Date(0), };
    }
    constructor(ori, cur, changeList) {
        super(askAliceLastLocationData, ori ? ori : askAliceLastLocationData.getBlankJSON(), cur, changeList);
    }

    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fUserKey(val) { this._setValue('fUserKey', val); } get fUserKey() { return this._getValue('fUserKey'); }
    set selectedPlace(val) { this._setValue('selectedPlace', val); } get selectedPlace() { return this._getValue('selectedPlace'); }
    set fNumberOfPerson(val) { this._setValue('fNumberOfPerson', val); } get fNumberOfPerson() { return this._getValue('fNumberOfPerson'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
   
}