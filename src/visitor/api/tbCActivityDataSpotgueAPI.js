/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbCActivityDataSpotgueAPI extends SGBaseScreen {
    static async addUpdateActiviyDataSpotgue(data) {
        var res = await SGHelperAPICall.callAPISync('AddUpdateActivityDataSpotgueVisitor', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getActivityDataSpotgueByID(fID) {
        var res = await SGHelperAPICall.callAPISync('GetActivityDataSpotgueByContentKeyAndUserKey', fID)
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }


}