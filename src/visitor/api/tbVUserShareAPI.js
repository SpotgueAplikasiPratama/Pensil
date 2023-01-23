/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVUserShareAPI extends SGBaseScreen {

    static async addUserShare(data) {
        var token = SGHelperGlobalVar.getVar("token");
        data.fID = null;
        console.log(data)
        var res = await SGHelperAPICall.callAPISync('AddUserShare', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

}