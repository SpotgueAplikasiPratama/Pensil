/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VStoreProfileAPI extends SGBaseScreen {

    static async getStoreHomeProfile(contentKey) {
        var token = SGHelperGlobalVar.getVar("token");
        console.log('token key')
        console.log(contentKey);
        console.log(token);
        var res = await SGHelperAPICall.callAPISync('GetStoreHomeProfile', contentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }
}