
/*
* Version 1.2.0
* 1. Yohanes, 24 Maret 2021
*    - fix Payment
* 2. Yohanes 26 March 2021
* - add ErrorHandling
*/
import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbCPaymentAPI extends SGBaseScreen {

    static async getPayment(fBuildingKey) {
        var res = await SGHelperAPICall.callAPISync('SearchPayment',fBuildingKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

}