/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbCOneSignalAPI extends SGBaseScreen {

    static async editOneSignalNotificationTags(userId) {
        var res = await SGHelperAPICall.callAPISync('EditOneSignalNotificationTags', userId)
        return SGHelperErrorHandling.executeRespon(res)
    }
    static async removeOneSignalNotificationTags(userId) {
        var res = await SGHelperAPICall.callAPISync('RemoveOneSignalNotificationTags', userId)
        return SGHelperErrorHandling.executeRespon(res)
    }

}