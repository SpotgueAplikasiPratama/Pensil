/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbCMyHealthAPI extends SGBaseScreen {

    static async searchMyHealth() {
        var res = await SGHelperAPICall.callAPISync('searchMyHealth')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async updateMyHealth(myHealthData) {
        var res = await SGHelperAPICall.callAPISync('updateMyHealth',myHealthData)
        return SGHelperErrorHandling.executeRespon(res)
    }

}