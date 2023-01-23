// import { RealmDB, announcementData as announcementRealm } from './RealmDB';
import { SGHelperType, SGHelperDB } from '../../core/helper';
import { SGBaseModel } from '../../core/model/SGBaseModel';

export class announcementDAO {
    
    static async addAnnouncement(data, userID, shareTransaction = false) {
        try {
            // RealmDB.beginTransaction(shareTransaction);
            var acceptJSON = {fID:'',fAnnouncementKey:'',fEndDate:'', fCreatedBy: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedDate: new Date(0)}
            acceptJSON.fID = SGHelperType.getGUID();
            acceptJSON.fAnnouncementKey = data.fID;
            acceptJSON.fEndDate = data.fEndDate;
            acceptJSON.fCreatedBy = userID;
            acceptJSON.fCreatedDate = new Date();
            acceptJSON.fLastModifiedBy = userID;
            acceptJSON.fLastModifiedDate = new Date();
            console.log(acceptJSON);
            await SGHelperDB._insert("announcementData",acceptJSON)
        } catch (error) {
            console.log("Error announcementDAO.addAnnouncement: "+ error)
        }
    }
    
    static async deleteAnnouncementByKey(key){
        try {
            // RealmDB.getRealm().write(() => {
                var condition = [
                    {name:'fAnnouncementKey',op:"=",value:key}
                ]
                return await SGHelperDB._delete("announcementData",condition);
                // var deletedID =  RealmDB.getRealm().objects('announcementData').filtered('fAnnouncementKey = "'+ key +'"')[0];
                // console.log(deletedID)
                // RealmDB.getRealm().delete(deletedID)
            // });
        } catch (error) {
            console.log("Error announcementDAO.deleteAnnouncementByKey: " + error);
        }
    }

    static async getAnnouncementRealm() {
        return await SGHelperDB._get("announcementData");

    }
}
