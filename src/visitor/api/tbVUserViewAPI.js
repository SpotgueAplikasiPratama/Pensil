/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVUserViewAPI extends SGBaseScreen {

    static async addUserView(data) {
        data.fID = null;
        var res = await SGHelperAPICall.callAPISync('addViewUserVisitor', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async addUserClick(data) {
        var res = await SGHelperAPICall.callAPISync('addClickUserVisitor', data)
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }

}