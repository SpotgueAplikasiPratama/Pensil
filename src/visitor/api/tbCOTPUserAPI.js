/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbCOTPUserAPI extends SGBaseScreen {

    static async addOTPUser(contact, sendVia,counter) {
        var res = await SGHelperAPICall.callAPISync('AddOTP', { contact: contact, sendVia: sendVia,counter:counter })
        return SGHelperErrorHandling.executeRespon(res)
    }


}