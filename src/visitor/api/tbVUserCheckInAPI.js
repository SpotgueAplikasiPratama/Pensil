/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVUserCheckInAPI extends SGBaseScreen {

    static async addUserCheckIn(data) {
        var res = await SGHelperAPICall.callAPISync('addUserCheckIn', data)
        console.log('addUserCheckIn')
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }


    static async ChangeUserCheckInInactive(contentKey) {
        var res = await SGHelperAPICall.callAPISync('changeUserCheckInInactive', contentKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async CheckUserCheckInHere(contentKey) {
        var res = await SGHelperAPICall.callAPISync('checkUserCheckInHere', contentKey)
        // console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }
}
