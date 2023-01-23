/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VRestoPromoDetailAPI extends SGBaseScreen {

    static async getRestoPromoDetail(contentKey) {
        var token = SGHelperGlobalVar.getVar("token");
        console.log(token);
        console.log(JSON.stringify(contentKey))
        var res = await SGHelperAPICall.callAPISync('GetDetailItemRestoPromo', contentKey)
        console.log(res);
        console.log(res.respInfo.status)
        try {
            return  SGHelperErrorHandling.executeRespon(res)
        } catch (error) {
            return null
        }
    }
}