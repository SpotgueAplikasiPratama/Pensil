/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VRestoProfileAPI extends SGBaseScreen {

    static async getRestoHomeProfile(contentKey) {
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('GetRestoHomeProfile', contentKey);
        console.log(token);
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }
}