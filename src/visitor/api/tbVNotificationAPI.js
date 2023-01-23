
/**
 * Version 1.3.0
 * 1. Yohanes 21 May 2021
 * - change NotificationGetByID
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperGlobalVar,SGHelperErrorHandling } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVNotificationAPI extends SGBaseScreen {
    static async searchNotificationCard(arrFilter, arrSort,pagingParam) {
        var token = SGHelperGlobalVar.getVar("token");
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        
        // var res = await SGHelperAPICall.callAPISync('SearchNotifications', 
        // { filter: filtersort.filter, 
        //     sort: filtersort.sort ,
        //     paging: pagingParam})
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam                                      
        }))
        var res = await SGHelperAPICall.callAPISync('SearchNotificationForCard', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam                                      
        })

       
        return SGHelperErrorHandling.executeRespon(res);
    }


    static async readStatus(fID) {
        var token = SGHelperGlobalVar.getVar("token");

        var res = await SGHelperAPICall.callAPISync('NotificationReadStatusForTV', fID)

        // var res = await SGHelperAPICall.callAPIAsync('POST', SGHelperGlobalVar.getVar('APICommon') + 'NotificationReadStatusForTV', {
        //     Authorization: 'Bearer ' + token,
        //     'Content-Type': 'application/json'
        // }, JSON.stringify(fID));
        return SGHelperErrorHandling.executeRespon(res);

    }
    static async getNotificationByID(fID,fContentType) {
        var token = SGHelperGlobalVar.getVar("token");
        var param ={
            fID :fID,
            fContentType:fContentType
        }
      
        console.log('getNotificationByID')
        console.log(token);
        console.log(JSON.stringify(param))

        var res = await SGHelperAPICall.callAPISync('GetNotificationByID', param)

        // var res = await SGHelperAPICall.callAPIAsync('POST', SGHelperGlobalVar.getVar('APICommon') + 'GetNotificationByID', {
        //     Authorization: 'Bearer ' + token,
        //     'Content-Type': 'application/json'
        // }, JSON.stringify(fID));

        // var result = JSON.parse(res.data);
        // return result;
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async notificationLength(arrFilter, arrSort) {
        var token = SGHelperGlobalVar.getVar("token");
        // console.log(token)
       
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        
        var res = await SGHelperAPICall.callAPISync('SearchNotificationsLength');
        // console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
       
    }
}
